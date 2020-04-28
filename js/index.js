// 食品安全资讯
foodNewsList()
function foodNewsList() {
        http.ajax({
            url: 'notice/newsList',
            type: 'GET',
            json: false,
            mask: false,
            data: {
                pageNo: 1,
                pageSize: 12,
                type:'foodNews'
            }
        }).then(function (data) {
            var result = data.data;
            var leftHtml="";
            var rightHtml="";
            var topList="";
            if (data.code == 200) {
                // 数据渲染
                leftHtml +="<div class=\"imgBox gjpAfter\">";
                if(result.items[0].imageUrl){
                    leftHtml +="<img src="+result.items[0].imageUrl+" />";
                }else{
                    
                }
                leftHtml +="</div>"+
                "<div class=\"textBox\">"+
                "<time>新闻 | "+result.items[0].createTime+"</time>"+
                "<p>"+result.items[0].noticeTitle+"</p>"+
                "<a href=\"details.html?id="+result.items[0].id+"\">【查看详情】</a>"+
                "</div>";

                for (var i = 1; i < result.items.length; i++) {
                    rightHtml += '<li title='+result.items[i].noticeTitle+' id="'+result.items[i].id+'"  ><p>'+result.items[i].noticeTitle+'</p><span>'+result.items[i].createTime+'</span></li>';
                };

                for (var i = 0; i < result.items.length; i++) {
                    topList += '<div id="'+result.items[i].id+'"  class="swiper-slide">最新资讯：'+result.items[i].noticeTitle+'</div>';
                };
                if(result.items.length == 0){
                    topList += '<div class="swiper-slide">最新资讯：暂无最新资讯</div>';
                }
                if(result.items.length == 1){
                    rightHtml += '<li ><p>暂无更多资讯</p><span>'+getNowFormatDate()+'</span></li>';
                }

                $("#topList").append(topList);
                $("#foodNewsList .left").append(leftHtml);
                $("#foodNewsList .middle ul").append(rightHtml);

                $("#foodNewsList .middle ul li").click(function(){
                    var id = $(this).attr("id");
                    var upTitle = localStorage.setItem("upTitle",'> 食品安全资讯')
                    if(id){
                        openUrl('details.html?id='+id+'');
                    }
                });
                $("#topList div").click(function(){
                    var id = $(this).attr("id");
                    var upTitle = localStorage.setItem("upTitle",'> 食品安全资讯')
                    if(id){
                        openUrl('details.html?id='+id+'');
                    }
                })
                //轮播资讯
                var noticeSwiper = new Swiper('.noticeSwiper', {
                    direction: 'vertical',
                    autoplay: {
                        delay: 3000
                    },
                });
            }
        }, function (err) {
            if(err.status == 403){
                layer.msg('未登录，不可操作！', {
                    icon: 5,
                    time: 800, 
                },function(){
                    location.href = 'login.html';
                });
            }
        })
};

// 获取课程列表
// indexCourse()
function indexCourse() {
        http.ajax({
            url: 'course/indexCourse',
            type: 'GET',
            json: false,
            mask: false,
            data: {
                
            }
        }).then(function (data) {
            var result = beZero(data.data);
            if (data.code == 200) {
                $(".course .temporary").hide();
                //从业人员培训课程
                var listOne = result.items[0];
                if(listOne == undefined){
                    $("#courseOne").parents().parent(".manager").hide();
                }else{
                    courseList(listOne,"courseOne");
                }
                //管理人员培训课程
                var listTwo = result.items[1];
                if(listTwo == undefined){
                    $("#courseTwo").parents().parent(".manager").hide();
                }else{
                    courseList(listTwo,"courseTwo");
                }
                
            }
        }, function (err) {
            
        })
};
function courseList(list,id){
    var innerHtml = "";
    for (var i = 0; i < list.length; i++) {
        innerHtml +="<li onclick=\"openUrl(\'courseCenterDetails.html?id="+list[i].id+"\')\">";
        if(list[i].fontCoverPic == 0 ||list[i].fontCoverPic == null){
            innerHtml +="<div class=\"gbox\" style='background: url(../img/no.png);'></div>";
        }else{
            innerHtml +="<div class=\"gbox\" style='background: url("+list[i].fontCoverPic+");background-size:cover;background-position:center;'></div>";
        }
        innerHtml +="<div class=\"kbox\">"+
        "<div class=\"right\">"+
        "<h2>"+list[i].courseName+"</h2>"+
        "<p>"+list[i].trainingType.trainingTypeName+"适用</p>"+
        "<i>简介："+list[i].courseSummary+"</i>"+
        "</div>"+
        "<div class=\"timeBox\">"+
        "<span><img src=\"../img/book.png\" /><p>"+list[i].learnNum+"人学习</p></span>"+
        "<span><img src=\"../img/time.png\" /><p>"+list[i].courseHourNum+"课时/"+list[i].totalLearningHours+"分钟</p>"+
        "</span>"+
        "</div></div></li>";
    };
    $("#"+id+"").append(innerHtml);
    $("#"+id+"").siblings(".title").find(".stitle").text(list[0].trainingType.trainingTypeName);
}

