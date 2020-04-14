//考试试题列表
exam();
function exam() {
    http.ajax({
        url: 'exam/exam',
        type: 'GET',
        json: false,
        mask: true,
        data: {
            examCenterId: getQueryString("id")
        }
    }).then(function (data) {
        $(".temporary").hide();
        document.getElementById("numChoiceListHtml").innerHTML = "";
        document.getElementById("numjudgeListHtml").innerHTML = "";
        document.getElementById("nummultiChoiceListHtml").innerHTML = "";
        var result = data.data;
        var numChoiceListHtml = '';
        var numjudgeListHtml = '';
        var nummultiChoiceListHtml = '';
        var ChoiceListHtml = '';
        var judgeListHtml = '';
        var multiChoiceListHtml = '';
        if (data.code == 200) {
            // 总题数量
            var total = result.choiceList.length + result.judgeList.length + result.multiChoiceList.length;
            // 简介
            $(".examName").text(result.info.examName);
            $(".questionNum").text(total);
            $(".limitedTime").text(result.info.limitedTime);
            $("#id").val(result.id);
            $(".nowTime").html(getNowFormatDate()+" 开考")
            //单选题序号循环
            for (var i = 0; i < result.choiceList.length; i++) {
                numChoiceListHtml += '<span class="number">' + (i + 1) + '</span>';
            };
            $("#numChoiceListHtml").append(numChoiceListHtml);
            //判断题序号循环
            for (var i = 0; i < result.judgeList.length; i++) {
                numjudgeListHtml += '<span class="number">' + (result.choiceList.length + i + 1) + '</span>';
            };
            $("#numjudgeListHtml").append(numjudgeListHtml);
            //多选题序号循环
            for (var i = 0; i < result.multiChoiceList.length; i++) {
                nummultiChoiceListHtml += '<span class="number">' + (result.choiceList.length + result.judgeList.length + i + 1) + '</span>';
            };
            $("#nummultiChoiceListHtml").append(nummultiChoiceListHtml);

            // 单选题题目渲染
            for (var i = 0; i < result.choiceList.length; i++) {
                ChoiceListHtml += "<li id=" + result.choiceList[i].id + "><p>" +
                    "<span style='margin-right: 0px;'>" + (i + 1) + "</span>、" + result.choiceList[i].name + "" +
                    "</p>" +
                    "<div class=\"layui-input-block\">";
                for (var j = 0; j < result.choiceList[i].chooseResultList.length; j++) {
                    ChoiceListHtml += "<input type=\"radio\" name=\"dx" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + result.choiceList[i].chooseResultList[j].choose + "\">";
                }
                ChoiceListHtml += "</div>" +
                    "<em class=\"layui-icon layui-icon-rate-solid\"></em>" +
                    "</li>";
            }
            $("#ChoiceListHtml").append(ChoiceListHtml);

            // 判断题题目渲染
            for (var i = 0; i < result.judgeList.length; i++) {
                judgeListHtml += "<li id=" + result.judgeList[i].id + "><p>" +
                    "<span style='margin-right: 0px;'>" + (result.choiceList.length + i + 1) + "</span>、" + result.judgeList[i].name + "" +
                    "</p>" +
                    "<div class=\"layui-input-block\">";
                for (var j = 0; j < result.judgeList[i].chooseResultList.length; j++) {
                    judgeListHtml += "<input type=\"radio\" name=\"pd" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + result.judgeList[i].chooseResultList[j].choose + "\">";
                }
                judgeListHtml += "</div>" +
                    "<em class=\"layui-icon layui-icon-rate-solid\"></em>" +
                    "</li>";
            }
            $("#judgeListHtml").append(judgeListHtml);

            // 多选题题目渲染
            for (var i = 0; i < result.multiChoiceList.length; i++) {
                multiChoiceListHtml += "<li id=" + result.multiChoiceList[i].id + "><p>" +
                    "<span style='margin-right: 0px;'>" + (result.choiceList.length + result.judgeList.length + i + 1) + "</span>、" + result.multiChoiceList[i].name + "" +
                    "</p>" +
                    "<div class=\"layui-input-block multipleChoice\">";
                for (var j = 0; j < result.multiChoiceList[i].chooseResultList.length; j++) {
                    multiChoiceListHtml += "<input type=\"checkbox\" name=\"dx" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + result.multiChoiceList[i].chooseResultList[j].choose + "\">";
                }
                multiChoiceListHtml += "</div>" +
                    "<em class=\"layui-icon layui-icon-rate-solid\"></em>" +
                    "</li>";
            }
            $("#multiChoiceListHtml").append(multiChoiceListHtml);

            // 数据绑定到右侧答题卡
            $("#topic  li .layui-input-block").click(function () {
                var selectedIndex = $(this).parents("li").find("p span").text()-1;
                $("#sequence .number").eq(selectedIndex).addClass("green");
                if ($(this).hasClass("multipleChoice")) {
                    if ($(this).find('.layui-form-checked').length == 0) {
                        $("#sequence .number").eq(selectedIndex).removeClass("green");
                    }
                }
            });
            //收藏题目
            $("#topic li em").click(function () {
                var selectedIndex = $(this).parents("li").find("p span").text()-1;
                if ($(this).hasClass("activeStar")) {
                    $(this).removeClass("activeStar");
                    $("#sequence .number").eq(selectedIndex).removeClass("yellow")
                } else {
                    $(this).addClass("activeStar");
                    $("#sequence .number").eq(selectedIndex).addClass("yellow")
                }
            })
            
            renderForm();
            //倒计时,时间存入缓存，休想刷新混时长
            var maxtime = result.info.limitedTime * 60;
            console.log(localStorage.getItem("maxtime"))
            if (localStorage.getItem("maxtime")) {
                maxtime = localStorage.getItem("maxtime");
                timer = setInterval(function () {
                    if (maxtime >= 0) {
                        $("#timeCost").val($(".limitedTime").text() * 60 - maxtime);
                        minutes = Math.floor(maxtime / 60);
                        seconds = Math.floor(maxtime % 60);
                        msg = "剩余时间：" + minutes + "分" + seconds + "秒";
                        localStorage.setItem("maxtime", maxtime);
                        $("time").text(msg);
                        if (maxtime == 5 * 60) layer.msg('考试结束还剩5分钟!', { icon: 1 });
                        --maxtime;
                    } else {
                        clearInterval(timer);
                        $("time").text('考试结束!')
                        layer.msg('时间到，考试结束!', {
                            icon: 1
                        });
                        //时间到，直接提交
                        examSubmit();
                        localStorage.removeItem("maxtime");
                    }
                }, 1000);
                // window.addEventListener("beforeunload", function (e) {
                //     var confirmationMessage = "\o/";
                //     (e || window.event).returnValue = confirmationMessage; // Gecko and Trident
                //     return confirmationMessage; // Gecko and WebKit
                // });
            } else {
                layer.confirm('考试马上开始，准备好了吗？', {
                    btn: ['是', '否'],
                    title: "温馨提示",
                    closeBtn: 0
                }, function () {
                    fullscreen()
                    layer.msg('考试开始！', { icon: 1 });
                    timer = setInterval(function () {
                        if (maxtime >= 0) {
                            $("#timeCost").val($(".limitedTime").text() * 60 - maxtime);
                            minutes = Math.floor(maxtime / 60);
                            seconds = Math.floor(maxtime % 60);
                            msg = "剩余时间：" + minutes + "分" + seconds + "秒";
                            localStorage.setItem("maxtime", maxtime);
                            $("time").text(msg);
                            if (maxtime == 5 * 60) layer.msg('考试结束还剩5分钟!', { icon: 1 });
                            --maxtime;
                        } else {
                            clearInterval(timer);
                            $("time").text('考试结束!')
                            layer.msg('时间到，考试结束!', {
                                icon: 1
                            });
                            //时间到，直接提交
                            examSubmit();
                            localStorage.removeItem("maxtime");
                        }
                    }, 1000);
                }, function () {
                    history.back();
                });
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
}
//提交
$(".submit").click(function () {
    layer.confirm('确定提交答卷？', {
        title: "温馨提示",
        btn: ['确定', '再看看'] //按钮
    }, function () {
        examSubmit();
    }, function () {

    });
});

function examSubmit() {
    var dataList = ''
    var choiceAnswer = [];
    var judgeAnswer = [];
    var multiChoiceAnswer = [];

    for (var i = 0; i < $("#ChoiceListHtml li").length; i++) {
        // 单选框的值
        var answerList = $("#ChoiceListHtml li").eq(i).find("input:checked").val() * 1;
        if (answerList == undefined) {
            answerList = ""
        }
        choiceAnswer.push({
            "answerList": [answerList],
            "testQuestionId": $("#ChoiceListHtml li").eq(i).attr("id")
        });
    };
    for (var i = 0; i < $("#judgeListHtml li").length; i++) {
        // 判断框的值
        var answerList = $("#judgeListHtml li").eq(i).find("input:checked").val() * 1;
        if (answerList == undefined) {
            answerList = ""
        }
        judgeAnswer.push({
            "answerList": [answerList],
            "testQuestionId": $("#judgeListHtml li").eq(i).attr("id")
        });
    };
    for (var i = 0; i < $("#multiChoiceListHtml li").length; i++) {
        // 多选框的值
        var answerList = [];
        for (var j = 0; j < $("#multiChoiceListHtml li").eq(i).find("input:checked").length; j++) {
            answerList.push($("#multiChoiceListHtml li").eq(i).find("input:checked").eq(j).val() * 1)
        }
        multiChoiceAnswer.push({
            "answerList": answerList,
            "testQuestionId": $("#multiChoiceListHtml li").eq(i).attr("id")
        });
    };

    dataList = {
        choiceAnswer: choiceAnswer,
        judgeAnswer: judgeAnswer,
        multiChoiceAnswer: multiChoiceAnswer,
        testPaperId: $("#id").val(),
        timeConsum: $("#timeCost").val(),//用了多长时间交卷
        type: 'exam'//exam(考试)exercise(练习)
    };

    http.ajax({
        url: 'exam/submit',
        type: 'POST',
        json: true,
        mask: true,
        data: JSON.stringify(dataList)
    }).then(function (data) {
        var result = data;
        if (data.code == 200) {
            layer.msg('考试结果正在加载中', { icon: 16, time: '950' })
            setTimeout(function () {
                $(".examination").hide();
                $(".certificate").show();
                //初始化数字滚动特效
                $(".font").text(result.data.score);
                if(result.data.pass == true){
                    $(".pass").html("恭喜您已成功通过<br> 【"+result.data.info.examName+"】考试");
                    $(".application").show();
                }else{
                    $(".pass").html("很抱歉考试未合格，请重新参加<br> 【"+result.data.info.examName+"】考试")
                    $(".examResult .circle").css("border","7px solid #9A979A");
                    $(".examResult .circle p").css("color","#9A979A");
                    $(".examResult .circle p i").css("color","#9A979A");
                    $(".restart").show();
                }
                $(".font").numScroll();
            }, 1000)
        }else{
            layer.msg('考试失败！失败原因：'+data.msg+'请联系管理员！', {
                icon: 5
            },function(){
                history.back();
            });
        }
    }, function (err) {

    })
}

//点击发证
$(".application").click(function(){
    openUrl('application.html?id='+getQueryString('kid')+'');
})

//全屏
function fullscreen(){
    var e = event || window.event || arguments.callee.caller.arguments[0];
      e.preventDefault();  //阻止F11默认动作
      var el = document.documentElement;
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;//定义不同浏览器的全屏API
　　　　　　//执行全屏
      if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
      } else if(typeof window.ActiveXObject != "undefined"){
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript!=null) {
                wscript.SendKeys("{F11}");
            }
      }
　　　　　　//监听不同浏览器的全屏事件，并件执行相应的代码
      document.addEventListener("webkitfullscreenchange", function() {//
          if (document.webkitIsFullScreen) {
               //全屏后要执行的代码
          }else{
               //退出全屏后执行的代码
      　　 }
      }, false);

      document.addEventListener("fullscreenchange", function() {
          if (document.fullscreen) {
               //全屏后执行的代码
          }else{
               //退出全屏后要执行的代码
          }
      }, false);

      document.addEventListener("mozfullscreenchange", function() {
          if (document.mozFullScreen) {
               //全屏后要执行的代码
          }else{
               //退出全屏后要执行的代码
          }
      }, false);

      document.addEventListener("msfullscreenchange", function() {
          if (document.msFullscreenElement) {
               //全屏后要执行的代码
          }else{
               //退出全屏后要执行的代码
          }
      }, false)

}