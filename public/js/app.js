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
  }])

  // TODO: directive controllers - move to another file at some point

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
    var vm = this;
    var taskId;

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
  }])

  // TODO: Auth controllers refactor into another file at some point

  .controller('loginCtrl', ['$rootScope', 'authFactory', function($rootScope, authFactory) {
    var vm = this;

    vm.showing = false;

    vm.login = function() {
      vm.error = false;

      authFactory.login(vm.form.username, vm.form.password)
        .then(() => {
          vm.form = {};
          vm.showing = false;
          $rootScope.$broadcast('loggedIn');
        })
        .catch(err => {
          vm.error = true;
          vm.errorMessage = err.message || 'Something went wrong';
          vm.form = {};
        });
    };

    vm.showRegister = function() {
      vm.showing = false;
      authFactory.setForm('register');
      $rootScope.$broadcast('register');
    };

    $rootScope.$on('login', () => {
      vm.showing = !vm.showing;
    });
  }])

  .controller('registerCtrl', ['$rootScope', 'authFactory', function($rootScope, authFactory) {
    var vm = this;

    vm.showing = false;

    vm.showLogin = function() {
      vm.showing = false;
      authFactory.setForm('login');
      $rootScope.$broadcast('login');
    };

    vm.register = function() {
      vm.error = false;
      // TODO: add in the disabled setting so that the user cannot submit the form over and over while the login promise is going through
      // add this in after I've got a functioning promise

      // validate form
      if (vm.form.password !== vm.form.passwordCheck) {
        vm.error = true;
        vm.errorMessage = 'Passwords do not match';
      }

      if (!vm.form.username) {
        vm.error = true;
        vm.errorMessage = 'Username cannot be empty';
      }

      authFactory.register(vm.form.username, vm.form.password)
        .then(() => {
          vm.showing = false;
          vm.form = {};
          $rootScope.$broadcast('loggedIn');
        })
        .catch(err => {
          vm.error = true;
          vm.errorMessage = err.message || 'Something went wrong';
          vm.form = {};
        });
    };

    $rootScope.$on('register', () => {
      vm.showing = !vm.showing;
    });
  }])

  .controller('authCtrl', ['$rootScope', 'authFactory', function($rootScope, authFactory) {
    var vm = this;
    var loggedIn;

    function changeStatus() {
      loggedIn = authFactory.isLoggedIn();
      vm.buttonText = loggedIn ? 'Logout' : 'Login';
    }

    authFactory.getUserStatus().then(() => {
      changeStatus();
    });

    vm.loginLogout = function() {
      if (loggedIn) {
        authFactory.logout().then(() => {
          vm.buttonText = 'Login';
          loggedIn = false;
          $rootScope.$broadcast('loggedOut');
        });
      } else {
        $rootScope.$broadcast(authFactory.getForm());
      }
    };

    $rootScope.$on('loggedIn', changeStatus);
  }])

  .controller('tallyCtrl', ['tallyFactory', 'tallyDataFactory', '$rootScope', 'authFactory', function(tallyFactory, tallyDataFactory, $rootScope, authFactory) {
    var vm = this;

    function populateData() {
      tallyFactory.getTallies().then(data => {
        tallyDataFactory.setTallyData(data.data);
        vm.data = tallyDataFactory.getTallyData();
        vm.showMessage = false;

        if (vm.data.length < 1) {
          vm.showMessage = true;
          vm.message = 'Click the plus to add a task.';
        }
      });
    }

    authFactory.getUserStatus().then(() => {
      if (authFactory.isLoggedIn()) {
        populateData();
      } else {
        vm.message = 'Please login or register to track tasks.';
        vm.showMessage = true;
      }
    });

    $rootScope.$on('loggedIn', populateData);
    $rootScope.$on('loggedOut', () => {
      vm.data = [];
      vm.message = 'Please login or register to track tasks.';
      vm.showMessage = true;
    });
  }])

  .controller('headerCtrl', ['$rootScope', 'authFactory', function($rootScope, authFactory) {
    var vm = this;

    vm.addTally = function() {
      if (authFactory.isLoggedIn()) {
        $rootScope.$broadcast('addTally');
      }
    };
  }]);
})();
