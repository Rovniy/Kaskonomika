(function () {
    'use strict';

    angular
        .module('partners')
        .controller('pagePsoCreateController', pagePsoCreateController);

    pagePsoCreateController.$inject = ['$rootScope', '$scope', '$http', 'config', '$location'];

    function pagePsoCreateController($rootScope, $scope, $http, config, $location) {
        var vm = this,
        api = config.api;

        vm.formReady = false;
        vm.formData = {
            number    : '',
            partnerId : '',
            type      : '',
            city      : '',
            address   : '',
            phone     : ''
        };


        vm.PSOCreate_Number_Error = '';
        vm.policy = {};
        vm.policyExists = undefined;
        function checkPolicy(number) {
            $http.post(api + '/policies/getbynumber', {
                token  : $rootScope.token,
                number : number
            }).then(function(response) {
                $('#pso-create-number').tooltip();
                if (response.data.result) {
                    vm.policy = response.data.response;
                    console.log(vm.policy);
                    vm.policyExists = true;
                    vm.PSOCreate_Number_Error = '';
                } else {
                    vm.policyExists = false;
                    if (response.data.response.code == '400.38.1') {
                        vm.PSOCreate_Number_Error = 'Введите номер полиса';
                    } else if (response.data.response.code == '400.38.2') {
                        vm.PSOCreate_Number_Error = 'Полис с таким номером не найден';
                    } else {
                        vm.PSOCreate_Number_Error = response.data.response.message;
                    }
                }
            });
        }
        vm.checkPolicy = checkPolicy;


        vm.PSOCreate_Partner_Error = '';
        vm.psoPartners = undefined;
        vm.psoPartnerActions = [];
        $http.get(api + '/pso/partners/list?token=' + $rootScope.token).then(function(response) {
            if (response.data.result) {
                vm.psoPartners = response.data.response;
                vm.formData.partnerId = vm.psoPartners[0].id;
                if (vm.psoPartners[0].is_review == 1) {
                    vm.psoPartnerActions.push({
                        value : '1',
                        title : 'Осмотр'
                    });
                }
                if (vm.psoPartners[0].is_mount == 1) {
                    vm.psoPartnerActions.push({
                        value : '2',
                        title : 'Установка'
                    });
                }
                if (vm.psoPartners[0].is_review == 1 && vm.psoPartners[0].is_mount == 1) {
                    vm.psoPartnerActions.push({
                        value : '3',
                        title : 'Осмотр и установка'
                    });
                }
                vm.formData.type = vm.psoPartnerActions[0].value;
                console.log(vm.formData);
            } else {
                vm.psoPartners = [];
                vm.PSOCreate_Partner_Error = response.data.response.message;
                vm.error = true;
            }
        });


        function changePsoPartner(partnerId) {
            vm.psoPartnerActions = [];
            vm.psoPartners.forEach(function(element, index, array) {
                if (element.id == partnerId) {
                    if (element.is_review == 1) {
                        vm.psoPartnerActions.push({
                            value : '1',
                            title : 'Осмотр'
                        });
                    }
                    if (element.is_mount == 1) {
                        vm.psoPartnerActions.push({
                            value : '2',
                            title : 'Установка'
                        });
                    }
                    if (element.is_review == 1 && element.is_mount == 1) {
                        vm.psoPartnerActions.push({
                            value : '3',
                            title : 'Осмотр и установка'
                        });
                    }
                    vm.formData.type = vm.psoPartnerActions[0].value;
                }
            });
        }
        vm.changePsoPartner = changePsoPartner;


        vm.PSOCreate_Phone_Error = '';
        function checkPhone(phone) {
            if (phone == '') {
                vm.PSOCreate_Phone_Error = 'Введите контактный номер';
            } else {
                vm.PSOCreate_Phone_Error = '';
            }
        }
        vm.checkPhone = checkPhone;


        vm.PSOCreate_Address_Error = '';
        function checkAddress(address) {
            if (address == '') {
                vm.PSOCreate_Address_Error = 'Введите адрес';
            } else {
                vm.PSOCreate_Address_Error = '';
            }
        }
        vm.checkAddress = checkAddress;


        vm.PSOCreate_City_Error = '';
        function checkCity(city) {
            if (city == '') {
                vm.PSOCreate_City_Error = 'Введите город';
            } else {
                vm.PSOCreate_City_Error = '';
            }
        }
        vm.checkCity = checkCity;


        // vm.findPolicyByNumber = findPolicyByNumber;
        // vm.objectData = undefined;
        // function findPolicyByNumber(number) {
        //     vm.error = false;

            

        //     $http.post(api + '/policies/getbynumber', {
        //         token  : $rootScope.token,
        //         number : number
        //     }).then(function(response) {
        //         if (response.data.result) {
        //             vm.objectData = response.data.response;
        //         } else {
        //             vm.error = true;
        //         }
        //     });
        // }

        vm.PSOCreate_Error = '';
        vm.PSOCreate_Phone_Error = ''
        function psoCreate() {
            vm.error = false;
            vm.formReady = true;

            vm.mountResult = undefined;
            vm.reviewResult = undefined;

            if (vm.formData.number == '') {
                vm.PSOCreate_Number_Error = 'Введите номер полиса';
                vm.policyExists = false;
                vm.formReady = false;
            }
            if (vm.formData.phone == '') {
                vm.PSOCreate_Phone_Error = 'Введите контактный номер';
                vm.formReady = false;
            }
            if (vm.formData.address == '') {
                vm.PSOCreate_Address_Error = 'Введите адрес';
                vm.formReady = false;
            }
            if (vm.formData.city == '') {
                vm.PSOCreate_City_Error = 'Введите город';
                vm.formReady = false;
            }
            if (vm.policyExists == false) {
                vm.formReady = false;
            }

            vm.appCreated = false;
            if (vm.formReady) {
                $('#pso-create-submit').button('loading');
                $('form[name="PSOCreateForm"] input, form[name="PSOCreateForm"] select, form[name="PSOCreateForm"] textarea').prop('disabled', true);

                $http.post(api + '/pso/applications/create', {
                    token         : $rootScope.token,
                    policy_id     : vm.policyExists ? vm.policy.id : '',
                    contractor_id : vm.policyExists ? vm.policy.contractor_id : '',
                    phone         : vm.formData.phone,
                    address       : vm.formData.address,
                    city          : vm.formData.city,
                    is_review     : (vm.formData.type == 1 || vm.formData.type == 3) ? 1 : 0,
                    is_mount      : (vm.formData.type == 2 || vm.formData.type == 3) ? 1 : 0
                }).then(function(response) {
                    if (response.data.result) {
                        if (typeof response.data.response != 'undefined') {
                            if (typeof response.data.response.mount != 'undefined') {
                                vm.mountResult = response.data.response.mount;
                            }
                            if (typeof response.data.response.review != 'undefined') {
                                vm.reviewResult = response.data.response.review;
                            }
                        }

                        vm.appCreated = true;
                        vm.PSOCreate_Error = '';
                        vm.objectData = response.data.response;
                    } else {
                        vm.error = true;
                        vm.PSOCreate_Error = '[' + response.data.response.code + '] ' + response.data.response.message;
                    }

                    $('form[name="PSOCreateForm"] input, form[name="PSOCreateForm"] select, form[name="PSOCreateForm"] textarea').prop('disabled', false);
                    $('#pso-create-submit').button('reset');
                });
            }
        }
        vm.psoCreate = psoCreate;
    }
})();
