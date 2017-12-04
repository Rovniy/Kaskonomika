(function () {
    'use strict';

    angular
        .module('partners')
        .controller('appController', appController);

    appController.$inject = ['$rootScope','$location','$scope','intercomService','userService','config','$window'];

    function appController($rootScope,$location,$scope,intercomService,userService,config,$window) {

        $rootScope.httpError = config.dictionary.httpError;
        
        activate();

        function activate(){
            onChangePath();
            checkUserStatus(); //Проверка авторизованности пользователя
            
            
            getResponses(); //Реакция на вход пользователя
        }

        function getResponses(){
            intercomService.on('user-login-success', userLoginSuccess);
            
        }

        /**
         * Проверка авторизованности пользователя
         */
        function checkUserStatus(){
            userService.checkUser();
        }

        function userLoginSuccess(data) {
            if (data.remember)  {
                localStorage.setItem('userAuthRemember', data.remember);
            }
            $location.url(data.url);
        }


        /**
         * Отслежинивае измнения текущего URL
         */
        function onChangePath(){
            $scope.$on('$routeChangeSuccess',function(){
                getCurrentPath();
            });
        }

        /**
         * Получение версии для сборки
         * @returns {string}
         */
        $window.v = function(){
            return new Date().getUTCDay() + '' + new Date().getUTCMonth() + '/' + new Date().getHours() + '-' + new Date().getMinutes();
        };

        /**
         * Отслеживание текущего URL сайта
         */
        function getCurrentPath(){
            $rootScope.currentUrl = $location.path();
            $rootScope.currentUrl == '/' ? $rootScope.isIndexPage = true : $rootScope.isIndexPage = false;
        }
        
        
    }

})();

