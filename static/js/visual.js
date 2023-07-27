var total_of_images = 100

$('#btn-loadfile').click(function () {
    var mode = document.getElementById("mode").value;
    var index = document.getElementById("number_index").value;
    var dataset = document.getElementById("choose_dataset").value;

    if (mode.localeCompare('index')==0){
        getImgFileName('index', index, dataset);
    }else if (mode.localeCompare('path')==0){
        getImgFileName('path', index, dataset);
    }
}
)

function getImgFileName(mode, index, dataset){
    $.ajax({
        url: 'get_img_name?mode='+mode+'&index='+index+'&dataset='+dataset,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',  
        success: function (response) {
            if (response['code'] == 1001) {
                alert("[Lỗi] Không nhận được phản hồi từ server, vui lòng kiểm tra lại!");
            }
            console.log(response);
            fname = response['data']['fname'];
            index = response['data']['index'];
            total = response['data']['total'];
            dict_emotion = response['data']['dict_emotion'];
            total_of_images = total;
            document.getElementById('number_index').value = index;
            var return_index = String(response['data']['index']);
            if (return_index.localeCompare('-1')==0){
                window.location.href = "idcard?mode=index&index=0";
            }
            angry_prob = dict_emotion['angry']
            disgust_prob = dict_emotion['disgust']
            fear_prob = dict_emotion['fear']
            happy_prob = dict_emotion['happy']
            sad_prob = dict_emotion['sad']
            surprise_prob = dict_emotion['surprise']
            neutral_prob = dict_emotion['neutral']
            other_prob = dict_emotion['others']

            drawImageOCR("get_ori_img?dataset="+dataset+"&filename="+fname, fname, index);
            document.getElementById("noti_angry").innerHTML = angry_prob;
            document.getElementById("noti_disgust").innerHTML = disgust_prob;
            document.getElementById("noti_fear").innerHTML = fear_prob;
            document.getElementById("noti_happy").innerHTML = happy_prob;
            document.getElementById("noti_sad").innerHTML = sad_prob;
            document.getElementById("noti_surprise").innerHTML = surprise_prob;
            document.getElementById("noti_neutral").innerHTML = neutral_prob;
            document.getElementById("noti_others").innerHTML = other_prob;
            document.getElementById("noti_fname").innerHTML = "filename: " + fname;
        }
    }).done(function() {
        
    }).fail(function() {
        alert('Fail!');
    });
}

// function getImgFileName(){
//     drawImageOCR("/get_ori_img");
// }

function drawImageOCR(src) {
    var canvas = document.getElementById("preview_img");
    IMGSRC = src;
    var context = canvas.getContext('2d');
    var imageObj = new Image();
    imageObj.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(imageObj, 0, 0, this.width,this.height);
    };
    imageObj.src = src;
}

function view_previous_image(){
    var index = document.getElementById("number_index").value;
    var dataset = document.getElementById("choose_dataset").value;

    index = parseInt(index)
    if (index > 0) {
        index = index - 1;
    }

    getImgFileName('index', String(index), dataset);
}

function view_next_image(){
    var index = document.getElementById("number_index").value;
    var dataset = document.getElementById("choose_dataset").value;

    index = parseInt(index) ;

    if (index <  total_of_images-1){
        index += 1;
    }
    else{
        index = 0;
    }

    console.log("index: " + index);

    getImgFileName('index', String(index), dataset);
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        // case 13:
        //     save_info_idcard();
        //     break;
        case 37:
           view_previous_image();
           break;
        case 39:
           view_next_image();
           break;
    }
};