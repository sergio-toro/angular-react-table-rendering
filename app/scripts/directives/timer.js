(function (React) {
    'use strict';

    var Timer = React.createClass({displayName: "Timer",
        getInitialState: function() {
            return {secondsElapsed: 0};
        },
        tick: function() {
            this.setState({secondsElapsed: this.state.secondsElapsed + 1});
        },
        componentDidMount: function() {
            this.interval = setInterval(this.tick, 1000);
        },
        componentWillUnmount: function() {
            clearInterval(this.interval);
        },
        render: function() {
            return (
                React.createElement("div", null, "Seconds Elapsed: ", this.state.secondsElapsed)
            );
        }
    });

    /**
     *
     * @ngdoc directive
     * @name angularReactTableRenderingApp.directive:timer
     * @description
     * # timer
     */
    angular.module('angularReactTableRenderingApp')
        .directive('timer', function () {
            return {
                template: '<div></div>',
                restrict: 'E',
                link: function postLink(scope, element) {
                    React.render(React.createElement(Timer, null), element[0]);
                }
            };
        })
    ;
})(window.React);
