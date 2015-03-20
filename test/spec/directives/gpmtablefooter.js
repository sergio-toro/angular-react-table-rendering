'use strict';

describe('Directive: gpmTableFooter', function () {

  // load the directive's module
  beforeEach(module('angularReactTableRenderingApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gpm-table-footer></gpm-table-footer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the gpmTableFooter directive');
  }));
});
