'use strict';

angular.module('prettyBitnzApp')
  .controller('BalanceCtrl', ['$scope', '$log', '$interval', 'BitNZ', 'PubSub', function($scope, $log, $interval, bitnz, PubSub){
    var interval = null;
    
    $scope.balance = {};
    $scope.authorized = false;
      
    var load = function(){
      $log.info('run');
      bitnz.balance().success(function(data){
        $scope.authorized = true;
        if (!data.hasOwnProperty('result')) {
          $log.log('balance', data);
          $scope.balance = data;
          $scope.authorized = true;
        } else {
          stop();
        }
      }).error(function(data){
        $log.error('balance', data);
        stop();
        $scope.authorized = false;
      });
    };
   
    var start = function() {
      $log.info('balance', 'start');
      load();
      interval = $interval(load, 60 * 1000);
    };
   
    var stop = function() {
      $log.info('balance', 'stop');
      if (angular.isDefined(interval)) {
        $interval.cancel(interval);
        interval = undefined;
      }
    };

    $scope.Load = load;
    PubSub.Subscribe('Authorized', start);

  }]);