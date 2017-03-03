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

  .factory('tallyDataFactory', ['$http', '$rootScope', function($http, $rootScope) {
    let tallyData = [];

    const factory = {
      getTallyData: function() {
        return tallyData;
      },
      setTallyData: function(tallies) {
        tallyData = tallies;
      },
      pushNew: function(tally) {
        tallyData.push(tally);

        if (tallyData.length === 1) {
          $rootScope.$broadcast('taskAdded');
        }
      },
      editTally: function(tally) {
        const i = tallyData.findIndex(obj => obj._id === tally._id);

        tallyData.splice(i, 1, tally);
      },
      deleteTally: function(id) {
        const i = tallyData.findIndex(obj => obj._id === id);

        tallyData.splice(i, 1);

        if (tallyData.length === 0) {
          $rootScope.$broadcast('taskDeleted');
        }
      },
      increment: function(id) {
        const i = tallyData.findIndex(obj => obj._id === id);

        tallyData[i].tallies[tallyData[i].tallies.length - 1].tally++;
        $http.put('/api/tallies/increment', {tallyId: id});
      },
      decrement: function(id) {
        const i = tallyData.findIndex(obj => obj._id === id);
        const tally = tallyData[i].tallies[tallyData[i].tallies.length - 1].tally;

        if (tally > 0) {
          tallyData[i].tallies[tallyData[i].tallies.length - 1].tally--;
          $http.put('/api/tallies/decrement', {tallyId: id});
        }
      }
    };

    return factory;
  }])

  .factory('taskDataFactory', ['$http', function($http) {
    let dateRange = {
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      year: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    };
    let rangeWidth = null;

    const factory = {
      getRange: function(range, id) {
        var url = `/api/tallies/${range}/${id}`;

        return $http.get(url);
      },
      getDateRange: function(range) {
        if (range.toLowerCase() === 'month') {
          const now = new Date();
          const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          const daysInMonth = last.getDate();

          dateRange.month = [];

          for (var i = 1; i <= daysInMonth; i += 6) {
            let date = `${now.getMonth() + 1}/${i}`;
            dateRange.month.push(date);
          }
        }

        return dateRange[range.toLowerCase()];
      },
      getRangeWidth: function() {
        return rangeWidth;
      },
      buildBars: function(tallies) {
        const barData = tallies;
        const height = document.querySelector('.bars').offsetHeight;
        const width = (document.querySelector('.bars').offsetHeight / tallies.length) * 0.90;
        const max = Math.max.apply(Math, tallies.map(tally => tally.tally));
        const unitSize = height / max;

        // set date range width to match bar width
        if (tallies.length < 13) {
          rangeWidth = `${width}px`;
        } else {
          // fix
          rangeWidth = `${width * 6}px`;
        }

        barData.forEach(bar => {
          bar.height = `${(unitSize * bar.tally) * 0.95}px`;
          bar.width = `${width}px`;
        });

        return barData;
      }
    };

    return factory;
  }]);
})();
