app.config(['$routeProvider', '$locationProvider',function (router, provider) {
    router
      .when('/game', {
        templateUrl: 'views/game.html',
        controller: 'GameCtrl',
        directive: 'keyDown'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/addLevel', {
        templateUrl: 'views/addLevel.html',
        controller: 'addLevelCtrl'
      })
      .otherwise({
        redirectTo: '/game'
      });

    provider.html5Mode(true);
  }]);