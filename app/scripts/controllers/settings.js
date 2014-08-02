'use strict';

angular.module('prettyBitnzApp')
  .controller('SettingsCtrl', function($scope, $rootScope, $log, BitNZAuth, PubSub, KeyStore){
    
    $scope.authError = false;
    $scope.errorMessage = '';

    $scope.username = '';
    $scope.key = '';
    $scope.secret = '';

    $scope.Authorize = function() {
      BitNZAuth.login($scope.username, $scope.key, $scope.secret, function(){
        $scope.authError = false;
        if ($scope.password){
          KeyStore.save_keys($scope.username, $scope.key, $scope.secret, $scope.password);
        }
      }, function(error){
        $rootScope.authorized = false;
        $scope.authError = true;
        $scope.errorMessage = error;
      })
    };    
  });
