/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var ORDER_LIST_URL = "/orders.json",
        PAGE_SIZE = 10;
    var pageIndex = 0;
    var orderList = $("#order-list"),
        template = $("#template");

    getOrderList(pageIndex);

    //到底部加载下一页
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight){
            if(pageIndex > 0){
                getOrderList(pageIndex);
            }
        }
    });

    function getOrderList(pageIndex){
        $.get(
            ORDER_LIST_URL,
            {
                count: PAGE_SIZE,
                cursor: pageIndex
            },
            function (result){
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return;
                }
                var len = result.length,arr = [], i;
                if(len === 0) {
                    new Toast({context: $('body'), message: "暂无订单"}).show();
                    return;
                }
                pageIndex = (len < PAGE_SIZE)?-1: pageIndex+PAGE_SIZE ;
                Mustache.parse(template.html());
                for ( i=0 ; i < len; i += 1) {
                    result[i].description = trim(result[i].description,17);//简介缩减
                    arr.push(Mustache.render(template.html(),result[i]));
                }
                orderList.append(arr.join(' '));
            }
        );
    }
}());