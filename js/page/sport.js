/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var SPORT_LIST_URL = "/sports",
        PAGE_SIZE = 10;
    var pageIndex = 0;
    var sportList = $("#sport-list"),
        template = $("#template");

    //到底部加载下一页
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight){
            if(pageIndex > 0){
                getSportList(pageIndex);
            }
        }
    });

    function getSportList(pageIndex){
        $.get(
            SPORT_LIST_URL,
            {
                count: PAGE_SIZE,
                cursor: pageIndex
            },
            function (result){
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return;
                }
                var len = result.length;
                if(len === 0) {
                    new Toast({context: $('body'), message: "暂无项目"}).show();
                    return;
                }
                pageIndex = (len < PAGE_SIZE)?-1: pageIndex+PAGE_SIZE ;
                Mustache.parse(template.html());
                var arr = [], i;
                for ( i=0 ; i < len; i += 1) {
                    arr.push(Mustache.render(template.html(),result[i]));
                }
                sportList.append(arr.join(' '));
            }
        );
    }

    getSportList(0);
}());