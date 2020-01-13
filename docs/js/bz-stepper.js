;(function(root, factory) {
    'use strict';
    // AMD. Register as an anonymous module. Wrap in function so we have access
    // to root via `this`.
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return factory.apply(window);
        });
    }
    // Node. Does not work with strict CommonJS, but only CommonJS-like
    // environments that support module.exports, like Node.
    else if (typeof exports === 'object') {
        module.exports = factory.call(window);
    }
    // Browser globals.
    else {
        window.Stepper = factory.call(window);
    }
})(typeof global === 'object' ? global : this, function() {
    'use strict';
    var ST = function (options) {
        options = options || {};
        this.o = {};
        this.o = bz.help.mergeOptions(ST.defaultOptions, options);
        this.stepper = bzDom(this.o.selector);
        this.marker = null;
        this.steps = [];
        this.stepsW = 0;
        this.message = null;
        this.data = {};
        this.buildStepper();
        this.addactions();
    };
    ST.prototype = {
        buildStepper: function() {
            var st = this,
                $stNav = bzDom('<div class="stepper-navs">'),
                $step = bzDom('<div class="step bz-t-align-center">');
            st.message = bzDom('<div class="stepper-messages bz-w-100p">');
            st.stepper.prepend(st.message);
            st.steps = st.stepper.find('.step-tab');
            var stepsQty = st.steps.el.length;
            st.stepsW = 100 / stepsQty;
            st.steps.each(function(i, item) {
                var $stepTab = bzDom(item),
                    name = $stepTab.ondata('name');
                $stepTab.ondata('key', i);
                var _$step = $step.clone();
                if (i === 0) {
                    _$step.onclass('active');
                    //_$step.onclass(st.o.highlight);
                }
                _$step.oncss('width', st.stepsW + '%');
                _$step.text(name);
                _$step.ondata('key', i);
                $stNav.append(_$step);
            });
            st.marker = bzDom('<div class="marker bz-transition">');
            st.marker.onclass(st.o.markerColor);
            st.marker.oncss('width', st.stepsW + '%');
            $stNav.append(st.marker);
            st.stepper.prepend($stNav);
        },
        addactions: function() {
            var st = this;
            st.steps.each(function(i, item) {
                var $stepTab = bzDom(item),
                    $nextBtn = $stepTab.find('[name=btn-next]'),
                    $prevBtn = $stepTab.find('[name=btn-prev]'),
                    $sbmtBtn = $stepTab.find('[name=btn-submit]');
                if ($nextBtn.exist()) {
                    $nextBtn.on('click', function(e) {
                        e.preventDefault();
                        var $th = bzDom(this);
                        st.nextAction($th);
                    });
                }
                if ($prevBtn.exist()) {
                    $prevBtn.on('click', function(e) {
                        e.preventDefault();
                        var $th = bzDom(this);
                        st.prevAction($th);
                    });
                }
                if ($sbmtBtn.exist()) {
                    $sbmtBtn.on('click', function(e) {
                        e.preventDefault();
                        var $th = bzDom(this);
                        st.sbmtAction($th);
                    });
                }
            });
        },
        nextAction: function(elem) {
            var st = this;
            var $form = elem.parent('form'),
                _$stepTab = elem.parent('.step-tab'),
                _$nextStep = _$stepTab.next();
            _$stepTab.offclass('active');
            _$nextStep.onclass('active');
            var shift = _$nextStep.ondata('key');
            st.moveMarker(shift);
            var data = $form.getformdata();
            st.data = bz.help.extendObject(st.data, data);
            if(bz.check.ifFunction(st.o.nextCall()))
                st.o.nextCall(data);
            if (st.o.stepRequest) {
                var ctr = $form.ondata('ctr'),
                    act = $form.ondata('act'),
                    url = '/' + ctr + '/' + act;
                st.sendData(data, url);
            }
        },
        prevAction: function(elem) {
            var st = this;
            var _$stepTab = elem.parent('.step-tab'),
                _$prevStep = _$stepTab.prev();
            _$stepTab.offclass('active');
            _$prevStep.onclass('active');
            var shift = _$prevStep.ondata('key');
            st.moveMarker(shift);
            if(bz.check.ifFunction(st.o.prevCall()))
                st.o.prevCall(st.data);
        },
        sbmtAction: function(elem) {
            var st = this;
            var $form = elem.parent('form'),
                _$stepTab = elem.parent('.step-tab'),
                ctr = $form.ondata('ctr'),
                act = $form.ondata('act'),
                url = '/' + ctr + '/' + act;
            var data = $form.getformdata();
            st.data = bz.help.extendObject(st.data, data);
            if(bz.check.ifFunction(st.o.submitCall()))
                st.o.submitCall(data);
            if (st.o.stepRequest)
                st.sendData(data, url);
            else
                st.sendData(st.data, url);
            _$stepTab.offclass('active');
            var msg = 'Form has been submitted successfully!';
            st.o.msgHandler(st.message, msg);
            if (st.o.reset) {
                st.o.resetBtn(st.message);
                var _$resetBtn = st.message.find('[name=reset-btn]');
                _$resetBtn.on('click', function() {
                    st.resetAction();
                    st.moveMarker(0);
                });
            }
        },
        resetAction: function() {
            var st = this;
            st.resetForms();
            st.message.inhtml('');
            bzDom(st.steps.el[0]).onclass('active');
        },
        resetForms: function() {
            var st = this;
            var inpts = st.stepper.find('input');
            inpts.each(function (i, item) {
               var _$inpt = bzDom(item);
               _$inpt.val('');
            });
        },
        moveMarker: function (shift) {
            var st = this;
            shift = shift * st.stepsW;
            st.marker.oncss('left', shift + '%');
        },
        sendData: function(dataObj, url) {
            bz.ajax({
                type: 'post',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                url: url,
                data: dataObj,
                success: function(data) {

                },
                error: function() {

                }
            });
        }
    };
    ST.defaultOptions = {
        selector: '.bz-stepper',
        markerColor: 'bz-bc-primary',
        highlight: 'bz-bc-gray-light',
        reset: false,
        stepRequest: false,
        nextCall: false,
        prevCall: false,
        submitCall: false,
        msgHandler: function(msgbox, msg) {
            var _$msgWrap = bzDom('<div>');
            _$msgWrap.onclass('bz-padding-32 bz-bc-positive bz-fc-white bz-t-align-center');
            _$msgWrap.text(msg);
            msgbox.append(_$msgWrap);
        },
        resetBtn: function(msgbox) {
            var $reset = bzDom('<input type="button" name="reset-btn" class="bz-btn primary inverted primary-wave bz-float-right" value="Reset">');
            msgbox.append($reset);
        }
    };
    function init(options) {
        if (!bzDom(options.selector).exist()) return;
        if (Object.prototype.hasOwnProperty.call(options, 'data-stepper')) return;
        Object.defineProperty(options, 'data-stepper', { value: new Stepper(options) });
    }
    ST.init = init;
    var Stepper = ST;
    window.Stepper = Stepper;
    return Stepper;
});