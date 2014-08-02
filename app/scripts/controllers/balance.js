'use strict';

angular.module('prettyBitnzApp')
  .controller('BalanceCtrl', ['$scope', '$log', '$interval', 'BitNZ', 'PubSub', function($scope, $log, $interval, bitnz, PubSub){
    var interval = null;
    
    $scope.balance = {};
    $scope.haveBalance = false;
      
    var load = function(){
      bitnz.balance().success(function(data){
        $scope.haveBalance = true;
        if (!data.hasOwnProperty('result')) {
          $log.log('balance', data);
          $scope.balance = data;
          $scope.haveBalance = true;
        } else {
          stop();
        }
      }).error(function(data){
        stop();
        $scope.haveBalance = false;
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