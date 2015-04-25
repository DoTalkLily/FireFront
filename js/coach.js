/**
 * Created by li.lli on 2015/4/18.
 */
$(function(){
    var COACH_LIST_URL = "mock/coaches.json",
        COACH_DETAIL_URL = "mock/coach-detail.json";

    var app = angular.module("coach",[]);

    /** 教练列表 **/
    app.controller("getCoachList",function($scope,$http) {
        $http.get(COACH_LIST_URL).success(function (response) {
            if(response.errCode) {
                //错误提示
                return;
            }
            $scope.coaches = response;
        }).error(function(data,state){
            //错误提示
        });
        $scope.getGender = function(genderType){
            return genderType == 1?"男":"女";
        }
        $scope.trimDescription = function(description){
            return description && description.length > 20? description.substr(0,20):description;
        }
    });

     /** 获取教练详情**/
    app.controller("getCoachDetail",function($scope,$http) {
        var id = getUrlParam("id");
        if(isNaN(id)){
            return;
        }
        $http.get(COACH_DETAIL_URL,{params:{"id":id} }).success(function (response) {
            if(response.errCode) {
                //错误提示
                return;
            }
            $scope.coach = response;
        }).error(function(data,state){
            //错误提示
        });
    });

}());