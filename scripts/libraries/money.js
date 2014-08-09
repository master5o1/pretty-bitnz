
angular.module('prettyBitnzApp').service('Money', function ($http, $log) {
	'use strict';

	var service = this;

	service.pad = function(number, decimal_places, d, t){
		number = parseFloat(number);
	    var decimal_places = isNaN(decimal_places = Math.abs(decimal_places)) ? 2 : decimal_places, 
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = number < 0 ? "-" : "", 
	    i = parseInt(number = Math.abs(+number || 0).toFixed(decimal_places)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (decimal_places ? d + Math.abs(number - i).toFixed(decimal_places).slice(2) : "");
	};

	service.format = function(number){
		return "$" + service.pad(number);
	}
});
