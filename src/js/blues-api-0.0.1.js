/*!
 * Waves v0.7.5
 * http://fian.my.id/Waves
 *
 * Copyright 2014-2016 Alfiana E. Sibuea and other contributors
 * Released under the MIT license
 * https://github.com/fians/Waves/blob/master/LICENSE
 */

;(function(window, factory) {
    'use strict';

    // AMD. Register as an anonymous module.  Wrap in function so we have access
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
        window.Waves = factory.call(window);
    }
})(typeof global === 'object' ? global : this, function() {
    'use strict';

    var Waves            = Waves || {};
    var $$               = document.querySelectorAll.bind(document);
    var toString         = Object.prototype.toString;
    var isTouchAvailable = 'ontouchstart' in window;


    // Find exact position of element
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function isObject(value) {
        var type = typeof value;
        return type === 'function' || type === 'object' && !!value;
    }

    function isDOMNode(obj) {
        return isObject(obj) && obj.nodeType > 0;
    }

    function getWavesElements(nodes) {
        var stringRepr = toString.call(nodes);

        if (stringRepr === '[object String]') {
            return $$(nodes);
        } else if (isObject(nodes) && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && nodes.hasOwnProperty('length')) {
            return nodes;
        } else if (isDOMNode(nodes)) {
            return [nodes];
        }

        return [];
    }

    function offset(elem) {
        var docElem, win,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    function convertStyle(styleObj) {
        var style = '';

        for (var prop in styleObj) {
            if (styleObj.hasOwnProperty(prop)) {
                style += (prop + ':' + styleObj[prop] + ';');
            }
        }

        return style;
    }

    var Effect = {

        // Effect duration
        duration: 750,

        // Effect delay (check for scroll before showing effect)
        delay: 200,

        show: function(e, element, velocity) {

            // Disable right click
            if (e.button === 2) {
                return false;
            }

            element = element || this;

            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple waves-rippling';
            element.appendChild(ripple);

            // Get click coordinate and element width
            var pos       = offset(element);
            var relativeY = 0;
            var relativeX = 0;
            // Support for touch devices
            if('touches' in e && e.touches.length) {
                relativeY   = (e.touches[0].pageY - pos.top);
                relativeX   = (e.touches[0].pageX - pos.left);
            }
            //Normal case
            else {
                relativeY   = (e.pageY - pos.top);
                relativeX   = (e.pageX - pos.left);
            }
            // Support for synthetic events
            relativeX = relativeX >= 0 ? relativeX : 0;
            relativeY = relativeY >= 0 ? relativeY : 0;

            var scale     = 'scale(' + ((element.clientWidth / 100) * 3) + ')';
            var translate = 'translate(0,0)';

            if (velocity) {
                translate = 'translate(' + (velocity.x) + 'px, ' + (velocity.y) + 'px)';
            }

            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);
            ripple.setAttribute('data-scale', scale);
            ripple.setAttribute('data-translate', translate);

            // Set ripple position
            var rippleStyle = {
                top: relativeY + 'px',
                left: relativeX + 'px'
            };

            ripple.classList.add('waves-notransition');
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.classList.remove('waves-notransition');

            // Scale the ripple
            rippleStyle['-webkit-transform'] = scale + ' ' + translate;
            rippleStyle['-moz-transform'] = scale + ' ' + translate;
            rippleStyle['-ms-transform'] = scale + ' ' + translate;
            rippleStyle['-o-transform'] = scale + ' ' + translate;
            rippleStyle.transform = scale + ' ' + translate;
            rippleStyle.opacity = '1';

            var duration = e.type === 'mousemove' ? 2500 : Effect.duration;
            rippleStyle['-webkit-transition-duration'] = duration + 'ms';
            rippleStyle['-moz-transition-duration']    = duration + 'ms';
            rippleStyle['-o-transition-duration']      = duration + 'ms';
            rippleStyle['transition-duration']         = duration + 'ms';

            ripple.setAttribute('style', convertStyle(rippleStyle));
        },

        hide: function(e, element) {
            element = element || this;

            var ripples = element.getElementsByClassName('waves-rippling');

            for (var i = 0, len = ripples.length; i < len; i++) {
                removeRipple(e, element, ripples[i]);
            }
        }
    };

    /**
     * Collection of wrapper for HTML element that only have single tag
     * like <input> and <img>
     */
    /*var TagWrapper = {

        // Wrap <input> tag so it can perform the effect
        input: function(element) {

            var parent = element.parentNode;

            // If input already have parent just pass through
            if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
                return;
            }

            // Put element class and style to the specified parent
            var wrapper       = document.createElement('i');
            wrapper.className = element.className + ' waves-input-wrapper';
            element.className = 'waves-button-input';

            // Put element as child
            parent.replaceChild(wrapper, element);
            wrapper.appendChild(element);

            // Apply element color and background color to wrapper
            var elementStyle    = window.getComputedStyle(element, null);
            var color           = elementStyle.color;
            var backgroundColor = elementStyle.backgroundColor;

            wrapper.setAttribute('style', 'color:' + color + ';background:' + backgroundColor);
            element.setAttribute('style', 'background-color:rgba(0,0,0,0);');

        },

        // Wrap <img> tag so it can perform the effect
        img: function(element) {

            var parent = element.parentNode;

            // If input already have parent just pass through
            if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
                return;
            }

            // Put element as child
            var wrapper  = document.createElement('i');
            parent.replaceChild(wrapper, element);
            wrapper.appendChild(element);

        }
    };*/

    /**
     * Hide the effect and remove the ripple. Must be
     * a separate function to pass the JSLint...
     */
    function removeRipple(e, el, ripple) {

        // Check if the ripple still exist
        if (!ripple) {
            return;
        }

        ripple.classList.remove('waves-rippling');

        var relativeX = ripple.getAttribute('data-x');
        var relativeY = ripple.getAttribute('data-y');
        var scale     = ripple.getAttribute('data-scale');
        var translate = ripple.getAttribute('data-translate');

        // Get delay beetween mousedown and mouse leave
        var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
        var delay = 350 - diff;

        if (delay < 0) {
            delay = 0;
        }

        if (e.type === 'mousemove') {
            delay = 150;
        }

        // Fade out ripple after delay
        var duration = e.type === 'mousemove' ? 2500 : Effect.duration;

        setTimeout(function() {

            var style = {
                top: relativeY + 'px',
                left: relativeX + 'px',
                opacity: '0',

                // Duration
                '-webkit-transition-duration': duration + 'ms',
                '-moz-transition-duration': duration + 'ms',
                '-o-transition-duration': duration + 'ms',
                'transition-duration': duration + 'ms',
                '-webkit-transform': scale + ' ' + translate,
                '-moz-transform': scale + ' ' + translate,
                '-ms-transform': scale + ' ' + translate,
                '-o-transform': scale + ' ' + translate,
                'transform': scale + ' ' + translate
            };

            ripple.setAttribute('style', convertStyle(style));

            setTimeout(function() {
                try {
                    el.removeChild(ripple);
                } catch (e) {
                    return false;
                }
            }, duration);

        }, delay);
    }


    /**
     * Disable mousedown event for 500ms during and after touch
     */
    var TouchHandler = {

        /* uses an integer rather than bool so there's no issues with
         * needing to clear timeouts if another touch event occurred
         * within the 500ms. Cannot mouseup between touchstart and
         * touchend, nor in the 500ms after touchend. */
        touches: 0,

        allowEvent: function(e) {

            var allow = true;

            if (/^(mousedown|mousemove)$/.test(e.type) && TouchHandler.touches) {
                allow = false;
            }

            return allow;
        },
        registerEvent: function(e) {
            var eType = e.type;

            if (eType === 'touchstart') {

                TouchHandler.touches += 1; // push

            } else if (/^(touchend|touchcancel)$/.test(eType)) {

                setTimeout(function() {
                    if (TouchHandler.touches) {
                        TouchHandler.touches -= 1; // pop after 500ms
                    }
                }, 500);

            }
        }
    };


    /**
     * Delegated click handler for .waves-effect element.
     * returns null when .waves-effect element not in "click tree"
     */
    function getWavesEffectElement(e) {

        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }

        var element = null;
        var target = e.target || e.srcElement;

        while (target.parentElement !== null) {
            if (target.classList.contains('waves-effect') && (!(target instanceof SVGElement))) {
                element = target;
                break;
            }
            target = target.parentElement;
        }

        return element;
    }

    /**
     * Bubble the click and show effect if .waves-effect elem was found
     */
    function showEffect(e) {

        // Disable effect if element has "disabled" property on it
        // In some cases, the event is not triggered by the current element
        // if (e.target.getAttribute('disabled') !== null) {
        //     return;
        // }

        var element = getWavesEffectElement(e);

        if (element !== null) {

            // Make it sure the element has either disabled property, disabled attribute or 'disabled' class
            if (element.disabled || element.getAttribute('disabled') || element.classList.contains('disabled')) {
                return;
            }

            TouchHandler.registerEvent(e);

            if (e.type === 'touchstart' && Effect.delay) {

                var hidden = false;

                var timer = setTimeout(function () {
                    timer = null;
                    Effect.show(e, element);
                }, Effect.delay);

                var hideEffect = function(hideEvent) {

                    // if touch hasn't moved, and effect not yet started: start effect now
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                        Effect.show(e, element);
                    }
                    if (!hidden) {
                        hidden = true;
                        Effect.hide(hideEvent, element);
                    }
                };

                var touchMove = function(moveEvent) {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    hideEffect(moveEvent);
                };

                element.addEventListener('touchmove', touchMove, false);
                element.addEventListener('touchend', hideEffect, false);
                element.addEventListener('touchcancel', hideEffect, false);

            } else {

                Effect.show(e, element);

                if (isTouchAvailable) {
                    element.addEventListener('touchend', Effect.hide, false);
                    element.addEventListener('touchcancel', Effect.hide, false);
                }

                element.addEventListener('mouseup', Effect.hide, false);
                element.addEventListener('mouseleave', Effect.hide, false);
            }
        }
    }

    Waves.init = function(options) {
        var body = document.body;

        options = options || {};

        if ('duration' in options) {
            Effect.duration = options.duration;
        }

        if ('delay' in options) {
            Effect.delay = options.delay;
        }

        if (isTouchAvailable) {
            body.addEventListener('touchstart', showEffect, false);
            body.addEventListener('touchcancel', TouchHandler.registerEvent, false);
            body.addEventListener('touchend', TouchHandler.registerEvent, false);
        }

        body.addEventListener('mousedown', showEffect, false);
    };
    /**
     * Attach Waves to dynamically loaded inputs, or add .waves-effect and other
     * waves classes to a set of elements. Set drag to true if the ripple mouseover
     * or skimming effect should be applied to the elements.
     */
    Waves.attach = function(elements, classes) {

        elements = getWavesElements(elements);

        if (toString.call(classes) === '[object Array]') {
            classes = classes.join(' ');
        }

        classes = classes ? ' ' + classes : '';

        var element, tagName;

        for (var i = 0, len = elements.length; i < len; i++) {

            element = elements[i];
            tagName = element.tagName.toLowerCase();

            if (['input', 'img'].indexOf(tagName) !== -1) {
                TagWrapper[tagName](element);
                element = element.parentElement;
            }

            if (element.className.indexOf('waves-effect') === -1) {
                element.className += ' waves-effect' + classes;
            }
        }
    };
    /**
     * Deprecated API fallback
     */
    Waves.displayEffect = function(options) {
        console.error('Waves.displayEffect() has been deprecated and will be removed in future version. Please use Waves.init() to initialize Waves effect');
        Waves.init(options);
    };
    return Waves;
});
/**
 * Blues CSS Framework
 * Created by Alexander Potoccy on 5/22/2017.
 * Inspired by collaboration with Oleg Baskakov
 */
