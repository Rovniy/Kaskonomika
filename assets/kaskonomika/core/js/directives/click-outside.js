(function() {
    'use strict';

    angular
        .module('kaskonomika')
        .directive('clickOutside', ['$document', '$parse', '$timeout',clickOutside]);

    function clickOutside($document, $parse, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {

                /*$document.on('click', function(event){
                    var isChild = $(elem).has(event.target).length > 0;
                    var isSelf = elem[0] == event.target;
                    var isInside = isChild || isSelf;


                    console.log('event.target',event.target);
                    console.log('elem',elem);
                    console.log('$(element).has(event.target).length',$(elem).has(event.target).length);
                    console.log('isChild',isChild);
                    console.log('isSelf',isSelf);
                    console.log('isInside',isInside);
                    console.log('--------------------------------------------------------------');



                    if (!isInside) scope.$apply(attr.clickOutside);
                });*/
            }
        };
    }
})();