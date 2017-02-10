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

  .factory('tallyDataFactory', [function() {
    var tallyData = [];

    var factory = {
      getToday: function(tallies) {
        var today = tallies[tallies.length - 1].tally < 10 ? '0' + tallies[tallies.length - 1].tally : tallies[tallies.length - 1].tally;
        return today;
      },
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
      increment: function() {

      },
      decrement: function() {

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
  }]);
})();
