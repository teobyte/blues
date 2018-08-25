if (typeof require === 'function') {
    var Blues = require('./bz-core-2.0.0');
}
;(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(window, document)
    } else {
        root.Injector = factory(window, document)
    }
})(this, function(w, d) {
    'use strict';
    Blues.inject = {
        // counts inputing chars quantity
        inputCounter: function(inpt) {
            inpt.on('input', function() {
                var $self = bzDom(this);
                var sep = $self.ondata('counter');
                var val = $self.onattr('maxlength');
                var $cntr = $self.parent().find('.counter');
                $cntr.inhtml($self.val().length + sep + val);
            })
        },
        /////////////////////////////////////////////////////
        // set this method globaly to initiate range selector
        rangeSelectorEvent: function (elem) {
            elem.on('input', function() {
                var $inp = bzDom(this);
                var outwrap = $inp.parent().find('.text'),
                    output = outwrap.find('span');
                output.inhtml(this.value);
            });
        },
        /////////////////////////////////////////////////////
        // input injector
        input: function(element) {
            var inpt = bzDom(element);
            var inptWrapp = bzDom('<div class="bz-input">');
            if (inpt.ifclass('bordered')) {
                inptWrapp.onclass('bordered');
                inpt.offclass('bordered');
            }
            if (inpt.ifclass('chips')) {
                inptWrapp.onclass('chips');
                inpt.offclass('chips');
            }
            if (inpt.ondata('class')) {
                inptWrapp.onclass(inpt.ondata('class'));
                inpt.offdata('class');
            }
            if (inpt.ondata('style')) {
                inptWrapp.onattr('style', inpt.ondata('style'));
                inpt.offdata('style');
            }
            var clone = inpt.clone().offclass('bz-input').offattr('placeholder');
            if (clone.ifclass('flash')) {
                clone.offclass('flash');
            }
            var injected = clone.wrapinto(inptWrapp);
            // add floating label
            if (inpt.onattr('placeholder')) {
                var lblText = bzDom('<label class="text">').inhtml(inpt.onattr('placeholder'));
                injected.append(lblText);
            }
            // add icon
            if (inpt.ondata('icon')) {
                var icon = bzDom('<i>').onclass(inpt.ondata('icon'));
                injected.prepend(icon);
            }
            // add status bar
            var bar = bzDom('<div class="bar">');
            injected.append(bar);
            // add flash light
            if (inpt.ifclass('flash')) {
                var flash = bzDom('<div class="flash">');
                injected.append(flash);
            }
            // add counter
            if (inpt.ondata('counter')) {
                var cntr = bzDom('<div class="counter">');
                injected.append(cntr);
            }
            // replace element with enjected one
            // inpt.after(injected);
            injected.on('click', function() {
                var _$inpt = bzDom(this).find('input');
                _$inpt.focus();
            });
            inpt.replacewith(injected);
            // add counter
            if (inpt.ondata('counter')) {
                Blues.inject.inputCounter(injected.find('input'));
            }
        },
        button: function (element) {
            var btn = bzDom(element);
            var tagName = btn.el.tagName.toLowerCase();
            if (tagName == 'button') {
                var newIco = null;
                if (btn.find('i').exist()) {
                    var oldIco = btn.find('i');
                    newIco = oldIco.clone();
                    btn.find('i').remove();
                }
                var name = btn.inhtml();
                btn.inhtml('');
                if (btn.ondata('icon')) {
                    var ico = bzDom('<i>'),
                        dataIcon = btn.ondata('icon'),
                        iconName, iconPos = null;
                    if (dataIcon.includes(':')) {
                        iconName = dataIcon.split(':')[1];
                        iconPos = dataIcon.split(':')[0];
                    } else
                        iconName = dataIcon;
                    if(iconPos != null)
                        ico.onclass(iconPos);
                    ico.onclass(iconName);
                    btn.append(ico);
                }

                var nameSpan = bzDom('<span class="text">');
                nameSpan.inhtml(name);
                if (newIco != null)
                    btn.append(newIco);
                btn.append(nameSpan);
                if (btn.ifclass('bz-wave')) {
                    if (btn.find('.text').exist()) {
                        var $txt = btn.find('.text');
                        if ($txt.find('.wave').exist())
                            $txt.find('.wave').remove();
                    }
                    bz.addwave(btn);
                }
            }
            if (tagName === 'input') {
                var name = btn.val();
                var btnNew = bzDom('<button>');
                var attrs = btn.el.attributes;
                for(var i = attrs.length - 1; i >= 0; i--) {
                    if (attrs[i].name != 'value')
                        btnNew.onattr(attrs[i].name, attrs[i].value);
                }
                if (btn.ondata('icon')) {
                    var ico = bzDom('<i>');
                    ico.onclass(btn.ondata('icon'));
                    btnNew.append(ico);
                }
                var cls = btn.class;
                btnNew.onclass(btn.class);
                var nameSpan = bzDom('<span class="text">');
                nameSpan.inhtml(name);
                btnNew.append(nameSpan);
                if (btn.ifclass('bz-wave'))
                    bz.addwave(btnNew);
                btn.replacewith(btnNew);
            }
        },
        radio: function(element) {
            var rad = bzDom(element);
            if (!rad.find('input').exist()) {
                var cln = rad.clone();
                cln.offclass('bz-radio');
                var lbl = bzDom('<label class="bz-radio">');
                var outer = bzDom('<span class="outer">');
                var inner = bzDom('<span class="inner">');
                outer.append(inner);
                lbl.append(cln);
                lbl.append(outer);
                if (rad.ondata('label')) {
                    var txt = bzDom('<span class="text">').inhtml(rad.ondata('label'));
                    lbl.append(txt);
                }
                rad.replacewith(lbl);
            }
        },
        checkbox: function(element) {
            var rad = bzDom(element);
            if (!rad.find('input').exist()) {
                var cln = rad.clone();
                cln.offclass('bz-checkbox');
                var lbl = bzDom('<label class="bz-checkbox">');
                var outer = bzDom('<span class="outer">');
                var inner = bzDom('<span class="inner">');
                outer.append(inner);
                lbl.append(cln);
                lbl.append(outer);
                if (rad.ondata('label')) {
                    var txt = bzDom('<span class="text">').inhtml(rad.ondata('label'));
                    lbl.append(txt);
                }
                rad.replacewith(lbl);
            }
        },
        switcher: function(element) {
            var rad = bzDom(element);
            if (!rad.find('input').exist()) {
                var cln = rad.clone();
                cln.offclass('bz-switch');
                var lbl = bzDom('<label class="bz-switch">');
                if (rad.ifclass('rounded'))
                    lbl.onclass('rounded');
                var slider = bzDom('<span class="slider">');
                lbl.append(cln);
                lbl.append(slider);
                rad.replacewith(lbl);
            }
        },
        inputfile: function(element) {
            var fl = bzDom(element);
            if (!fl.find('input').exist()) {
                var wrap = bzDom('<div class="bz-fileinput">');
                var cln = fl.clone()
                cln.offclass('bz-fileinput');
                var lbl = bzDom('<label class="bz-btn">');
                if (fl.onattr('id'))
                    lbl.onattr('for', fl.onattr('id'));
                if (fl.ondata('label')) {
                    lbl.inhtml(fl.ondata('label'));
                }
                cln.on('change', function(e) {
                    var $self = bzDom(this),
                        $lbl = $self.parent().find('label');
                    var _lbl = $lbl.inhtml();
                    var fileName = '';
                    if( this.files && this.files.length > 1 )
                        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
                    else
                        fileName = e.target.value.split( '\\' ).pop();
                    if( fileName )
                        $lbl.inhtml(fileName);
                    else
                        $lbl.inhtml(_val);
                });
                wrap.append(cln);
                wrap.append(lbl);
                fl.replacewith(wrap);
            }
        },
        droplist: function(element) {
            var ddl = bzDom(element);
            if (ddl.find('option').exist()) {
                var $ddl = bzDom('<div class="bz-droplist">');
                var $inpt = bzDom('<input type="hidden">');
                var attrs = ddl.el.attributes;
                for(var i = attrs.length - 1; i >= 0; i--) {
                    if (attrs[i].name != 'multiple' && attrs[i].name != 'data-search')
                        $inpt.onattr(attrs[i].name, attrs[i].value);
                }
                $inpt.offclass('bz-droplist');
                if (ddl.ondata('class'))
                    $ddl.onclass(ddl.ondata('class'));
                if (ddl.onattr('multiple'))
                    $ddl.onattr('multiple', ddl.onattr('multiple'));
                if (ddl.ondata('search'))
                    $ddl.ondata('search', ddl.ondata('search'));
                var $trig = bzDom('<div class="bz-trigg">');
                var $txt = bzDom('<span class="text">');
                var $flag = bzDom('<i class="bz-flag">');
                if (ddl.ondata('name'))
                    $inpt.ondata('name', ddl.ondata('name'));
                $trig.append($txt);
                $trig.append($flag);
                $ddl.append($inpt);
                $ddl.append($trig);
                var _$dll = bzDom('<div class="bz-ddl">');
                var _$item = bzDom('<div class="bz-ddl-item" >'),
                    _$chk = bzDom('<input type="checkbox" class="formignore">'),
                    _$txt = bzDom('<div class="text">');
                _$chk.onclass('bz-checkbox');
                var opts = ddl.find('option');
                opts.each(function(i, item) {
                    var opt = bzDom(item),
                        optName = opt.inhtml(),
                        optVal = opt.onattr('value');
                    var _item = _$item.clone(),
                        _chk = _$chk.clone().onattr('name', optVal),
                        _txt = _$txt.clone().inhtml(optName);
                    _item.append(_chk);
                    Blues.inject.checkbox(_chk);
                    _item.append(_txt);
                    _$dll.append(_item);
                });
                $ddl.append(_$dll);
                ddl.replacewith($ddl);
            }
        },
        range: function(element) {
            var rng = bzDom(element);
            if (rng.find('input').exist()) {
                var slct = rng.find('input');
                var outwrap = slct.parent().find('.text'),
                    output = outwrap.find('span');
                output.inhtml(slct.val());
                Blues.inject.rangeSelectorEvent(slct);
            }
            if(!rng.find('input').exist()) {
                var wrap = bzDom('<div class="bz-range-select">');
                var cln = rng.clone();
                cln.offclass('bz-range-select');
                cln.onclass('slider');
                if (rng.ondata('value-name')) {
                    var nm = bzDom('<span>');
                    var val = nm.clone();
                    nm.onclass('text');
                    if (rng.ondata('value-name'))
                        nm.inhtml(rng.ondata('value-name') + ': ');
                    val.inhtml(' ' + rng.val());
                    nm.append(val);
                    wrap.append(nm);
                }
                Blues.inject.rangeSelectorEvent(cln);
                wrap.append(cln);
                rng.replacewith(wrap);
            }
        }
    }
    Blues.injectall = function() {
        // inject bz-input
        var inpts = document.getElementsByClassName('bz-input');
        for (var i = 0; i < inpts.length; i++)
            Blues.inject.input(inpts[i]);
        // inject bz-btn
        var btns = document.getElementsByClassName('bz-btn');
        for (var i = 0; i < btns.length; i++)
            Blues.inject.button(btns[i]);
        // circle buttons
        var rbtns = document.getElementsByClassName('bz-btn-circle');
        for (var i = 0; i < rbtns.length; i++) {
            var rbtn = bzDom(rbtns[i]);
            if (rbtn.ifclass('bz-wave'))
                bz.addwave(rbtn);
        }
        // inject radios
        var rads = document.getElementsByClassName('bz-radio');
        for (var i = 0; i < rads.length; i++)
            Blues.inject.radio(rads[i]);
        // inject checkboxes
        var chks = document.getElementsByClassName('bz-checkbox');
        for (var i = 0; i < chks.length; i++)
            Blues.inject.checkbox(chks[i]);
        // inject checkboxes
        var swchs = document.getElementsByClassName('bz-switch');
        for (var i = 0; i < swchs.length; i++)
            Blues.inject.switcher(swchs[i]);
        // inject input file
        var fls = document.getElementsByClassName('bz-fileinput');
        for (var i = 0; i < fls.length; i++)
            Blues.inject.inputfile(fls[i]);
        // inject drop list
        var ddls = document.getElementsByClassName('bz-droplist');
        for (var i = 0; i < ddls.length; i++)
            Blues.inject.droplist(ddls[i]);
        // inject range selector
        var rngs = document.getElementsByClassName('bz-range-select');
        for (var i = 0; i < rngs.length; i++)
            Blues.inject.range(rngs[i]);
        ////////////////////////////////////////////////
        // Apply password strongivety validation
        var passwrds = document.getElementsByClassName('pwd-check');
        for (var i = 0; i < passwrds.length; i++) {
            var pass = bzDom(passwrds[i]);
            if (pass.ifclass('show')) {
                var show = pass.parent().find('i');
                show.oncss('cursor', 'pointer');
                show.on('click', function() {
                    var $self = bzDom(this),
                        ifshow = $self.ondata('show') || 1;
                    var inpt = $self.parent().find('input');
                    if (ifshow == 1) {
                        inpt.onattr('type', 'text');
                        $self.ondata('show', '0');
                        $self.toggleclass('bz-fc-positive');
                    }
                    else {
                        inpt.onattr('type', 'password');
                        $self.ondata('show', '1');
                        $self.toggleclass('bz-fc-positive');
                    }
                });
            }
            if (pass.ifclass('strength')) {
                pass.on('focus', function() {
                    var $that = bzDom(this);
                    var bar = $that.parent().find('.bar');
                    var w = $that.oncss('width');
                    bar.ondata('width', w);
                    if (bar.ondata('style'))
                        bar.onattr('style', bar.ondata('style'));
                    if ($that.val() == '')
                        bar.offattr('style');
                });
                pass.on('blur', function() {
                    var $that = bzDom(this);
                    var bar = $that.parent().find('.bar');
                    var style = bar.onattr('style');
                    bar.ondata('style', style);
                    bar.offattr('style');
                });
                var width = 0;
                var LC = true, UC = true, NO = true, LG = true, LLG = true, SC = true;
                pass.on('keyup', function() {
                    var $that = bzDom(this);
                    var bar = $that.parent().find('.bar');
                    // Validate lowercase letters
                    var lowerCaseLetters = /[a-z]/g;
                    if($that.val().match(lowerCaseLetters)) {
                        if (LC === true) {
                            width += 15;
                            LC = false;
                        }
                    } else {
                        if (width >= 15 && LC === false) {
                            width -= 15;
                            LC = true;
                        }
                    }
                    // Validate capital letters
                    var upperCaseLetters = /[A-Z]/g;
                    if($that.val().match(upperCaseLetters)) {
                        if(UC === true) {
                            width += 15;
                            UC = false;
                        }
                    } else {
                        if (width >= 15 && UC === false) {
                            width -= 15;
                            UC = true;
                        }
                    }
                    // Validate numbers
                    var numbers = /[0-9]/g;
                    if($that.val().match(numbers)) {
                        if (NO === true) {
                            width += 15;
                            NO = false;
                        }
                    } else {
                        if (width >= 15 && NO === false) {
                            width -= 15;
                            NO = true;
                        }
                    }
                    // Validate length
                    if($that.val().length >= 6) {
                        if (LG === true) {
                            width += 10;
                            LG = false;
                        }
                    } else {
                        if (width >= 10 && LG === false) {
                            width -= 10;
                            LG = true;
                        }
                    }
                    if($that.val().length >= 8) {
                        if (LLG === true) {
                            width += 20;
                            LLG = false;
                        }
                    } else {
                        if (width >= 20 && LLG === false) {
                            width -= 20;
                            LLG = true;
                        }
                    }
                    // special chars
                    var specialChars = /[-_\/\\^$*+?.()|[\]{}]/g;
                    if($that.val().match(specialChars)) {
                        if(SC === true) {
                            width += 25;
                            SC = false;
                        }
                    } else {
                        if (width >= 25 && SC === false) {
                            width -= 25;
                            SC = true;
                        }
                    }
                    width = parseInt(width);
                    var color;
                    if (width <= 25)
                        color = 'red';
                    if (width > 25 && width <= 50)
                        color = 'yellow';
                    if (width > 50 && width <= 75)
                        color = 'orange';
                    if (width > 75 && width <= 100)
                        color = 'green';
                    bar.oncss({ 'background': color, 'width': width + '%' });

                });
            }
        }
    }
    var Injector = Blues.injectall();
    return Injector;
});