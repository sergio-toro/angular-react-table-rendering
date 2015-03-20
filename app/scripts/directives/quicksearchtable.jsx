(function ($, React) {

    'use strict';

    var QuickSearchTableDirective = function($filter, $log) {

        var QuickSearchTable = React.createClass({
            setPerPage: function(perPage) {
                $log.info('changed perPage', perPage);
                this.setState({
                    perPage: perPage,
                    currentPage: 0,
                });
            },
            setCurrentPage: function(currentPage) {
                $log.info('changed currentPage', currentPage);
                this.setState({ currentPage: currentPage });
            },
            getInitialState: function() {
                return {
                    perPage:     12,
                    currentPage: 0
                };
            },
            togglePopover: function(element, content) {
                var $element = $(element).closest('th');

                if (typeof $element.attr('data-original-title')!=='undefined') {
                    $element.popover('toggle');
                }
                else {
                    $element.popover({
                        html:      true,
                        content:   content,
                        trigger:   'manual',
                        container: 'quick-search-table',
                    })
                    .popover('show');
                }
            },
            render: function() {
                var
                    self = this,
                    filteredData = this.props.data
                ;

                filteredData = $filter('startFrom')(
                    filteredData,
                    this.state.currentPage*this.state.perPage
                );
                filteredData = $filter('limitTo')(
                    filteredData,
                    this.state.perPage
                );

                return (
                    <table className="table table-striped table-bordered table-hover table-condensed">
                        <thead className="header">
                            <tr>
                                <th>Fecha</th>
                                <th>DAM</th>
                                <th>Tarjeta</th>
                                <th>Dispositivo</th>
                                {this.props.parameters.map(function(param) {
                                    var hasCodeType = (param.code_type!='-1');

                                    return (
                                        <th key={param.$$hashKey}
                                            className={hasCodeType ? 'pointer' : ''}
                                            onClick={function(ev){
                                                if (hasCodeType) {
                                                    self.togglePopover(ev.target, param.code_info);
                                                }
                                            }}>
                                            {param.name} {param.unit}
                                            {hasCodeType && <i className="fa fa-info-circle"></i>}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <QuickSearchTableResults filteredData={filteredData} />
                    </table>
                );
            }
        });

        var QuickSearchTableResults = React.createClass({
            destroyTooltip: function(element) {
                $(element).tooltip('destroy');
            },
            toggleTooltip: function(element, content) {
                var $element = $(element);

                if (typeof $element.attr('data-original-title')!=='undefined') {
                    $element.tooltip('toggle');
                }
                else {
                    $element.tooltip({
                        title:     content,
                        trigger:   'manual',
                        container: 'quick-search-table',
                        placement: 'top'
                    })
                    .tooltip('show');
                }
            },
            render: function() {
                var self = this;
                return (
                    <tbody>
                        {this.props.filteredData.map(function (row) {
                            var i = 0;
                            return (
                                <tr key={row.key} className="animate-repeat-fade-in">
                                    <td className="nowrap">{row.date}</td>
                                    <td className="nowrap"
                                        onClick={function(ev){
                                            self.toggleTooltip(ev.target, row.dam_tooltip);
                                        }}>
                                        {row.datalogger}
                                    </td>
                                    <td className="nowrap"
                                        onClick={function(ev){
                                            self.toggleTooltip(ev.target, row.card_tooltip);
                                        }}>
                                        {row.card}
                                    </td>
                                    <td className="nowrap">{row.device}</td>
                                    {row.parameters.map(function(value) {
                                        i++;
                                        return (
                                            <td key={row.key+'.'+i}
                                                className="result nowrap"
                                                dangerouslySetInnerHTML={{__html: value}}>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                );
            }
        });

        return {
            template: [
                '<div class="table-container overflow-x-auto"></div>',
                '<gpm-table-footer',
                '    per-page="ctrl.perPage"',
                '    per-page-options="ctrl.perPageOptions"',
                '    current-page="ctrl.currentPage"',
                '    max-pages="ctrl.maxPages"',
                '    total-results="ctrl.data.length">',
                '<gpm-table-footer>',
            ].join(''),
            restrict: 'E',
            scope: {
                data: '=',
                parameters: '=',
            },
            controller: QuickSearchTableCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            link: function(scope, element) {
                var self = scope.ctrl;

                $log.info('link called');

                var start = new Date().getTime();


                self.$tableContainer = element.find('.table-container');
                self.quickSearch = React.render(
                    <QuickSearchTable
                        parameters={self.parameters}
                        data={self.computedData}
                    />,
                    self.$tableContainer[0]
                );

                self.$tableContainer.find('table').stickyTableHeaders();
                self.$tableContainer.find('thead.tableFloatingHeader')
                    .removeAttr('data-reactid');

                var end = new Date().getTime();
                var time = end - start;
                $log.info('First render time: ' + (time/1000) + 's');
            }
        };
    };

    var QuickSearchTableCtrl = function($scope, $filter, $log, Constant) {
        var self = this;

        $log.info('controller called');

        self.$scope   = $scope;
        self.$filter  = $filter;
        self.$log     = $log;
        self.Constant = Constant;

        self.SpecialFormat     = self.Constant.getByConstant('SpecialFormatTypes');
        self.$tableContainer   = null;

        self.computedData      = self.getComputedData();
        self.currentPage       = 0;
        self.perPage           = 12;
        self.perPageOptions    = self.getPerPageOptions();


        self.$scope.$watch('ctrl.perPage', function(perPage) {
            if (self.quickSearch.state.perPage!==perPage) {
                self.updateTable(function updateFn() {
                    self.quickSearch.setPerPage(self.perPage);
                    self.currentPage = 0;
                });
            }
        });

        self.$scope.$watch('ctrl.currentPage', function(currentPage) {
            if (self.quickSearch.state.currentPage!==currentPage) {
                self.updateTable(function updateFn() {
                    self.quickSearch.setCurrentPage(currentPage);
                });
            }
        });
    };

    QuickSearchTableCtrl.prototype.updateTable = function(updateFn) {
        var self = this;

        var start = new Date().getTime();

        self.$tableContainer.find('table').stickyTableHeaders('destroy');

        updateFn();

        self.$tableContainer.find('table').stickyTableHeaders();
        self.$tableContainer.find('thead.tableFloatingHeader')
            .removeAttr('data-reactid');


        var end = new Date().getTime();
        var time = end - start;
        self.$log.info('Render time: ' + (time/1000) + 's');
    };


    QuickSearchTableCtrl.prototype.getComputedData = function() {
        var self = this;

        var start = new Date().getTime();

        // Precompute quick analysis filters
        var computedData = self.data.map(function(item) {
            var row = angular.copy(item);
            row.date = self.$filter('momentDateTime')(row.date, 'Europe/Madrid');
            row.parameters = row.parameters.map(function(value, index) {
                var
                    param  = self.parameters[index],
                    result = ''
                ;
                if (param.special_format_mode==self.SpecialFormat.NONE) {
                    result = self.$filter('gpmNumber')(value, param.decimal_places);
                }
                else {
                    result = self.$filter('gpmSpecialFormat')(value, param.special_format_mode);
                }
                return result + ' ' + self.$filter('decodeValue')(value, param.code_type, param.code);
            });
            return row;
        });


        var end = new Date().getTime();
        var time = end - start;
        self.$log.info('Compute time: ' + (time/1000) + 's');

        return computedData;
    };

    QuickSearchTableCtrl.prototype.getPerPageOptions = function() {
        var self = this;

        var
            safeCellsCount   = 10000,
            columnsCount     = 4 + self.parameters.length, // 4 static fields: Fecha, DAM, Tarjeta, Dispositivo
            maxRowsPerPage   = Math.round(safeCellsCount/columnsCount),
            perPageOptions   = [],
            defaultPerPage   = [
                12, 24, 30, 100, 200, 288, 300, 365, 500, 750, 1000, 2000
            ]
        ;
        for(var key in defaultPerPage) {
            if (defaultPerPage[key]<=maxRowsPerPage) {
                perPageOptions.push(defaultPerPage[key]);
            }
        }

        self.$log.info('Max per page results: ', perPageOptions);

        return perPageOptions;
    };

    /**
     * @ngdoc directive
     * @name angularReactTableRenderingApp.directive:quickSearchTable
     * @description
     * # quickSearchTable
     */
    angular.module('angularReactTableRenderingApp')
        .directive('quickSearchTable', QuickSearchTableDirective)
    ;
})(window.$, window.React);
