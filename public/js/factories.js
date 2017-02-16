(function() {
  angular.module('tally25')

  .factory('tallyFactory', ['$http', function($http) {
    var factory = {
      getTallies: function() {
        return $http.get('/api/tallies');
      },
      addTally: function(data) {
        return $http.post('/api/tallies', {data: data});
      },
      updateTally: function(data) {
        return $http.put('/api/tallies', {data: data});
      },
      deleteTally: function(tallyId) {
        return $http({
          url: '/api/tallies',
          method: 'DELETE',
          data: {
            tallyId: tallyId
          },
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        });
      }
    };

    return factory;
  }])

  .factory('tallyDataFactory', ['$http', function($http) {
    var tallyData = [];

    var factory = {
      getTallyData: function() {
        return tallyData;
      },
      setTallyData: function(tallies) {
        tallyData = tallies;
      },
      pushNew: function(tally) {
        tallyData.push(tally);
      },
      editTally: function(tally) {
        var i = tallyData.findIndex(obj => obj._id === tally._id);
        tallyData.splice(i, 1, tally);
      },
      deleteTally: function(id) {
        var i = tallyData.findIndex(obj => obj._id === id);
        tallyData.splice(i, 1);
      },
      increment: function(id) {
        var i = tallyData.findIndex(obj => obj._id === id);
        tallyData[i].tallies[tallyData[i].tallies.length - 1].tally++;
        $http.put('/api/tallies/increment', {tallyId: id});
      },
      decrement: function(id) {
        var i = tallyData.findIndex(obj => obj._id === id);
        var tally = tallyData[i].tallies[tallyData[i].tallies.length - 1].tally;
        if (tally > 0) {
          tallyData[i].tallies[tallyData[i].tallies.length - 1].tally--;
          $http.put('/api/tallies/decrement', {tallyId: id});
        }
      }
    };

    return factory;
  }])

  .factory('colorFactory', [function() {
    var colors = ['color-red', 'color-yellow', 'color-green', 'color-seafoam', 'color-lightblue', 'color-blue', 'color-purple', 'color-pink', 'color-darkpink'];

    var factory = {
      getColors: function() {
        return colors;
      }
    };

    return factory;
  }])

  .factory('timerFactory', ['$interval', 'tallyDataFactory', function($interval, tallyDataFactory) {
    var timer;
    var time = 25 * 60;
    var pauseTime = null;
    var timePushed = false;

    var factory = {
      startTimer: function(vm, id) {
        var now = Date.now() / 1000;
        var then = now + time;

        if (!timePushed) {
          timePushed = true;

          timer = $interval(() => {
            var secondsLeft = Math.round(then - (Date.now() / 1000));
            var mins = Math.floor(secondsLeft / 60);
            var secs = secondsLeft % 60 >= 10 ? secondsLeft % 60 : '0' + (secondsLeft % 60);

            vm.timeLeft = `${mins}:${secs}`;
            pauseTime = secondsLeft;

            if (secondsLeft < 1) {
              $interval.cancel(timer);
              vm.timeLeft = '25:00';
              tallyDataFactory.increment(id);
              factory.resetTime();
              timePushed = false;
            }
          }, 1000);
        }
      },
      stopTimer: function(vm) {
        if (vm) {
          vm.timeLeft = '25:00';
        }

        $interval.cancel(timer);
        factory.resetTime();
        timePushed = false;
      },
      pauseTimer: function() {
        if (pauseTime) {
          $interval.cancel(timer);
          time = pauseTime;
          timePushed = false;
        }
      },
      resetTime: function() {
        time = 25 * 60;
        pauseTime = null;
      }
    };

    return factory;
  }])

  .factory('taskDataFactory', ['$http', function($http) {
    var dateRange = {
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      month: [],
      year: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    };

    var factory = {
      getRange: function(range, id) {
        var url = `/api/tallies/${range}/${id}`;
        return $http.get(url);
      },
      getDateRange: function(range) {
        if (range.toLowerCase() === 'month') {
          var now = new Date();
          var last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          var daysInMonth = last.getDate();

          for (var i = 1; i <= daysInMonth; i += 6) {
            var date = `${now.getMonth() + 1}/${i}`;
            dateRange.month.push(date);
          }
        }

        return dateRange[range.toLowerCase()];
      },
      buildBars: function(range, tallies) {
        // var height = barsDiv.offsetHeight;
        // var width = (barsDiv.offsetWidth / tallies.length) * 0.90;
        // var max = Math.max.apply(Math, tallies);
        // var unitSize = height / max;
        //
        // {
        //   tally: 10,
        //   height: '100px',
        //   width: '25px'
        // }
        if(range === 'month') {

        }
      }
    };

    return factory;
  }]);
})();

// factory for charts
// var with the week
// var with the data
// get height function which matches the day with something in the data to get the heihgt
// get tally funcion which matches the day with the tally to get the right data
