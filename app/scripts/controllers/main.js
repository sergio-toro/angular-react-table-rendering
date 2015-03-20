(function () {

    'use strict';

    var MainCtrl = function() {
        var self = this;

        self.data              = null;
        self.parameters        = null;
    };


    MainCtrl.prototype.loadData = function() {
        var self = this;

        self.data       = window.quickQuery.data;
        self.parameters = window.quickQuery.parameters;
    };

    MainCtrl.prototype.clearData = function() {
        var self = this;

        self.data       = null;
        self.parameters = null;
    };

    /**
     * @ngdoc function
     * @name angularReactTableRenderingApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the angularReactTableRenderingApp
     */
    angular.module('angularReactTableRenderingApp')
        .controller('MainCtrl', MainCtrl);
})();
