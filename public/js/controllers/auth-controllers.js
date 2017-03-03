(function() {
  angular.module('tally25')

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
  }]);
})();
