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
      .when('/settings', {
        templateUrl: 'settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
