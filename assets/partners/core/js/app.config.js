(function () {
    'use strict';

    angular
        .module('partners', [
            'ngRoute',
            'ngSanitize',
            'ngCookies',
            'ui.bootstrap',
            'chart.js'
        ])
        .constant('config', {
            api: 'https://api.kaskonomika.ru/v1',
            version: '45/19-21', //Текущая версия сайта
            template: 'partners', //Шаблон сайта
            theme: 'default', //Тема сайта
            mainUrl: window.location.protocol+ '//' + window.location.host,
            copy: 'Каскономика &copy &year',
            debug: window.location.host === 'partners.kaskonomika.local:9360',
            dictionary: {
                httpError: '<h4><i class="fa fa-exclamation-circle color-red"></i> Не удалось получить данные. Данные не существуют у вас нет прав для просмотра запрашиваемой информации </h4>'
            }
        })
        .config(config);

    config.$inject = ['$locationProvider','$httpProvider'];

    function config ($locationProvider,$httpProvider) {

        // Надстройка для отправки кроссдоменных POST запросов
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        
        $locationProvider.html5Mode(true); //Включение HTML5 роутинга без "#"
    }

})();