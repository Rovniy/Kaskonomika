/**
 * Created by Ravy on 22.03.2017.
 */
(function () {
    'use strict';

    angular.module('partners')
        .controller('sidebarController', sidebarController);

    sidebarController.$inject = ['config'];

    function sidebarController(config) {
        var vm = this;
        vm.config = config;
        
        vm.menu = [
            {
                name: 'Панель управления',
                icon: 'fa-dashboard',
                path: '/dashboard'
            },
            {
                name: 'ПСО',
                icon: 'fa-car',
                path: '/pso/list',
                child: [
                    {
                        name: 'Список заявок',
                        icon: 'fa-list',
                        path: '/pso/list'
                    },
                    {
                        name: 'Создать заявку',
                        icon: 'fa-pencil',
                        path: '/pso/create'
                    },
                    {
                        name: 'Поиск заявок',
                        icon: 'fa-search',
                        path: '/pso/search'
                    }
                ]
            },
            {
                name: 'Убытки',
                icon: 'fa-rub',
                path: '/losses/list',
                child: [
                    {
                        name: 'Список убытков',
                        icon: 'fa-list',
                        path: '/losses/list'
                    }
                ]
            }
        ];
               

        activate();
        /////////////////////
        function activate() {

        }

        

    }
})();