// 获取试听课程列表
var videoID = 10; //视频的区分ID，每个视频分配一个唯一的ID
var cookieTime = cookie.get('time_' + videoID); //调用已记录的time
freeCourseList()
function freeCourseList() {
        http.ajax({
            url: 'course/freeCourseList',
            type: 'GET',
            json: false,
            mask: false,
            data: {
                pageNo:1,
                pageSize:5
            }
        }).then(function (data) {
            var result = beZero(data.data);
            var rigthHtml = "";
            $("#auditionRight .temporary").hide();
            if (data.code == 200) {
                for (var i = 0; i < result.items.length; i++) {
                    rigthHtml+='<li id='+result.items[i].courseInfo.id+'><span>'+result.items[i].courseInfo.trainingType.trainingTypeName+'</span><p>'+result.items[i].courseInfo.courseName+' - '+result.items[i].courseHourName+'</p></li>'
                };
                $("#auditionRight").append(rigthHtml);
                
                $("#auditionRight li:first-child").addClass("active");

                leftDetsils(result,0,result.items[0].courseInfo.id);

                var courseResourceUrl = result.items[0].courseResourceUrl;
                //切换视频
                $(".information .right li").click(function () {
                    cookieTime = 0;
                    var id = $(this).attr("id");
                    var index = $(this).index();
                    $(this).addClass("active").siblings().removeClass("active");
                    var courseResourceUrl = result.items[index].courseResourceUrl;
                    videoPlay(courseResourceUrl,'true');

                    leftDetsils(result,index,id)
                });

                videoPlay(courseResourceUrl)
               

            }
        }, function (err) {
            
        })
};

// 播放视频
function videoPlay(courseResourceUrl,isAutoplay){
    var videoObject = {
        container: '.videosamplex',//“#”代表容器的ID，“.”或“”代表容器的class
        variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
        // poster: 'img/no.png',
        loaded: "loadHandler",
        autoplay: isAutoplay, //是否自动播放
        loop: false, //播放结束是否循环播放
        mobileCkControls: true,//是否在移动端（包括ios）环境中显示控制栏
        mobileAutoFull: false,//在移动端播放后是否按系统设置的全屏播放
        h5container: '#videoplayer',//h5环境中使用自定义容器
        video: courseResourceUrl,//视频地址,
    };
    if (!cookieTime || cookieTime == undefined) { //如果没有记录值，则设置时间0开始播放
        cookieTime = 0;
    }
    if (cookieTime > 0) {
        console.log('本视频记录的上次观看时间(秒)为：' + cookieTime);
    }
    if (cookieTime > 0) { //如果记录时间大于0，则设置视频播放后跳转至上次记录时间
        // videoObject['seek'] = cookieTime;
    }
    var player = new ckplayer(videoObject);
    loadHandler(player);
}

function loadHandler(player) {
    player.addListener('time', timeHandler); //监听播放时间
    player.addListener('ended', VideoPlayEndedHandler);//监听播放结束
}
function timeHandler(t) {
    cookie.set('time_' + videoID, t); //当前视频播放时间写入cookie
}
function VideoPlayEndedHandler() {//监听视频播放完成
    console.log('本视频已结束');
}

// 课程简介
function leftDetsils(result,i,id){
    $(".trainingTypeName").html(result.items[i].courseInfo.courseName+' - '+result.items[0].courseHourName+'<a href="javascript:;">试听课程</a>')
    $(".hitCount").text(result.items[i].hitCount);
    $(".learnNum").text(result.items[i].courseInfo.learnNum);
    $(".jump").attr("id",id);
    $(".jump").click(function(){
        openUrl('courseCenterDetails.html?id='+id+'');
    })
}