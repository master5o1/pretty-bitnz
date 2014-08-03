'use strict';

/**
 * @ngdoc function
 * @name prettyBitnzApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the prettyBitnzApp
 */
angular.module('prettyBitnzApp')
  .controller('MainCtrl', function ($scope, $rootScope, $log, BitNZ, BitNZAuth, Money, String_helper, KeyStore, ngDialog, PubSub) {     

      var controller = this;

      $scope.bids_current_page = 0;
      $scope.asks_current_page = 0;
      $scope.bids_max_page = 1;
      $scope.asks_max_page = 1;
      $scope.bids = [];
      $scope.asks = [];
      $scope.last_price = "Loading...";
      $scope.ask_price = "Loading...";
      $scope.bid_price = "Loading...";
      $scope.active_tab = 'buy';
      $scope.new_order = {
        btc_rate : '',
        btc_amount : '',
        is_buy : true
      }

      $scope.active_order_tab = 'order_book';

      controller.init = function(){

        // check if we have some keys
        $scope.show_password_field = localStorage.getItem('api_keys') != null;        
        console.log('pw', $scope.show_password_field);

        BitNZ.ticker().success(function(data, status){
            $scope.last_price = data.last;
            $scope.ask_price = data.ask;
            $scope.bid_price = data.bid;
        });       

        var a_week_ago = new moment().subtract('days', 14).format("X"); // unix timestamp

        $scope.chart_url = "https://bitnz.com/api/0/trades_chart?width=800&height=500&since_date=" + a_week_ago;

        controller.get_order_book();

        PubSub.Subscribe("update_orders", function(){
          controller.get_order_book();
          controller.get_open_orders();
        });

        PubSub.Subscribe("Authorized", function(){
          controller.get_open_orders();
        })

      };

      controller.get_order_book = function(){
        BitNZ.orderbook().success(function(data, status){
          console.log('orders', data);
          data.bids.sort(function(a, b){ return a[0] - b[0] });
          data.asks.sort(function(a, b){ return b[0] - a[0] });
          $scope.bids = controller.group_orders(data.bids);
          $scope.asks = controller.group_orders(data.asks);

          $scope.change_page('bids', 0);
          $scope.change_page('asks', 0);
        });
      }

      controller.get_open_orders = function(){
        BitNZ.orders_buy_open().success(function(data, status){
          for (var i = data.length - 1; i >= 0; i--) {            
            data[i].date_formatted = new moment.unix(data[i].date).format("DD/MM h:mm a");
          };
          console.log(data);
          $scope.open_buy_orders = data;
        });

        BitNZ.orders_sell_open().success(function(data, status){
          $scope.open_sell_orders = data;
        });
      };

      $scope.unlock = function(){
        
        if (! $scope.unlock.keystore_password){
          alert("Invalid password");
          return;
        }

        var result = KeyStore.retrieve_keys($scope.unlock.keystore_password);
        if (! result){
          alert('invalid password');          
        }
        else
        {
          BitNZAuth.login(result.username, result.api_key, result.secret, function(){
            // logged in
          }, function(error){                        
            alert(error);
          })
        }
      }

      controller.group_orders = function(orders){        
        var unique_prices = {};

        for (var i = orders.length - 1; i >= 0; i--){
          var rounded_rate = Money.pad(orders[i][0]);
          var order = {
            rate : orders[i][0],            
            amount : orders[i][1]
          };

          if (typeof unique_prices[rounded_rate] === 'undefined'){
            unique_prices[rounded_rate] = {
              orders : [order],
              rate : rounded_rate,
              volume : order.amount,
              order_description : String_helper.pad_string(15, '$' + order.rate, " ") +  'BTC ' + order.amount
            };
            
          } else {
            unique_prices[rounded_rate]['orders'].push(order);
            unique_prices[rounded_rate]['volume'] += order.amount;
            unique_prices[rounded_rate]['order_description'] += '\n' + String_helper.pad_string(15, '$' + order.rate, " ") +  'BTC ' + order.amount;
          }
        };

        var return_array = [];
        for (var key in unique_prices) {
          return_array.push(unique_prices[key]);
        };

        return return_array;
      };

      $scope.next_page = function(type){
        var current_page = (type === 'asks') ? $scope.asks_current_page : $scope.bids_current_page;
        $scope.change_page(type, current_page + 1);
      }

      $scope.prev_page = function(type){        
        var current_page = type === 'asks' ? $scope.asks_current_page : $scope.bids_current_page;
        $scope.change_page(type, current_page - 1);     
      }     

      $scope.change_page = function(type, page){

        var orders_to_filter = (type == 'asks') ? $scope.asks : $scope.bids;
        var pagesize = 8;       
        var max_page = Math.floor(orders_to_filter.length / pagesize);

        var page_to_move_to = Math.max(page, 0);
        page_to_move_to = Math.min(page_to_move_to, max_page);      

        var current_page;
        if (type == 'asks'){
          current_page = $scope.asks_current_page;
          $scope.asks_current_page = page_to_move_to;
          $scope.asks_max_page = max_page;
        } else {
          current_page = $scope.bids_current_page;
          $scope.bids_current_page = page_to_move_to;
          $scope.bids_max_page = max_page;
        }

        
        var start = page_to_move_to * pagesize;

        if (type == 'asks'){
          $scope.paged_asks = orders_to_filter.slice(start, start + pagesize);
        } else {
          $scope.paged_bids = orders_to_filter.slice(start, start + pagesize);
        }
        
      }

      

      $scope.switch_tab = function(tab_name){
        $scope.active_tab = tab_name;
        $scope.new_order.is_buy = (tab_name == 'buy')
      }

      $scope.switch_order_tab = function(tab_name){
        $scope.active_order_tab = tab_name;
      }

      $scope.use_last = function(){
        $scope.new_order.btc_rate = $scope.last_price;
      }

      $scope.use_bid = function(){
        $scope.new_order.btc_rate = $scope.bid_price;
      }

      $scope.use_ask = function(){
        $scope.new_order.btc_rate = $scope.ask_price;
      }

      $scope.use_remaining = function(){
        if (typeof $rootScope.balance !== 'undefined') {
          if ($scope.active_tab === 'buy' && $rootScope.balance.hasOwnProperty('nzd_available')) {
            $scope.new_order.btc_rate = $scope.new_order.btc_rate || $scope.ask_price
            $scope.new_order.btc_amount = $rootScope.balance.nzd_available / $scope.new_order.btc_rate;
          }
          if ($scope.active_tab === 'sell' && $rootScope.balance.hasOwnProperty('btc_available')) {
            $scope.new_order.btc_rate = $scope.new_order.btc_rate || $scope.bid_price
            $scope.new_order.btc_amount = $rootScope.balance.btc_available;
          }
        }
      }

      $scope.create_order = function(){
        var dialog = ngDialog.open({ 
          template: 'confirm_order',
          className: 'ngdialog-theme-flat',
          controller : 'ConfirmBuyModalCtrl',
          data : JSON.stringify($scope.new_order)
        });
      }

      $scope.cancel_order = function(order, order_type){

        order.order_type = order_type;

        var dialog = ngDialog.openConfirm({
          template: 'confirm_cancel_order',
          className: 'ngdialog-theme-flat',
          data : JSON.stringify(order)
        }).then(function(data){          
          controller.actually_cancel_order(order, order_type);
        });        
      };

      controller.actually_cancel_order = function(order, order_type){
        console.log("Cancel Order: ", order);
        if (order_type == 'buy'){
          BitNZ.orders_buy_cancel(order.id).success(function(){
            PubSub.Publish('update_orders');
          });
        } else {
          BitNZ.orders_sell_cancel(order.id).success(function(){
            PubSub.Publish('update_orders');
          });
        }    
      }

      controller.init();
  });