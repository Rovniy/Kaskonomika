(function () {
    'use strict';

    angular
        .module('kaskonomika')
        .run(run);

        run.$inject = ['$http','config','$rootScope'];

    function run ($http,config,$rootScope) {

        $rootScope.checkUser = checkUser;
        checkUser();

        /**
         * Проверка наличия залогининного пользователя
         */
        function checkUser() {
            var token = localStorage.getItem('currentToken'),
                user = localStorage.getItem('currentUser');
            if (token && user) {
                $http.get(config.api+'isTokenAuthorized/'+token)
                    .then(function(_res){
                        if (_res.data.response && _res.data.result) {
                            $rootScope.currentUser = JSON.parse(user);
                            $rootScope.currentToken = token;
                            xlog('APP.RUN : USER ->', $rootScope.currentUser);
                            xlog('APP.RUN : TOKEN ->', $rootScope.currentToken);
                            $rootScope.$broadcast('user');
                        } else {
                            $rootScope.currentUser = undefined;
                            localStorage.removeItem('currentToken');
                            localStorage.removeItem('currentUser');
                        }
                    })
            } else {
                $rootScope.currentUser = undefined;
                $rootScope.demoToken = '';
                localStorage.removeItem('currentToken');
                localStorage.removeItem('currentUser');
                xlog("APP.RUN : USER -> Can't check user localData");
                $rootScope.$broadcast('!user');
            }
        }
    }
})();