(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('dashboardMainController', dashboardMainController);

    dashboardMainController.$inject = ['$rootScope','$location','NgMap'];

    function dashboardMainController($rootScope,$location,NgMap) {
        var vm = this;
        vm.user = true; // Delete after test
        vm.dashboard = {
            scoring: 20, // Scoring data
            milage: {
                val: 3245, // Milage distance
                raw: 70 // Milage percent
            }  
        };


        activate();
        ///////////////////
        function activate() {
            checkUser(); //Проверка залогенного пользователя
            // Work with map
            NgMap.getMap().then(function(map) {
                console.log(map.getCenter());
                console.log('markers', map.markers);
                console.log('shapes', map.shapes);
            });
        }

        /**
         * Проверка залогенного пользователя
         */
        function checkUser() {
            var user = localStorage.getItem('currentUser');
            var token = localStorage.getItem('currentToken');
            if (!$rootScope.currentUser || !user || !token) {
                $location.path('/')
            }
        }

        function isUser() {
            if (vm.user) {

            } else {
                $location.path('/')
            }
        }
        
    }
})();