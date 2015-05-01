/**
 * Created by li.lli on 2015/4/30.
 */
$(function(){
    var REGISTER_URL = "mock/register.json",//注册页面数据ajax url
        INDEX_URL = "index.html",//首页url
        VERYFY_URL = "mock/verify.json";//发送验证码url
    var MOBILE_RULE = new RegExp("^((13[0-9])|(15[^4,\\D])|(17[0-9])|(18[0-9]))\\d{8}$");//手机号正则表达式

    var mobileEle = $('#telephone'),
        verifyCodeEle = $('#verify-code');

    $("#register-btn").on('click',register);
    $("#verifycode-btn").on('click',sendVerifyCode);

    function sendVerifyCode(){
        countDown($("#verifycode-btn"));//倒计时60s
        if(!mobileEle.val() || !MOBILE_RULE.test(mobileEle.val())){
            new Toast({context:$('body'),message:'请输入正确手机号'}).show();
            return false;
        }
        $.get(
            VERYFY_URL,
            {
                "mobile": mobileEle.val(),
                "sign": md5(mobileEle.val()+"@randian")
            },
            function (result) {
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return false;
                }
                new Toast({context:$('body'),message:'已发送短信，请注意查收'}).show();
            }, "json");
        return false;
    }

    function register(){
        if(!mobileEle.val() || !MOBILE_RULE.test(mobileEle.val())){
            new Toast({context:$('body'),message:'请输入正确手机号'}).show();
            return false;
        }
        if(!verifyCodeEle.val()){
            new Toast({context:$('body'),message:'请输入验证码'}).show();
            return false;
        }
        $.post(
            REGISTER_URL,
            {
                "mobile": mobileEle.val(),
                "sms_code": verifyCodeEle.val(),
                "openid": getOpenid()
            },
            function (result) {
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return false;
                }
                window.location.href = INDEX_URL;
            }, "json");
        return false;
    }

    /** 倒计时**/
    function countDown(o) {
        var count = 60, clear;
        var time = function() {
            if (count == 0) {
                o.html("短信获取");
                o.removeClass("codeDisabled");
                o.on('click',sendVerifyCode);
                count = 60;
                clearInterval(clear)
            } else {
                o.addClass("codeDisabled");
                o.html(count + '秒后重新获取');
                count--;
                clear = setTimeout(function() {
                    time()
                }, 1000)
            }
        };
        if (!o.hasClass('codeDisabled')) {
            $("#verifycode-btn").off();
            time()
        }
    }

    function getOpenid(){
        return '1111';
    }
}());