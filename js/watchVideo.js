
var videoID = 10; //视频的区分ID，每个视频分配一个唯一的ID
var maxTime = 600;//观看视频5分钟前不能快进
var cookieTime = cookie.get('time_' + videoID); //调用已记录的time
var videoObject;
var player;
//课程详情
courseDetail();
function courseDetail() {
    http.ajax({
        url: 'course/courseDetail',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            courseId: getQueryString("id")
        }
    }).then(function (data) {
        if (data.code == 200) {
            // 数据渲染
            $("#kcList .temporary").hide();
            var data = beZero(data.data);
            var listHtml = "";
            $(".courseName").text(data.courseName);
            $(".totalList").text(data.courseHourList.length);
            if (data.learnProgress == "unstart") {
                $(".learnProgress").text('0');
            } else {
                if(data.learnProgress == 'completed'){
                    $(".learnProgress").text(data.courseHourList.length);
                }else{
                    $(".learnProgress").text(data.learnProgress);
                }
                
            }
            for (var i = 0; i < data.courseHourList.length; i++) {
                if (data.courseHourList[i].learnStatus == 'completed') {
                    listHtml += '<li style="color:#397D47" class=' + data.courseHourList[i].learnStatus + ' id=' + data.courseHourList[i].id + '>(' + (i + 1) + ')-' + data.courseHourList[i].courseHourName + '<span>（已学习）</span><input type="hidden" value="'+data.courseHourList[i].free+'" class="free" /></li>';
                } else {
                    listHtml += '<li  class=' + data.courseHourList[i].learnStatus + ' id=' + data.courseHourList[i].id + '>(' + (i + 1) + ')-' + data.courseHourList[i].courseHourName + '<input type="hidden" value="'+data.courseHourList[i].free+'" class="free" /></li>';
                }
            };
            $("#kcList").append(listHtml);

            var learnStatus = $("#" + getQueryString("sid") + "").attr("class");
            if (learnStatus == 'completed') {
                $(".videoPrevent").hide();
            } else {
                $(".videoPrevent").show();
            }
            $("#" + getQueryString("sid") + "").addClass("active").siblings().removeClass("active");

            //页面刷新从缓存中取上一次的id
            if(localStorage.getItem("courseHourId")){
            	$("#"+localStorage.getItem("courseHourId")+"").addClass("active").siblings().removeClass("active");
            	//获取视频
            	courseHourDetail(localStorage.getItem("courseHourId"));
            }else{
                //获取视频
                courseHourDetail(getQueryString("sid"));
            }
            $("#kcList  li").click(function () {
                cookieTime = 0;
                var sid = $(this).attr("id");
                var learnStatus = $(this).attr("class");
                var free = $(this).find(".free").val();
                // 切换视频时候判断是否已学习
                if (learnStatus == 'completed') {
                    $(".videoPrevent").hide();
                } else {
                    $(".videoPrevent").show();
                }
                
                if(sid && data.buyStatus == 'purchased'){
                     courseHourDetail(sid);
                     $(this).addClass("active").siblings().removeClass("active");
                     localStorage.setItem("courseHourId", sid);
                }else{
                    if(sid && free == 'true'){
                        courseHourDetail(sid);
                        $(this).addClass("active").siblings().removeClass("active");
                        localStorage.setItem("courseHourId", sid);
                    }else{
                        layer.msg('未购买不可观看！', {
                            icon: 5
                        }, function () {
                        });
                    }
                }
               
            });

            if($("#kcList .active").hasClass("unstart")){
                $(".videoPrevent").show();
            }else{
                $(".videoPrevent").hide();
            }
        }
    }, function (err) {
        if (err.status == 403) {
            layer.msg('未登录，不可操作！', {
                icon: 5,
                time: 800,
            }, function () {
                location.href = 'login.html';
            });
        }
    })
};
// 不可以快进
$(".videoPrevent").click(function () {
    layer.msg('未学习视频不可快进噢！');
})

