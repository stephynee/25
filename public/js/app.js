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
  }])

  // directive controllers - move to another file at some point

  .controller('singleTallyCtrl', ['$rootScope', 'tallyDataFactory', function($rootScope, tallyDataFactory) {
    var vm = this;

    vm.showingInfo = {};

    vm.showInfo = function(tallyId) {
      vm.showingInfo[tallyId] = !vm.showingInfo[tallyId];
    };

    vm.editTally = function(tally) {
      $rootScope.$broadcast('editTally', {tallyData: tally});
    };

    vm.showTimer = function(tally) {
      $rootScope.$broadcast('showTimer', {tallyData: tally});
    };

    vm.showData = function(tally) {
      $rootScope.$broadcast('showData', {task: tally.task, id: tally._id});
    };

    vm.increment = tallyDataFactory.increment;

    vm.decrement = tallyDataFactory.decrement;
  }])

  .controller('addTallyCtrl', ['$rootScope', 'tallyFactory', 'colorFactory', 'tallyDataFactory', function($rootScope, tallyFactory, colorFactory, tallyDataFactory) {
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
        tallyDataFactory.pushNew(data.data);
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

  .controller('editTallyCtrl', ['$rootScope', 'colorFactory', 'tallyFactory', 'tallyDataFactory', function($rootScope, colorFactory, tallyFactory, tallyDataFactory) {
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
        tallyDataFactory.editTally(data.data);
        vm.openClose();
      });
    };

    vm.deleteTally = function() {
      tallyFactory.deleteTally(vm.tallyData._id).then(() => {
        tallyDataFactory.deleteTally(vm.tallyData._id);
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

  .controller('taskTimerCtrl', ['$rootScope', 'timerFactory', function($rootScope, timerFactory) {
    var vm = this;

    vm.show = false;
    vm.timeLeft = '25:00';

    vm.openClose = function() {
      vm.show = !vm.show;
      timerFactory.stopTimer();
    };

    vm.startTimer = function() {
      timerFactory.startTimer(vm);
    };

    vm.pauseTimer = timerFactory.pauseTimer;

    vm.stopTimer = function() {
      timerFactory.stopTimer(vm);
    };

    $rootScope.$on('showTimer', (e, data) => {
      vm.show = !vm.show;
      vm.task = data.tallyData.task;
    });
  }])

  .controller('taskDataCtrl', ['$rootScope', 'taskDataFactory', function($rootScope, taskDataFactory) {
    var vm = this;

    vm.show = false;

    vm.openClose = function() {
      vm.show = !vm.show;
    };

    $rootScope.$on('showData', (e, data) => {
      vm.openClose();
      vm.task = data.task;
      taskDataFactory.getWeek(data.id).then(data => {
        vm.totalCat = 'Week';
        vm.todayTally = data.data.todayTally;
        vm.todayTime = `${data.data.todayTime.hours} hr ${data.data.todayTime.minutes} min`;
        vm.weekTally = data.data.weekTally;
        vm.weekTime = `${data.data.weekTime.hours} hr ${data.data.weekTime.minutes} min`;
      });
    });
  }])

  // //////////////////////////////

  .controller('tallyCtrl', ['tallyFactory', 'tallyDataFactory', function(tallyFactory, tallyDataFactory) {
    var vm = this;

    tallyFactory.getTallies().then(data => {
      tallyDataFactory.setTallyData(data.data);
      vm.data = tallyDataFactory.getTallyData();
    });
  }])

  .controller('headerCtrl', ['$rootScope', function($rootScope) {
    var vm = this;

    vm.addTally = function() {
      $rootScope.$broadcast('addTally');
    };
  }]);
})();
