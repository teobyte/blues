if (typeof require === 'function') {
    var Blues = require('./bz-core-2.0.0');
}


// switcher prototype
var Switcher = function(selector, options) {
    this.selector = selector || '.bz-switch';
    this.element = bzDom(this.selector);
    this.data = [];
    options = options || {};
    this.o = {};
    for (var k in Switcher.defaultOptions) {
        if (Switcher.defaultOptions.hasOwnProperty(k)) {
            if (options.hasOwnProperty(k))
                this.o[k] = options[k];
            else
                this.o[k] = Switcher.defaultOptions[k];
        }
    }
}
Switcher.prototype = {
    init: function() {

    },
    all: function() {

    }
}
Switcher.defaultOtions = function() {
    initcall: function(data) {

    },
    oncall: function(data) {

    },
    offcall: function(data) {

    }
}