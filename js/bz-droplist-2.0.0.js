if (typeof require === 'function') {
    var Blues = require('./bz-core-2.0.0');
}
;(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(window, document)
    } else {
        root.Droplist = factory(window, document)
    }
})(this, function(w, d) {
    'use strict';
    // droplist prototype
    var Dl = function (options) {
        options = options || {};
        this.o = {};
        for (var k in Dl.defaultOptions) {
            if (Dl.defaultOptions.hasOwnProperty(k)) {
                if (options.hasOwnProperty(k))
                    this.o[k] = options[k];
                else
                    this.o[k] = Dl.defaultOptions[k];
            }
        }
        this.droplist = bzDom(this.o.selector);
        this.data = [];
        this.addactions();
    };
    Dl.prototype = {
        // main methods
        addactions: function() {
            var Dl = this;
            var $ddlWrap = Dl.droplist.parent('.bz-droplist'),
                $trig = $ddlWrap.find('.bz-trigg'),
                $inpt = $trig.prev('input'),
                $chks = $ddlWrap.find('[type="checkbox"]'),
                $itms = $ddlWrap.find('.bz-ddl-item');

            var selectedVal = $inpt.val(),
                selectedName = $inpt.ondata('name');



            $trig.find('.text').inhtml(selectedName);

            $trig.on('click', function() {
                var $th = bzDom(this),
                    _$ddl = $th.parent().find('.bz-ddl');
                if (_$ddl.ondata('key') == '1')
                    Dl.closeDdl(_$ddl);
                else
                    Dl.openDdl(_$ddl);
            });
            $chks.each(function(i, item) {
                var chk = bzDom(item);
                if (chk.el.checked == true) {
                    Dl.checkBox(chk);
                }
            });
            $chks.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            $itms.each(function(i, item) {
                var itm = bzDom(item);
                itm.on('click', function(e) {
                    var $self = bzDom(this),
                        $chk = $self.find('input');
                    if ($chk.el.checked == false || $chk.onattr('checked') != 'checked') {
                        if (!$ddlWrap.onattr('multiple') == true)
                            Dl.uncheckAll($chks);
                        Dl.checkBox($chk);
                        if (Dl.o.calloncheck && Blues.check.ifFunction(Dl.o.calloncheck))
                            Dl.o.calloncheck(Dl.data, $trig, $inpt);
                    } else {
                        Dl.uncheckBox($chk);
                        if (Dl.o.calluncheck && Blues.check.ifFunction(Dl.o.calluncheck))
                            Dl.o.calluncheck(Dl.data, $trig, $inpt);
                    }
                });
            });
            // switch on searching option
            if ($ddlWrap.ondata('search') == 'true')
                Dl.initsearch($itms);
            bzDom(document).on('click', function(event) {
                var opnds = document.getElementsByClassName('bz-on');
                for (var i = 0; i < opnds.length; i++) {
                    var isClickInside = opnds[i].contains(event.target);
                    if (!isClickInside) {
                        var elm = bzDom(opnds[i]);
                        if (elm.ondata('key') == '1') {
                            elm.ondata('key', '0');
                            elm.toggleclass('bz-on');
                        }
                    }
                }
            });
        },
        closeDdl: function (ddl) {
            ddl.ondata('key', '0');
            ddl.toggleclass('bz-on');
            //$flag.toggleclass('bz-rotate180');
        },
        openDdl: function(ddl) {
            var Dl = this;
            setTimeout(function() {
                ddl.ondata('key', '1');
                ddl.toggleclass('bz-on');
            }, 300);

            ddl.on('mouseenter', function(e) {
                var $self = bzDom(this);
                $self.on('mouseleave', function() {
                    $self.ondata('hold', '0');
                    if ($self.ondata('key') == '1') {
                        setTimeout(function() {
                            if ($self.ondata('key') == '1')
                                Dl.closeDdl($self);
                        }, 1500)
                    }
                });
            });
            //$flag.toggleclass('bz-rotate180');
        },
        checkBox: function (chk) {
            var $dlItem = chk.parent('.bz-ddl-item');
            chk.el.setAttribute('checked', 'checked');
            chk.el.checked = true;
            if (!$dlItem.ifclass('selected'))
                $dlItem.onclass('selected');
            var Dl = this;
            Dl.data.push(chk.onattr('name'));
            Dl.droplist.val(Dl.data);
        },
        uncheckBox: function (chk) {
            var $dlItem = chk.parent('.bz-ddl-item');
            chk.el.removeAttribute('checked');
            chk.el.checked = false;
            if ($dlItem.ifclass('selected'))
                $dlItem.offclass('selected');
            var Dl = this;
            if (Dl.data.indexOf(chk.onattr('name')) > -1 ) {
                Dl.data.splice(Dl.data.indexOf(chk.onattr('name')) , 1);
            }
        },
        uncheckAll: function(chks) {
            var Dl = this;
            chks.each(function(i, item) {
                Dl.uncheckBox(bzDom(item));
            });
        },
        initsearch: function(items) {
            var $ddl = bzDom(items.el[0]).parent('.bz-ddl');
            var input = bzDom('<input type="text">');
            input.onclass('searchfield');
            input.onattr('placeholder', 'Search..');
            function filterFunction(filter, itms) {
                itms.each(function(i, item) {
                    var a = bzDom(item).find('.text');
                    if (a.inhtml().toUpperCase().indexOf(filter) > -1)
                        a.parent('.bz-ddl-item').show();
                    else
                        a.parent('.bz-ddl-item').hide();
                });
            }
            input.on('keyup', function() {
                var $self = bzDom(this),
                    filter = $self.val().toUpperCase();
                var itms = $self.parent().find('.bz-ddl-item');
                filterFunction(filter, itms);
            });
            $ddl.prepend(input);
        }
    };
    Dl.defaultOptions = {
        selector: '.bz-droplist',
        calloncheck: function(selected, trigger, inpt) {
            var t = trigger.find('.text');
            t.inhtml('selected: ' + JSON.stringify(selected));
        },
        calluncheck: function(selected, trigger, inpt) {
            var t = trigger.find('.text');
            t.inhtml('selected: ' + JSON.stringify(selected));
        }
    };
    function init(options) {
        if (!bzDom(options.selector).exist()) return;
        if (Object.prototype.hasOwnProperty.call(options, 'data-droplist')) return;
        Object.defineProperty(options, 'data-droplist', { value: new Droplist(options) });
    }
    function all() {
        var ddls = bzDom('.bz-droplist');
        ddls.each(function(i, item) {
            var options = {};
            options.selector = bzDom(item);
            init(options);
        });
    }
    function getdata(selector) {
        var elem = bzDom(selector),
            chks = elem.find('[type="checkbox"]');
        var arr = [];
        chks.each(function(i, item) {
            var chk = bzDom(item);
            if (chk.el.checked == true) {
                arr.push(chk.onattr('name'));
            }
        });
        return arr;
    }
    Dl.data = getdata;
    Dl.init = init;
    Dl.all = all;
    var Droplist = Dl;
    return Droplist;
});

