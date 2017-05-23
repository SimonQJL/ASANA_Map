"use strict";

angular.module('app.home').factory('customerBookingRecord', ['$http', function($http) {
  return $http.get(ServerUrl+'base/list')
  .success(function(records) {
    return records;
  })
  .error(function(err) {
    return err;
  });
}]);