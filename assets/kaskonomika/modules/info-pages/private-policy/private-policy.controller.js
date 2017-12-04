(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('privatePolicyController', privatePolicyController);

    privatePolicyController.$inject = ['$scope'];

    function privatePolicyController($scope) {
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