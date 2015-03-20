(function () {

    'use strict';

    var GpmTableFooter = function(){
        var
            directive = {
            restrict: 'E',
            templateUrl: 'views/directives/gpmtablefooter.html',
            scope: {
                currentPage:      '=',
                maxPages:         '=',
                perPage:          '=',
                perPageOptions:   '=',
                totalResults:     '=',
                onPerPageChanged: '&',
                disablePerPage:   '=',
                disablePageInfo:  '=',
            },
            controllerAs: 'ctrl',
            bindToController: true,
            controller: function GpmTableFooterCtrl($scope) {
                var self = this;
                //scope.ctrl = scope;

                $scope.$watchGroup([ 'ctrl.totalResults', 'ctrl.currentPage', 'ctrl.perPage' ],function() {
                    self.resultsStart = self.currentPage*self.perPage;
                    self.resultsEnd   = self.resultsStart + self.perPage;
                    if (self.resultsEnd>self.totalResults){
                        self.resultsEnd = self.totalResults;
                    }
                });
            }
        };

        return directive;
    };

    /**
     * @ngdoc directive
     * @name angularReactTableRenderingApp.directive:gpmTableFooter
     * @description
     * # gpmTableFooter
     */
    angular.module('angularReactTableRenderingApp')
        .directive('gpmTableFooter', GpmTableFooter);
})();