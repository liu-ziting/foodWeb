// 食品安全资讯
foodNewsList()
function foodNewsList() {
        http.ajax({
            url: 'notice/newsList',
            type: 'GET',
            json: false,
            mask: true,
            data: {
                pageNo: 1,
                pageSize: 12,
                type:'foodNews'
            }
        }).then(function (data) {
            var result = data.data;
            var leftHtml="";
            var rightHtml="";
            if (data.code == 200) {
                // 数据渲染
                leftHtml +="<div class=\"imgBox gjpAfter\">"+
                "</div>"+
                "<div class=\"textBox\">"+
                "<time>新闻 | "+result.items[0].createTime+"</time>"+
                "<p>"+result.items[0].noticeTitle+"</p>"+
                "<a href=\"details.html?id="+result.items[0].id+"\">【查看详情】</a>"+
                "</div>";

                for (var i = 1; i < result.items.length; i++) {
                    rightHtml += '<li  onclick="openUrl("details.html?id='+result.items[i].id+'")" ><p>'+result.items[i].noticeTitle+'</p><span>'+result.items[i].createTime+'</span></li>';
                };

                $("#foodNewsList .left").append(leftHtml);
                $("#foodNewsList .middle ul").append(rightHtml);

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