/**
 * Created by li.lli on 2015/4/18.
 */
$(function(){
    var coachUrl = "mock/coach.json";
    function getCoachList($scope,$http) {
        $http.get(coachUrl).success(function (response) {
            if(response.errCode != 0){
                //提示错误
                return;
            }
            $scope.coaches = response;
        }).error(function(data,state){
            //提示错误
        });
    }
}());