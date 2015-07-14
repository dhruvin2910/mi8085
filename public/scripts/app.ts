///<reference path="../../typings/angularjs/angular.d.ts"/>

module mi8085App {

  angular.module('mi8085App', [
    'ngRoute'
  ]).
    config(function ($routeProvider) {

      $routeProvider
        .when('/', {
          redirectTo: 'dashboard'
        })
        .when('/dashboard', {
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
        })
        .otherwise({
          redirectTo: '/'
        })

    });

}