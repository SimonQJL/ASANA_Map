"use strict";

angular.module('app.home').factory('customerBookingRecord', ['$http', function($http) {
  return $http.get('http://localhost:8888/api/customer-booking.json')
  .success(function(records) {
    return records;
  })
  .error(function(err) {
    return err;
  });
}]);