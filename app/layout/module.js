"use strict";


angular.module('app.layout', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {


    $stateProvider
        .state('app', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/layout.tpl.html'
                }
            }
        });
    $urlRouterProvider.otherwise('/home');

})

.controller('datCtrl', function($scope, $interval) {
    $scope.today = new Date();
    var tick = function() {
        $scope.clock = Date.now();
    }
    tick();
    $interval(tick, 1000);
});
