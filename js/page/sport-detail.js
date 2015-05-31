/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var SPORT_DETAIL_URL = "/sports",
        sportDetail = $("#sport-detail"),
        template = $("#template"),
        sport;

    function getSportDetail(){
        var id = getUrlParam("id");
        if (isNaN(id)) {
            return;
        }
        $.get(
            SPORT_DETAIL_URL+"/"+id,
            {
                id:id
            },
            function (result) {
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return;
                }
                if(!result) {
                    new Toast({context: $('body'), message: "暂无详情"}).show();
                    return;
                }
                sport = result;
                sport.countLimit = getNumLimit(sport.max_user_num,sport.min_user_num);
                Mustache.parse(template.html());
                sportDetail.append(Mustache.render(template.html(),sport));
                bindEvent();
            }
        );
    }

    function bindEvent(){
        var time = parseInt($("#time").html()),
            expense = parseFloat($("#expense").html()),
            totalTime = $("#totalTime"),
            totalExpense = $("#totalExpense"),
            orderBtn = $("#order-btn"),
            orderCount = $("#count"),count;

        $("#add").on('click',function(){
            count = parseInt(orderCount.html())+1;
            orderCount.html(count);
            totalTime.html(count * time);
            totalExpense.html(count * expense);
            orderBtn.removeClass("order-inactive").addClass("order-active");
        }).click();
        $("#delete").on('click',function(){
            if(orderCount.html() === '0'){
                return false;
            }
            if(orderCount.html() === '1'){
                orderBtn.removeClass("order-active").addClass("order-inactive");
            }
            count = parseInt(orderCount.html())-1;
            orderCount.html(count);
            totalTime.html(count * time);
            totalExpense.html(count * expense);
        });
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
        orderBtn.on('click', function() {
            sport.num =count;
            var order = {
                sport : sport
            };
            $rd.store.setItem('order',JSON.stringify(order));
            location.href = 'order1';
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
    getSportDetail();
}());