"use strict";

angular.module('app.home').factory('customerBookingRecord', ['$http', function($http) {
  return $http.get('http://10.0.0.188/base/list')
  .success(function(records) {
    return records;
  })
  .error(function(err) {
    return err;
  });
}]);