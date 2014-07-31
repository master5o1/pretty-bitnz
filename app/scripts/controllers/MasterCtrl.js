'use strict';

/**
 * @ngdoc function
 * @name prettyBitnzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the prettyBitnzApp
 */
angular.module('prettyBitnzApp')
  .controller('MasterCtrl', function ($scope) {    	
  	console.log('bootstrap master');
    $scope.side_bar_toggled = false;

    $scope.show_side_bar = function(){    	
    	$scope.side_bar_toggled = ! $scope.side_bar_toggled;
    }

  });
