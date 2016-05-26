// runs the mocha tests
describe('Classes', function () {
  require('tests/test.AjaxRequest');
});

describe('Functions', function () {
  require('tests/test.extendObject');
  require('tests/test.classes');
  require('tests/test.removeElement');
  require('tests/test.getPageOffset');
  require('tests/test.getScrollPosition');
});
