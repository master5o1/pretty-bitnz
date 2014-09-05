
angular.module('prettyBitnzApp').factory('BitNZ', ['$http', '$log', function ($http, $log) {
  'use strict';
  var api = {};
  var host = 'https://bitnz.com/api/0';

  var config = {
    username: '',
    key: '',
    secret: ''
  };
  
  var sign = function(parameters){
    parameters = parameters || {};
    var d = new Date();
    parameters.nonce = d.getTime() + ''+ d.getMilliseconds();
    parameters.key = config.key;
    parameters.signature = CryptoJS.algo.HMAC
                                .create(CryptoJS.algo.SHA256, config.secret)
                                .update(parameters.nonce + config.username + config.key)
                                .finalize()
                                .toString(CryptoJS.enc.Hex)
                                .toUpperCase();
    return parameters;
  };

  var serialize = function(parameters) {
    var params = [];
    Object.keys(parameters).forEach(function(key){
      this.push(key + '=' + parameters[key]);
    }, params);
    return params.join('&');
  };

  var request = function(method, action, parameters){
    var config = {
      method: method,
      url: host + action,
      data: serialize(parameters),
      headers: {}
    };
    if (method === 'GET') {
      config.params = parameters;
    }
    if (method === 'POST') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return $http(config);
  };
 
  var get = function(action, parameters){
      return request('GET', action, parameters);
  };

  var post = function(action, parameters){
    return request('POST', '/private' + action, sign(parameters));
  };

  // Save keys:
  api.authorize = function(username, key, secret){
    if (username.key !== undefined) {
      key = username.key;
      secret = username.secret;
      username = username.username;
    }
    config = {
      username: username,
      key: key,
      secret: secret
    };
  };

  api.sign = sign;

  // Open/Public API Calls:
  api.ticker = function(){
    return get('/ticker', {});
  };

  api.trades = function(lastTrade, fromDate) {
    return get('/trades', {
      'since': lastTrade || 0,
      'since_date': fromDate || 0
    });
  };

  api.chart = function(fromDate, width, height, background) {
    return host + '/trades_chart?' + serialize({
      'since_date': fromDate || 0,
      'width': width || 600,
      'height': height || 400,
      'bgcolor': background || ''
    });
  };

  api.orderbook = function(group) {
    return get('/orderbook', {
      'group': group || 0
    });
  };

  // Private API Calls:

  api.balance = function() {
    return post('/balance', {});
  };

  api.orders_buy_open = function() {
    return post('/orders/buy/open', {});
  };

  api.orders_sell_open = function() {
    return post('/orders/sell/open', {});
  };

  api.orders_buy_closed = function(offset, limit) {
    return post('/orders/buy/closed', {
      offset: offset || 0,
      limit: limit || 0
    });
  };

  api.orders_sell_closed = function(offset, limit) {
    return post('/orders/sell/closed', {
      offset: offset || 0,
      limit: limit || 0
    });
  };

  api.orders_buy_cancel = function(id) {
    return post('/orders/buy/cancel', {
      id: id
    });
  };

  api.orders_sell_cancel = function(id) {
    return post('/orders/sell/cancel', {
      id: id
    });
  };

  api.orders_buy_create = function(amount, price) {
    return post('/orders/buy/create', {
      amount: amount,
      price: price
    });
  };

  api.orders_sell_create = function(amount, price) {
    return post('/orders/sell/create', {
      amount: amount,
      price: price
    });
  };

  api.btc_deposit_address = function() {
    return post('/btc/address', {});
  };

  api.btc_withdraw = function(address, amount) {
    return post('/btc/withdraw', {
      address: address,
      amount: amount
    });
  };

  return api;
}]);
