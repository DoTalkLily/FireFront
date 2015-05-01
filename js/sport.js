/**
 * Created by li.lli on 2015/4/18.
 */
$(function () {
    var SPORT_LIST_URL = "mock/sports.json",
        SPORT_DETAIL_URL = "mock/sport-detail.json";

    var app = angular.module("sport", []);

    /** 项目列表 **/
    app.controller("getSportList", function ($scope, $http) {
        $http.get(SPORT_LIST_URL).success(function (response) {
            if (response.error_code) {
                new Toast({context:$('body'),message:result.error}).show();
                return;
            }
            $("#sport-list").css("display", "block");
            $scope.sports = response;
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.sports = $scope.sports.concat(response);
                });
            }, 2000);
        }).error(function (data, state) {
            new Toast({context:$('body'),message:"系统错误，请稍后再试"}).show();
        });
    });

    /** 项目详情**/
    app.controller("getSportDetail", function ($scope, $http) {
        var id = getUrlParam("id");
        if (isNaN(id)) {
            return;
        }
        $http.get(SPORT_DETAIL_URL, {params: {"id": id}}).success(function (response) {
            if (response.error_code) {
                new Toast({context:$('body'),message:result.error}).show();
                return;
            }
            $("#sport-detail").css("display", "block");
            $scope.sport = response;
        }).error(function (data, state) {
            new Toast({context:$('body'),message:"系统错误，请稍后再试"}).show();
        });
        $scope.getNumLimit = function (maxNum,minNum) {
            var str;
            if(maxNum&&!isNaN(maxNum)){
                str = "小于"+maxNum+"人";
            }
            if(minNum&&!isNaN(minNum)){
                str += " 大于"+minNum+"人";
            }
            return str
        }
    });

}());