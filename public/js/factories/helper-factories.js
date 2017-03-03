(function() {
  angular.module('tally25')

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
  }]);
})();
