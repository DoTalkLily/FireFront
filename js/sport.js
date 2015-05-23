/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var SPORT_LIST_URL = "mock/sports.json",
        SPORT_DETAIL_URL = "mock/sport-detail.json",
        PAGE_SIZE = 10;

    var sportList = $("#sport-list"),
        sportDetail = $("#sport-detail"),
        template = $("#template");

    //教练列表页面
    if(sportList && sportList.length){
        getSportList(0);
    }
    //详情页面
    if(sportDetail  && sportDetail.length){
        getSportDetail();
    }

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
                Mustache.parse(template.html());
                var arr = [], i;
                for ( i=0 ; i < len; i += 1) {
                    arr.push(Mustache.render(template.html(),result[i]));
                }
                sportList.append(arr.join(' '));
            }
        );
    }
    function getSportDetail(){
        var id = getUrlParam("id");
        if (isNaN(id)) {
            return;
        }
        $.get(
            SPORT_DETAIL_URL,{ id : id },
            function (result) {
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return;
                }
                if(!result) {
                    new Toast({context: $('body'), message: "暂无详情"}).show();
                    return;
                }
                result.countLimit = getNumLimit(result.max_user_num,result.min_user_num);
                Mustache.parse(template.html());
                sportDetail.append(Mustache.render(template.html(),result));
                bindEvent();
            }
        );
    }

    function bindEvent(){
        var time = parseInt($("#time").html()),
            expense = parseFloat($("#expense").html()),
            totalTime = $("#totalTime"),
            totalExpense = $("#totalExpense"),
            orderCount = $("#count"),count;

        $("#add").on('click',function(){
            count = parseInt(orderCount.html())+1;
            orderCount.html(count);
            totalTime.html(count * time);
            totalExpense.html(count * expense);
        });
        $("#delete").on('click',function(){
            if(orderCount.html() != '0'){
                count = parseInt(orderCount.html())-1;
                orderCount.html(count);
                totalTime.html(count * time);
                totalExpense.html(count * expense);
            }
        });
    }
    function getNumLimit(maxNum,minNum) {
        var str="";
        if(minNum && !isNaN(minNum)){
            str += " 大于"+minNum+"人";
        }
        if(maxNum && !isNaN(maxNum)){
            str += "小于"+maxNum+"人";
        }
        return str
    }
}());