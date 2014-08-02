'use strict';

angular.module('prettyBitnzApp')
  .controller('TickerCtrl', ['$scope', '$rootScope', '$interval', '$log', 'BitNZ', function($scope, $rootScope, $interval, $log, bitnz){
    $scope.ticker = {};
   
    var interval = null;
   
    var fn = function(){
      $log.info('run');
      bitnz.ticker().success(function(data){
        $log.log('ticker', data);
        $scope.ticker = data;
        $rootScope.current_nzd_price = data.last;
      }).error(function(data){
        $log.error('ticker', data);
        // $scope.Stop();
      });
    };

    $scope.Reload = function() {
      fn();
    };
   
    $scope.Start = function() {
      $log.info('ticker', 'start');
      fn();
      interval = $interval(fn, 60 * 1000);
    };
   
    $scope.Stop = function() {
      $log.info('ticker', 'stop');
      if (angular.isDefined(interval)) {
        $interval.cancel(interval);
        interval = undefined;
      }
    };
  }]);