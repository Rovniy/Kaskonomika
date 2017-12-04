/**
 * Created by Ravy on 22.03.2017.
 */
(function () {
    'use strict';

    angular.module('partners')
        .controller('pagePsoItemController', pagePsoItemController);

    pagePsoItemController.$inject = ['$rootScope','$http','config','$routeParams'];

    function pagePsoItemController($rootScope,$http,config,$routeParams) {
        var vm = this,
        api = config.api;
        vm.path = $routeParams.id;

        activate();
        /////////////////////
        function activate() {
            getPsoItem();
        }

        function getPsoItem() {
            $http.get(api + '/pso/applications/item/' + vm.path + '?token=' + $rootScope.token)
                .then(function(response){
                    if (response.data.result) {
                        vm.psoData = response.data.response;
                    } else {
                        vm.error = true;
                    }
                })

        }
        

    }
})();

