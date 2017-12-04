/**
 * Created by Ravy on 31.03.2017.
 */
(function () {
    'use strict';

    angular
        .module('partners')
        .directive("breadcrumbs", ['breadcrumbs','$location',function (breadcrumbs,$location) {
            return {
                restrict: 'EA',
                scope: {},
                template: "<div class='page-title'><div>"+
                            "<h1><i class='fa {{dict.icon}}'></i>{{dict.name}}</h1>"+
                            "</div><div><ul class='breadcrumb'>"+
                            "<li><a href='/dashboard'><i class='fa fa-home fa-lg'></i></a></li>"+
                            "<li ng-if='dict.parent'><a href='{{dict.parent.link}}'>{{dict.parent.name}}</a></li>"+
                            "<li>{{dict.name}}</li>"+
                            "</ul></div></div>",
                link: function(scope) {
                    scope.$on('$routeChangeSuccess',function(){
                        var currentPath = $location.path();
                        breadcrumbs.dictionary.forEach(function(f){
                            if (currentPath.indexOf(f.link) !== -1) scope.dict = f;
                        });
                    });

                }
            }
        }]);
})();