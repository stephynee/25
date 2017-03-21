(function() {
  angular.module('tally25')

  .factory('colorFactory', [function() {
    const colors = ['color-red', 'color-yellow', 'color-green', 'color-seafoam', 'color-lightblue', 'color-blue', 'color-purple', 'color-pink', 'color-darkpink'];

    const factory = {
      getColors: function() {
        return colors;
      }
    };

    return factory;
  }])

  .factory('timerFactory', ['$interval', 'tallyDataFactory', function($interval, tallyDataFactory) {
    let timer;
    let time = 25 * 60;
    let pauseTime = null;
    let timePushed = false;
    let audio = new Audio('/music_marimba_chord.wav');

    const factory = {
      startTimer: function(vm, id) {
        let now = Date.now() / 1000;
        let then = now + time;
        
        if(!timePushed) {
          timePushed = true;

          timer = $interval(() => {
            let secondsLeft = Math.round(then - (Date.now() / 1000));
            let mins = Math.floor(secondsLeft / 60);
            let secs = secondsLeft % 60 >= 10 ? secondsLeft % 60 : '0' + (secondsLeft % 60);

            vm.timeLeft = `${mins}:${secs}`;
            pauseTime = secondsLeft;

            if(secondsLeft < 1) {
              audio.play();
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
        if(vm) {
          vm.timeLeft = '25:00';
        }

        $interval.cancel(timer);
        factory.resetTime();
        timePushed = false;
      },
      pauseTimer: function() {
        if(pauseTime) {
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
