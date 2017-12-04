/**
 * Created by Ravy on 22.03.2017.
 */
(function () {
    'use strict';

    angular.module('partners')
        .controller('pageTelematicsController', pageTelematicsController);

    pageTelematicsController.$inject = ['$scope','$http','config','$filter','$sce','$location'];

    function pageTelematicsController($scope,$http,config, $filter,$sce,$location) {
        var vm = this;
        var api = config.api;
        vm.token = localStorage.getItem('token'); //Получение токена из localStorage
        vm.cars = []; //массив атомобилей
        vm.tabIndex = 0; //Начальное значение вкладки авто
        vm.monthCalendar = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']; //Годовой календарь
        vm.series = ['Пробег']; //Маркировка стлбцов для графиков пробега
        vm.eventsTabs = [
            {
                title: 'Апрель',
                num: 4
            },
            {
                title: 'Май',
                num: 5
            },
            {
                title: 'Июнь',
                num: 6
            }
        ]; //Хардкод табов календаря
        vm.currentYear = 17; //Текущий год для отображения во вкладках
        vm.waiter = false; //Ожидание выполнения рестов
        vm.currentMap = undefined; //Обнуление данных о картах

        vm.getNewResult = getNewResult;
        vm.showEventList = showEventList;
        vm.showMoreinfo = showMoreinfo;
        

        activate();
        /////////////////////
        function activate() {
            getCarsWithDevices();

            if (!vm.token) $location.url('/');

        }

        /**
         * Обновление данных по всем машинам
         * @param carId
         */
        function getNewResult(carId,id) {
            vm.carID = carId;
            vm.currentCar = id;
            clearData();
            if (vm.eventListToShow.length == 0) {
                if (vm.sampleCars) {
                    vm.sampleCars.forEach(function(f){
                        if (f.object_id == carId) {
                            getScoringByCar(f);
                            getMileage(f);
                            getTrips(f);
                        }
                    })
                }
            }
        }

        /**
         * Очистка всех данных при переключении машины
         */
        function clearData(){
            vm.popoverHtml = null;
            vm.dashboardData = [];
            vm.newMounthcalendar = [];
            vm.yearsCalendar = [];
            vm.yearsCalendarPerMounth = [[0,0,0,0,0,0,0,0,0,0,0,0]];
            vm.currentMonth = null;
            vm.eventsList = [];
            vm.regionChart = [];
            vm.regionChartLabel = [];
            vm.otherScoringTrip = [];
            vm.waypoints = [];
            vm.waypointsList = [];
            vm.eventListToShow = [];
        }

        /**
         * Получение списка данных по машинам
         */
        function getCarsWithDevices() {
            if (vm.token) {
                $http.get(api+'/telematic/cars_with_devices?token='+vm.token)
                    .then(function(response){
                        if (response.data.result) {
                            vm.sampleCars = response.data.response;
                            vm.sampleCars.forEach(function(f){
                                var a = {
                                    title: f.mark + ' ' + f.model,
                                    contract_id: f.contract_id,
                                    object_id: f.object_id
                                };
                                vm.cars.push(a)
                            });
                            getNewResult(vm.sampleCars[2].object_id,2)
                        }
                    })
            }
        }

        /**
         * Получение данных скоринга по машине
         * @param carData - информация по машине из "/telematic/cars_with_devices"
         */
        function getScoringByCar(carData) {
            var data = {
                token: vm.token,
                carId: carData.object_id,
                contractId: carData.contract_id,
                periodType: 'CONTRACT'
            };
            $http.post(api + '/telematic/citymaster/scoring/get', data)
                .then(function(response){
                    if (response.data.result) {
                        var otherScoringArray = [];
                        vm.popoverHtml = '';
                        if (response.data.response.response) {
                            response.data.response.response.forEach(function(f){
                                if (f.param === null) {
                                    vm.dashboardData = f;
                                } else {
                                    otherScoringArray.push(f);
                                }
                            });
                            otherScoringArray.forEach(function(a){
                                vm.popoverHtml = vm.popoverHtml + '<li>' + a.param + ':' + ' ' +  a.score + '</li>';
                            });
                            vm.popoverHtml = '<ul>' + vm.popoverHtml + '</ul>';
                            vm.popoverHtml = $sce.trustAsHtml(vm.popoverHtml);
                        }
                    }
                })
        }

        /**
         * Получение данных для отоюражения графиков
         * @param carData - информация по машине из "/telematic/cars_with_devices"
         */
        function getMileage(carData) {
            // Begin date
            var newBeginYearMounth = carData.begin_date.split('-');
            var newBeginData = newBeginYearMounth[2].split(' ')[0];

            // End date
            var newEndYearMounth = carData.end_date.split('-');
            var newEndData = newBeginYearMounth[2].split(' ')[0];

            // Get Data per days by mounth
            var dataMounth = {
                token: vm.token,
                dateBegin: newBeginData+'.'+newBeginYearMounth[1]+'.'+newBeginYearMounth[0],
                dateEnd: newEndData+'.'+newEndYearMounth[1]+'.'+newEndYearMounth[0],
                contractId: carData.contract_id,
                carId: carData.object_id,
                dmy: 'D'
            };
            $http.post(api + '/telematic/citymaster/mileage/get',dataMounth)
                .then(function(response){
                    if (response.data.result) {
                        vm.newMounthcalendarLabels = ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''];
                        vm.newMounthcalendar = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
                        var maxYear = 1 , maxMounth = 1;
                        if (response.data.response.response) {
                            response.data.response.response.forEach(function(f){
                                var date = f.date.split(' ');
                                var items = date[0].split('.');
                                if (parseInt(items[2]) > maxYear) {
                                    maxYear = items[2];
                                }
                                if (parseInt(items[2]) == maxYear && parseInt(items[1]) > maxMounth) {
                                    maxMounth = items[1];
                                }
                            });
                            response.data.response.response.forEach(function(f,i){
                                var date = f.date.split(' ');
                                var items = date[0].split('.');
                                if (items[1] == maxMounth) {
                                    var day = parseInt(items[0]);
                                    vm.newMounthcalendar[0][parseInt(items[0])-1] = f.value;
                                    if (f.value != 0 || f.value != '0') {
                                        vm.newMounthcalendarLabels[day-1] = parseInt(items[0]);
                                    }
                                }
                            });
                        }
                    }
                });

            // Get Data per mounth by yaer
            var dataYear = {
                token: vm.token,
                dateBegin: newBeginData+'.'+newBeginYearMounth[1]+'.'+newBeginYearMounth[0],
                dateEnd: newEndData+'.'+newEndYearMounth[1]+'.'+newEndYearMounth[0],
                contractId: carData.contract_id,
                carId: carData.object_id,
                dmy: 'M'
            };
            $http.post(api + '/telematic/citymaster/mileage/get',dataYear)
                .then(function(response){
                    if (response.data.result) {
                        if (response.data.response.response) {
                            var maxYear = 0;
                            response.data.response.response.forEach(function(f){
                                var date = f.date.split(' '),
                                    items = date[0].split('.');

                                if (items[2] > maxYear) maxYear = items[2];
                            });
                            response.data.response.response.forEach(function(f){
                                var error = false,
                                    date = f.date.split(' '),
                                    items = date[0].split('.');

                                vm.yearsCalendar.forEach(function(a){
                                    if (items[2] == maxYear && items[1] == a) {
                                        error = true;
                                    }
                                });
                                if (!error) {
                                    if (items[1] !== undefined) {
                                        vm.yearsCalendar.push(items[1])
                                    }
                                }
                            });
                            vm.yearsCalendar.forEach(function(m){
                                response.data.response.response.forEach(function(f){
                                    var date = f.date.split(' '),
                                        items = date[0].split('.');
                                    if (items[2] == maxYear && items[1] == m) {
                                        if (f.value !== undefined) {
                                            vm.yearsCalendarPerMounth[0][parseInt(m)-1] = f.value;
                                        }
                                    }
                                });
                            });
                        }
                    }
                })
        }

        /**
         * Получение списка поездок
         * @param carData - информация по машине из "/telematic/cars_with_devices"
         */
        function getTrips(carData) {
            if (!vm.waiter) {
                vm.waiter = true;
                var newBeginYearMounth = carData.begin_date.split('-');
                var newBeginData = newBeginYearMounth[2].split(' ')[0];

                // End date
                var newEndYearMounth = carData.end_date.split('-');
                var newEndData = newBeginYearMounth[2].split(' ')[0];

                var data = {
                    token: vm.token,
                    carId: carData.object_id,
                    dateBegin: newBeginData+'.'+newBeginYearMounth[1]+'.'+newBeginYearMounth[0],
                    dateEnd: newEndData+'.'+newEndYearMounth[1]+'.'+newEndYearMounth[0],
                    pageNumber: 0
                };
                $http.post(api + '/telematic/citymaster/trip/get', data)
                    .then(function(response){
                        if (response.data.result) {
                            var trips = response.data.response.trips;
                            $http.post(api + '/telematic/citymaster/parking/get', data)
                                .then(function(response){
                                    if (response.data.result) {
                                        var parking = response.data.response.response;
                                        if (parking) {
                                            vm.waiter = false;
                                            parking.forEach(function(f){
                                                var beforeParse = f.dateBegin.split(' '),
                                                    afterParse = beforeParse[0].split('.'),
                                                    newDate = afterParse[2]+'-'+afterParse[1]+'-'+afterParse[0]+' ' + beforeParse[1];
                                                f.time_start = Date.parse(newDate);

                                                beforeParse = f.dateEnd.split(' ');
                                                afterParse = beforeParse[0].split('.');
                                                newDate = afterParse[2]+'-'+afterParse[1]+'-'+afterParse[0]+' ' + beforeParse[1];
                                                f.time_end = Date.parse(newDate);
                                                var sec = f.duration*60;
                                                var h = sec/3600 ^ 0;
                                                var m = (sec-h*3600)/60 ^ 0;
                                                f.hhmm = (h<10 ? '0'+h : h) + " ч. "+(m<10 ? '0'+ m:m) + " мин.";

                                                f.type = 'parking';
                                                vm.eventsList.push(f);
                                            });
                                            trips.forEach(function(f){
                                                f.type = 'trip';
                                                f.time_end = f.time_end*1000;
                                                f.time_start = f.time_start*1000;
                                                var sec = f.duration*60;
                                                var h = sec/3600 ^ 0;
                                                var m = (sec-h*3600)/60 ^ 0;
                                                f.hhmm = (h<10 ? '0'+h : h) + " ч. "+(m<10 ? '0'+ m:m) + " мин.";
                                                vm.eventsList.push(f);
                                            });
                                            vm.currentMonth = 2;
                                            showEventList(6);
                                        }
                                        else vm.waiter = false;
                                    } else vm.waiter = false;
                                })
                        }
                    })
            }


        }

        /**
         * Получение списка событий для выбранного месяца
         * @param mounth - цифра, обозначающая порядковый номер месяца в году
         */
        function showEventList(mounth) {
            vm.eventListToShow = undefined;
            vm.eventListToShow = [];
            vm.eventsList.forEach(function(f){
                var getMounth = parseInt($filter('date')(f.time_start,'MM','GMT+3'));
                if (getMounth == mounth) {
                    vm.eventListToShow.push(f);
                }
            });
            if (vm.eventListToShow.length == 0) {
                var error = {error:'Нет данных о поездах за этот месяц.'};
                vm.eventListToShow.push(error);
            }
            vm.eventListToShow.sort(compareNumbers);
        }

        /**
         * Отображение подробностей выюранного события
         * @param event - данные из списка событий для отображения
         * @param open - статус - true / false для вкладки, по которой производится клик
         */
        function showMoreinfo(event, open) {
            if (open){
                console.log('event',event);
                vm.eventMore = event;
                if (event.type == 'parking') {
                    vm.eventMorePoi = event.poi;
                    var region = [event.regionId];
                    var data = {
                        token: vm.token,
                        carId: event.carId,
                        regionIdList: region
                    };
                    $http.post(api + '/telematic/citymaster/region/get',data)
                        .then(function(response){
                            if (response.data.result) {
                                vm.region = response.data.response.response[0];
                                vm.regionChart = [];
                                vm.regionChartLabel = [];
                                vm.region.poiWeight.sort(compareWeight);
                                vm.region.poiWeight.forEach(function(f){
                                    switch (f.type) {
                                        case 'home_goods_store':
                                            f.type = 'Товары для дома';
                                            break;
                                        case 'school':
                                            f.type = 'Школа';
                                            break;
                                        case 'point_of_interest':
                                            f.type = 'Без категории';
                                            break;
                                        case 'food':
                                            f.type = 'Еда';
                                            break;
                                        case 'general_contractor':
                                            f.type = 'Контрагент';
                                            break;
                                        case 'shopping_mall':
                                            f.type = 'Торговые центры';
                                            break;
                                        case 'store':
                                            f.type = 'Магазин';
                                            break;
                                        case 'lawyer':
                                            f.type = 'Закон';
                                            break;
                                        case 'shoe_store':
                                            f.type = 'Магазин обуви';
                                            break;
                                        case 'finance':
                                            f.type = 'Финансы';
                                            break;
                                        case 'establishment':
                                            f.type = 'Творчество';
                                            break;
                                        case 'accounting':
                                            f.type = 'Финансы';
                                            break;
                                        case 'moving_company':
                                            f.type = 'Перевозки';
                                            break;
                                        case 'health':
                                            f.type = 'Здоровье';
                                            break;
                                        case 'transit_station':
                                            f.type = 'Общественный транспорт';
                                            break;
                                        case 'bus_station':
                                            f.type = 'Автобусные остановки';
                                            break;
                                        case 'florist':
                                            f.type = 'Цветы';
                                            break;
                                        case 'furniture_store':
                                            f.type = 'Мебельный магазин';
                                            break;
                                        case 'atm':
                                            f.type = 'Банкоматы';
                                            break;
                                        case 'hair_care':
                                            f.type = 'Парикмахерская';
                                            break;
                                        case 'locksmith':
                                            f.type = 'Слесарь';
                                            break;
                                        case 'place_of_worship':
                                            f.type = 'Памятники';
                                            break;
                                        case 'bank':
                                            f.type = 'Банк';
                                            break;
                                        case 'book_store':
                                            f.type = 'Книжный магазин';
                                            break;
                                        case 'parking':
                                            f.type = 'Парковка';
                                            break;
                                        case 'grocery_or_supermarket':
                                            f.type = 'Супермаркет';
                                            break;
                                        case 'car_repair':
                                            f.type = 'Автомастерская';
                                            break;
                                        case 'car_dealer':
                                            f.type = 'Автосалон';
                                            break;
                                        case 'dentist':
                                            f.type = 'Дантист';
                                            break;
                                        case 'real_estate_agency':
                                            f.type = 'Агенство недвижимости';
                                            break;
                                        case 'clothing_store':
                                            f.type = 'Магазин одежды';
                                            break;
                                        case 'jewelry_store':
                                            f.type = 'Ювелирный одежды';
                                            break;
                                        case 'travel_agency':
                                            f.type = 'Путешествия';
                                            break;
                                        case 'beauty_salon':
                                            f.type = 'Салон красоты';
                                            break;
                                        case 'liquor_store':
                                            f.type = 'Алкогольный магазин';
                                            break;
                                        case 'laundry':
                                            f.type = 'Прачечная';
                                            break;
                                        case 'night_club':
                                            f.type = 'Ночные клубы';
                                            break;
                                        case 'restaurant':
                                            f.type = 'Рестораны';
                                            break;
                                    }
                                    vm.regionChart.push(f.weight);
                                    vm.regionChartLabel.push(f.type);
                                });
                                if (vm.region.type == 'HOME') {
                                    vm.region.type = 'Дом'
                                } else if (vm.region.type == 'WORK') {
                                    vm.region.type = 'Работа'
                                } else if (vm.region.type == null) {
                                    vm.region.type = vm.regionChartLabel[0];
                                }
                                createCurrentMap(event);
                            }

                        })
                } else if (event.type == 'trip') {
                    var data = {
                        token: vm.token,
                        carId: vm.carID,
                        tripId: event.id,
                        periodType: 'TRIP'
                    };
                    $http.post(api + '/telematic/citymaster/scoring/get', data)
                        .then(function(response){
                            if (response.data.response.response) {
                                response.data.response.response.forEach(function (f) {
                                    if (f.param === null) {
                                        vm.tripScoringData = f;
                                    } else {
                                        vm.otherScoringTrip.push(f);
                                    }
                                });
                            }
                        });
                    createCurrentMap(event);
                }
            }
        }

        /**
         * Отрисовка карты
         * @param event - событие из списка, для которого нужно нарисовать карту
         */
        function createCurrentMap(event){
            if (event.type == 'parking') {
                var location = {lat: event.latitude, lng: event.longitude},
                    id = 'map' + event.time_start;
                var map = new google.maps.Map(document.getElementById(id), {
                    zoom: 13,
                    center: location
                });
                var marker = new google.maps.Marker({
                    position: location,
                    map: map
                });
            } else if (event.type == 'trip') {
                var data = {
                    token: vm.token,
                    tripId: event.id
                };
                $http.post(api+'/telematic/citymaster/track/get',data)
                        .then(function(response) {
                            vm.waypointsList = [];
                            vm.waypoints = [];
                            vm.waypointsServer = response.data.response.tracker.p;
                            vm.waypointsServer.forEach(function(f){
                                var location = new google.maps.LatLng(f.pt.gps.lat,f.pt.gps.lon);
                                vm.waypoints.push(location);
                            });

                            var wayLength = vm.waypoints.length - 1;

                            //Отображение карты с маршрутом
                            var request = {
                                origin: new google.maps.LatLng(event.start_point.lat,event.start_point.lon), //точка старта
                                destination: new google.maps.LatLng(event.end_point.lat,event.end_point.lon) //точка финиша
                            };
                            var map;
                            var id = 'map' + event.time_start;
                            var mapOptions = {
                                zoom:11,
                                center: request.destination
                            };

                            map = new google.maps.Map(document.getElementById(id), mapOptions);

                            var flightPath = new google.maps.Polyline({
                                path: vm.waypoints,
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 1.0,
                                strokeWeight: 4
                            });

                            var marker1 = new google.maps.Marker({
                                position: vm.waypoints[0],
                                map: map,
                                title: 'Start point',
                                label: 'A'
                            });


                            var marker2 = new google.maps.Marker({
                                position: vm.waypoints[wayLength],
                                map: map,
                                title: 'End point',
                                label: 'B'

                            });
                            flightPath.setMap(map);
                        });

            }

        }

        /**
         * Сортировка списка событий
         * @param a - текущий индекс
         * @param b - предыдущий индекс
         * @returns {number}
         */
        function compareNumbers(a, b) {
            return ((a.time_end-100) - b.time_start);
        }

        /**
         * Сортировка списка событий
         * @param a - текущий индекс
         * @param b - предыдущий индекс
         * @returns {number}
         */
        function compareWeight(a, b) {
            return (b.weight - a.weight);
        }
    }
})();

