/**
 * Created by li.lli on 2015/4/25.
 */
//��ȡurl�еĲ���
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //����һ������Ŀ�������������ʽ����
    var r = window.location.search.substr(1).match(reg);  //ƥ��Ŀ�����
    if (r != null) return unescape(r[2]);
    return null; //���ز���ֵ
}
/**
 * ģ��android�����ToastЧ������Ҫ�������ڲ���ϳ�������ִ�е��������ʾ��ʾ����
 * @param config
 * @return
 */
var Toast = function(config){
    this.msgEntity;
    this.context = config.context==null?$('body'):config.context;//������
    this.message = config.message;//��ʾ����
    this.time = config.time==null?3000:config.time;//����ʱ��
    this.left = config.left;//��������ߵľ���
    this.top = config.top;//�������Ϸ��ľ���
    this.init();
}

Toast.prototype = {
    //��ʼ����ʾ��λ�����ݵ�
    init : function(){
        $("#toastMessage").remove();
        //������Ϣ��
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage" style="border-radius: 4px">');
        msgDIV.push('<span>'+this.message+'</span>');
        msgDIV.push('</div>');
        this.msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //������Ϣ��ʽ
        var left = this.left == null ? this.context.width()/2-this.msgEntity.find('span').width()/2 : this.left;
        var top = this.top == null ? this.context.height()/2-this.msgEntity.find('span').height()/2  : this.top;
        this.msgEntity.css({position:'absolute',top:top,'z-index':'99',left:left,'background-color':'black',color:'white','font-size':'18px',padding:'10px',margin:'10px'});
        this.msgEntity.hide();
    },
    //��ʾ����
    show :function(){
        this.msgEntity.fadeIn(this.time/2);
        this.msgEntity.fadeOut(this.time/2);
    }

}
