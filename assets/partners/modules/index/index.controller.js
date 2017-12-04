/**
 * Created by Ravy on 22.03.2017.
 */
(function () {
    'use strict';

    angular.module('partners')
        .controller('indexController', indexController);

    indexController.$inject = ['$rootScope','$http','config'];

    function indexController($rootScope,$http,config) {
        var vm = this;
        var api = config.api;

        activate();
        /////////////////////
        function activate() {
            getLossesCount(); //Получение списка Убытков
            getPsoCount(); //Получение списка ПСО
        }

        /**
         * Получение списка Убытков
         */
        function getLossesCount() {
            $http.get(api + '/losses/applications?token=' + $rootScope.token)
                .then(function(response){
                    if (response.data.result) {
                        vm.lossesCount = response.data.response.length;
                    } else {
                        vm.lossesCount = '! Ошибка получения данных';
                    }
                })
        }

        /**
         * Получение списка ПСО
         */
        function getPsoCount() {
            $http.get(api + '/pso/applications/list?token=' + $rootScope.token)
                .then(function(response){
                    if (response.data.result) {
                        vm.psoCount = response.data.response.length;
                    } else {
                        vm.psoCount = '! Ошибка получения данных';
                    }
                })
        }

    }
})();

