class HookCodeFactory {
  args() {
    return this.options._args.join(',');
  }
  header(){
    return `
      "use strict";
      var _context;
      var _x = this._x;
    `;
  }
  content() {
    let code = '';
    for (let i = 0; i < this.options.taps.length; i++) {
      code += `
        var _fn${i} = _x[${i}];
        _fn${i}(${this.args()})
      `
    }
    return code;
  }
  setup(hookInstance, options) {
    this.options = options;
    hookInstance._x = options.taps.map(item => item.fn);
  }
  create(options) {
    let fn = new Function (this.args(), this.header() + this.content());
    return fn
  }
};

module.exports = HookCodeFactory;