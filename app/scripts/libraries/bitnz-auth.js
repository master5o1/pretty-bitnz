angular.module('prettyBitnzApp').service('BitNZAuth', function ($log, $rootScope, BitNZ, PubSub) {
  'use strict';
 
 	var service = this;

 	service.login = function(username, key, secret, success, error){
 		BitNZ.authorize(username, key, secret);
	      BitNZ.balance().success(function(data){
	        $log.log(data);
	        if (!data.hasOwnProperty('result')) {
	          $rootScope.authorized = true;	          
	          PubSub.Publish('Authorized');
	          success();	          

	        } else {
	          error(data.message);
	        }
	      }).error(function(){
	        error();
	      });
 	}


	
});