"use strict";

angular.module('app.home').factory('selectedItemCORecord', ['$http', function($http) {
  return $http.get('http://localhost:8888/api/selectedItemCO.json')
  .success(function(records) {
    return records;
  })
  .error(function(err) {
    return err;
  });
}]);