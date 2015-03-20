(function($) {

    'use strict';

    /**
     * @ngdoc directive
     * @name angularReactTableRenderingApp.directive:tablefixed
     * @description
     * # tablefixed
     */
    angular.module('angularReactTableRenderingApp')
    .directive('tablefixed', function ($timeout, $compile, $window, $rootScope) {
        return {
            restrict: 'A',
            templateUrl: 'views/directives/tablefixed.html',
            scope: {
                offsetTop: '=tablefixed',
            },
            transclude: true,
            link: function(scope, element){
                scope.ctrl = scope;
                scope.onlyInit = false;

                var headerFixed = function(){
                    var
                        $element  = $(element),
                        $windowEl = $($window),
                        $table    = $element.find('table'),
                        $thead    = $table.find('thead'),
                        offset    = $element.offset(),
                        offsetTop = scope.offsetTop || 86 // Default offset to correct fixed page header
                    ;

                    console.log('tablefixed', $element[0], $thead[0]);

                    scope.elements = [];
                    scope.fixedHeaderDisplay = false;

                    //Initial position
                    scope.fixedHeaderWidth  = $table.width() + 10;
                    scope.fixedHeaderHeight = $thead.height();

                    $thead.find('th').each(function(){
                        var $th = $(this);
                        scope.elements.push({
                            width:   $th.outerWidth(),
                            padding: ($th.innerWidth()-$th.width())/2,
                            name:    $th.html()
                        });
                    });

                    var posYInitShow    = $thead.height() + (offset.top - offsetTop);
                    var correctionalTop = $thead.height();

                    if(scope.onlyInit) {
                        return;
                    }

                    //Scroll event
                    var scrollTimeout;
                    $windowEl.on('scroll', function() {

                        $timeout.cancel(scrollTimeout);
                        scrollTimeout = $timeout(function(){
                            if ($windowEl.scrollTop() >= posYInitShow) {

                                $table.css('top', (correctionalTop*(-1)) );

                                scope.fixedHeaderTop = $windowEl.scrollTop() - (offset.top - offsetTop);
                                scope.fixedHeaderDisplay = true;
                            }
                            else {
                                scope.fixedHeaderDisplay = false;
                                $table.css('top', 0);
                            }

                            scope.$apply();
                        }, 150);
                    });

                    element.bind('$destroy', function() {
                        $windowEl.off('scroll');
                    });
                };

                //hack: beacuse I want call the first time after render
                $timeout(headerFixed, 0);

                var refreshTablefixed = function(){
                    scope.onlyInit = true;
                    $timeout(headerFixed, 800);
                    scope.onlyInit = false;
                };
                //Listeners: actue recalcule the header
                $rootScope.$on('SIDEBAR_CHANGED',    refreshTablefixed);

                $rootScope.$on('REFRESH_TABLEFIXED', refreshTablefixed);
            }
        };
    });
})(window.$);