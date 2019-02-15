'use strict';

/* Controllers */
var phonebookApp = angular.module('phonebookApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
phonebookApp.controller('PhonebookListCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {

    $scope.title = "Абоненты";
    $scope.subscriberList = null;
    $scope.subscriberModel = {};
    $scope.subscriberModel.id = 0;
    getallData();
    //$scope.setTitle("title in PhonebookListCtrl");
    
    $scope.setSubscriberList = function (subscriberList) {
        $scope.subscriberList = subscriberList;
    };

    //Pagination
    {
        $scope.viewby = 10;
        $scope.itemsPerPage = $scope.viewby;
        $scope.currentPage = 1;
        $scope.maxSize = 3;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.setItemsPerPage = function (num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; 
        }

        $scope.pageChanged = function () {
            $log.log('Page changed to: ' + $scope.currentPage);
        };
    }

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

    $scope.saveSubscriber = function () {
        $http({
            method: 'POST',
            url: '/api/subscribers/',
            data: $scope.subscriberModel
        }).then(function (response) {
            $scope.reset();
            getallData();
            console.log(response, '\nпосле getalldata()\nИмя: ', response.data.name,
                '\nНомер: ', response.data.phoneNumber);
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
            console.log(response, '\nВ БД обновлены данные, полученные из модального' +
                ' окна\nДанные: ', response.data, '\nИмя: ', response.data.name, '\nНомер: ', response.data.phoneNumber);
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

    mdctrl.defaultModel = { name: "Оля", phoneNumber: 89221234567, id: 0 };
        
    mdctrl.animationsEnabled = true;
    mdctrl.toggleAnimation = function () {
        mdctrl.animationsEnabled = !mdctrl.animationsEnabled;
    };

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
            scope: $scope,
            appendTo: parentElem,
            resolve: {
                subscriberModel: function () {
                    return mdctrl.defaultModel;
                }
            }
        });

        modalInstance.result.then(function (subscriber) {
            $http({
                method: 'POST',
                url: '/api/subscribers/',
                data: subscriber
            }).then(function (response) {
                console.log(response, '\nВ БД добавлены данные, полученные из модального' +
                    ' окна\nИмя: ', response.data.name, '\nНомер: ', response.data.phoneNumber);
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
                console.log(error, '\nОшибка при добавлении данных, полученных ' +
                    'из модального окна, в БД');
            });
            $log.info('Данные успешно добавлены в: ' + new Date());
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.update_open = function (size, parentSelector) {
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
            scope: $scope,
            appendTo: parentElem,
            resolve: {
                subscriberModel: function () {
                    return $scope.item;
                }
            }
        });

        modalInstance.result.then(function (subscriber) {
            $http({
                method: 'PUT',
                url: '/api/subscribers/' + parseInt(subscriber.id),
                data: subscriber
            }).then(function (response) {
                console.log('\nВ БД обновлены данные, полученные из модального окна');
                $http({
                    method: 'GET',
                    url: 'api/subscribers'
                }).then(function (response) {
                    $scope.setSubscriberList(response.data);
                    console.log('getalldata() выполнена\nДанные: ', response.data);
                }, function (error) {
                    console.log(error, 'can not get data.');
                });
            }, function (error) {
                console.log(error, '\nОшибка при обновлении данных, полученных ' +
                    'из модального окна, в БД');
            });
            $log.info('Данные успешно обновлены в: ' + new Date());
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

phonebookApp.controller('ModalInstanceCtrl', ['$uibModalInstance', 'subscriberModel',
    function ($uibModalInstance, subscriberModel) {
        var mdictrl = this;
        mdictrl.subscriber = {
            name: subscriberModel.name,
            phoneNumber: subscriberModel.phoneNumber,
            id: subscriberModel.id
        };
        mdictrl.windowTitle = subscriberModel.id == 0 ? "Добавление новой записи" : "Изменение записи";
        
        mdictrl.reset = function () {
            mdictrl.subscriber = {
                name: subscriberModel.name,
                phoneNumber: subscriberModel.phoneNumber,
                id: subscriberModel.id
            };
        };

        mdictrl.ok = function () {
            $uibModalInstance.close(mdictrl.subscriber);
        };

        mdictrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
}]); 