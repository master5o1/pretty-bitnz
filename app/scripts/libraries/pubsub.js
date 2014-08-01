


angular.module('prettyBitnzApp').service('PubSub', function ($http, $log) {
  'use strict';

  var service = this;
  var events = {};

  service.Subscribe = function(event, handler){
    if (typeof events[event] === 'undefined') {
      events[event] = [];
    }
    events[event].push(handler);
  };

  service.Publish = function(event){
    var args = [].slice.call(arguments, 1);
    if (typeof events[event] === 'undefined') {
      return;
    }
    for (var i = 0; i < events[event].length; i++) {
      events[event][i](args);
    }
  };
});
