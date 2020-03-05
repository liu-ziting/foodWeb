var App = {
	apiBasePath: "http://www.chenkaix.cn:8088/", 	//接口地址
	rootPath: getRootPath(),				//项目根目录地址
	filePath: 'http://www.chenkaix.cn:8088/',
	timestamp: ((Date.parse(new Date())) / 1000).toString(),	//时间戳
};

//头部进度加载条
NProgress.start();
document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		NProgress.done();
	}
}
			
//导航栏操作
$("#navList li").click(function () {
	var _index = $(this).index() + 1;
	openUrl(jumpUrl('0'+_index))
	console.log(jumpUrl('0'+_index));
});
function jumpUrl(value) {
	switch (value) {
		case "01":
			return "index.html";
		case "02":
			return "courseCenter.html";
		case "03":
			return "fingerpost.html";
		case "04":
			return "announcement.html";
		case "05":
			return "information.html";
		case "06":
			return "certificate.html";
		case "07":
			return "testCenter.html";
	}
};
function jumpActive(value) {
	switch (value) {
		case "index":
			return "0";
		case "courseCenter":
			return "1";
		case "courseCenterDetails":
			return "1";	
		case "watchVideo":
			return "1";	
		case "fingerpost":
			return "2";
		case "announcement":
			return "3";
		case "information":
			return "4";
		case "details":
			return "4";
		case "certificate":
			return "5";
		case "testCenter":
			return "6";
		case "examination":
			return "6";	
	}
};
var pathName = window.document.location.pathname;
var aPos = pathName.indexOf('/');
var bPos = pathName.indexOf('.');
var activeUrl = pathName.substr(aPos + 1, bPos - aPos - 1);
$("#navList li").eq(jumpActive(activeUrl)).addClass("active")
// 底部
$("footer").load("footer.html");

// 获取导航栏
// $(function () {
// 	$.ajax({
// 		type: "GET",
// 		url: "js/nav.json",
// 		dataType: "json",
// 		success: function (data) {
// 			var ihtml = "";
// 			// 获取主机地址之后的目录
// 			var pathName = window.document.location.pathname;
// 			var aPos = pathName.indexOf('/');
// 			var bPos = pathName.indexOf('.');
// 			var activeUrl = pathName.substr(aPos + 1, bPos - aPos - 1);
// 			for (var i = 0; i < data.length; i++) {
// 				if (activeUrl == data[i].id) {
// 					ihtml += '<li class="active" onclick=\"openUrl(\'' + data[i].href + '\')\">' + data[i].title + '<i></i></li>'
// 				} else {
// 					ihtml += '<li onclick=\"openUrl(\'' + data[i].href + '\')\">' + data[i].title + '<i></i></li>'
// 				}
// 			};
// 			$("#navList").html(ihtml);
// 			// 底部
// 			$("footer").load("footer.html");
// 		}
// 	});
// });

// 返回顶部
layui.use(['util'], function () {
	var util = layui.util
	//固定块
	util.fixbar({
		css: { right: 50, bottom: 100 }
		, bgcolor: '#393D49'
	});
})

/* 获取url地址参数  */
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
};
// 处理图片404
function imgError(image) {
	$(image).attr("src", App.rootPath + "/img/kong.png");
}
/* 打开新页面 */
function openUrl(url, type) {
	if (!type) {
		window.location.href = url;
	} else {
		window.open(url)
	};
};
/** ajax封装
    url: 请求接口地址,
    type: 请求类型 POST GET,
    json: 数据请求方式,
    mask: 是否有loading,
    data: 请求参数
 */