//课程详情视频
function courseHourDetail(sid) {
    http.ajax({
        url: 'course/courseHourDetail',
        type: 'GET',
        json: false,
        mask: true,
        data: {
            courseHourId: sid
        }
    }).then(function (data) {
        var result = beNull(data.data);
        if (data.code == 200) {
            $(".exercise .temporary").hide();
            $(".courseHourName").text(result.courseHourName);
            videoObject = {
                container: '#videoplayer',//“#”代表容器的ID，“.”或“”代表容器的class
                variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
                // poster: 'pic/wdm.jpg',//封面图片
                loaded: "loadHandler",
                loop: false, //播放结束是否循环播放
                autoplay: true, //是否自动播放
                mobileCkControls: true,//是否在移动端（包括ios）环境中显示控制栏
                mobileAutoFull: false,//在移动端播放后是否按系统设置的全屏播放
                h5container: '#videoplayer',//h5环境中使用自定义容器
                video: result.courseResourceUrl,//视频地址,
            };

            var cookieTime = result.progress;
            if (!cookieTime || cookieTime == undefined) { //如果没有记录值，则设置时间0开始播放
                cookieTime = 0;
            }
            if (cookieTime > 0) {
                console.log('本视频记录的上次观看时间(秒)为：' + cookieTime);
            }
            if (cookieTime > 0) { //如果记录时间大于0，则设置视频播放后跳转至上次记录时间
                videoObject['seek'] = cookieTime;
            }
            player = new ckplayer(videoObject);
            loadHandler(player);

            // 随堂练习
            var practice = result.practice;
            doExercise(practice);

        }
    }, function (err) {

    })
};

function loadHandler(player) {
    player.addListener('time', timeHandler); //监听播放时间
    player.addListener('ended', VideoPlayEndedHandler);//监听播放结束
}
function timeHandler(t) {
    cookie.set('time_' + videoID, t); //当前视频播放时间写入cookie
    //观看时间大于设定时间就可以快进
    if (t > maxTime) {
        $(".videoPrevent").hide();
    }
}
function VideoPlayEndedHandler() {//监听视频播放完成
    updateLeanStatus();
    console.log('本视频已结束');
}

// 3秒上传一次视频观看进度给后台
window.setInterval(function () {
    realTime = cookie.get('time_' + videoID);
    updateProgress(realTime);
}, 3000)

//更新课时观看记录定时上报给我或者监听播放状态，离开页面或其他可能导致进度丢失的情况，上报一次进度给我
function updateProgress(t) {
    var courseHourId = $("#kcList .active").attr("id");
    http.ajax({
        url: 'course/updateProgress',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            courseHourId: courseHourId,
            progress: parseInt(t)
        }
    }).then(function (data) {
        var result = data.data;
        if (data.code == 200) {

        }
    }, function (err) {

    })
};
//课时视频播放完毕后请求接口
function updateLeanStatus() {
    var courseHourId = $("#kcList .active").attr("id");
    http.ajax({
        url: 'course/updateLeanStatus',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            courseHourId: courseHourId
        }
    }).then(function (data) {
        var result = data.data;
        if (data.code == 200) {

        }
    }, function (err) {

    })
};

