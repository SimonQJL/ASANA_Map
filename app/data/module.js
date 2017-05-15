"use strict";

angular.module('app.data', ['ui.router'])


.config(function ($stateProvider) {

    $stateProvider
        .state('app.data', {
            url: '/data_source',
            data: {
                title: 'Data Source View & Alias'
            },
            views: {
                "content@app": {
                    controller: 'dataSourceCtrl',
                    templateUrl: 'app/data/views/data-source.html'
                }
            }

        })

});
