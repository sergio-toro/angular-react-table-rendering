'use strict';

describe('Directive: tablefixed', function () {

  // load the directive's module
  beforeEach(module('angularReactTableRenderingApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tablefixed></tablefixed>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tablefixed directive');
  }));
});
