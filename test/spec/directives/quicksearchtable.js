'use strict';

describe('Directive: quickSearchTable', function () {

  // load the directive's module
  beforeEach(module('angularReactTableRenderingApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<quick-search-table></quick-search-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the quickSearchTable directive');
  }));
});
