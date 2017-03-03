(function() {
  angular.module('tally25')

  .controller('singleTallyCtrl', ['$rootScope', 'tallyDataFactory', function($rootScope, tallyDataFactory) {
    const vm = this;

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
    const vm = this;

    vm.show = false;
    // vm.tallyName = '';
    vm.colors = colorFactory.getColors();
    vm.selectedColor = 'color-white';

    vm.openClose = function() {
      vm.show = !vm.show;
    };

    vm.addTally = function() {
      const task = {
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
    const vm = this;

    vm.show = false;
    vm.colors = colorFactory.getColors();

    vm.openClose = function() {
      vm.show = !vm.show;
    };

    vm.selectColor = function(color) {
      vm.selectedColor = color;
    };

    vm.updateTally = function() {
      const update = {
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
    const vm = this;

    vm.show = false;
    vm.timeLeft = '25:00';

    vm.openClose = function() {
      vm.show = !vm.show;
      timerFactory.stopTimer();
    };

    vm.startTimer = function() {
      timerFactory.startTimer(vm, vm.task._id);
    };

    vm.pauseTimer = timerFactory.pauseTimer;

    vm.stopTimer = function() {
      timerFactory.stopTimer(vm);
    };

    $rootScope.$on('showTimer', (e, data) => {
      vm.show = !vm.show;
      vm.task = data.tallyData;
    });
  }])

  .controller('taskDataCtrl', ['$rootScope', 'taskDataFactory', function($rootScope, taskDataFactory) {
    const vm = this;
    let taskId;

    vm.show = false;
    vm.selected = {
      week: false,
      month: false,
      year: false
    };

    vm.openClose = function() {
      vm.show = !vm.show;
    };

    vm.getRange = function(range) {
      for (var key in vm.selected) {
        if (vm.selected.hasOwnProperty(key)) {
          vm.selected[key] = false;
        }
      }

      vm.selected[range.toLowerCase()] = true;
      vm.totalCat = range;
      vm.rangeDates = taskDataFactory.getDateRange(range);
      vm.monthView = range === 'Month';

      taskDataFactory.getRange(range, taskId).then(data => {
        if (range.toLowerCase() === 'week') {
          vm.todayTally = data.data.todayTally;
          vm.todayTime = `${data.data.todayTime.hours} hr ${data.data.todayTime.minutes} min`;
        }

        vm.rangeTally = data.data.tally;
        vm.rangeTime = `${data.data.time.hours} hr ${data.data.time.minutes} min`;
        vm.bars = taskDataFactory.buildBars(data.data.graphData);
        vm.rangeWidth = taskDataFactory.getRangeWidth();
      });
    };

    $rootScope.$on('showData', (e, data) => {
      // open the data overlay and display data for the week
      vm.openClose();
      vm.task = data.task;
      taskId = data.id;
      vm.getRange('Week');
    });
  }]);
})();
