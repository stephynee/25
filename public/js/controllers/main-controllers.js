(function() {
  angular.module('tally25')

  .controller('headerCtrl', ['$rootScope', 'authFactory', function($rootScope, authFactory) {
    const vm = this;

    vm.addTally = function() {
      if (authFactory.isLoggedIn()) {
        $rootScope.$broadcast('addTally');
      }
    };
  }])

  .controller('tallyCtrl', ['tallyFactory', 'tallyDataFactory', '$rootScope', 'authFactory', function(tallyFactory, tallyDataFactory, $rootScope, authFactory) {
    var vm = this;

    function populateData() {
      tallyFactory.getTallies().then(data => {
        tallyDataFactory.setTallyData(data.data);
        vm.data = tallyDataFactory.getTallyData();
        vm.showMessage = false;

        if (vm.data.length < 1) {
          vm.showMessage = true;
          vm.message = 'Click the plus to add a task.';
        }
      });
    }

    authFactory.getUserStatus().then(() => {
      if (authFactory.isLoggedIn()) {
        populateData();
      } else {
        vm.message = 'Please login or register to track tasks.';
        vm.showMessage = true;
      }
    });

    $rootScope.$on('loggedIn', populateData);
    $rootScope.$on('loggedOut', () => {
      vm.data = [];
      vm.message = 'Please login or register to track tasks.';
      vm.showMessage = true;
    });
  }]);
})();
