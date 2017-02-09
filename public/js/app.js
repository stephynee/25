(function() {
  angular.module('tally25', ['ui.router'])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('tallies', {
        url: '/',
        templateUrl: '/views/tallies.html',
        controller: 'tallyCtrl as tallyCtrl'
      });
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

  // directive controllers - move to another file at some point

  .controller('singleTallyCtrl', ['$rootScope', 'tallyFactory', function($rootScope, tallyFactory) {
    var vm = this;

    vm.showingInfo = {};

    vm.showInfo = function(tallyId) {
      vm.showingInfo[tallyId] = !vm.showingInfo[tallyId];
    };

    vm.editTally = function(tally) {
      $rootScope.$broadcast('editTally', {tallyData: tally});
    };

    vm.getToday = tallyFactory.getToday;
  }])

  .controller('addTallyCtrl', ['$rootScope', 'tallyFactory', 'colorFactory', function($rootScope, tallyFactory, colorFactory) {
    var vm = this;

    vm.show = false;
    vm.tallyName = '';
    vm.colors = colorFactory.getColors();
    vm.selectedColor = 'color-white';

    vm.openClose = function() {
      vm.show = !vm.show;
    };

    vm.addTally = function() {
      let task = {
        task: vm.tallyName,
        color: vm.selectedColor
      };

      tallyFactory.addTally(task).then(data => {
        $rootScope.$broadcast('tallyAdded', data.data);
        vm.openClose();
        vm.selectedColor = 'color-white';
        vm.tallyName = '';
      });
    };

    vm.selectColor = function(color) {
      vm.selectedColor = color;
    };

    $rootScope.$on('addTally', vm.openClose);
  }])

  .controller('editTallyCtrl', ['$rootScope', 'colorFactory', 'tallyFactory', function($rootScope, colorFactory, tallyFactory) {
    var vm = this;

    vm.show = false;
    vm.colors = colorFactory.getColors();

    vm.openClose = function() {
      vm.show = !vm.show;
    };

    vm.selectColor = function(color) {
      vm.selectedColor = color;
    };

    vm.updateTally = function() {
      var update = {
        id: vm.tallyData._id,
        task: vm.tallyName,
        color: vm.selectedColor
      };

      tallyFactory.updateTally(update).then(data => {
        $rootScope.$broadcast('tallyUpdated', data.data);
        vm.openClose();
      });
    };

    vm.deleteTally = function() {
      tallyFactory.deleteTally(vm.tallyData.id).then(() => {
        $rootScope.$broadcast('tallyDeleted', vm.tallyData.id);
        vm.openClose();
      });
    };

    $rootScope.$on('editTally', (e, data) => {
      vm.tallyData = data.tallyData;
      vm.selectedColor = data.tallyData.color;
      vm.tallyName = data.tallyData.task;
      vm.openClose();
    });
  }])

  // //////////////////////////////

  .controller('tallyCtrl', ['tallyFactory', '$rootScope', function(tallyFactory, $rootScope) {
    var vm = this;

    tallyFactory.getTallies().then(data => {
      vm.data = data.data;
    });

    $rootScope.$on('tallyAdded', (e, data) => vm.data.push(data));
    $rootScope.$on('tallyUpdated', (e, data) => {
      var i = vm.data.findIndex(obj => obj._id === data._id);
      vm.data.splice(i, 1, data);
    });

    $rootScope.$on('tallyDeleted', (e, data) => {
      var i = vm.data.findIndex(obj => obj.id === data);
      vm.data.splice(i, 1);
    });
  }])

  .controller('headerCtrl', ['$rootScope', function($rootScope) {
    var vm = this;

    vm.addTally = function() {
      $rootScope.$broadcast('addTally');
    };
  }]);
})();
