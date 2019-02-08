'use strict';

/* Controllers */
var phonebookApp = angular.module('phonebookApp',[]);
phonebookApp.controller('PhonebookListController', ['$scope', '$http', function($scope, $http) {
    $scope.title = "Абоненты";
    $scope.subscriberList = null;
    $scope.subscriberModel = {};
    $scope.subscriberModel.id = 0;
    getallData();

    //******=========Get subscribers=========******
    function getallData() {
        $http({
            method: 'GET',
            url: 'api/subscribers'
        }).then(function (response) {
            $scope.subscriberList = response.data;
        }, function (error) {
            console.log(error, 'can not get data.');
        });
    };

    //******=========Get single subscriber=========******
    $scope.getSubscriber = function (subscriber) {
        $http({
            method: 'GET',
            url: 'api/subscribers/' + parseInt(subscriber.id)
        }).then(function (response) {
            $scope.subscriberModel = response.data;
        }, function (error) {
            console.log(error, 'can not get data.');
        });
    };

    //******=========Save subscriber=========******
    $scope.saveSubscriber = function () {
        $http({
            method: 'POST',
            url: '/api/subscribers/',
            data: $scope.subscriberModel
        }).then(function (response) {
            $scope.reset();
            getallData();
        }, function (error) {
            console.log(error);
        });
    };

    //******=========Update subscriber=========******
    $scope.updateSubscriber = function () {
        $http({
            method: 'PUT',
            url: '/api/subscribers/' + parseInt($scope.subscriberModel.id),
            data: $scope.subscriberModel
        }).then(function (response) {
            $scope.reset();
            getallData();
        }, function (error) {
            console.log(error);
        });
    };

    //******=========Delete subscriber=========******
    $scope.deleteSubscriber = function (subscriber) {
        var IsConf = confirm('You are about to delete ' + subscriber.name + '. Are you sure?');
        if (IsConf) {
            $http({
                method: 'DELETE',
                url: '/api/subscribers/' + parseInt(subscriber.id)
            }).then(function (response) {
                $scope.reset();
                getallData();
            }, function (error) {
                console.log(error);
            });
        }
    };

    //******=========Clear Form=========******
    $scope.reset = function () {
        var msg = "Form Cleared";
        $scope.subscriberModel = {};
        $scope.subscriberModel.id = 0;
    };


    //$http({
    //    method: 'GET',
    //    url: 'api/subscribers'
    // }).then(function (response){
    //    console.log('This is data:', response.data,'\nThis is status:', response.status, 
    //        '\nThis is headers:', response.headers, '\nThis is config:', response.config);
    //     $scope.subscribers = response.data;
    // },function (error){
    //    console.log(error, 'can not get data.');
    // });


    /* Filters */
    
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