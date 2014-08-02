'use strict';

angular.module('prettyBitnzApp')
  .controller('SettingsCtrl', ['$scope', '$rootScope', '$log', 'BitNZ', 'PubSub', function($scope, $rootScope, $log, bitnz, PubSub){
    $scope.username = '';
    $scope.key = '';
    $scope.secret = '';
    
    $rootScope.authorized = false;
    $scope.authError = false;
    $scope.errorMessage = '';

    $scope.Authorize = function() {
      bitnz.authorize($scope.username, $scope.key, $scope.secret);
      bitnz.balance().success(function(data){
        $log.log(data);
        if (!data.hasOwnProperty('result')) {
          $rootScope.authorized = true;
          $scope.authError = false;
          PubSub.Publish('Authorized');
        } else {
          $scope.authError = true;
          $scope.errorMessage = data.message;
        }
      }).error(function(){
        $scope.authError = true;
      });
    };
  }]);