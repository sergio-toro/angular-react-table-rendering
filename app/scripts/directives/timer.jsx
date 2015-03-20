(function (React) {
    'use strict';

    var Timer = React.createClass({
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
                <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
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
                    React.render(<Timer />, element[0]);
                }
            };
        })
    ;
})(window.React);
