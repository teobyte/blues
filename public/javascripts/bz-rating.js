
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
    this.action = false;
    if (this.ratebox.ondata('action'))
        this.action = this.ratebox.ondata('action');
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
        if (rating.o.rate === true)
            wrap.onclass('bz-cursor-pointer');
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
            if (rating.o.type === 'star') {
                _wrap.onclass('star');
                var star = bzDom('<i class="bzi-star-in-square bz-fc-white">');
                _wrap.append(star.clone());
                if (rating.o.showvalue === true)
                    rateDiv.onclass('star');
            }
        });
    },
    // check radio button
    checkbox: function(wrap) {
        var wrap = bzDom(wrap),
            rad = wrap.find('input');
        rad.checkon();
    },
    highlighton: function(wrap) {
        var rating = this;
        var _index = bzDom(wrap).find('input').val();
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
    highlightoff: function() {
        var rating = this;
        var _wraps = rating.ratebox.find('.bz-rating-wrap');
        _wraps.each(function(i, item) {
            var _wrap = bzDom(item);
            _wrap.offclass('bz-rating-highlight');
        });
        rating.showwraps();
    },
    // highlight radio wrapper on mouseover
    mouseover: function(wrap) {
        var rating = this,
            key = rating.ratebox.ondata('key');
        if (key !== 1)
            rating.highlighton(wrap);
    },
    mouseleave: function() {
        var rating = this,
            key = rating.ratebox.ondata('key');
        if (key !== 1)
            rating.highlightoff();
    },
    // set value
    setvalue: function(wrap) {
        var rating = this;
        var _index = bzDom(wrap).find('input').val(),
            _wraps = rating.ratebox.find('.bz-rating-wrap');
        _wraps.each(function(i, item) {
            var _wrap = bzDom(item);
            _wrap.offclass('bz-rating-highlight');
            rating.hidewraps();
            if (i <= parseInt(_index) - 1) {
                if (!_wrap.ifclass('bz-rating-highlight'))
                    _wrap.onclass('bz-rating-highlight');
            }
        });
    },
    // adds actions to the Rating box
    addactions: function() {
        var rating = this;
        var rads = rating.ratebox.find('input');
        rads.each(function(i, item) {
            var rad = bzDom(item);
            rad.on('change', function() {
                var $that = bzDom(this),
                    _val = $that.val(),
                    _wrap = $that.parent();
                rating.ratebox.ondata('key', '1');
                if (rating.action)
                    rating.o.request(rating, _wrap, _val);
            });
        });
        if (rating.o.rate === true) {
            var wraps = rating.ratebox.find('.bz-rating-wrap');
            wraps.each(function(i, item) {
                var wrap = bzDom(item);
                wrap.on('click', function(e) {
                    //e.stopPropagation();
                    rating.checkbox(this);
                    rating.setvalue(this);
                });
                wrap.on('mouseover', function() {
                    rating.mouseover(this);
                });
                wrap.on('mouseleave', function() {
                    rating.mouseleave();
                });
            });
        }
    },
    setstyle: function() {
        var rating = this,
            top = 2,
            topstar = 3,
            marginleft = 30;
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            marginleft = 38;
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
                        border: 'none',
                        background: '#777',
                        display: 'inline-block',
                        'vertical-align': 'middle',
                        height: '8px',
                        position: 'relative',
                        width: '24px'
                    }
                },
                '.bz-rating .bz-rating-wrap.star' : {
                    'attr': {
                        'font-size': '16px',
                        height: '14px',
                        width: '14px'
                    }
                },
                '.bz-rating .bz-rating-rate + .bz-rating-wrap' : {
                    'attr': {
                        'margin-left': marginleft + 'px'
                    }
                },
                '.bz-rating .bz-rating-wrap input' : {
                    'attr': {
                        appearance: 'none',
                        '-webkit-appearance': 'none',
                        '-moz-appearance': 'none'
                    }
                },
                '.bz-rating .bz-rating-wrap i' : {
                    'attr': {
                        position: 'absolute',
                        top: '-1px',
                        left: '-1px'
                    }
                },
                '.bz-rating .bz-rating-rate': {
                    'attr': {
                        display: 'inline-block',
                        'font-size': '0.9em',
                        'font-weight': 'bold',
                        position: 'absolute',
                        top: top + 'px'
                    }
                },
                '.bz-rating .bz-rating-rate.star': {
                    'attr': {
                        top: topstar + 'px'
                    }
                },
                '.bz-rating.primary .bz-rating-highlight': {
                    'attr': {
                        background: 'var(--color-navy)'
                    }
                },
                '.bz-rating .bz-rating-back': {
                    'attr': {
                        height: '100%',
                        position: 'absolute',
                        top: '0',
                        width: '0'
                    }
                }
            },
            'attr': {}
        };
        var css = Blues.JSONCSS(jss);
        Blues.JSS(css, 'bzcss_rating');
    },
    init: function() {
        var rating = this;
        rating.setup();
        rating.setstyle();
        rating.addactions();
    }
};
Rating.defaultOptions = {
    element: '.bz-rating',
    rate: false,
    type: 'star',
    showvalue: false,
    request: function(rating, wrap, val) {
        alert(val);
        bz.ajax({
            url: rating.action,
            type: 'post',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: { value: val },
            success: function(data) {
                rating.setvalue(wrap);
            },
            error: function() {
                rating.setvalue(wrap);
            }
        });
    }
};