(function() {
    'use strict';
    var Blues = Blues || {};
    Blues.animate = function(element, styles, options) {
        var Animate = Animate || {};
        if (!element)
            return null;
        var duration, metod, callback;
        options = options || {};
        duration = options.duration || 450;
        metod = options.method || 'linear';
        callback = options.callback || false;

        var extract = function(element, style) {
            // check for an inline style
            if(typeof element.style !== 'undefined' && element.style[style])
                return element.style[style];
            // if none, continue
            var value,
                defaultView = (element.ownerDocument || document).defaultView;
            // modified W3C method
            if (defaultView && defaultView.getComputedStyle) {
                // sanitize property name to css notation
                style = style.replace(/([A-Z])/g, "-$1").toLowerCase();
                value = window.getComputedStyle(element, null).getPropertyValue(style);
                return value;
            } else if (element.currentStyle) { // IE
                // sanitize property name to camelCase
                style = style.replace(/\-(\w)/g, function(str, letter) {
                    return letter.toUpperCase();
                });
                value = element.currentStyle[style];
                // convert other units to pixels on IE
                if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                    return (function(value) {
                        var oldLeft = element.style.left, oldRsLeft = element.runtimeStyle.left;
                        element.runtimeStyle.left = element.currentStyle.left;
                        element.style.left = value || 0;
                        value = element.style.pixelLeft + "px";
                        element.style.left = oldLeft;
                        element.runtimeStyle.left = oldRsLeft;
                        return value;
                    })(value);
                }
                return value;
            }
        };
        // animation math patterns
        var easePattern = {
            // linear animation
            linear: function (t) {
                return t;
            },
            // easeInQuad - accelerating animation
            easeInQuad: function (t) {
                return t*t;
            }
        };
        //
        var key = 0;
        var execute = function(element, style, unit, from, to, duration, metod, callback) {
            var start = new Date().getTime(),
                timer = setInterval(function() {
                    // determine how long the animation has been going
                    var time = new Date().getTime() - start;
                    // if the animation is complete
                    if( time >= duration ) {
                        // stop the interval
                        clearInterval(timer);
                        // set the final position
                        element.style[style] = to + unit;
                        // start callback
                        if(callback && key === 0) {
                            key = 1;
                            callback();
                        }
                        return;
                    }
                    // calculate the step
                    var t = time / duration;
                    var step = from + easePattern[metod](t) * (to - from);
                    // update the element style
                    element.style[style] = step + unit;
                }, 10);
            // assign the initial starting point
            element.style[style] = from + unit;
        };
        Animate = {
            init: function () {
                for(var style in styles) {
                    // get the necessary attributes of the element
                    var current = extract(element, style);
                    // get "from" value with respect to negative values
                    var from = parseInt(current),
                        // get "to" value with respect to negative values
                        to = parseInt(styles[style]),
                        // get value unit
                        unit = styles[style].replace(to, '');
                    // run the animation
                    execute(element, style , unit , from , to , duration , metod, callback);
                }
            }
        };
        Animate.init();
        return Animate;
    };
    Blues.flyTo = function(flyer, flyingTo) {
        var flyerElem = bzDom(flyer),
            flyingToElem = bzDom(flyingTo),
            divider = 3;
        var flyerClone = flyerElem.clone();
        bzDom(flyerClone, {
            addcss: {color: 'green', position: 'absolute', top: flyerElem.scrollPos().top + "px", left: flyerElem.scrollPos().left + "px", opacity: 1, 'z-index': 1000}
        });
        document.body.appendChild(flyerClone.el);
        var gotoX = parseInt(flyingToElem.scrollPos().left + (flyingToElem.width() / 2) - (flyerElem.width()/divider)/2);
        var gotoY = parseInt(flyingToElem.scrollPos().top + (flyingToElem.height() / 2) - (flyerElem.height()/divider)/2);
        Blues.animate(flyerClone.el, {
            //opacity: 0.4,
            left: gotoX + 'px',
            top: gotoY + 'px'
        } , {
            duration: 700,
            callback: function() {
                flyerClone.remove();
                flyingToElem.oncss('color', '#FF6600');
                setTimeout(function() {
                    flyingToElem.oncss('color', '#0048BA');
                }, 300);
            }
        })
    };
    Blues.dynamoValue = function(target, newvalue, unit, duration) {
        var oldval = 0,
            tarGet = bzDom(target),
            duration = parseInt(duration) || 600,
            unit = unit || '';
        if (tarGet.inhtml()) {
            oldval = numeral(tarGet.inhtml()).format('0.00');
            oldval = parseFloat(oldval);
        }
        newvalue = parseFloat(newvalue);
        var execute = function(target, from, to, duration, unit) {
            var start = new Date().getTime(),
                timer = setInterval(function() {
                    // determine how long the animation has been going
                    var time = new Date().getTime() - start;
                    // if the animation is complete
                    if( time >= duration ) {
                        // stop the interval
                        clearInterval(timer);
                        // set the final position
                        target.innerHTML = unit + ' ' + numeral(to).format('0.00');
                        // start callback
                        return;
                    }
                    // calculate the step
                    var t = time / duration;
                    var step = from + t * (to - from);
                    // update the element style
                    target.innerHTML = unit + ' ' + numeral(step).format('0.00');
                }, 10);
            // assign the initial starting point
            target.innerHTML = unit + ' ' + numeral(from).format('0.00');
        };
        execute(target, oldval, newvalue, duration, unit);
    };
    function init() {
        window.bz.animate = window.Blues.animate = Blues.animate;
        window.bz.flyTo = window.Blues.flyTo = Blues.flyTo;
        window.bz.dynamoValue = window.Blues.dynamoValue = Blues.dynamoValue;
    }
    return init();
})();