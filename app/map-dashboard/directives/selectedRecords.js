'use strict';

angular.module('app.home').directive('selectedRecords', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/map-dashboard/views/selected-record.tpl.html'
  };
});