'use strict';

/* Controllers */
var phonebookApp = angular.module('phonebookApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
phonebookApp.controller('PhonebookListCtrl', ['$scope', '$http', '$uibModal', '$log', '$document', function ($scope, $http, $uibModal, $log, $document) {

    $scope.title = "Абоненты";
    $scope.subscriberList = null;
    $scope.subscriberModel = {};
    $scope.subscriberModel.id = 0;
    getallData();
    //$scope.setTitle("title in PhonebookListCtrl");
    
    $scope.setSubscriberList = function (subscriberList) {
        $scope.subscriberList = subscriberList;
    };

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
    //$scope.saveSubscriberViaModal = function () {
    //    //$scope.modctrl.open();
    //    //getallData();
    //};

    //$scope.saveSubscriberAfterModal = function () {
    //    $scope.modctrl.open();
    //    $scope.subscriberModel = $scope.subscriberToSave;
    //    //$scope.subscriberModel = { name: "Имя", phoneNumber: 89239876543, id: 0 };//$scope.subscriberToSave; //
    //    //$scope.subscriberModel.id = 0;
    //    //$scope.saveSubscriber($scope.subscriberModel);
    //};

    $scope.saveSubscriber = function () {
        $http({
            method: 'POST',
            url: '/api/subscribers/',
            data: $scope.subscriberModel
        }).then(function (response) {
            $scope.reset();
            getallData();
            console.log(response, '\nпосле getalldata()\nИмя: ', response.data.name, '\nНомер: ', response.data.phoneNumber);
        }, function (error) {
            console.log(error, '\nя пока не могу этого сделать');
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
        var IsConf = confirm('Удалить запись с именем ' + subscriber.name + '?');
        if (IsConf) {
            $http({
                method: 'DELETE',
                url: '/api/subscribers/' + parseInt(subscriber.id)
            }).then(function (response) {
                //$scope.reset();
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

    /* Filters */ 
    {
        $scope.sortField = undefined;
        $scope.reverse = false;

        $scope.sort = function (fieldname) {
            if ($scope.sortField === fieldname) {
                $scope.reverse = !$scope.reverse;
            }
            else {
                $scope.sortField = fieldname;
                $scope.reverse = false;
            }
        }
        $scope.isSortUp = function (fieldname) {
            return $scope.sortField === fieldname && !$scope.reverse
        }
        $scope.isSortDown = function (fieldname) {
            return $scope.sortField === fieldname && $scope.reverse
        }
    }
}]); 

/* Modal */
phonebookApp.controller('ModalCtrl', ['$scope', '$http', '$uibModal', '$log', '$document', function ($scope, $http, $uibModal, $log, $document) {
    var mdctrl = this;

        mdctrl.subscriberModel = {};
        mdctrl.subscriberModel.name = "Оля";
        mdctrl.subscriberModel.phoneNumber = 89221234567;
        mdctrl.subscriberModel.id = 0;
        //mdctrl.subscriberList = null;
        //$ctrl.subscriberModel = subscriberModel;
        
        mdctrl.animationsEnabled = true;

        //mdctrl.open = function (size, parentSelector) {
        $scope.open = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-my ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: mdctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modal.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: 'mdlictrl',
                size: size,
                appendTo: parentElem,
                resolve: {
                    subscriberModel: function () {
                        return mdctrl.subscriberModel;
                    }
                }
            });

            modalInstance.result.then(function (subscriber) {
                $http({
                    method: 'POST',
                    url: '/api/subscribers/',
                    data: subscriber
                }).then(function (response) {
                    console.log(response, '\nВ БД добавлены данные, полученные из модального окна\nИмя: ', response.data.name, '\nНомер: ', response.data.phoneNumber);
                    $http({
                        method: 'GET',
                        url: 'api/subscribers'
                    }).then(function (response) {
                        $scope.setSubscriberList(response.data);
                        console.log('\ngetalldata() выполнена\nДанные: ', response.data);
                    }, function (error) {
                        console.log(error, 'can not get data.');
                    });
                }, function (error) {
                    console.log(error, '\nОшибка при добавлении данных, полученных из модального окна, в БД');
                });
                $log.info('Данные успешно добавлены в: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        mdctrl.toggleAnimation = function () {
            mdctrl.animationsEnabled = !mdctrl.animationsEnabled;
        };
}]);

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

phonebookApp.controller('ModalInstanceCtrl', ['$uibModalInstance', 'subscriberModel',
    function ($uibModalInstance, subscriberModel) {
    var mdictrl = this;
    mdictrl.subscriber = subscriberModel;

    //    mdictrl.reset = function () {
    //        mdictrl.subscriber = {};
    //        mdictrl.subscriber.id = 0;        
    //};

    mdictrl.ok = function () {
        $uibModalInstance.close(mdictrl.subscriber);
    };

    mdictrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]); 