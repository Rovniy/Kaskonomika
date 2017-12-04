(function () {
    'use strict';

    angular
        .module('partners')
        .config(config);

    config.$inject = ['$routeProvider'];
    
    function config ($routeProvider) {
        $routeProvider
            .when ('/', {
                templateUrl: '/login/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .when ('/dashboard', {
                templateUrl: '/index/index.html',
                controller: 'indexController',
                controllerAs: 'vm'
            })
            .when ('/pso/list', {
                templateUrl: '/pso/list/pso-list.html',
                controller: 'pagePsoListController',
                controllerAs: 'vm'
            })
            .when ('/pso/item/:id', {
                templateUrl: '/pso/item/pso-item.html',
                controller: 'pagePsoItemController',
                controllerAs: 'vm'
            })
            .when ('/pso/create', {
                templateUrl: '/pso/create/pso-create.html',
                controller: 'pagePsoCreateController',
                controllerAs: 'vm'
            })
            .when ('/pso/search', {
                templateUrl: '/pso/search/pso-search.html',
                controller: 'pagePsoSearchController',
                controllerAs: 'vm'
            })
            .when ('/losses/list', {
                templateUrl: '/losses/list/losses.html',
                controller: 'pageLossesController',
                controllerAs: 'vm'
            })
            .when ('/telematics', {
                templateUrl: '/telematics/telematics.html',
                controller: 'pageTelematicsController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

})();