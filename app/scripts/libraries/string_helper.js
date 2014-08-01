
angular.module('prettyBitnzApp').service('String_helper', function ($http, $log) {
	'use strict';

	var service = this;

	service.pad_string = function pad(width, string, padding) { 
		return (width <= string.length) ? string : service.pad_string(width, string + padding, padding)
	}
});
