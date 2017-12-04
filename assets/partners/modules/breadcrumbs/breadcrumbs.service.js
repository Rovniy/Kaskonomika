/**
 * Created by Ravy on 31.03.2017.
 */
(function () {
    'use strict';

    angular
        .module('partners')
        .service('breadcrumbs', userService);

    userService.$inject = [];

    function userService() {
        this.dictionary = [
            {
                link: '/dashboard',
                name: 'Панель управления',
                icon: 'fa-dashboard'
            },
            {
                link: '/pso/list',
                name: 'ПСО',
                icon: 'fa-car'
            },
            {
                link: '/pso/item',
                name: 'Заявка на псо',
                icon: 'fa-car',
                parent:{
                    link: '/pso/list',
                    name: 'ПСО',
                    icon: 'fa-car'}
            },
            {
                link: '/pso/create',
                name: 'Создание заявки ПСО',
                icon: 'fa-pencil',
                parent:{
                    link: '/pso/list',
                    name: 'ПСО',
                    icon: 'fa-car'}
            },
            {
                link: '/pso/search',
                name: 'Поиск заявки псо',
                icon: 'fa-search',
                parent:{
                    link: '/pso/list',
                    name: 'ПСО',
                    icon: 'fa-car'}
            },
            {
                link: '/losses',
                name: 'Убытки',
                icon: 'fa-rub'
            },
            {
                link: '/telematics',
                name: 'Телематика',
                icon: 'fa-map-marker'
            }
        ]
    }
})();