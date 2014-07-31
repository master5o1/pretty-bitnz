'use strict';

/**
 * @ngdoc overview
 * @name prettyBitnzApp
 * @description
 * # prettyBitnzApp
 *
 * Main module of the application.
 */
angular
  .module('prettyBitnzApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
