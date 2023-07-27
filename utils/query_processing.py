from pyvi import ViUtils, ViTokenizer
import googletrans
import translate
from difflib import SequenceMatcher
from langdetect import detect
import underthesea


class Translation():
    def __init__(self, from_lang='vi', to_lang='en', mode='google'):
        # The class Translation is a wrapper for the two translation libraries, googletrans and translate. 
        self.__mode = mode
        self.__from_lang = from_lang
        self.__to_lang = to_lang

        if mode in 'googletrans':
            self.translator = googletrans.Translator()
        elif mode in 'translate':
            self.translator = translate.Translator(from_lang=from_lang,to_lang=to_lang)

    def preprocessing(self, text):

        return text.lower()

    def __call__(self, text):

        text = self.preprocessing(text)
        return self.translator.translate(text) if self.__mode in 'translate' \
                else self.translator.translate(text, dest=self.__to_lang).text

class Text_Preprocessing():
    def __init__(self, stopwords_path='./dict/vietnamese-stopwords-dash.txt'):
        with open(stopwords_path, 'rb') as f:
            lines = f.readlines()
        self.stop_words = [line.decode('utf8').replace('\n','') for line in lines]

    def find_substring(self, string1, string2):

        match = SequenceMatcher(None, string1, string2, autojunk=False).find_longest_match(0, len(string1), 0, len(string2))
        return string1[match.a:match.a + match.size].strip()

    def remove_stopwords(self, text):

        text = ViTokenizer.tokenize(text)
        return " ".join([w for w in text.split() if w not in self.stop_words])

    def lowercasing(self, text):
        return text.lower() 

    def uppercasing(self, text):
        return text.upper()

    def add_accents(self, text): 

        return ViUtils.add_accents(u"{}".format(text))

    def remove_accents(self, text): 

        return ViUtils.remove_accents(u"{}".format(text))

    def sentence_segment(self, text):

        return underthesea.sent_tokenize(text)

    def text_norm(self, text):

        return underthesea.text_normalize(text)  

    def text_classify(self, text):

        return underthesea.classify(text)

    def sentiment_analysis(self, text):

        return underthesea.sentiment(text)

    def __call__(self, text):

        text = self.lowercasing(text)
        text = self.remove_stopwords(text)
        # text = self.remove_accents(text)
        # text = self.add_accents(text)
        text = self.text_norm(text)
        categories = self.text_classify(text)
        return categories