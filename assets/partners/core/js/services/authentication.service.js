(function () {
    'use strict';

    angular
        .module('partners')
        .service('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', 'intercomService', 'userService','config','$rootScope'];

    function authenticationService($http, intercomService,userService,config,$rootScope) {
        this.login = login;
        this.restorePass = restorePass;

        var api = config.api;

        ////////////////

        /*{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }*/

        // Авториязация по логину / паролю
        function login(email, password, redirect, remember) {
            return $http
                .post(api+'/authorization', {username: email, password: password,'meta-stop':true})
                .then(function (response) {
                    if (response.data.result) {
                        localStorage.setItem('token', response.data.token);
                        $rootScope.token = response.data.token;
                        xlog('Token:', $rootScope.token);
                        $rootScope.user = response.data.response;
                        intercomService.emit('user-login-success',{
                            remember: remember || null, 
                            url: redirect
                            }
                        );

                    } else {
                        intercomService.emit('user-login-error', response.data);
                    }
                })
        }
        
        // Восстановление пароля на почту
        function restorePass(email) {
            return $http.post(api+'/users/restorePasswordByEmail', {email: email})
        }
    }

})();

