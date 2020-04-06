// 点击切换注册
$(".registerBut").click(function(){
    $(".phone").val("");
    $(".code").val("");
    if($(this).text() == "注册"){
        $(this).text("登录");
        $(".loginMain h1").text("欢迎注册安徽食品安全培训网");
        $(".submit").text("注册账号");
        $("#checkType").val("register");
    }else{
        $(this).text("注册");
        $(".loginMain h1").text("欢迎登录安徽食品安全培训网");
        $(".submit").text("登录");
        $("#checkType").val("login");
    }
});

// 点击切换二维码
$(".numberLogin .upRight").click(function(){
    $(".qrcodeLogin").show().siblings(".numberLogin").hide();
    //获取loginCode
    // getLoginCode();
});
$(".numberLogin .ewm").click(function(){
    $(".qrcodeLogin").show().siblings(".numberLogin").hide();
    //获取loginCode
    // getLoginCode();
});
$(".qrcodeLogin .upRight").click(function(){
    $(".numberLogin").show().siblings(".qrcodeLogin").hide()
});
//轮询
window.setInterval(function () {
    // checkLogin($("#loginCode").val())
}, 3000)

//获取验证码
$(".getCode").click(function(){
    var phone = $(".phone").val();
    if(!phone){
        layer.msg('请先输入手机号码!', {
            icon: 5
        });
    }else{
        if($("#checkType").val() == "register"){
            check(phone,'phone');
        }else{
            send_verify_code(phone,$("#checkType").val());
            countDownCode();
        }
        
    }
});

$(".submit").click(function(){
    var phone = $(".phone").val();
    var code = $(".code").val();
    if(phone == ""){
        layer.msg('请输入手机账号', {
            icon: 5
        });
    }else if(code == ""){
        layer.msg('请输入验证码', {
            icon: 5
        });
    }else{
        if($(this).text() == "登录"){
            login(phone,code);
        }else{
            var json = {
                "code": code,
                "openid": "",
                "phone": phone
            };
            register(json);
        }
    }
})

//用户登录
function login(phone,code){
    http.ajax({
        url: 'user/login',
        type: 'POST',
        json: false,
        mask: true,
        data: {
            phone:phone,
            code:code,
        }
    }).then(function(data) {
        if(data.code == 200){
            layer.msg('恭喜您，登录成功！', {
                icon: 1
            }, function() {
                location.href = 'index.html';
            });
        }
    },function(err) {
        console.log(err);
    })
};

//用户注册
function register(json){
    http.ajax({
        url: 'user/register',
        type: 'POST',
        json: true,
        mask: true,
        data: JSON.stringify(json)
    }).then(function(data) {
        clearInterval(timer);
        if(data.code == 200){
            layer.msg('注册成功！即将登录', {
                icon: 1
            }, function() {
                location.href = 'index.html';
            });
        }
    },function(err) {
        console.log(err);
    })
};

//检查手机号或用户名是否可注册
function check(phone,type){
    http.ajax({
        url: 'user/check',
        type: 'GET',
        json: false,
        mask: true,
        data: {
            data:phone,
            type:type,
        }
    }).then(function(data) {
        if(data.code == 200){
            send_verify_code(phone,$("#checkType").val());
            countDownCode();
        }
    },function(err) {
        
    })
};
//模拟登陆
// $(".qrCode").click(function () {
//     layer.prompt({ title: '开发模拟小程序登陆', formType: 3 }, function (pass, index) {
//         layer.close(index);
//         devLogin(pass)
//     });
// })
//测试环境用户登录
function devLogin(phone) {
    http.ajax({
        url: 'user/devLogin',
        type: 'POST',
        json: false,
        mask: true,
        data: {
            phone: phone,
        }
    }).then(function (data) {
        if (data.code == 200) {
            layer.msg('恭喜您，登录成功！', {
                icon: 1,
                time:1000
            }, function () {
                location.href = 'index.html';
            });
        }
    }, function (err) {
        console.log(err);
    })
};


