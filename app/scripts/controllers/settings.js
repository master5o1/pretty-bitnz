'use strict';

angular.module('prettyBitnzApp')
  .controller('Configuration', ['$scope', '$log', 'BitNZ', function($scope, $log, bitnz){
    $scope.username = '';
    $scope.key = '';
    $scope.secret = '';
    
    $scope.authorized = false;
    $scope.authError = false;

    $scope.Authorize = function() {
      bitnz.authorize($scope.username, $scope.key, $scope.secret);
      bitnz.balance().success(function(data){
        $scope.authorized = true;
        $scope.authError = false;
      }).error(function(){
        $scope.authError = true;
      });
    };
  }]);