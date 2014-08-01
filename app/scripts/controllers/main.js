'use strict';

/**
 * @ngdoc function
 * @name prettyBitnzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the prettyBitnzApp
 */
angular.module('prettyBitnzApp')
  .controller('MainCtrl', function ($scope, $log, BitNZ, Money, String_helper) {  		

  		var t = this;

	    $scope.bids_current_page = 0;
	    $scope.asks_current_page = 0;
	    $scope.bids_max_page = 1;
	    $scope.asks_max_page = 1;
	    $scope.bids = [];
	    $scope.asks = [];
	    $scope.last_price = "Loading...";
      	$scope.ask_price = "Loading...";
      	$scope.bid_price = "Loading...";
      	$scope.active_tab = 'buy';
      	$scope.new_order = {}

  		t.init = function(){
  			BitNZ.ticker().success(function(data, status){
		      	$scope.last_price = data.last;
		      	$scope.ask_price = data.ask;
		      	$scope.bid_price = data.bid;
		    });

		  	BitNZ.orderbook().success(function(data, status){
		  		console.log('orders', data);
		  		$scope.bids = t.group_orders(data.bids);
		  		$scope.asks = t.group_orders(data.asks);

		  		$scope.change_page('bids', 0);
		  		$scope.change_page('asks', 0);
		  	});

  		};

      t.group_orders = function(orders){        
        var unique_prices = {};

        for (var i = orders.length - 1; i >= 0; i--){
          var rounded_rate = Money.pad(orders[i][0]);
          var order = {
            rate : orders[i][0],            
            amount : orders[i][1]
          };

          if (typeof unique_prices[rounded_rate] === 'undefined'){
            unique_prices[rounded_rate] = {
              orders : [order],
              rate : rounded_rate,
              volume : order.amount,
              order_description : String_helper.pad_string(20, '$' + order.rate, " ") +  'BTC ' + order.amount
            };
            
          } else {
            unique_prices[rounded_rate]['orders'].push(order);
            unique_prices[rounded_rate]['volume'] += order.amount;
            unique_prices[rounded_rate]['order_description'] += '\n' + String_helper.pad_string(20, '$' + order.rate, " ") +  'BTC ' + order.amount;
          }
        };

        var return_array = [];
        for (var key in unique_prices) {
          return_array.push(unique_prices[key]);
        };

        return return_array;
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

  		$scope.switch_tab = function(tab_name){
  			$scope.active_tab = tab_name;
  		}

  		$scope.use_last = function(){
  			$scope.new_order.btc_rate = $scope.last_price;
  		}

  		$scope.use_bid = function(){
  			$scope.new_order.btc_rate = $scope.bid_price;
  		}

  		$scope.use_ask = function(){
  			$scope.new_order.btc_rate = $scope.ask_price;
  		}

  		$scope.use_remaining = function(){
  			$scope.new_order.btc_amount = 0.5;
  		}

  		t.init();
  });
