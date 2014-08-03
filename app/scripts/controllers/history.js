'use strict';

angular.module('prettyBitnzApp')
  .controller('HistoryCtrl', function($scope, $rootScope, $interval, $log, BitNZ, PubSub){
    
    var interval = null;
    var pageSize = 10;

    $scope.closed_buys = [];
    $scope.closed_sells = [];
    $scope.paged_closed_buys = [];
    $scope.paged_closed_sells = [];
    $scope.closed_buys_current_page = 0;
    $scope.closed_buys_max_page = 1;
    $scope.closed_sells_current_page = 0;
    $scope.closed_sells_max_page = 1;

    var load = function(){
      $log.log('load history');
      if (!$rootScope.authorized) {
        return;
      }
      BitNZ.orders_buy_closed(0, 0).success(function(data){
        $log.log('load history buys');
        $scope.closed_buys = process(data);
        $scope.closed_buys_max_page = Math.round($scope.closed_buys.length / pageSize);
        $scope.paged_closed_buys = page($scope.closed_buys, $scope.closed_buys_current_page, pageSize);
      }).error(function(data){
        $scope.Stop();
      });

      BitNZ.orders_sell_closed(0, 0).success(function(data){
        $log.log('load history sells');
        $scope.closed_sells = process(data);
        $scope.closed_sells_max_page = Math.round($scope.closed_sells.length / pageSize);
        $scope.paged_closed_sells = page($scope.closed_sells, $scope.closed_buys_current_page, pageSize);
      }).error(function(data){
        $scope.Stop();
      });
    };

    var process = function(data){
      (data || []).sort(function(a, b){ return b.date - a.date });
      var orders = [];
      for (var i = 0; i < data.length; i++) {
        var order = {
          price: data[i].price,
          volume: data[i].amount,
          date: fromSeconds(data[i].date),
          id: data[i].id
        };
        orders.push(order);
      }
      return orders;
    };

    var fromSeconds = function(seconds) {
      var t = new Date(1970,0,1);
      t.setSeconds(seconds);
      return t;
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

    var page = function(arr, page, size){
      return arr.slice(0, size);
    };

    $scope.prev_page = function(type){
 
    };
    $scope.next_page = function(type){
 
    };

    $scope.Reload = reload;
    $scope.Start = start;
    $scope.Stop = stop;

    start();
    PubSub.Subscribe('Authorized', reload);
  });