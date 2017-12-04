(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .controller('faqController', faqController);

    faqController.$inject = ['$scope','$http','$filter'];

    function faqController($scope,$http,$filter) {
        ///////////////////
        var vm = this;
        vm.view = false; //Статус готовности отображения
        activate();
        function activate() {
            $scope.$on('cfpLoadingBar:completed',function(){
                vm.view = true;
            });
            getQuestions(); //Получение вопросов
        }
        //////////////////
        vm.accordeonClose = true;
        vm.tabsVision = true;

        vm.filterResults = filterResults; //Поиск и фильтр по вопросам и ответам.

        /**
         * Получение вопросов из JSON файла. Расположение: /src/common/json
         */
        function getQuestions() {
            $http.get('https://sitelaravel.kaskonomika.ru/faq/section/list')
                .then(function(response){
                    vm.questionsResp = response.data;
                    vm.questionsResp.forEach(function(f){
                        f.open = true;
                    })
                })
        }

        /**
         * Поиск и фильтр по вопросам и ответам.
         * @param search
         */
        function filterResults(search){
            if (search) { //Если строка не пуста
                search = search.toLowerCase(); //преобразование в lowercase
                vm.accordeonClose = false; //отмена запрета о одновременном открытии нескольких вкладок
                var tag = 'b', //тег, который будет вставляться в текст и обозначать помеченный элемент
                    arraySearch = []; //проверка на пустой результат поиска
                /**
                 * Удаление всех тегов из текста
                 */
                vm.questionsResp.forEach(function(f) {
                    f.open = false;
                    f.questions.forEach(function (a) {
                        if (a.title.indexOf('<'+tag+'>') + 1) {
                            var markIndex = a.title.indexOf('<'+tag+'>');
                            var firstPart = a.title.substring(0,markIndex);
                            var lastPart = a.title.substring(markIndex+tag.length+2,a.title.length);
                            a.title = firstPart + lastPart;
                        }
                        if (a.title.indexOf('</'+tag+'>') + 1) {
                            var markEndIndex = a.title.indexOf('</'+tag+'>');
                            var firstPart = a.title.substring(0,markEndIndex);
                            var lastPart = a.title.substring(markEndIndex+tag.length+3,a.title.length);
                            a.title = firstPart + lastPart;
                        }
                        if (a.description.indexOf('<'+tag+'>') + 1) {
                            var markIndex = a.description.indexOf('<'+tag+'>');
                            var firstPart = a.description.substring(0,markIndex);
                            var lastPart = a.description.substring(markIndex+tag.length+2,a.description.length);
                            a.description = firstPart + lastPart;
                        }
                        if (a.description.indexOf('</'+tag+'>') + 1) {
                            var markEndIndex = a.description.indexOf('</'+tag+'>');
                            var firstPart = a.description.substring(0,markEndIndex);
                            var lastPart = a.description.substring(markEndIndex+tag.length+3,a.description.length);
                            a.description = firstPart + lastPart;
                        }
                        a.open = true;
                    })
                });
                /**
                 * Поиск слов и фраз, добавление тегов и определение списка
                 */
                if (search !== '' || search !== ' ') {
                    vm.questionsResp.forEach(function(f){
                        f.questions.forEach(function(a){
                            var c = a.title.toLowerCase(),
                                d = a.description.toLowerCase(),
                                mainOpen = false,
                                startIndex,lastindex,firstPart,wordPart,lastPart;
                            if (c.indexOf(search) + 1) {
                                //Разбор оригинальной строки и создание новой
                                startIndex = c.indexOf(search);
                                lastindex = startIndex + search.length;
                                firstPart = a.title.substring(0,startIndex);
                                wordPart = a.title.substring(startIndex,lastindex);
                                lastPart = a.title.substring(lastindex,a.title.length+1);
                                mainOpen = true;
                                arraySearch.push(1);
                                a.title = firstPart + '<'+tag+'>' + wordPart + '</'+tag+'>' + lastPart;
                            }
                            if (d.indexOf(search) + 1) {
                                //Разбор оригинальной строки и создание новой
                                startIndex = d.indexOf(search);
                                lastindex = startIndex + search.length;
                                firstPart = a.description.substring(0,startIndex);
                                wordPart = a.description.substring(startIndex,lastindex);
                                lastPart = a.description.substring(lastindex,a.description.length+1);
                                mainOpen = true;
                                arraySearch.push(1);
                                a.description = firstPart + '<'+tag+'>' + wordPart + '</'+tag+'>' + lastPart;
                            }
                            //Возможность открытия всех вкладок
                            if (mainOpen) {
                                f.open = true;
                            }
                            //отображение предупреждения о пустом результате
                            if (arraySearch.indexOf(1) == -1) {
                                vm.tabsVision = false;
                            } else {
                                vm.tabsVision = true;
                            }
                        })
                    });
                }
            } else {
                //при пустом поиске возвращаться все на свои места
                vm.accordeonClose = true;
                vm.tabsVision = true;
                vm.questionsResp.forEach(function (f) {
                    f.open = true;
                    f.questions.forEach(function (a) {
                        a.open = false;
                    })
                });
            }
        }
    }
})();