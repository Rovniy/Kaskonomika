/**
 * Created by Ravy on 22.03.2017.
 */
(function () {
    'use strict';

    angular.module('partners')
        .controller('pageLossesController', pageLossesController);

    pageLossesController.$inject = ['$rootScope','$http','config'];

    function pageLossesController($rootScope,$http,config) {
        var vm = this;
        var api = config.api;
        vm.lossesList = false;

        activate();
        /////////////////////
        function activate() {
            getLosses();

        }

        /**
         * Получение и форматирование списка убытков
         */
        function getLosses() {
            $http.get(api + '/losses/applications?token=' + $rootScope.token)
                .then(function(response){
                    if (response.data.result) {
                        vm.lossesList = response.data.response;
                    } else {
                        vm.error = true;
                    }
                })
        }

    }
})();

