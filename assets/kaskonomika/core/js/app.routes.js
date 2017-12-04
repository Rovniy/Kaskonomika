(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .config(config);

    config.$inject = ['$routeProvider'];
    
    function config ($routeProvider) {
        $routeProvider
            .when ('/', {
                templateUrl: '/info-pages/index/index.html',
                controller: 'indexController',
                controllerAs: 'vm'
            })
            .when ('/how-it-work', {
                templateUrl: '/info-pages/how-it-work/how-it-work.html',
                controller: 'howItWorkController',
                controllerAs: 'vm'
            })
            .when ('/faq', {
                templateUrl: '/info-pages/faq/faq.html',
                controller: 'faqController',
                controllerAs: 'vm'
            })
            .when ('/download', {
                templateUrl: '/info-pages/download/download.html',
                controller: 'downloadController',
                controllerAs: 'vm'
            })
            .when ('/requisites', {
                templateUrl: '/info-pages/requisites/requisites.html',
                controller: 'requisitesController',
                controllerAs: 'vm'
            })
            .when ('/payment-and-delivery', {
                templateUrl: '/info-pages/payment-and-delivery/payment-and-delivery.html',
                controller: 'paymentAndDeliveryController',
                controllerAs: 'vm'
            })
            .when ('/privacy-policy', {
                templateUrl: '/info-pages/private-policy/private-policy.html',
                controller: 'privatePolicyController',
                controllerAs: 'vm'
            })
            .when ('/contacts', {
                templateUrl: '/pages/contacts/contacts.html',
                controller: 'contactsController',
                controllerAs: 'vm'
            })
            .when ('/dashboard', {
                templateUrl: '/dashboard/main/dashboard-main.html',
                controller: 'dashboardMainController',
                controllerAs: 'vm'
            })
            .when ('/result-page', {
                templateUrl: '/result-page/result-page.html',
                controller: 'resultPageController',
                controllerAs: 'vm'
            })
            .when ('/filling', {
                templateUrl: '/filling-insurance/filling-insurance.html',
                controller: 'fillingInsuranceController',
                controllerAs: 'vm'
            })
            .when ('/registration', {
                templateUrl: '/info-pages/registration/registration.html',
                controller: 'registrationController',
                controllerAs: 'vm'
            })

            .otherwise({
                redirectTo: '/'
            });

    }

})();