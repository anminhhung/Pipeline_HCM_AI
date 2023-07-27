import json

with open('image_path.json') as json_file:
    DictImagePath = json.load(json_file)

# print(type(DictImagePath))
id2img_fps = {}
for key, value in DictImagePath.items():
   id2img_fps[int(key)] = value 

print(id2img_fps)
with open('image_path_1.json', 'a+') as f:
  f.write(json.dumps(id2img_fps))

