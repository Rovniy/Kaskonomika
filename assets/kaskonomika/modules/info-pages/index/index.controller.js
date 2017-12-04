(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('indexController', indexController);

    indexController.$inject = ['$scope'];

    function indexController($scope) {
        ///////////////////
        var vm = this;
        vm.view = false; //Статус готовности отображения
        activate();
        function activate() {
            $scope.$on('cfpLoadingBar:completed',function(){
                vm.view = true;
            });
        }
        //////////////////
        vm.swiperIndex = 0;
        
        // Список партнеров
        vm.partnersList = [
            {
                src: '/src/img/partners/soglasie.png',
                url: '//http://www.soglasie.ru',
                alt: 'Страховая кампания Согласие'
            },
            {
                src: '/src/img/partners/absolut.png',
                url: '//www.absolutins.ru',
                alt: 'Страховая кампания Абсолют'
            },
            {
                src: '/src/img/partners/tinkoff.png',
                url: '//www.tinkoffinsurance.ru',
                alt: 'Тинькофф страхование'
            },
            {
                src: '/src/img/partners/vsk.png',
                url: '//www.vsk.ru',
                alt: 'ВСК-групп'
            },
            {
                src: '/src/img/partners/ergo.png',
                url: '//http://ergo.ru/',
                alt: 'Страховая кампания ERGO'
            }
        ];
        vm.accordeon = true;
        vm.accordeonOpen = true;
        vm.indexSlides = [
            {
                index: 4,
                text: 'Введите полные данные об автомобиле и водителях для расчета итоговой стоимости и формирования электронного полиса. Оплатить страховку можно банковской картой.'
            },
            {
                index: 1,
                text: 'После оформления электронного полиса мы свяжемся с вами, чтобы договориться об осмотре автомобиля и установке трекера. Мы подъедем в удобное для вас место и время и сама процедура займет не более получаса.'
            },
            {
                index: 2,
                text: 'Используйте максимум возможностей нашего приложения! Анализируйте поездки и совершенствуйте свою манеру вождения, следите за техническим состоянием вашего автомобиля. Накапливайте бонусные баллы и получайте скидки на Каско'
            },
            {
                index: 3,
                text: 'После ввода первичных данных мы предоставим вам предварительный расчет стоимости страховки. Сравнивайте, конфигурируйте наполнение и условия, выбирайте наиболее подходящий вам вариант.'
            }
        ];

        $scope.onReadySwiper = function (swiper) {
            xlog('PAGE : INDEX -> Swiper Ready');

            vm.slideTo = slideTo;
            
            function slideTo(index) {
                swiper.slideTo(index);
            }
            
            swiper.on('onSlideChangeEnd',function(){
                vm.swiperIndex = swiper.activeIndex;
                $scope.$digest();
            })

            
        };
        
    }
})();