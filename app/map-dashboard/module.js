"use strict";

angular.module('app.home', ['ui.router'])


.config(function ($stateProvider) {

    $stateProvider
        .state('app.home', {
            url: '/home',
            data: {
                title: 'Map Dashboard'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/map-dashboard/views/map-dashboard.html'

                }
            },
            resolve: {
                srcipts: function(lazyScript){
                    return lazyScript.register([
                        "build/vendor.ui.js"
                    ])

                }
            }
        })

});