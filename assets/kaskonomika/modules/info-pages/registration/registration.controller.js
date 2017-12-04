(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('registrationController', registrationController);

    registrationController.$inject = ['$rootScope','$scope','config','$http','$location'];

    function registrationController($rootScope,$scope,config,$http,$location) {
        ///////////////////
        var vm = this;
        vm.view = false; //Статус готовности отображения
        vm.step = 1;
        vm.user = {
            email: '',
            pass: '',
            phone: '',
            agree: false
        };
        
        vm.registration = registration;
        vm.confirmPhone = confirmPhone;
        vm.clearErrorData = clearErrorData;

        activate();
        function activate() {
            $scope.$on('cfpLoadingBar:completed',function(){
                vm.view = true;
            });
        }
        //////////////////

        /**
         * Регистрация пользователя
         */
        function registration() {
            var data = {
                phone: vm.user.phone,
                email: vm.user.email,
                password: vm.user.pass,
                login: vm.user.email
            };
            vm.user.await = true;
            vm.user.regError = false;
            $http.post(config.api + 'users/registration',data)
                .then(function(response){
                    if (response.data.result) {
                        vm.user.activation_hash = response.data.response.activation_hash;
                        vm.user.user_id = response.data.response.user_id;
                        vm.user.token = response.data.token;
                        vm.step = 2;
                        vm.user.await = false;
                        xlog('registrationController : REGISTRATION -> Registration success');
                    } else {
                        vm.user.regError = true;
                        vm.user.errorCode = response.data.response.code;
                        if (response.data.response.code == '200.1.4') {
                            vm.user.errorCode = '200.1.4'
                        }
                        vm.user.await = false;
                        xlog('registrationController : REGISTRATION -> Registration error');
                    }
                })
        }

        /**
         * Подтверждение кода из SMS
         */
        function confirmPhone() {
            var data = {
                phone: vm.user.phone,
                sms_verification_code: vm.user.code
            };
            vm.user.codeError = false;
            vm.user.await = true;
            $http.post(config.api + 'users/confirmPhoneByCode',data)
                .then(function(response){
                    if (response.data.result) {
                        vm.user.await = true;
                        xlog('registrationController : CONFIRM_PHONE -> Confirm phone success');
                        getUser();
                    } else {
                        vm.user.code = undefined;
                        vm.user.codeError = true;
                        vm.user.await = false;
                        xlog('registrationController : CONFIRM_PHONE -> Confirm phone error');
                    }
                })
        }

        function getUser() {
            $http.post(config.api + 'users/info',{token: vm.user.token})
                .then(function(response){
                    if (response.data.result) {
                        xlog('registrationController : USER -> Get user info success');
                        localStorage.setItem('currentToken', vm.user.token);
                        localStorage.setItem('currentUser', JSON.stringify(response.data.response));
                        $rootScope.checkUser();
                        $location.path('/');
                    } else {
                        alert('Server Error');
                        xlog('registrationController : USER -> Server error');
                    }

                })
        }

        /**
         * Очищение ошибок при изменении форм
         */
        function clearErrorData() {
            vm.user.regError = false;
            vm.user.errorCode = undefined;
        }
        
    }
})();