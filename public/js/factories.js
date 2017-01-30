app.factory('tallyFactory', ['$http', function($http) {
  var factory = {
    getTallies: function() {
      return $http.get('/api/tallies');
    }
  }

  return factory;
}]);
