angular.module('prettyBitnzApp').service('BitNZAuth', function ($log, $rootScope, BitNZ, PubSub, $timeout) {
  'use strict';
 
 	var service = this;

 	service.login = function(username, key, secret, success, error){

 		service.login_with_attempt(0, username, key, secret, success, error);
 	}

 	service.login_with_attempt = function(attempt, username, key, secret, success, error){ 		

 		BitNZ.authorize(username, key, secret);
    BitNZ.balance().success(function(data){
      $log.log(data);
      if (!data.hasOwnProperty('result')) {
        $rootScope.authorized = true;	          
        PubSub.Publish('Authorized');
        success();	          

      } else {
      	if (attempt < 3){	      			
      		console.log("Authentication failed. Trying again", attempt);
      		$timeout(function(){
      			service.login_with_attempt(attempt + 1, username, key, secret, success, error);
      		}, 500);
    			return 
    		}
        error(data.message);
      }
    }).error(function(){	      	
    	if (attempt < 3){	      		
    		console.log("Authentication failed. Trying again", attempt);	      		
    		$timeout(function(){
    			service.login_with_attempt(attempt + 1, username, key, secret, success, error);
    		}, 500);
    	}
      error();
    });
 	}
	
});