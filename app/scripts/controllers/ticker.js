'use strict';

angular.module('prettyBitnzApp')
  .controller('TickerCtrl', ['$scope', '$rootScope', '$interval', '$log', 'BitNZ', function($scope, $rootScope, $interval, $log, bitnz){
    $scope.ticker = {};
   
    var interval = null;
   
    var load = function(){
      $log.info('run');
      bitnz.ticker().success(function(data){
        $log.log('ticker', data);
        $scope.ticker = data;
        $rootScope.current_nzd_price = data.last;
      }).error(function(data){
        $log.error('ticker', data);
        $scope.Stop();
      });
    };

    $scope.Reload = function() {
      stop();
      start();
    };
   
    $scope.Start = function() {
      load();
      interval = $interval(load, 60 * 1000);
    };
   
    $scope.Stop = function() {
      if (angular.isDefined(interval)) {
        $interval.cancel(interval);
        interval = undefined;
      }
    };
  }]);