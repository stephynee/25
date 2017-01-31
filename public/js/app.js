var app = angular.module('tally25', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider)  {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('tallies', {
      url: '/',
      templateUrl: '/views/tallies.html',
      controller: 'tallyCtrl as ctrl'
    });
}]);

app.directive('tally', [function() {
  return {
    scope: {
      data: '=data'
    },
    templateUrl: '/directives/tally.html',
    controller: 'singleTallyCtrl as ctrl'
  }
}]);

app.controller('singleTallyCtrl', [function() {
  var vm = this;

  vm.showingInfo = {};

  vm.showInfo = function(tallyId, e) {
    vm.showingInfo[tallyId] = vm.showingInfo[tallyId] ? false: true;
  }
}]);

app.controller('tallyCtrl', ['tallyFactory', function(tallyFactory) {
  var vm = this;

  tallyFactory.getTallies().then(data => vm.data = data.data);
}]);
