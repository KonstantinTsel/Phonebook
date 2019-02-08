'use strict';

/* Controllers */
var phonecatApp = angular.module('phonecatApp',[]);
phonecatApp.controller('PhoneListController', ['$scope', '$http', function($scope, $http) {
    $scope.title="Телефонный справочник";
    //$scope.phones = [
    //    {
    //      name: 'Alex',
    //      number: '89231234567'
    //    }, 
    //    {
    //      name: 'Denis',
    //      number: '89232471515'
    //    }, 
    //    {
    //      name: 'Bob',
    //      number: '89222222222'
    //    }
    //  ];

    //$scope.phones2 = 

    $http({
        method: 'GET',
        url: 'api/subscribers'
     }).then(function (response){
        console.log('This is data:', response.data,'\nThis is status:', response.status, 
            '\nThis is headers:', response.headers, '\nThis is config:', response.config);
        $scope.phones = response.data;
     },function (error){
        console.log(error, 'can not get data.');
     });

    /* Filters */
    //var date = new Date();
    //$scope.today = date;

    $scope.sortField = undefined;
    $scope.reverse = false;

    $scope.sort = function(fieldname)
    {
        if($scope.sortField === fieldname)
        {
            $scope.reverse = !$scope.reverse;
        }
        else
        {
            $scope.sortField = fieldname;
            $scope.reverse = false;
        }
    }
    $scope.isSortUp = function(fieldname)
    {
        return $scope.sortField === fieldname && !$scope.reverse
    }
    $scope.isSortDown = function(fieldname)
    {
        return $scope.sortField === fieldname && $scope.reverse
    }
}]);