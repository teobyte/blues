
"use strict";
var Rating = function (options) {
    this.o = {};
    options = options || {};
    for (var k in Rating.defaultOptions) {
        if (Rating.defaultOptions.hasOwnProperty(k)) {
            if (options.hasOwnProperty(k))
                this.o[k] = options[k] ;
            else
                this.o[k] = Rating.defaultOptions[k] ;
        }
    }
    this.ratebox = bzDom(this.o.element);
    this.name = bz.help.timestamp();
    // init Rating
    this.init();
};
Rating.prototype = {
    constructor: Rating,
    setback: function(rate, i, wrapback) {
        var rating = this,
            clas;
        i = i + 1;
        if (rate <= 1)
            clas = 'bz-bc-negative';
        else if (rate > 1 && rate <= 3)
            clas = 'bz-bc-warning';
        else if (rate > 3 && rate <= 5)
            clas= 'bz-bc-positive';
        var rate1 = parseInt(rate.split('.')[0]),
            rate2 = parseInt(rate.split('.')[1]);
        if (i === 1 && rate > 0) {
            if (!wrapback.ifclass(clas))
                wrapback.onclass(clas);
            wrapback.oncss('width', '100%');
            if (rate > 0 && rate < 1) {
                wrapback.oncss('width', rate2 + '%');
            }
        }
        else if (i === 2 && rate > 1) {
            if (!wrapback.ifclass(clas))
                wrapback.onclass(clas);
            wrapback.oncss('width', '100%');
            if (rate > 1 && rate < 2) {
                wrapback.oncss('width', rate2 + '%');
            }
        }
        else if (i === 3 && rate > 2) {
            if (!wrapback.ifclass(clas))
                wrapback.onclass(clas);
            wrapback.oncss('width', '100%');
            if (rate > 2 && rate < 3) {
                wrapback.oncss('width', rate2 + '%');
            }
        }
        else if (i === 4 && rate > 3) {
            if (!wrapback.ifclass(clas))
                wrapback.onclass(clas);
            wrapback.oncss('width', '100%');
            if (rate > 3 && rate < 4) {
                wrapback.oncss('width', rate2 + '%');
            }
        }
        else if (i === 5 && rate > 4) {
            if (!wrapback.ifclass(clas))
                wrapback.onclass(clas);
            wrapback.oncss('width', '100%');
            if (rate > 4 && rate < 5) {
                wrapback.oncss('width', rate2 + '%');
            }
        }
        return wrapback;
    },
    hidewraps: function() {
        var rating = this;
        var wraps = rating.ratebox.find('.bz-rating-back');
        wraps.each(function(i, item) {
            bzDom(item).hide();
        });
    },
    showwraps: function() {
        var rating = this;
        var wraps = rating.ratebox.find('.bz-rating-back');
        wraps.each(function(i, item) {
            bzDom(item).show();
        });
    },
    // setup rating box
    setup: function() {
        var rating = this,
            rads = rating.ratebox.find('input'),
            wrap = bzDom('<div class="bz-rating-wrap">'),
            wrapBack = bzDom('<div class="bz-rating-back">'),
            rate = rating.ratebox.ondata('value');
        if (rating.o.showvalue === true) {
            var rateDiv = bzDom('<div class="bz-rating-rate">');
            rateDiv.text(rate);
            rating.ratebox.prepend(rateDiv);
        }
        rads.each(function(i, item) {
            var rad = bzDom(item),
                _wrap = wrap.clone();
            rad.onattr('name', rating.name);
            rad.val(i + 1);
            rad.wrapinto(_wrap, true);
            var _wrapback = wrapBack.clone();
            _wrap.append(rating.setback(rate, i, _wrapback));
        });
    },
    // check radio button
    checkbox: function(wrap) {
        var wrap = bzDom(wrap),
            rad = wrap.find('input');
        rad.checkon();
    },
    // highlight radio wrapper on mouseover
    mouseover: function(wrap) {
        var rating = this;
        var $that = bzDom(wrap),
            _index = $that.find('input').val();
        var _wraps = rating.ratebox.find('.bz-rating-wrap');
        _wraps.each(function(i, item) {
            var _wrap = bzDom(item);
            rating.hidewraps();
            if (i <= parseInt(_index) - 1) {
                if (!_wrap.ifclass('bz-rating-highlight'))
                    _wrap.onclass('bz-rating-highlight');
            }
        });
    },
    mouseleave: function() {
        var rating = this;
        var _wraps = rating.ratebox.find('.bz-rating-wrap');
        _wraps.each(function(i, item) {
            var _wrap = bzDom(item);
            _wrap.offclass('bz-rating-highlight');
        });
        rating.showwraps();
    },
    // adds actions to the Rating box
    addactions: function() {
        var rating = this;
        var rads = rating.ratebox.find('input');
        rads.each(function(i, item) {
            var rad = bzDom(item);
            rad.on('change', function() {
                var $that = bzDom(this),
                    _val = $that.val();
                alert(_val);
            });
        });
        var wraps = rating.ratebox.find('.bz-rating-wrap');
        wraps.each(function(i, item) {
            var wrap = bzDom(item);
            wrap.on('click', function(e) {
                e.stopPropagation();
                rating.checkbox(this);
            });
            wrap.on('mouseover', function() {
                rating.mouseover(this);
            });
            wrap.on('mouseleave', function() {
                rating.mouseleave();
            });
        });
    },
    setstyle: function() {
        var top = '10px',
            marginleft = '30px';
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
            top = '11px';
            marginleft = '34px';
        }
        var jss = {
            'rule': {
                '.bz-rating': {
                    'attr': {
                        position: 'relative',
                        display: 'inline-block'
                    }
                },
                '.bz-rating .bz-rating-wrap' : {
                    'attr': {
                        border: '1px solid #777',
                        cursor: 'pointer',
                        display: 'inline-block',
                        height: '8px',
                        position: 'relative',
                        width: '32px'
                    }
                },
                '.bz-rating .bz-rating-rate + .bz-rating-wrap' : {
                    'attr': {
                        'margin-left': marginleft
                    }
                },
                '.bz-rating .bz-rating-wrap input' : {
                    'attr': {
                        appearance: 'none',
                        '-webkit-appearance': 'none',
                        '-moz-appearance': 'none'
                    }
                },
                '.bz-rating .bz-rating-rate': {
                    'attr': {
                        display: 'inline-block',
                        'font-size': '0.8em',
                        'font-weight': 'bold',
                        position: 'absolute',
                        top: top
                    }
                },
                '.bz-rating.primary .bz-rating-highlight': {
                    'attr': {
                        background: 'var(--color-primary)'
                    }
                },
                '.bz-rating .bz-rating-back': {
                    'attr': {
                        height: '100%',
                        position: 'absolute',
                        width: '0'
                    }
                }
            },
            'attr': {}
        };
        var css = Blues.JSONCSS(jss);
        Blues.JSS(css, 'bzcss_rating');
    },
    // Rating initialization
    init: function() {
        var rating = this;
        rating.setup();
        rating.setstyle();
        rating.addactions();
    }
};
Rating.defaultOptions = {
    element: '.bz-rating',
    showvalue: false
};