/**
 * Created by Ravy on 31.03.2017.
 */
(function () {
    'use strict';

    angular
        .module('partners')
        .directive("httpError", function () {
            return {
                restrict: 'EA',
                template: "<div class='ta-center httpError' ng-if='vm.error' ng-bind-html='httpError'></div>"
            }
        })
})();
