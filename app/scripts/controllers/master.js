'use strict';

/**
 * @ngdoc function
 * @name prettyBitnzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the prettyBitnzApp
 */
angular.module('prettyBitnzApp').controller('MasterCtrl', function ($scope, $rootScope) {    	  	

	var controller = this;
	controller.init = function(){
		$rootScope.username = localStorage.getItem('username');
	}

    $scope.side_bar_toggled = false;


    
    $scope.show_side_bar = function(){    	
    	$scope.side_bar_toggled = ! $scope.side_bar_toggled;
    }

    controller.init();

  });
