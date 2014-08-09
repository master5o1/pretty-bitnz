'use strict';

angular.module('prettyBitnzApp')
  .controller('BalanceCtrl', function($scope, $rootScope, $log, $interval, BitNZ, PubSub){
    var interval = null;
    
    $rootScope.balance = {};
    $scope.haveBalance = false;
      
    var load = function(){
      BitNZ.balance().success(function(data){
        $scope.haveBalance = true;
        if (!data.hasOwnProperty('result')) {
          $log.log('balance', data);
          $rootScope.balance = data;
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

    var update = function(){
      stop();
      start();
    };

    $scope.Load = load;
    PubSub.Subscribe('Authorized', start);
    PubSub.Subscribe('Update', update);

  });