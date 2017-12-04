(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('requisitesController', requisitesController);

    requisitesController.$inject = ['$scope'];

    function requisitesController($scope) {
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