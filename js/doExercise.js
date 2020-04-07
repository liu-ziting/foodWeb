
//练习试题列表
exercise();
function exercise() {
    http.ajax({
        url: 'exam/exercise',
        type: 'GET',
        json: false,
        mask: true,
        data: {
            courseId: getQueryString("id")
        }
    }).then(function (data) {
        $(".temporary").hide();
        document.getElementById("numChoiceListHtml").innerHTML = "";
        document.getElementById("numjudgeListHtml").innerHTML = "";
        document.getElementById("nummultiChoiceListHtml").innerHTML = "";
        var result = beNull(data.data);
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
            $(".courseName").text(result.info.courseName);
            $(".questionNum").text(total);
            $("#id").val(result.id);
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
                nummultiChoiceListHtml += '<span class="number">' + (result.choiceList.length + result.choiceList.length + i) + '</span>';
            };
            $("#nummultiChoiceListHtml").append(nummultiChoiceListHtml);

            // 单选题题目渲染
            for (var i = 0; i < result.choiceList.length; i++) {
                ChoiceListHtml += "<li id=" + result.choiceList[i].id + "><p>" +
                    "<span style='margin-right: 0px;'>" + (i + 1) + "</span>、" + result.choiceList[i].name + "" +
                    "<i>查看解析</i>" +
                    "</p>" +
                    "<div class=\"layui-input-block\">";
                for (var j = 0; j < result.choiceList[i].chooseResultList.length; j++) {
                    ChoiceListHtml += "<input type=\"radio\" name=\"dx" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + result.choiceList[i].chooseResultList[j].choose + "\">";
                }

                ChoiceListHtml += "</div>" +
                    "<input type=\"hidden\" class=\"answer\"  value=\"" + result.choiceList[i].answer[0] + "\" />" +
                    "<h2><p>正确答案：<span>" + indexToString(result.choiceList[i].answer[0]) + "</span></p>解析：" + result.choiceList[i].questionAnalyze + "</h2>" +
                    "<em class=\"layui-icon layui-icon-rate-solid\"></em>" +
                    "</li>";
            }
            $("#ChoiceListHtml").append(ChoiceListHtml);

            // 判断题题目渲染
            for (var i = 0; i < result.judgeList.length; i++) {
                judgeListHtml += "<li id=" + result.judgeList[i].id + "><p>" +
                    "<span style='margin-right: 0px;'>" + (result.choiceList.length + i + 1) + "</span>、" + result.judgeList[i].name + "" +
                    "<i>查看解析</i>" +
                    "</p>" +
                    "<div class=\"layui-input-block\">";
                for (var j = 0; j < result.judgeList[i].chooseResultList.length; j++) {
                    judgeListHtml += "<input type=\"radio\" name=\"pd" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + result.judgeList[i].chooseResultList[j].choose + "\">";
                }
                judgeListHtml += "</div>" +
                    "<input type=\"hidden\" class=\"answer\"  value=\"" + result.judgeList[i].answer[0] + "\" />" +
                    "<h2><p>正确答案：<span>" + indexToString(result.judgeList[i].answer[0]) + "</span></p>解析：" + result.judgeList[i].questionAnalyze + "</h2>" +
                    "<em class=\"layui-icon layui-icon-rate-solid\"></em>" +
                    "</li>";
            }
            $("#judgeListHtml").append(judgeListHtml);

            // 多选题题目渲染
            for (var i = 0; i < result.multiChoiceList.length; i++) {
                multiChoiceListHtml += "<li id=" + result.multiChoiceList[i].id + "><p>" +
                    "<span style='margin-right: 0px;'>" + (result.choiceList.length + result.choiceList.length + i) + "</span>、" + result.multiChoiceList[i].name + "" +
                    "<i>查看解析</i>" +
                    "</p>" +
                    "<div class=\"layui-input-block multipleChoice\">";
                for (var j = 0; j < result.multiChoiceList[i].chooseResultList.length; j++) {
                    multiChoiceListHtml += "<input type=\"checkbox\" name=\"dx" + i + "\" value=\"" + j + "\" title=\"" + indexToString(j) + "：" + result.multiChoiceList[i].chooseResultList[j].choose + "\">";
                }
                multiChoiceListHtml += "</div>" +
                    "<input type=\"hidden\" class=\"answer\"  value=\"" + result.multiChoiceList[i].answer + "\" />" +
                    "<h2><p>正确答案：<span>" + acTiveArrStringFun(result.multiChoiceList[i].answer) + "</span></p>解析：" + result.multiChoiceList[i].questionAnalyze + "</h2>" +
                    "<em class=\"layui-icon layui-icon-rate-solid\"></em>" +
                    "</li>";
            }
            $("#multiChoiceListHtml").append(multiChoiceListHtml);

            // 数据绑定到右侧答题卡
            $("#topic  li .layui-input-block").click(function () {
                var selectedIndex = $(this).parents("li").find("p span").text() - 1;
                $("#sequence .number").eq(selectedIndex).addClass("green");
                if ($(this).hasClass("multipleChoice")) {
                    if ($(this).find('.layui-form-checked').length == 0) {
                        $("#sequence .number").eq(selectedIndex).removeClass("green");
                    }
                }
            });
            //收藏题目
            $("#topic li em").click(function () {
                var selectedIndex = $(this).parents("li").find("p span").text() - 1;
                if ($(this).hasClass("activeStar")) {
                    $(this).removeClass("activeStar");
                    $("#sequence .number").eq(selectedIndex).removeClass("yellow")
                } else {
                    $(this).addClass("activeStar");
                    $("#sequence .number").eq(selectedIndex).addClass("yellow")
                }
            });
            //查看解析
            $(".examination .right li i").click(function () {
                if ($(this).hasClass("activei")) {
                    $(this).removeClass("activei");
                    $(this).parent().siblings("h2").hide()
                } else {
                    $(this).addClass("activei");
                    $(this).parent().siblings("h2").show()
                }
            });
            renderForm();

            //模拟点击提交
            $(".submit").click(function () {
                // 单选框的值
                for (var i = 0; i < $("#ChoiceListHtml li").length; i++) {
                    var answerList = $("#ChoiceListHtml li").eq(i).find("input:checked").val() * 1;
                    if (answerList == undefined) {
                        answerList = ""
                    }
                    if ($("#ChoiceListHtml li").eq(i).find(".answer").val() == answerList) {
                        $("#numChoiceListHtml span").eq(i).addClass('correct');
                        $("#ChoiceListHtml li").eq(i).find("input:checked").next().addClass("correctBox")
                    } else {
                        $("#numChoiceListHtml span").eq(i).addClass('wrong');
                        $("#ChoiceListHtml li").eq(i).find("input:checked").next().addClass("errorBox")
                    }
                };
                // 判断框的值
                for (var i = 0; i < $("#judgeListHtml li").length; i++) {
                    var answerList = $("#judgeListHtml li").eq(i).find("input:checked").val() * 1;
                    if (answerList == undefined) {
                        answerList = ""
                    }
                    if ($("#judgeListHtml li").eq(i).find(".answer").val() == answerList) {
                        $("#numjudgeListHtml span").eq(i).addClass('correct');
                        $("#judgeListHtml li").eq(i).find("input:checked").next().addClass("correctBox")
                    } else {
                        $("#numjudgeListHtml span").eq(i).addClass('wrong');
                        $("#judgeListHtml li").eq(i).find("input:checked").next().addClass("errorBox")
                    }
                };
                // 多选框的值
                for (var i = 0; i < $("#multiChoiceListHtml li").length; i++) {
                    var answerList = [];
                    for (var j = 0; j < $("#multiChoiceListHtml li").eq(i).find("input:checked").length; j++) {
                        answerList.push($("#multiChoiceListHtml li").eq(i).find("input:checked").eq(j).val() * 1)
                    }
                    var answerBox = $("#multiChoiceListHtml li").eq(i).find(".answer").val();
                    
                    var str = answerBox;
                    var str_array = str.split(',');
                    var answerList2 = []
                    for (var h = 0; h < str_array.length; h++) {
                        str_array[h] = str_array[h].replace(/^\s*/, "").replace(/\s*$/, "");
                        answerList2.push(str_array[h] * 1)
                    }
                    // 两个数组去重
                    var intersection = answerList.filter(function (val) { return answerList2.indexOf(val) > -1 })


                    if ($("#multiChoiceListHtml li").eq(i).find(".answer").val() == answerList) {
                        $("#nummultiChoiceListHtml span").eq(i).addClass('correct');
                        $("#multiChoiceListHtml li").eq(i).find("input:checked").next().addClass("correctBox");
                    } else {
                        $("#nummultiChoiceListHtml span").eq(i).addClass('wrong');
                        $("#multiChoiceListHtml li").eq(i).find("input:checked").next().addClass("errorBox");
                        //多选题判断自己答对的选项变绿    
                        for (var k = 0; k < intersection.length; k++) {
                            $("#multiChoiceListHtml li").eq(i).find("input:checked").eq(intersection[k]).next().addClass("correctBox")
                        }
                    }
                };
                $("input").attr("disabled", "disabled");
                $("input").next().addClass('layui-radio-disbaled layui-disabled');
                $("h2").removeClass('layui-radio-disbaled layui-disabled');
                if ($(this).text() == "再练习一遍") {
                    location.reload();
                } else {
                    $(".examination .right form em").hide();
                    $(".examination .right form ul li p i").show();
                    $(this).text("再练习一遍");
                }
            });
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

