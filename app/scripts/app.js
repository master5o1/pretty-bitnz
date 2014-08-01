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
      .when('/trade', {
        templateUrl: 'trade.html',
        controller: 'TradeCtrl'
      })
      .when('/history', {
        templateUrl: 'history.html',
        controller: 'HistoryCtrl'
      })
      .when('/settings', {
        templateUrl: 'settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/help', {
        templateUrl: 'help.html',
        controller: 'HelpCtrl'
      })
      .when('/about', {
        templateUrl: 'about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
