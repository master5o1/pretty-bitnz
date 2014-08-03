angular.module('prettyBitnzApp')
  .controller('ConfirmBuyModalCtrl', function ($scope, ngDialog, BitNZ) {    
    'use strict'; 

    var controller = this;

    controller.validate_order = function(order){
      if (isNaN(order.btc_rate)){
        alert('invalid rate');
        return false;
      }

      if (isNaN(order.btc_amount)){
        alert('invalid btc amount');
        return false;
      }

      return true;      

    }

    controller.success_callback = function(data){      
      console.log("Order added!", data);
      if (data.hasOwnProperty('result') && data.result == false){
        alert(data.message);
        return;
      }
      $scope.closeThisDialog();
    };

    controller.error_callback = function(error){      
      console.log("Error making order", error);
    };

    controller.perform_buy = function(order){

      if (! controller.validate_order(order)){
        console.log("Invalidate order");
        return false;
      }

      if (order.is_buy){
        BitNZ.orders_buy_create(order.btc_amount, order.btc_rate).success(controller.success_callback).error(controller.error_callback);
      } else {
        BitNZ.orders_sell_create(order.btc_amount, order.btc_rate).success(controller.success_callback).error(controller.error_callback);
      }
    }

    $scope.confirm = function(id){
      console.log("Confirm", $scope.ngDialogData);
      controller.perform_buy($scope.ngDialogData);

    }



});