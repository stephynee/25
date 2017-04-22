import app from './angular-module';

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('tallies', {
      url: '/',
      templateUrl: '/views/tallies.html',
      controller: 'tallyCtrl as tallyCtrl'
    });
}])
