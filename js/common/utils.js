/**
 * Created by li.lli on 2015/4/25.
 */
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
//截断字符串
function trim(description,len){
    return description && description.length > len ? description.substr(0, len) : description;
}
/**
 * 模仿android里面的Toast效果，主要是用于在不打断程序正常执行的情况下显示提示数据
 * @param config
 * @return
 */
var Toast = function(config){
    this.msgEntity;
    this.context = config.context==null?$('body'):config.context;//上下文
    this.message = config.message;//显示内容
    this.time = config.time==null?3000:config.time;//持续时间
    this.left = config.left;//距容器左边的距离
    this.top = config.top;//距容器上方的距离
    this.init();
}

Toast.prototype = {
    //初始化显示的位置内容等
    init : function(){
        $("#toastMessage").remove();
        //设置消息体
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage" style="border-radius: 4px">');
        msgDIV.push('<span>'+this.message+'</span>');
        msgDIV.push('</div>');
        this.msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //设置消息样式
        var left = (this.left == null) ? (this.context.width()/2-this.msgEntity.find('span').width()/2) : this.left;
        var top = (this.top == null) ? (this.context.height()/2-this.msgEntity.find('span').height()/2) : this.top;
        this.msgEntity.css({position:'absolute',top:top,'z-index':'99',left:left,'background-color':'#000000',color:'white','font-size':'16px',padding:'10px',margin:'10px'});
        this.msgEntity.hide();
    },
    //显示动画
    show :function(){
        this.msgEntity.fadeIn(this.time/2);
        this.msgEntity.fadeOut(this.time/2);
    }
};

//菜单tab切换效果
$(function(){
   var path = window.location.pathname;
   $(".footer a").removeClass('active');

   if(path.indexOf("sport_list")>0){
       $(".index-tab").addClass('active');
   }else if(path.indexOf("coach_list")>0){
       $(".coach-tab").addClass('active');
   }else if(path.indexOf("order_list")>0){
       $(".order-tab").addClass('active');
   }else{
       $(".my-tab").addClass('active');
   }
}());


