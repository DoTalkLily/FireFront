/**
 * Created by li.lli on 2015/4/18.
 */
$(function(){
    var coachUrl = "mock/coach.json";
    angular.module("fire", []).controller("getCoachList",function getCoachList($scope,$http) {
        $http.get(coachUrl).success(function (response) {
            if(response.errCode){
                //��ʾ����
                return;
            }
            console.log($scope);
            $scope.coaches = response;
        }).error(function(data,state){
            //��ʾ����
        });
    });

}());