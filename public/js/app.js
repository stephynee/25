(function() {
  angular.module('tally25', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('tallies', {
        url: '/',
        templateUrl: '/views/tallies.html',
        controller: 'tallyCtrl as ctrl'
      });
  }])

  .directive('tally', [function() {
    return {
      scope: {
        data: '=data'
      },
      templateUrl: '/directives/tally.html',
      controller: 'singleTallyCtrl as ctrl'
    };
  }])

  .directive('addTally', [function() {
    return {
      templateUrl: '/directives/addtally.html',
      controller: 'addTallyCtrl as ctrl'
    };
  }])

  // directive controllers - move to another file at some point

  .controller('singleTallyCtrl', [function() {
    var vm = this;

    vm.showingInfo = {};

    vm.showInfo = function(tallyId) {
      vm.showingInfo[tallyId] = !vm.showingInfo[tallyId];
    };
  }])

  .controller('addTallyCtrl', ['$rootScope', 'tallyFactory', function($rootScope, tallyFactory) {
    var vm = this;

    vm.show = false;
    vm.tallyName = '';
    vm.colors = ['color-red', 'color-yellow', 'color-green', 'color-seafoam', 'color-lightblue', 'color-blue', 'color-purple', 'color-pink', 'color-darkpink'];
    vm.selectedColor = '';

    vm.openClose = function() {
      vm.show = !vm.show;
    };

    vm.addTally = function() {
      let data = {
        task: vm.tallyName,
        color: vm.selectedColor
      };

      tallyFactory.addTally(data).then(() => vm.openClose());
    };

    vm.selectColor = function(color) {
      vm.selectedColor = color;
    };

    $rootScope.$on('addTally', vm.openClose);
  }])

  // //////////////////////////////

  .controller('tallyCtrl', ['tallyFactory', function(tallyFactory) {
    var vm = this;

    tallyFactory.getTallies().then(data => {
      vm.data = data.data;
    });
  }])

  .controller('headerCtrl', ['$rootScope', function($rootScope) {
    var vm = this;

    vm.addTally = function() {
      $rootScope.$broadcast('addTally');
    };
  }]);
})();
