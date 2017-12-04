/**
 * Created by Ravy on 30.03.2017.
 */
(function () {
    'use strict';

    angular
        .module('partners')
        .directive("sort", [function () {
        return {
            restrict: 'A',
            transclude: true,
            template: '<a href ng-click="onClick()">' +
            '<span ng-transclude></span>' +
            '<i class="fa pull-right" ng-class="{\'fa-sort-amount-asc\' : order === by && !reverse,  \'fa-sort-amount-desc\' : order===by && reverse}" ng-if="order === by"></i>' +
            '<i class="fa pull-right fa-sort color-grey" ng-if="order != by"></i>' +
            '</a>',
            scope: {
                order: '=',
                by: '=',
                reverse: '='
            },
            link: function (scope) {
                scope.onClick = function () {
                    if (scope.order === scope.by) {
                        scope.reverse = !scope.reverse
                    } else {
                        scope.by = scope.order;
                        scope.reverse = false;
                    }
                }
            }
        }
    }]);
})();