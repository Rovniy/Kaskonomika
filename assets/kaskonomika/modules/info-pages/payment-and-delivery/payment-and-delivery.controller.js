(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('paymentAndDeliveryController', paymentAndDeliveryController);

    paymentAndDeliveryController.$inject = ['$scope'];

    function paymentAndDeliveryController($scope) {
        ///////////////////
        var vm = this;
        vm.view = false; //Статус готовности отображения
        activate();
        function activate() {
            $scope.$on('cfpLoadingBar:completed',function(){
                vm.view = true;
            });
        }
        //////////////////
        
    }
})();