(function() {
  angular.module('tally25')

  .factory('authFactory', ['$q', '$http', function($q, $http) {
    let showingForm = 'login';
    let user = null;

    const factory = {
      // control which form should be shown or hidden when clicking the login button
      getForm: function() {
        return showingForm;
      },
      setForm: function(form) {
        showingForm = form;
      },
      isLoggedIn: function() {
        if (user) {
          return true;
        }

        return false;
      },
      getUserStatus: function() {
        return $http.get('/api/userstatus')
          .then(data => {
            user = data.data.status;
          })
          .catch(() => {
            user = false;
          });
      },
      register: function(username, password) {
        const deferred = $q.defer();

        $http.post('/api/register', {username: username, password: password})
          .then(data => {
            if (data.status === 200 && data.status) {
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject({message: 'Something went wrong'});
            }
          })
          .catch(err => {
            user = false;
            deferred.reject({message: err.data.error});
          });

        return deferred.promise;
      },
      login: function(username, password) {
        const deferred = $q.defer();

        $http.post('/api/login', {username: username, password: password})
          .then(data => {
            if (data.status === 200 && data.status) {
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject({message: 'Something went wrong with the login'});
            }
          })
          .catch(err => {
            user = false;
            deferred.reject({message: err.data.error});
          });

        return deferred.promise;
      },
      logout: function() {
        const deferred = $q.defer();

        $http.get('/api/logout')
          .then(() => {
            user = false;
            deferred.resolve();
          })
          .catch(() => {
            user = true;
            deferred.reject();
          });

        return deferred.promise;
      }
    };

    return factory;
  }]);
})();
