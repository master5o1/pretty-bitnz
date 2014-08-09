'use strict';

angular.module('prettyBitnzApp')
  .controller('TickerCtrl', ['$scope', '$rootScope', '$interval', '$log', 'Money', 'BitNZ', function($scope, $rootScope, $interval, $log, Money, bitnz){
    $scope.ticker = {};    

    var controller = this;
   
    var interval = null;
    controller.failed_loads = 0;
   
    controller.load = function(){
      $log.info('run');
      bitnz.ticker().success(function(data){
        controller.failed_loads = 0;
        $log.log('ticker', data);
        $rootScope.ticker = data;
        $scope.ticker = data;
        $rootScope.current_nzd_price = data.last;
      }).error(function(data){
        controller.failed_loads++;
        $log.error('ticker', data);

        if (controller.failed_loads > 20){
          controller.stop();
        } else {
          controller.load();
        }
      });
    };

    $scope.start = function(){
      controller.load();
      interval = $interval(controller.load, 60 * 1000);
    };

    controller.stop = function() {
      if (angular.isDefined(interval)) {
        $interval.cancel(interval);
        interval = undefined;
      }
    };

    $scope.reload = function() {
      controller.stop();
      $scope.start();
    };
  }]);