/**
 * Created by Ravy on 30.06.2017.
 */
(function() {
    'use strict';

    angular
        .module('kaskonomika')
        .directive('clickAnywhereButHere', ['$document', function ($document) {
            return {
                restrict: 'A',
                link: function postLink(scope, element, attrs) {
                    console.log('232312312')
                    var onClick = function (event) {
                        var isChild = $(element).has(event.target).length > 0;
                        var isSelf = element[0] == event.target;
                        var isInside = isChild || isSelf;
                        if (!isInside) {
                            scope.$apply(attrs.clickAnywhereButHere)
                        }
                    };
                    $document.bind('click', onClick);
                    scope.$watch(attrs.isActive, function(newValue, oldValue) {
                        if (newValue !== oldValue && newValue == true) {
                            $document.bind('click', onClick);
                        }
                        else if (newValue !== oldValue && newValue == false) {
                            $document.unbind('click', onClick);
                        }
                    });
                }
            };
        }]);
})();
