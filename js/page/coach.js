/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var COACH_LIST_URL = "/coaches",
        PAGE_SIZE = 10;
    var pageIndex = 0;//获得的累计记录数
    var coachList = $("#coach-list"),
        template = $("#template"),
        loading = $("#loading");


    //到底部加载下一页
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight){
            if(pageIndex > 0){
                getCoachList(pageIndex);
            }
        }
    });

    function getCoachList(pageIndex){
        loading.show();
        $.get(
            COACH_LIST_URL,
            {
                count: PAGE_SIZE,
                cursor: pageIndex
            },
            function (result){
                loading.hide();
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return;
                }
                var len = result.length,arr = [], i;
                if(len === 0) {
                    new Toast({context: $('body'), message: "暂无教练"}).show();
                    return;
                }
                pageIndex = (len < PAGE_SIZE)?-1: pageIndex+PAGE_SIZE ;
                Mustache.parse(template.html());
                for ( i=0 ; i < len; i += 1) {
                    result[i].description = trim(result[i].description,17);//简介缩减
                    arr.push(Mustache.render(template.html(),result[i]));
                }
                coachList.append(arr.join(' '));
            }
        );
    }

    getCoachList(pageIndex);
}());