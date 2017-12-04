/**
 * Created by Ravy on 22.03.2017.
 */
(function () {
    'use strict';

    angular.module('partners')
        .controller('pagePsoListController', pagePsoListController);

    pagePsoListController.$inject = ['$rootScope','$scope','$http','config','$location'];

    function pagePsoListController($rootScope,$scope,$http,config,$location) {
        var vm = this,
        api = config.api;
        $scope.order = 'create_date';
        $scope.reverse = false;
        vm.psoList = false;
        
        vm.goToItem = goToItem;

        activate();
        /////////////////////
        function activate() {
            getPsoList();
        }

        /**
         * Получение и форматирование списка ПСО
         */
        function getPsoList() {
            var list;
            $http.get(api + '/pso/applications/list?token=' + $rootScope.token)
                .then(function(response){
                    vm.psoList = [];
                    if (response.data.result) {
                        list = response.data.response;
                        xlog('list',list);
                        list.forEach(function(f){
                            var data = {
                                id: Number(f.id),
                                number: f.number,
                                create_date: f.create_date,
                                pso_status: f.pso_status,
                                policy_object_mark: f.policy_object_mark,
                                policy_object_model: f.policy_object_model,
                                policy_object_year: f.policy_object_year,
                                policy_object_number: f.policy_object_number,
                                pso_status_date: f.pso_status_date,
                                performer_contractor_name: f.performer_contractor_name,
                                is_mount: f.is_mount || false,
                                is_review: f.is_review || false
                            };
                            vm.psoList.push(data);
                        })
                    } else {
                        vm.error = true;
                    }
                })
        }

        /**
         * Переход на страницу с инфой о убытках
         * @param number - ID текущей страницы убытков
         */
        function goToItem(number) {
            $location.url('/pso/item/' + number);
        }

    }
})();

