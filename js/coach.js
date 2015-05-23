/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var COACH_LIST_URL = "mock/coaches.json",
        COACH_DETAIL_URL = "mock/coach-detail.json",
        PAGE_SIZE = 10;

    var coachList = $("#coach-list"),
        coachDetail = $("#coach-detail"),
        template = $("#template"),
        loading = $("#loading")
        sportTemplate = $("#sport-template");
    $("#order-btn").on('click', submitOrder);//预约下单按钮
    //教练列表页面
    if(coachList&&coachList.length){
        getCoachList(0);
    }
    //详情页面
    if(coachDetail && coachDetail.length){
        getCoachDetail();
    }

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
                    result[i].description = trim(result[i].description,20);//简介缩减
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
            COACH_DETAIL_URL,{ id : id },
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
                    arr.push(Mustache.render(sportTemplate.html(),result.sports[i]));
                }
                $("#sports").append(arr.join(' '));
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