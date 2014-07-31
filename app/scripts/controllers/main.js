'use strict';

/**
 * @ngdoc function
 * @name prettyBitnzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the prettyBitnzApp
 */
angular.module('prettyBitnzApp')
  .controller('MainCtrl', function ($scope, $log, BitNZ, Money) {  	
	  	BitNZ.ticker().success(function(data, status){
	      	$scope.last_price = Money.format(data.last);
	      	$scope.ask_price = Money.format(data.ask);
	      	$scope.buy_price = Money.format(data.bid);
	    });


	  	BitNZ.orderbook().success(function(data, status){
	  		console.log('orders', data);
	  		$scope.bids = data.bids.reverse();
	  		$scope.asks = data.asks.reverse();
	  	});	    
  });