;(function(window, factory) {
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
        window.Blues = factory.call(window);
    }
})(typeof global === 'object' ? global : this, function() {
    'use strict';
    var Blues = Blues || {};
    // if Element has Class: element.bzhasClass('some-class');
    Element.prototype.bzhasClass = function (className) {
        return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
    };
    // toggle Element Class: element.bztoggleClass('some-class');
    Element.prototype.bztoggleClass = function(className) {
        var elem = this;
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if (elem.bzhasClass(className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        } else {
            elem.className += ' ' + className;
        }
    };
    // Remove Class from Element: element.bzdeleteClass('some-class');
    Element.prototype.bzdeleteClass = function(className) {
        var elem = this;
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if (elem.bzhasClass(className)) {
            while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                newClass = newClass.replace(' ' + className + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g,'');
        }
    };
    // Convert String to DOM object
    String.prototype.toDomObject = function () {
        var html = this;
        var wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            area: [ 1, "<map>", "</map>" ],
            param: [ 1, "<object>", "</object>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            body: [0, "", ""],
            _default: [ 1, "<div>", "</div>"  ]
        };
        wrapMap.optgroup = wrapMap.option;
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        var match = /<\s*\w.*?>/g.exec(html);
        var element = document.createElement('div');
        if(match != null) {
            var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
            if(tag.toLowerCase() === 'body') {
                var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
                var body = document.createElement("body");
                // keeping the attributes
                element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
                var attrs = element.firstChild.attributes;
                body.innerHTML = html;
                for(var i=0; i<attrs.length; i++) {
                    body.setAttribute(attrs[i].name, attrs[i].value);
                }
                return body;
            } else {
                var map = wrapMap[tag] || wrapMap._default, element;
                html = map[1] + html + map[2];
                element.innerHTML = html;
                // Descend through wrappers to the right content
                var j = map[0]+1;
                while(j--) {
                    element = element.lastChild;
                }
            }
        } else {
            element.innerHTML = html;
            element = element.lastChild;
        }
        return element;
    };
    //Screen, client width
    Blues.bzscrWidth = function() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth;
        return x;
    };
    //Screen, client height
    Blues.bzscrHeight = function() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        return y;
    };
    //--> Blues Accordion start here
    Blues.Accordion = {
        init: function(element) {
            // get elem class from init() or by default
            element = element || 'bz-accordion';
            // get element from DOM
            var bzacc = document.getElementsByClassName(element);

            function initAcc(bzacc) {
                var controls = bzacc.getElementsByClassName('bz-title'),
                    contents = bzacc.getElementsByClassName('bz-content');

                var offAcc = function(elem) {
                    if (elem.parentElement.bzhasClass('bz-scalein'))
                        elem.parentElement.bzdeleteClass('bz-scalein');
                    if (elem.parentElement.bzhasClass('open'))
                        elem.parentElement.bzdeleteClass('open');
                }

                var openAcc = function(accId, elem) {
                    var cont = document.getElementById(accId);
                    if (!elem.parentElement.bzhasClass('open') && !elem.parentElement.bzhasClass('bz-scalein')) {
                        for (var i = 0; i < contents.length; i++) {
                            contents[i].style.display = 'none';
                        }
                        lightAcc(elem);
                        cont.style.display = "block";
                    }
                    else {
                        offAcc(elem);
                        cont.style.display = "none";
                    }
                }
                var lightAcc = function(elem) {

                    for (var i = 0; i < controls.length; i++) {
                        offAcc(controls[i]);
                    }

                    if (bzacc.bzhasClass('popout')) {
                        elem.parentElement.className += ' ' + 'bz-scalein';
                    }
                    else {
                        elem.parentElement.className += ' ' + 'open';
                    }
                }
                for (var j = 0, L = controls.length; j < L; j++) {
                    var ctrl = controls[j];

                    ctrl.addEventListener('click', function(e) {
                        var accId = e.target.getAttribute('data-show');

                        /*alert(e.target.parentElement.ifhasClass('bz-scalein'));
                        if (e.target.parentElement.ifhasClass('open') != true && e.target.parentElement.ifhasClass('bz-scalein') != true) {
                            alert('light it');
                            lightAcc(e.target);
                        }*/
                        openAcc(accId, e.target);
                    });
                }
            };
            // apply for every elems with the same class
            for (var i = 0, L = bzacc.length; i < L; i++) {
                initAcc(bzacc[i]);
            }
        }
    };
    //--> Blues Drpdowns starts here
    Blues.Dropdown = {
        init: function(element) {
            // get elem class from init() or by default
            element = element || 'bz-dropdown';
            // get element from DOM
            var bzdrop = document.getElementsByClassName(element);
            function initDrop(bzdrop) {
                var _span = bzdrop.getElementsByClassName('dd-name')[0],
                    _name = _span.innerHTML,
                    _ul = bzdrop.getElementsByTagName('ul')[0],
                    _li = bzdrop.getElementsByTagName('li');
                if (_li.length > 0) {
                    _span.style.cursor = 'pointer';
                    _span.addEventListener('click', function(e) {
                        _ul.style.display = 'block';
                    });
                    for (var i = 0, L = _li.length; i < L; i++) {
                        _li[i].addEventListener('click', function(e) {

                            if (bzdrop.bzhasClass('menu')) {
                            }
                            else {
                                _span.innerHTML = _name + ': ' + e.target.innerText;
                            }
                            _ul.style.display = 'none';
                        });
                    }
                }
            };
            // apply for every elems with the same class
            for (var i = 0, L = bzdrop.length; i < L; i++) {
                initDrop(bzdrop[i]);
            }
        }
    };
    //--> Blues Modal
    Blues.Modal = function(element, options) {
        var Modal = Modal || {};
        // get elem class from init() or by default
        element = element || 'open-modal';
        // get element from DOM
        var bzmodal = document.getElementsByClassName(element);
        options = options || {};
        var type = options.type || null,
            funcyes = options.funcyes || null,
            funcno = options.funcno || null;
        Modal = {
            init: function (bzmodal) {
                var popupId = bzmodal.getAttribute('bz-item'),
                    popup = document.getElementById(popupId);

                if (type == 'dialog') {
                    var yes = popup.getElementsByClassName('confirm-yes')[0],
                        no = popup.getElementsByClassName('confirm-no')[0];

                    if (funcyes != null) {
                        yes.addEventListener('click', function() {
                            funcyes();
                        });
                    }
                    if (funcno != null) {
                        no.addEventListener('click', function() {
                            funcno();
                        });
                    }
                }

                bzmodal.addEventListener('click', function() {
                    popup.style.display = 'block';
                    Modal.close(popup);
                });
            },
            close: function (popup) {
                var close = document.getElementsByClassName('modal-close')[0];
                close.addEventListener('click', function(event) {
                    popup.style.display = 'none';
                });
                window.addEventListener('click', function(event) {
                    if (event.target == popup) {
                        popup.style.display = 'none';
                    }
                });
            }

        };
        // apply for every elems with the same class
        for (var i = 0, L = bzmodal.length; i < L; i++) {
            Modal.init(bzmodal[i]);
        }
        return Modal;
    };
    //--> Blues Menu starts here
    Blues.Navigation = {
        init: function(element) {
            // get elem class from init() or by default
            element = element || 'bz-nav';
            // get element from DOM
            var bznav = document.getElementsByClassName(element);
            function initNav(bznav) {
                var navlist = bznav.querySelector('.bz-nav-list');
                var hamburger = document.createElement('i');
                hamburger.className = 'fa fa-bars fa-2x bz-float-l';
                var mobile = document.createElement('div');
                mobile.className = 'bz-nav-mobile';
                mobile.appendChild(hamburger);
                bznav.insertBefore(mobile ,bznav.firstChild);
                mobile.addEventListener('click', function() {
                    this.toggleClass('bz-nav-mobile-open');
                    navlist.toggleClass('bz-nav-active');
                });
            };
            // apply for every elems with the same class
            for (var i = 0, L = bznav.length; i < L; i++) {
                if (bznav[i].bzhasClass('mobile'))
                    initNav(bznav[i]);
            }
        }
    };
    //--> Blues Tabs starts here
    Blues.Tabs = {
        init: function(element) {
            // get elem class from init() or by default
            element = element || 'bz-tab';
            // get element from DOM
            var bztab = document.getElementsByClassName(element);
            function initTab(bztab) {
                var controls = bztab.getElementsByClassName('tab-controls')[0],
                    control = controls.getElementsByTagName('li'),
                    contents = bztab.getElementsByClassName('tab-contents')[0],
                    block = contents.getElementsByClassName('tab-block');
                var openTab = function(tabId) {
                    for (var i = 0; i < block.length; i++) {
                        block[i].style.display = "none";
                    }
                    document.getElementById(tabId).style.display = "block";
                    //alert(tabId);
                }
                var lightTab = function(elem) {
                    for (var i = 0; i < control.length; i++) {
                        control[i].bzdeleteClass('active');
                    }
                    elem.className += ' ' + 'active';
                    //alert(elem.innerHTML);
                }
                for (var j = 0, L = control.length; j < L; j++) {
                    var ctrl = control[j],
                        tabId = ctrl.getAttribute('data-show');
                    if (ctrl.bzhasClass('active')) {
                        for (var k = 0, L = block.length; k < L; k++) {
                            var blk = block[k],
                                blId = blk.getAttribute('id');
                            if (blId == tabId) {
                                blk.style.display = 'block';
                            }
                        }

                    }
                    if (!ctrl.hasAttribute('disabled')) {
                        ctrl.addEventListener('click', function(e) {
                            var tabId = e.target.getAttribute('data-show');
                            openTab(tabId);
                            lightTab(e.target);
                        });
                    }
                }
            };
            // apply for every elems with the same class
            for (var i = 0, L = bztab.length; i < L; i++) {
                initTab(bztab[i]);
            }
        }
    };
    //--> Blues Toasts
    Blues.Toast = function(message, options) {
        message = message || false;
        options = options || {};
        var tclass= options.tclass || 'default',
            timer = options.timer || 5000,
            funclose = options.funclose || null;
        var toastbox = document.createElement('div');
        toastbox.className = 'bs-toast-box';
        if (!document.getElementsByClassName('bs-toast-box')[0]) {
            document.body.appendChild(toastbox);
        }
        function newToast(message) {
            var newt = document.createElement('div');
            newt.className = 'bz-toast' + ' ' + tclass;
            newt.innerHTML = message;
            closeToast(newt);
            return newt;
        };
        var newtoast = newToast(message);
        if (message) {
            var tb = document.getElementsByClassName('bs-toast-box')[0];
            tb.appendChild(newtoast);
            newtoast.toggleClass('show');
        }
        function closeToast(toast) {
            toast.addEventListener('click', function(event) {
                var tost = event.target;
                tost.parentNode.removeChild(tost);
                funclose();
            });
            setTimeout(function(){
                toast.parentNode.removeChild(toast);
                funclose();
            }, timer);
        };
    };
    //--> Inputs Text Fields Labels
    Blues.Labels = function() {
        var input_elements =
                'input[type=text],'+
                'input[type=password],'+
                'input[type=email],'+
                'input[type=url],'+
                'input[type=tel],'+
                'input[type=number],'+
                'input[type=search],'+
                'textarea',
            elements = document.querySelectorAll(input_elements);
        var CheckInput = function(input) {
            var bzinput = input.parentNode;
            if (input.value.length > 0 || input.placeholder.length > 0) {
                bzinput.className += ' ' + 'highlight';
            } else {
                bzinput.bzdeleteClass('highlight');
            }
        },
        checkOnFocus = function(input) {
            var bzinput = input.parentNode;
            if (!bzinput.bzhasClass('highlight')) {
                bzinput.className += ' ' + 'highlight';
            }
        },
        checkOnBlur = function(input) {
            CheckInput(input);
        };
        for (var i = 0; i < elements.length; i++) {
            var $input = elements[i];
            CheckInput($input);
            $input.addEventListener('focus', function() {
                var that = this;
                checkOnFocus(that);
            });
            $input.addEventListener('blur', function() {
                var that = this;
                checkOnBlur(that);
            });
        }
    };

    function SetBlues() {
        Blues.Modal();
        Blues.Navigation.init();
        Blues.Dropdown.init();
        Blues.Accordion.init();
        Blues.Tabs.init();
        Blues.Labels();
    };
    Blues.init = function (options) {
        var body = document.body;
        options = options || {};
        SetBlues();
    };
    return Blues;
});
Blues.init();
//==> End Of BLUES CSS Framework =========================//

