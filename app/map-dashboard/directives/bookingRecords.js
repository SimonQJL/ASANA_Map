'use strict';

angular.module('app.home').directive('bookingRecords', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/map-dashboard/views/booking-records.tpl.html'
  };
});