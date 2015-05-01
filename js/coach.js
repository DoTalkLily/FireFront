/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var COACH_LIST_URL = "mock/coaches.json",
        COACH_DETAIL_URL = "mock/coach-detail.json";

    var app = angular.module("coach", []);
    $("#order-btn").on('click', submitOrder);
    /** 教练列表 **/
    app.controller("getCoachList", function ($scope, $http) {
        $http.get(COACH_LIST_URL).success(function (response) {
            if (response.error_code) {
                new Toast({context:$('body'),message:result.error}).show();
                return;
            }
            $("#coach-list").css("display", "block");
            $scope.coaches = response;
        }).error(function (data, state) {
            new Toast({context:$('body'),message:"系统错误，请稍后再试"}).show();
        });
        $scope.getGender = function (genderType) {
            return genderType == 1 ? "男" : "女";
        }
        $scope.trimDescription = function (description) {
            return description && description.length > 20 ? description.substr(0, 20) : description;
        }
    });

    /** 获取教练详情**/
    app.controller("getCoachDetail", function ($scope, $http) {
        var id = getUrlParam("id");
        if (isNaN(id)) {
            return;
        }
        $scope.getGender = function (genderType) {
            return genderType == 1 ? "男" : "女";
        }
        $http.get(COACH_DETAIL_URL, {params: {"id": id}}).success(function (response) {
            if (response.error_code) {
                new Toast({context:$('body'),message:result.error}).show();
                return;
            }
            $("#coach-detail").css("display", "block");
            $scope.coach = response;
        }).error(function (data, state) {
            new Toast({context:$('body'),message:"系统错误，请稍后再试"}).show();
        });
    });

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