Waves.attach('.bz-light-wave-init', ['waves-effect', 'waves-light']);
Waves.attach('.bz-dark-wave-init');
Waves.init();

//--> BLUES jQUERY
(function (jQuery) {
    'use strict';
    ///////////////////////////////////
    /////Start of Blues jQuery api/////
    ///////////////////////////////////
    var $ = jQuery;
    if (!jQuery) { throw new Error("Aiwee requires jQuery") }

    $.fn.getquiq = function() {
        return this.each(function() {
            var that = $(this);
            that.on('click', function(evt){
                $(this).addClass('actived');
                evt.stopPropagation();
            });
            $('body').on('click', function(event) {
                $('.bz-getquiq').removeClass('actived');
            })
            $('.kiler').on('click', function(evt){
                $(this).parents('.bz-getquiq').removeClass('actived');
                evt.stopPropagation();
            });
        });
    };

    /*
     jQuery autoComplete v1.0.7
     Copyright (c) 2014 Simon Steinberger / Pixabay
     GitHub: https://github.com/Pixabay/jQuery-autoComplete
     License: http://www.opensource.org/licenses/mit-license.php
    */

    $.fn.autoComplete = function(options){
        var o = $.extend({}, $.fn.autoComplete.defaults, options);
        // public methods
        if (typeof options == 'string') {
            this.each(function(){
                var that = $(this);
                if (options == 'destroy') {
                    $(window).off('resize.autocomplete', that.updateSC);
                    that.off('blur.autocomplete focus.autocomplete keydown.autocomplete keyup.autocomplete');
                    if (that.data('autocomplete'))
                        that.attr('autocomplete', that.data('autocomplete'));
                    else
                        that.removeAttr('autocomplete');
                    $(that.data('sc')).remove();
                    that.removeData('sc').removeData('autocomplete');
                }
            });
            return this;
        }

        return this.each(function(){
            var that = $(this);
            // sc = 'suggestions container'
            that.sc = $('<div class="autocomplete-suggestions '+o.menuClass+'"></div>');
            that.data('sc', that.sc).data('autocomplete', that.attr('autocomplete'));
            that.attr('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = function(resize, next){
                that.sc.css({
                    top: that.offset().top + that.outerHeight(),
                    left: that.offset().left,
                    width: that.outerWidth()
                });
                if (!resize) {
                    that.sc.show();
                    if (!that.sc.maxHeight) that.sc.maxHeight = parseInt(that.sc.css('max-height'));
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = $('.autocomplete-suggestion', that.sc).first().outerHeight();
                    if (that.sc.suggestionHeight)
                        if (!next) that.sc.scrollTop(0);
                        else {
                            var scrTop = that.sc.scrollTop(), selTop = next.offset().top - that.sc.offset().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop(selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight);
                            else if (selTop < 0)
                                that.sc.scrollTop(selTop + scrTop);
                        }
                }
            }
            $(window).on('resize.autocomplete', that.updateSC);

            that.sc.appendTo('body');

            that.sc.on('mouseleave', '.autocomplete-suggestion', function (){
                $('.autocomplete-suggestion.selected').removeClass('selected');
            });

            that.sc.on('mouseenter', '.autocomplete-suggestion', function (){
                $('.autocomplete-suggestion.selected').removeClass('selected');
                $(this).addClass('selected');
            });

            that.sc.on('mousedown click', '.autocomplete-suggestion', function (e){
                var item = $(this), v = item.data('val');
                if (v || item.hasClass('autocomplete-suggestion')) { // else outside click
                    that.val(v);
                    o.onSelect(e, v, item);
                    that.sc.hide();
                }
                return false;
            });

            that.on('blur.autocomplete', function(){
                try { var over_sb = $('.autocomplete-suggestions:hover').length; } catch(e){ over_sb = 0; } // IE7 fix :hover
                if (!over_sb) {
                    that.last_val = that.val();
                    that.sc.hide();
                    setTimeout(function(){ that.sc.hide(); }, 350); // hide suggestions on fast input
                } else if (!that.is(':focus')) setTimeout(function(){ that.focus(); }, 20);
            });

            if (!o.minChars) that.on('focus.autocomplete', function(){ that.last_val = '\n'; that.trigger('keyup.autocomplete'); });

            function suggest(data){
                var val = that.val();
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i=0;i<data.length;i++) s += o.renderItem(data[i], val);
                    that.sc.html(s);
                    that.updateSC(0);
                }
                else
                    that.sc.hide();
            }

            that.on('keydown.autocomplete', function(e){
                // down (40), up (38)
                if ((e.which == 40 || e.which == 38) && that.sc.html()) {
                    var next, sel = $('.autocomplete-suggestion.selected', that.sc);
                    if (!sel.length) {
                        next = (e.which == 40) ? $('.autocomplete-suggestion', that.sc).first() : $('.autocomplete-suggestion', that.sc).last();
                        that.val(next.addClass('selected').data('val'));
                    } else {
                        next = (e.which == 40) ? sel.next('.autocomplete-suggestion') : sel.prev('.autocomplete-suggestion');
                        if (next.length) { sel.removeClass('selected'); that.val(next.addClass('selected').data('val')); }
                        else { sel.removeClass('selected'); that.val(that.last_val); next = 0; }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (e.which == 27) that.val(that.last_val).sc.hide();
                // enter or tab
                else if (e.which == 13 || e.which == 9) {
                    var sel = $('.autocomplete-suggestion.selected', that.sc);
                    if (sel.length && that.sc.is(':visible')) { o.onSelect(e, sel.data('val'), sel); setTimeout(function(){ that.sc.hide(); }, 20); }
                }
            });

            that.on('keyup.autocomplete', function(e){
                if (!~$.inArray(e.which, [13, 27, 35, 36, 37, 38, 39, 40])) {
                    var val = that.val();
                    if (val.length >= o.minChars) {
                        if (val != that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (var i=1; i<val.length-o.minChars; i++) {
                                    var part = val.slice(0, val.length-i);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(function(){ o.source(val, suggest) }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.hide();
                    }
                }
            });
        });
    }

    $.fn.autoComplete.defaults = {
        source: 0,
        minChars: 3,
        delay: 150,
        cache: 1,
        menuClass: '',
        renderItem: function (item, search){
            // escape special characters
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
        },
        onSelect: function(e, term, item){}
    };

    // End of autoComplete v1.0.7

    ///// start of loading spinner
    var loadspin = {
        _spinner: null,

        options: {
            target: null,
            icon: '', //spinner icon class fa-spinner/fa-refresh/fa-cog
            position: '', // right/left
            inside: '',
            timeout: null
        },

        init: function (options) {
            this.options = $.extend({}, this.options, options);
            this._build();
            return this;
        },

        _build: function () {
            var that = this,
                o = this.options;
            this._spinner = $('<i>').addClass('fa fa-spin fa-fw iwe-spinner');
            o.target.attr('disabled', 'disabled');
            if (o.icon === '')
                o.icon = 'fa-circle-o-notch';
            this._spinner.addClass(o.icon);
            if (o.inside == 'outside')
                this._spinner.hide().insertAfter(o.target).fadeIn('slow');
            else {
                if (o.position == 'left')
                    this._spinner.hide().prependTo(o.target).fadeIn('slow');
                else
                    this._spinner.hide().appendTo(o.target).fadeIn('slow');
            }
            this._close(o.target, o.timeout);
        },

        _close: function (elem, timeout) {
            var self = this;
            if (timeout !== null) {
                setTimeout(function () {
                    self._hide();
                    elem.removeAttr('disabled');
                }, timeout);
            }
            return this;
        },

        _hide: function () {
            var that = this;
            if (this._spinner !== undefined) {
                this._spinner.fadeOut('slow', function () {
                    $(this).remove();
                });
                return this;
            } else {
                return false;
            }
        }
    };

    $.Loadspin = function (options) {
        return Object.create(loadspin).init(options);
    };

    $.Loadspin.show = function (el, ins, pos, timeout, ico) {
        return $.Loadspin({
            target: el,
            inside: ins,
            position: pos,
            timeout: timeout,
            icon: ico
        });
    };

    $.Loadspin.close = function (elem, ins, timeout) {
        var spin;
        if (ins === 'inside')
            spin = elem.next('i');
        else
            spin = elem.find('i');
        if (timeout !== null) {
            setTimeout(function () {
                spin.fadeOut('slow', function () {
                    $(this).remove();
                });;
            }, timeout);
        } else {
            spin.fadeOut('slow', function () {
                $(this).remove();
            });
        }
        elem.removeAttr('disabled');
    };
    ///// end of loading spinner


    $(window).load(function () {



    });

    $(document).ready(function() {
        // $('body').append($('<div id="bz-loading"><div class="bz-spin"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div></div>'));
        // setTimeout(function(){
        //     $('#bz-loading').remove();
        // }, 3000);


        $('.bz-getquiq').getquiq();
    });

})(jQuery, document, window);