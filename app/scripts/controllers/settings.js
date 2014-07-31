'use strict';

angular.module('prettyBitnzApp')
  .controller('SettingsCtrl', ['$scope', '$log', 'BitNZ', function($scope, $log, bitnz){
    $scope.username = '';
    $scope.key = '';
    $scope.secret = '';
    
    $scope.authorized = false;
    $scope.authError = false;
    $scope.errorMessage = '';

    $scope.Authorize = function() {
      bitnz.authorize($scope.username, $scope.key, $scope.secret);
      bitnz.balance().success(function(data){
        $log.log(data);
        if (!data.hasOwnProperty('result')) {
          $scope.authorized = true;
          $scope.authError = false;
        } else {
          $scope.authError = true;
          $scope.errorMessage = data.message;
        }
      }).error(function(){
        $scope.authError = true;
      });
    };
  }]);