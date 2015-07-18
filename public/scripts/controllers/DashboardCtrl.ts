///<reference path="../../../typings/angularjs/angular.d.ts"/>

module DashboardCtrl {

  angular.module('mi8085App')
    .controller('DashboardCtrl', function ($scope, $http) {
      $scope.data = {
        instructions: []
      };

      $http.get('/api/mnemonics')
        .success(function (response) {
          $scope.data.instructions = response;
        })
        .error(function (response) {
          alert(response || 'Something went wrong.');
        });

      $scope.underscoredMnemonic = function (spacedMnemonic) {
        return spacedMnemonic.replace(/ /, '_');
      };

    });

}