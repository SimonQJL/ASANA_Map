"use strict";

angular.module('app.data').factory('dataSource', ['$http', function($http) {
  return $http.get('http://localhost:8888/api/data-source.json')
  .success(function(source) {
    return source;
  })
  .error(function(err) {
    return err;
  });
}]);