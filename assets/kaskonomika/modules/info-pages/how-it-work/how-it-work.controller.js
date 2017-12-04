(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('howItWorkController', howItWorkController);

    howItWorkController.$inject = ['$http','$scope'];

    function howItWorkController($http,$scope) {
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