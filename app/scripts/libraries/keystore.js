angular.module('prettyBitnzApp').factory('EncryptService', [function() {
    return EncryptedLocalStorage;
}]);

angular.module('prettyBitnzApp').service('KeyStore', function ($log, EncryptService) {
  'use strict';
  	var service = this;
  	service.salt = 'Fouu~K9L8GHytyIOLZQaJCTofj{rALh';

  	service.retrieve_keys = function(password){


  		// Initialization
 	     var els = new EncryptService(password + service.salt);
         var key = 'api_keys';
 
	    // Get the current text and encrypted text from localstorage (if any).
	    try {
    		var decrypted_text = els.get(key);    		
    		return JSON.parse(decrypted_text);	
		}
		catch(err) {
		    console.log("could not get decrypted_text", err);
		    return false;
		}
	    
	    return false;
	};

	service.save_keys = function(username, api_key, secret, password)
	{
		var key_object = {
			username  : username,
			api_key   : api_key,
			secret    : secret
		};

		var els = new EncryptService(password + service.salt);		

        // Update local storage key
        els.set('api_keys', JSON.stringify(key_object));
        localStorage.setItem('username', username);
       
	}

	
});