//随堂练习
function doExercise(practice) {
    var ChoiceListHtml = '';
    var judgeListHtml = '';
    var multiChoiceListHtml = '';
    document.getElementById("ChoiceListHtml").innerHTML = "";
    document.getElementById("judgeListHtml").innerHTML = "";
    document.getElementById("multiChoiceListHtml").innerHTML = "";
    for (var i = 0; i < practice.choiceList.length; i++) {
        ChoiceListHtml += "<li id=" + practice.choiceList[i].id + "><p>" +
            "<span style='margin-right: 0px;'>" + (i + 1) + "</span>、" + practice.choiceList[i].name + "" +
            "<i>查看解析</i>" +
            "</p>" +
            "<div class=\"layui-input-block\">";
        for (var j = 0; j < practice.choiceList[i].chooseResultList.length; j++) {
            ChoiceListHtml += "<input type=\"radio\" name=\"dx" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + practice.choiceList[i].chooseResultList[j].choose + "\">";
        }

        ChoiceListHtml += "</div>" +
            "<input type=\"hidden\" class=\"answer\"  value=\"" + practice.choiceList[i].answer[0] + "\" />" +
            "<h2><p>正确答案：<span>" + indexToString(practice.choiceList[i].answer[0]) + "</span></p>解析：" + practice.choiceList[i].questionAnalyze + "</h2>" +
            "</li>";
    }
    $("#ChoiceListHtml").append(ChoiceListHtml);

    // 判断题题目渲染
    for (var i = 0; i < practice.judgeList.length; i++) {
        judgeListHtml += "<li id=" + practice.judgeList[i].id + "><p>" +
            "<span style='margin-right: 0px;'>" + (practice.choiceList.length + i + 1) + "</span>、" + practice.judgeList[i].name + "" +
            "<i>查看解析</i>" +
            "</p>" +
            "<div class=\"layui-input-block\">";
        for (var j = 0; j < practice.judgeList[i].chooseResultList.length; j++) {
            judgeListHtml += "<input type=\"radio\" name=\"pd" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + practice.judgeList[i].chooseResultList[j].choose + "\">";
        }
        judgeListHtml += "</div>" +
            "<input type=\"hidden\" class=\"answer\"  value=\"" + practice.judgeList[i].answer[0] + "\" />" +
            "<h2><p>正确答案：<span>" + indexToString(practice.judgeList[i].answer[0]) + "</span></p>解析：" + practice.judgeList[i].questionAnalyze + "</h2>" +
            "</li>";
    }
    $("#judgeListHtml").append(judgeListHtml);

    // 多选题题目渲染
    for (var i = 0; i < practice.multiChoiceList.length; i++) {
        multiChoiceListHtml += "<li id=" + practice.multiChoiceList[i].id + "><p>" +
            "<span style='margin-right: 0px;'>" + (practice.choiceList.length + practice.choiceList.length + i + 1) + "</span>、" + practice.multiChoiceList[i].name + "" +
            "<i>查看解析</i>" +
            "</p>" +
            "<div class=\"layui-input-block multipleChoice\">";
        for (var j = 0; j < practice.multiChoiceList[i].chooseResultList.length; j++) {
            multiChoiceListHtml += "<input type=\"checkbox\" name=\"dx" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + practice.multiChoiceList[i].chooseResultList[j].choose + "\">";
        }
        multiChoiceListHtml += "</div>" +
            "<input type=\"hidden\" class=\"answer\"  value=\"" + practice.multiChoiceList[i].answer + "\" />" +
            "<h2><p>正确答案：<span>" + acTiveArrStringFun(practice.multiChoiceList[i].answer) + "</span></p>解析：" + practice.multiChoiceList[i].questionAnalyze + "</h2>" +
            "</li>";
    }
    $("#multiChoiceListHtml").append(multiChoiceListHtml);

    if (practice.multiChoiceList.length == 0 && practice.judgeList.length == 0 && practice.choiceList.length == 0) {
        $("#notAvailable").show();
        $("#notAvailable").html('<p style="text-align: center;font-size: 25px;color: #666666;line-height: 234px;">暂无该课程相关的随堂小练</p>')
    } else {
        $("#notAvailable").hide();
    }
    renderForm();
    //查看解析
    $(".exercise .left li i").click(function () {
        if ($(this).hasClass("activei")) {
            $(this).removeClass("activei");
            $(this).parent().siblings("h2").hide()
        } else {
            $(this).addClass("activei");
            $(this).parent().siblings("h2").show()
        }
    });
}
//去练习
$(".toExercise").click(function () {
    openUrl('doExercise.html?id=' + getQueryString("id") + '')
});
//上一级
$(".upperLevel").click(function () {
    openUrl('courseCenterDetails.html?id=' + getQueryString("id") + '')
});