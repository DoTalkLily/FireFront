/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var COACH_LIST_URL = "../mock/coaches.json",
        COACH_DETAIL_URL = "../mock/coach-detail.json",
        PAGE_SIZE = 10;
    var pageIndex = 0;
    var coachList = $("#coach-list"),
        coachDetail = $("#coach-detail"),
        template = $("#template"),
        loading = $("#loading"),
        sportTemplate = $("#sport-template"),
        orderBtn = $('#order-btn'),
        orderTip = $(".order-tip");
    $("#order-btn").on('click', submitOrder);//预约下单按钮
    //教练列表页面
    if(coachList&&coachList.length){
        getCoachList(pageIndex);
    }
    //详情页面
    if(coachDetail && coachDetail.length){
        getCoachDetail();
    }
    //到底部加载下一页
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight == scrollHeight){
            pageIndex += 1;
            getCoachList(pageIndex);
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
                Mustache.parse(template.html());
                for ( i=0 ; i < len; i += 1) {
                    result[i].description = trim(result[i].description,17);//简介缩减
                    arr.push(Mustache.render(template.html(),result[i]));
                }
                coachList.append(arr.join(' '));
            }
        );
    }
    function getCoachDetail(){
        var id = getUrlParam("id");
        if (isNaN(id)) {
            return;
        }
        $.get(
            COACH_DETAIL_URL,
            function (result) {
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return;
                }
                if(!result) {
                    new Toast({context: $('body'), message: "暂无教练"}).show();
                    return;
                }
                Mustache.parse(template.html());
                Mustache.parse(sportTemplate.html());
                coachDetail.append(Mustache.render(template.html(),result));
                var i,len = result.sports.length,arr=[];
                for ( i=0 ; i < len; i += 1) {
                    arr.push(Mustache.render(sportTemplate.html().trim(),result.sports[i]));
                }
                $("#sports-list").append(arr.join(''));
                //教练简介、展开收起事件
                $(".slide-up-down").on('click',function(){
                     if($(this).hasClass('extend')){
                         $(this).removeClass('extend').addClass('retract');
                         $(".description-content").slideUp().show();
                         $(this).html("收起");
                     }else{
                         $(this).removeClass('retract').addClass('extend');
                         $(".description-content").slideDown().hide();
                         $(this).html("展开");
                     }
                });
                orderBtn.on('click',submitOrder);
                $(".icon-chose").on('click',function(){
                    if($(this).hasClass('icon-chosen')){
                        $(this).removeClass('icon-chosen');
                    }else{
                        $(this).addClass('icon-chosen');
                    }
                    if($('.icon-chosen').length > 0){
                        orderBtn.addClass('order-active');
                        orderTip.html("教练+课程已选");
                    }else{
                        orderBtn.removeClass('order-active');
                        orderTip.html("请选择课程");
                    }
                });
            }
        );
    }

    function submitOrder() {
        var orderChecked = $('input:checkbox[name="sport"]:checked');
        if (orderChecked.length == 0) {
            new Toast({context:$('body'),message:"请选择项目"}).show();
            return false;
        }
        var orderIdArr = [], i = 0, len = orderChecked.length;
        for (; i < len; i++) {
            orderIdArr.push(orderChecked[i].value);
        }
        console.log(orderIdArr);
    }

}());