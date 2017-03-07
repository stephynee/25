(function() {
  angular.module('tally25')

  .controller('loginCtrl', ['$rootScope', 'authFactory', function($rootScope, authFactory) {
    const vm = this;

    vm.showing = false;

    vm.login = function() {
      vm.error = false;
      vm.disabled = true;

      authFactory.login(vm.form.username, vm.form.password)
        .then(() => {
          vm.form = {};
          vm.showing = false;
          vm.disabled = false;
          $rootScope.$broadcast('loggedIn');
        })
        .catch(err => {
          vm.form = {};
          vm.error = true;
          vm.disabled = false;
          vm.errorMessage = err.message || 'Something went wrong';
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
    const vm = this;

    vm.showing = false;

    vm.showLogin = function() {
      vm.showing = false;
      authFactory.setForm('login');
      $rootScope.$broadcast('login');
    };

    vm.register = function() {
      vm.error = false;
      vm.disabled = true;

      // validate form
      if (vm.form.password !== vm.form.passwordCheck) {
        vm.error = true;
        vm.disabled = false;
        vm.errorMessage = 'Passwords do not match';
      } else if (!vm.form.username) {
        vm.error = true;
        vm.disabled = false;
        vm.errorMessage = 'Username cannot be empty';
      } else {
        authFactory.register(vm.form.username, vm.form.password)
          .then(() => {
            vm.form = {};
            vm.showing = false;
            vm.disabled = false;
            $rootScope.$broadcast('loggedIn');
          })
          .catch(err => {
            vm.form = {};
            vm.error = true;
            vm.disabled = false;
            vm.errorMessage = err.message || 'Something went wrong';
          });
      }
    };

    $rootScope.$on('register', () => {
      vm.showing = !vm.showing;
    });
  }])

  .controller('authCtrl', ['$rootScope', 'authFactory', function($rootScope, authFactory) {
    const vm = this;
    let loggedIn;

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
