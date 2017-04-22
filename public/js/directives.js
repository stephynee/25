import app from './angular-module';

app.directive('login', [function() {
  return {
    templateUrl: '/directives/login.html',
    controller: 'loginCtrl as loginCtrl'
  };
}]);

app.directive('register', [function() {
  return {
    templateUrl: '/directives/register.html',
    controller: 'registerCtrl as registerCtrl'
  };
}]);

app.directive('tally', [function() {
  return {
    scope: {
      data: '=data'
    },
    templateUrl: '/directives/tally.html',
    controller: 'singleTallyCtrl as singleCtrl'
  };
}]);

app.directive('addTally', [function() {
  return {
    templateUrl: '/directives/addtally.html',
    controller: 'addTallyCtrl as addCtrl'
  };
}]);

app.directive('editTally', [function() {
  return {
    templateUrl: '/directives/edittally.html',
    controller: 'editTallyCtrl as editCtrl'
  };
}]);

app.directive('taskTimer', [function() {
  return {
    templateUrl: '/directives/tasktimer.html',
    controller: 'taskTimerCtrl as timerCtrl'
  };
}]);

app.directive('taskData', [function() {
  return {
    templateUrl: '/directives/taskdata.html',
    controller: 'taskDataCtrl as dataCtrl'
  };
}]);
