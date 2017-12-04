(function () {
    'use strict';

    angular
        .module('partners')
        .service('userService', userService);

    userService.$inject = ['$http', '$q','config','$rootScope','$location'];

    function userService($http, $q, config,$rootScope,$location) {
        var api = config.api;

        this.checkUser = checkUser; //Проверка пользователя на авторизацию
        this.removeUserProfile = removeUserProfile; //Удаление просроченного токена и возврат на страницу логина


        /**
         * Проверка пользователя на авторизацию
         */
        function checkUser() {
            if ($rootScope.token) {
                $http.get(api + '/isTokenAuthorized/' + $rootScope.token + '?token='+$rootScope.token)
                    .then(function(response) {
                        xlog('Проверка токена на авторизацию: ', response.data);
                        if (response.data.response){
                            getUserProfile(); //Получение профиля пользователя
                            if ($location.url() == '/') $location.url('/dashboard');
                        } else {
                            removeUserProfile(); //Удаление просроченного токена и возврат на страницу логина
                        }
                    })
            } else {
                removeUserProfile(); //Удаление просроченного токена и возврат на страницу логина
            }
        }

        /**
         * Получение профиля пользователя
         */
        function getUserProfile(){
            $http.post(api + '/users/info', {token: $rootScope.token})
                .then(function(user) {
                    xlog('Получил профайл пользователя при обновлении. ', user.data.response);
                    $rootScope.user = null;
                    $rootScope.user = user.data.response;
                })
        }

        /**
         * Удаление просроченного токена и возврат на страницу логина
         */
        function removeUserProfile() {
            $rootScope.user = null;
            $rootScope.token = null;
            localStorage.removeItem('token');
            $location.url('/');
            xlog('Пользователь не авторизован, адресую на страницу входа.');
            xlog('Токен:', $rootScope.token || 'не существует');
        }


    }

})();