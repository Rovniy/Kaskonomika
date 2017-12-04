/**
 * Created by Ravy on 22.03.2017.
 */
(function () {
    'use strict';

    angular.module('partners')
        .controller('pagePsoSearchController', pagePsoSearchController);

    pagePsoSearchController.$inject = ['$rootScope','$location','$http','config','$scope'];

    function pagePsoSearchController($rootScope,$location,$http,config,$scope) {
        var vm = this,
        api = config.api;
        vm.searchType = 'type';
        vm.current = 'Введите номер заявки';

        vm.findPsoById = findPsoById;
        vm.changeTitle = changeTitle;


        /**
         * Поиск заявки ПСО по параметрам
         * @param id - ID заявки. Вдальнйшем изменится это поле
         */
        function findPsoById(id) {
            vm.error = false;
            $http.get(api + '/pso/applications/item/' + id + '?token=' + $rootScope.token)
                .then(function(response){
                    if (response.data.result) {
                        $location.url('/pso/item/' + id);
                    } else {
                        vm.error = true;
                    }
                })
        }

        /**
         * Отслеживание фильтра поиска
         */
        
        function changeTitle(value) {
            switch (value) {
                case 'type' :
                    vm.current = 'Введите номер заявки';
                    break;
                case 'status' :
                    vm.current = 'Введите статус заявки';
                    break;
                case 'partner' :
                    vm.current = 'Введите название парнтера';
                    break;
                case 'police_number' :
                    vm.current = 'Введите номер полиса';
                    break;
                case 'pso_number' :
                    vm.current = 'Введите номер заявки';
                    break;
                case 'date' :
                    vm.current = 'Введите дату заявки';
                    break;
                case 'model' :
                    vm.current = 'Введите марку авто';
                    break;
                case 'vin' :
                    vm.current = 'Введите VIN-номер машины';
                    break;
                case 'end_date' :
                    vm.current = 'Введите дату изменения заявки';
                    break;
                case 'phone' :
                    vm.current = 'Введите номер телефона клиента';
                    break;
            }
        }       

    }
})();