var http = {
	ajax: function (options) {
		var loading = '';
		var def = $.Deferred();
		if (options.mask) {
			loading = layer.msg('加载中，请稍后...', {
				icon: 16,
				shade: 0.01,
				time: 0
			});
		}
		$.ajax({
			url: App.apiBasePath + options.url,
			data: options.data,
			type: options.type,
			xhrFields: {
				withCredentials: true
			},
			contentType: options.json ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded',
		}).then(function (rsp) {
			def.resolve(rsp);
			setTimeout(function () {
				layer.close(loading);
			}, 100)
		}, function (error) {
			if (error.status == 504) {
				layer.msg('请求超时，请重试!', {
					icon: 5
				});
			} else if (error.responseText) {
				var err = JSON.parse(error.responseText);
				var code = err.code; // 错误码
				var emsg = err.msg; // 错误内容提示（字符串）
				switch (code) {
					case 500: // 500 服务器错误
						layer.msg('服务器发生错误，请联系管理员！', {
							icon: 5
						});
						break;
					case 403: // 403 未登录
						//						layer.msg('登录失效，请重新登录！', {
						//							icon: 5
						//						},function(){
						//							location.href = 'login.html';
						//						});
						break;
					case 401: // 401 登录失败
						layer.msg('登录失败！', {
							icon: 5
						});
						break;
					case 10002: // 10002 注册失败
						layer.msg('用户注册失败！', {
							icon: 5
						});
						break;
					case 10000: // 10000 手机号已存在
						layer.msg('手机号已存在！', {
							icon: 5
						});
						break;
					case 10001: // 10001 验证码发送失败
						layer.msg('验证码发送失败！', {
							icon: 5
						});
						break;
					case 10003: // 10003 更改手机号失败
						layer.msg('更改手机号失败', {
							icon: 5
						});
						break;
					case 10004: // 10004 更新失败
						layer.msg('更新失败', {
							icon: 5
						});
						break;
					case 10009: // 10009 创建支付信息失败
						layer.msg(emsg + '，请联系管理员！', {
							icon: 5
						});
						break;
				}
			}
			def.reject(error);
			setTimeout(function () {
				layer.close(loading);
			}, 100)
		});
		return def;
	}
}

/* 获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS” */
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes();
	//+ seperator2 + date.getSeconds(); 
	return currentdate;
};

/* 获取当前项目根路径  */
function getRootPath() {
	// 获取当前网址
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
};
//表单重新渲染
function renderForm() {
	layui.use('form', function () {
		var form = layui.form;
		form.render();
	});
};
//处理返回的数据为null时候，设置为暂无
function beNull(data) {
	for (let x in data) {
		if (data[x] === null) { // 如果是null 把直接内容转为 '暂无'
			data[x] = '暂无';
		} else {
			// if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
			// 	data[x] = data[x].map(z => {
			// 	return beNull(z);
			// 	});
			// }
			if (typeof (data[x]) === 'object') { // 是json 递归继续处理
				data[x] = beNull(data[x])
			}
		}
	}
	return data;
};

//判断是pc还是H5
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

//分享到微信
function weixin(_this) {
	var url = App.rootPath + $(_this).attr("id");
	layer.open({
		type: 1,
		skin: 'layui-layer-demo', //样式类名
		closeBtn: 1, //不显示关闭按钮
		anim: 1,
		title: '扫一扫分享朋友圈', //不显示标题
		shadeClose: true, //开启遮罩关闭
		content: ' <div id="code" style="padding: 10px;"></div>'
	});
	$('#code').qrcode({ text: url });
}
//分享到新浪微博
function shareToXl(_this) {
	var title = $(_this).attr("bt");
	var url = App.rootPath + $(_this).attr("id");
	var picurl = $(_this).parent(".imgbox").find("img").attr("src");
	var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;
	window.open(sharesinastring, 'newwindow', 'height=400,width=400,top=100,left=100');
}
//分享到qq空间
function shareToQq(_this) {
	var title = $(_this).attr("bt");
	var url = App.rootPath + $(_this).attr("id");
	var picurl = $(_this).parent(".imgbox").find("img").attr("src");
	var summary = $(_this).parent("p").text();
	var shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' + summary + '&title=' + title + '&url=' + url + '&pics=' + picurl;
	window.open(shareqqzonestring, 'newwindow', 'height=400,width=400,top=100,left=100');
}

//操作cookie的对象
var cookie = {
	set: function (name, value) {
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
	},
	get: function (name) {
		var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
		if (arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	},
	del: function (name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if (cval != null) {
			document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
		}
	}
};