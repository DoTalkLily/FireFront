/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var COACH_DETAIL_URL = "/coaches";
    var coachDetail = $("#coach-detail"),
        template = $("#template"),
        loading = $("#loading"),
        sportTemplate = $("#sport-template"),
        orderBtn = $('#order-btn'),
        orderTip = $(".order-tip");
    var coach = {};

    function getCoachDetail(){
        var id = getUrlParam("id");
        if (isNaN(id)) {
            return;
        }
        $.get(
            COACH_DETAIL_URL+"/"+id,
            function (result) {
                if (result.error_code) {
                    new Toast({context:$('body'),message:result.error}).show();
                    return;
                }
                if(!result) {
                    new Toast({context: $('body'), message: "暂无教练"}).show();
                    return;
                }
                coach = result;
                console.log(coach);
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
                var jQiconChose = $(".icon-chose");
                jQiconChose.on('click',function(){
                    jQiconChose.removeClass('icon-chosen');
                    $(this).addClass('icon-chosen');
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
        var orderChecked = $('.icon-chosen');
        if (orderChecked.size() == 0) {
            new Toast({context:$('body'),message:"请选择项目"}).show();
            return false;
        }
        var jQitem = orderChecked.parents('.j-sport');
        var sportId = jQitem.data('id');
        var sportName = jQitem.data('name');
        var sportDuaration = jQitem.data('duration');
        var pic = jQitem.find('.j-pic').attr('src');
        var min_user_num = jQitem.data('min_user_num');
        var max_user_num = jQitem.data('max_user_num');

        var order = {
            coach : {
                id : coach.id,
                name : coach.name,
                categories : coach.categories,
                sex : coach.sex,
                description : coach.description,
                verified : coach.verified,
                profile_image_url : coach.profile_image_url
            },
            sport : {
                id : sportId,
                name : sportName,
                duaration : sportDuaration,
                head_image_url : pic,
                num : 1,
                min_user_num : min_user_num,
                max_user_num : max_user_num
            }
        };
        $rd.store.setItem('order', JSON.stringify(order));
    }

    getCoachDetail();
    orderBtn.on('click', submitOrder);//预约下单按钮

}());