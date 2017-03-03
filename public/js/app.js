(function() {
  angular.module('tally25', ['ui.router', 'ngAnimate'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('tallies', {
        url: '/',
        templateUrl: '/views/tallies.html',
        controller: 'tallyCtrl as tallyCtrl'
      });
  }])

  .directive('login', [function() {
    return {
      templateUrl: '/directives/login.html',
      controller: 'loginCtrl as loginCtrl'
    };
  }])

  .directive('register', [function() {
    return {
      templateUrl: '/directives/register.html',
      controller: 'registerCtrl as registerCtrl'
    };
  }])

  .directive('tally', [function() {
    return {
      scope: {
        data: '=data'
      },
      templateUrl: '/directives/tally.html',
      controller: 'singleTallyCtrl as singleCtrl'
    };
  }])

  .directive('addTally', [function() {
    return {
      templateUrl: '/directives/addtally.html',
      controller: 'addTallyCtrl as addCtrl'
    };
  }])

  .directive('editTally', [function() {
    return {
      templateUrl: '/directives/edittally.html',
      controller: 'editTallyCtrl as editCtrl'
    };
  }])

  .directive('taskTimer', [function() {
    return {
      templateUrl: '/directives/tasktimer.html',
      controller: 'taskTimerCtrl as timerCtrl'
    };
  }])

  .directive('taskData', [function() {
    return {
      templateUrl: '/directives/taskdata.html',
      controller: 'taskDataCtrl as dataCtrl'
    };
  }]);
})();
