'use strict';

describe('Service: Constant', function () {

  // load the service's module
  beforeEach(module('angularReactTableRenderingApp'));

  // instantiate service
  var Constant;
  beforeEach(inject(function (_Constant_) {
    Constant = _Constant_;
  }));

  it('should do something', function () {
    expect(!!Constant).toBe(true);
  });

});
