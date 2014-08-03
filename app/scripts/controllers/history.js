'use strict';

angular.module('prettyBitnzApp')
  .controller('HistoryCtrl', function($scope, $rootScope, $interval, $log, BitNZ, PubSub, notify){
    
    var interval = null;
    var pageSize = 10;

    $scope.closed_buys = [];
    $scope.closed_sells = [];
    $scope.paged_closed_buys = [];
    $scope.paged_closed_sells = [];
    $scope.bids_current_page = 0;
    $scope.bids_max_page = 0;
    $scope.asks_current_page = 0;
    $scope.asks_max_page = 0;

    $scope.last_buy_check = null;
    $scope.last_ask_check = null;

    var load = function(){
      $log.log('load history');
      if (!$rootScope.authorized) {
        return;
      }
      BitNZ.orders_buy_closed(0, 0).success(function(data){
        $log.log('load history buys');
        $scope.closed_buys = process(data);        
        $scope.change_page('bids', 0);     
        $scope.last_buy_check = new moment();
    
      }).error(function(data){
        $scope.Stop();
      });

      BitNZ.orders_sell_closed(0, 0).success(function(data){
        $log.log('load history sells');
        $scope.closed_sells = process(data);        
        $scope.change_page('asks', 0);
        $scope.last_sell_check = new moment();
      }).error(function(data){
        $scope.Stop();
      });
    };

    var notify_new_order = function(order, type){
      var date = moment.unix(order.date);
      notify("Order fulfilled: Amount: " + order.amount + " at $" + order.price + " " + date.humanize());
    };

    var process = function(data, type){      

      var date_to_compare = type == 'bids' ? $scope.last_buy_check : $scope.last_ask_check;

      (data || []).sort(function(a, b){ return b.date - a.date });
      var orders = [];
      for (var i = 0; i < data.length; i++) {

        var order_date = moment.unix(data[i].date);


        if (date_to_compare !== null && order_date > date_to_compare){
          notify_new_order(data[i], type);
        }

        var order = {
          price: data[i].price,
          volume: data[i].amount,
          date_formatted: order_date.format("DD MMM h:mm a"),
          id: data[i].id
        };
        orders.push(order);
      }
      return orders;
    };    

    var start = function() {
      load();
      interval = $interval(load, 60 * 1000);
    };

    var stop = function() {
      if (angular.isDefined(interval)) {
        $interval.cancel(interval);
        interval = undefined;
      }
    };

    var reload = function() {
      stop();
      start();
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

      var orders_to_filter = (type == 'asks') ? $scope.closed_sells : $scope.closed_buys;
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
        $scope.paged_closed_sells = orders_to_filter.slice(start, start + pagesize);
      } else {
        $scope.paged_closed_buys = orders_to_filter.slice(start, start + pagesize);
      }

    }

    $scope.Reload = reload;
    $scope.Start = start;
    $scope.Stop = stop;

    start();
    PubSub.Subscribe('Authorized', reload);
  });

