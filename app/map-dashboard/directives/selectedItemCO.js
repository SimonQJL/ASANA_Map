'use strict';

angular.module('app.home').directive('selectedItemCO', function() {
  return {
    restrict: 'C',//A 用于元素的 Attribute，这是默认值,E 用于元素的名称,C 用于 CSS 中的 class
    templateUrl: 'app/map-dashboard/views/selectedItemCO.tpl.html'
  };
});