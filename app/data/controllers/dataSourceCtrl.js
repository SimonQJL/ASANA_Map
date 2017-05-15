'use strict';



angular.module('app.data').controller('dataSourceCtrl', ['$scope', 'dataSource', function($scope, dataSource) {
  dataSource.success(function(source) {
    $scope.dataSource = source;
  });
  	$scope.dataClass = function(data) {
        switch (data.table) {
            case 'Customer':
                return 'data-source-customer';
                break;
            case 'Location':
                return 'data-source-location';
                break;
            case 'Staff':
                return 'data-source-staff';
                break;
            case 'Room':
                return 'data-source-room';
                break;
            case 'Booking':
                return 'data-source-booking';
                break;
            default:
                return 'data-source-customer';
        }
    };
  
}]);