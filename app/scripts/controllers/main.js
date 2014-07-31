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

  		var t = this;

	    $scope.bids_current_page = 0;
	    $scope.asks_current_page = 0;
	    $scope.bids_max_page = 1;
	    $scope.asks_max_page = 1;
	    $scope.bids = [];
	    $scope.asks = [];
	    $scope.last_price = "Loading...";
      	$scope.ask_price = "Loading...";
      	$scope.buy_price = "Loading...";

  		t.init = function(){
  			BitNZ.ticker().success(function(data, status){
		      	$scope.last_price = data.last;
		      	$scope.ask_price = data.ask;
		      	$scope.buy_price = data.bid;
		    });

		  	BitNZ.orderbook().success(function(data, status){
		  		console.log('orders', data);
		  		$scope.bids = data.bids.reverse();
		  		$scope.asks = data.asks.reverse();

		  		$scope.change_page('bids', 0);
		  		$scope.change_page('asks', 0);
		  	});

  		};

  		$scope.next_page = function(type){
  			var current_page = (type === 'asks') ? $scope.asks_current_page : $scope.bids_current_page;
  			$scope.change_page(type, current_page + 1);
  		}

  		$scope.prev_page = function(type){  			
  			var current_page = type === 'asks' ? $scope.asks_current_page : $scope.bids_current_page;
  			$scope.change_page(type, current_page - 1);  		
  		}  		

  		$scope.change_page = function(type, page){

  			var orders_to_filter = (type == 'asks') ? $scope.asks : $scope.bids;
  			var pagesize = 8;  			
  			var max_page = Math.floor(orders_to_filter.length / pagesize);

  			var page_to_move_to = Math.max(page, 0);
  			page_to_move_to = Math.min(page_to_move_to, max_page);  		

  			var current_page;
  			if (type == 'asks'){
  				current_page = $scope.asks_current_page;
  				$scope.asks_current_page = page_to_move_to;
  				$scope.asks_max_page = max_page;
  			} else {
  				current_page = $scope.bids_current_page;
  				$scope.bids_current_page = page_to_move_to;
  				$scope.bids_max_page = max_page;
  			}

  			
  			var start = page_to_move_to * pagesize;

  			if (type == 'asks'){  				
  				$scope.paged_asks = orders_to_filter.slice(start, start + pagesize);
  			} else {
  				$scope.paged_bids = orders_to_filter.slice(start, start + pagesize);
  			}
  			
  		}



  		t.init();
  });
