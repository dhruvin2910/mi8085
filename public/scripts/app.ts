///<reference path="../../typings/angularjs/angular.d.ts"/>

module mi8085App {

  angular.module('mi8085App', [
    'ngRoute'
  ]).
    config(function ($routeProvider) {

      $routeProvider
        .when('/dashboard', {
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
        })
        .when('/view-instruction/:underScoredMnemonic', {
          templateUrl: 'views/view-instruction.html',
          controller: 'ViewInstructionCtrl'
        })
        .otherwise({
          redirectTo: '/dashboard'
        })

    });

}