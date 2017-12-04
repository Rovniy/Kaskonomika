(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('footerController', footerController);

    footerController.$inject = [];

    function footerController() {
        var vm = this;
        
        activate();
        ///////////////////
        function activate() {
            getCurrentYear();
        }

        /**
         * Get current full Year -> 2017
         */
        function getCurrentYear() {
            var date = new Date();
            vm.currentYear = date.getFullYear();
        }
    }
})();

