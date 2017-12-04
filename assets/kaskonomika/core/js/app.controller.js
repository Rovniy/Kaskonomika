(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('appController', appController);

    appController.$inject = ['$rootScope','$scope','$location'];

    function appController($rootScope,$scope,$location) {
        
        $rootScope.calcCount = [];
        $rootScope.validateInput = validateInput;

        activate();

        ////////////////

        function activate() {
            clearScopeCaсhe();
            waitContentIncludes(); // Wait downloading content
        }

        /**
         * Событие очистки кеша событий
         */
        function clearScopeCaсhe(){
            $scope.$on("$routeChangeSuccess", function() {
                $rootScope.carFinder = false; // Обнуление данных поиска авто
                $rootScope.showCalc = false; // Обновление отображения поиска в хедере
                $rootScope.currentUlr = $location.url(); // Create note for current URL
                xlog('APP : CLEAR_SCOPE_DATA -> Scope data clean');
            });
        }

        /**
         * Wait downloading content
         */
        function waitContentIncludes() {
            $rootScope.$on('$includeContentLoaded',function(){
                $rootScope.pageLoaded = true;
            });
        }

        function validateInput(type, val) {
            if (type == 'phone') {
                var length = val.length;
                if (length < 1)
                switch (length) {
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;

                }
                console.log('phone', val);
            }
        }

    }

})();

