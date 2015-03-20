'use strict';

describe('Filter: gpmFilters', function () {

  // load the filter's module
  beforeEach(module('angularReactTableRenderingApp'));

  // initialize a new instance of the filter before each test
  var gpmFilters;
  beforeEach(inject(function ($filter) {
    gpmFilters = $filter('gpmFilters');
  }));

  it('should return the input prefixed with "gpmFilters filter:"', function () {
    var text = 'angularjs';
    expect(gpmFilters(text)).toBe('gpmFilters filter: ' + text);
  });

});
