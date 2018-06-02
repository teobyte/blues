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
    ///////////////////////////////////////////////////////
    // Blues Start
    var Blues = {};
    ///////////////////////////////////////////////////////
    // Blues Regular Expresions
    Blues.regex = {
        whitespace: /\s/g,
        multispaces: /  +/g,
        nonwordchars: /[^\w \xC0-\xFF]/g
        // numbers: /[^a-z ]\ *([.0-9])*\d/g,
        // tag: /<.*?>/g,
        // hashtag: /\B#([a-z0-9]{2,})(?![~!@#$%^&*()=+_`\-\|\/'\[\]\{\}]|[?.,]*\w)/ig,
        // htmltags: /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/ig,
        // url: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig,
    };
    ///////////////////////////////////////////////////////
    // Blues Checking Methods
    Blues.check = {
        // check if object
        // returns @true if Object
        ifObject: function(obj) {
            return obj !== null && typeof obj === 'object';
        },
        // check if window
        // returns @true if window
        ifWindow: function(obj) {
            return obj != null && obj == obj.window
        },
        // check if function
        ifFunction: function(func) {
            return func && {}.toString.call(func) === '[object Function]';
        },
        // check if document
        // returns @true if document
        ifDocument: function(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE
        },
        // check if string
        ifString: function(string) {
            return typeof string === 'string'
        },
        // check if string has whitespaces
        ifWhitespaces: function(string) {
            return Blues.regex.whitespace.test(string);
        },
        // chick if string is identifier
        ifIdentifier: function(identifier_name) {
            if (!Blues.check.ifWhitespaces(identifier_name))
                return identifier_name[0] === '#';
            else return false;
        },
        // chick if string is identifier
        ifClassname: function(class_name) {
            if (!Blues.check.ifWhitespaces(class_name))
                return class_name[0] === '.';
            else return false;
        },
        // check if selector is HTML tag
        // returns @true if valid html tag
        ifValidTag: function (tag_name) {
            var tags = 'a abbr address area article aside audio ' +
                'b base bdo blockquote body br button ' +
                'canvas caption cite code col colgroup ' +
                'datalist dd del details dfn dialog div dl dt ' +
                'em embed ' +
                'filedset figcaption figure footer form '+
                'head header hr html ' +
                'h1 h2 h3 h4 h5 h6 h7 h8 h9 ' +
                'i iframe img ins input ' +
                'kbd keygen label legend li link ' +
                'map mark menu menuitem meta meter nav' +
                'object ol opt optgroup option output ' +
                'p param pre progress q' +
                's samp script section select small source span strong style sub summary sup ' +
                'table td th tr tbody thead textarea time title track ' +
                'u ul var video'.split(' ');
            return tags.indexOf(tag_name.trim().toLowerCase()) > -1;
        },
        // check if dom node
        // returns @true if dom Node
        ifDomNode: function(dom_node){
            return (
                typeof Node === "object" ? dom_node instanceof Node :
                    dom_node && typeof dom_node === "object" && typeof dom_node.nodeType === "number" && typeof dom_node.nodeName==="string"
            )
        },
        // check if dom element
        // returns @true if it is a DOM element
        ifDomElement: function(dom_element){
            return (
                typeof HTMLElement === "object" ? dom_element instanceof HTMLElement :
                    dom_element && typeof dom_element === "object" && dom_element !== null && dom_element.nodeType === 1 && typeof dom_element.nodeName==="string"
            )
        },
        // checks if selector is attribute ["name"] selector
        // returns @true selector is attribute ["name"]
        ifElemName: function(element_name) {
            return element_name.substring(1, 6) === 'name=';
        },
        // check if attribute = name attribute
        // returns @true if name attribute
        ifAttrName: function(element_atribute) {
            if (!Blues.check.ifWhitespaces(element_atribute))
                return element_atribute[0] === '[' && element_atribute[element_atribute.length - 1] === ']';
            else return false;
        },
        // check if selector have no spaces or special characters
        // returns @true if selector simple
        ifSimpleSelector: function(selector) {
            if (!Blues.check.ifWhitespaces(selector)) {
                return !selector.includes('#', 1) &&
                    !selector.includes('.', 1) &&
                    !selector.includes('[', 1) // &&
                //!selector.includes(']', selector.length - 1) &&
                //!selector.includes('=')
            } else return false;

        },
        // check if selector id double selector
        // returns array of 2 simple selectors
        ifDoubleSelector: function(selector) {
            if (Blues.check.ifWhitespaces(selector)) {
                var selarr = selector.split(' ');
                if (selarr.length === 2)
                    return [ selarr[0], selarr[1] ];
            }
            return false;
        },
        // check if Array
        // returns @true if Array[]
        ifArray: function(obj) {
            // Use compiler's own isArray when available
            if (Array.isArray) {
                return Array.isArray(obj)
            }
            // Retain references to variables for performance optimization
            var objectToStringFn = Object.prototype.toString,
                arrayToStringResult = objectToStringFn.call([]);

            return function(obj){ return obj instanceof Array } || function (obj) {
                return objectToStringFn.call(obj) === arrayToStringResult;
            };
        },
        // check if NodeList or HTMLCollection
        // returns @true if list/collection
        ifNodeList: function(nodes) {
            if (nodes === null)
                return false;
            var result = Object.prototype.toString.call(nodes);
            // modern browser such as IE9 / firefox / chrome etc.
            if (result === '[object HTMLCollection]' || result === '[object NodeList]') {
                return true;
            }
            //ie 6/7/8
            if (typeof(nodes) != 'object') {
                return false;
            }
            // detect length and item
            if (!('length' in nodes) || !('item' in nodes)) {
                return false;
            }
            // use the trick NodeList(index),all browsers support
            try {
                if (nodes(0) === null || (nodes(0) && nodes(0).tagName)) return true;
            }
            catch (e) {
                return false;
            }
            return false;
        },
        // check if selector with params
        // returns @true
        ifSelectorParams: function(selector) {
            if (Blues.check.ifWhitespaces(selector)) {
                return false;
            } else {
                if (selector[0] === '#' || selector[0] === '.') {
                    selector = selector.substring(1);
                    return Blues.regex.nonwordchars.test(selector);
                } else {
                    return Blues.regex.nonwordchars.test(selector);
                }
            }
        },
        //
        ifEmpty: function (x) {
            return typeof x == 'undefined' || x.length == 0 || x == null;
        },
        //
        ifCssJson: function (node) {
            return !Blues.check.ifEmpty(node) ? (node.attr && node.rule) : false;
        },
        //
        ifValidStyleNode: function (node) {
            return (node instanceof HTMLStyleElement) && node.sheet.cssRules.length > 0;
        },
        isEqualObjects: function (first, second) {
            return (first && second && typeof first === 'object' && typeof second === 'object') ?
                (Object.keys(first).length === Object.keys(second).length) &&
                Object.keys(first).reduce(function(isEqual, key) {
                    return isEqual && isEqualObjects(first[key], second[key]);
                }, true) : (first === second);
        }

    };
    ///////////////////////////////////////////////////////
    // Blues Converting Methods
    Blues.convert = {
        // converts html string to [Object HTMLElement]
        stringToHtmlNode: function(html) {
            // creates temporary wrapper
            //var tempElem = document.createElement('div');
            var tempElem = document.createElement('div');
            // insert html
            tempElem.innerHTML = html;
            // returns wrapper childNode
            return tempElem.childNodes[0];
        },
        // converts node's list to the array[]
        nodeListToArray: function(nodes) {
            return [].slice.call(nodes);
        },
        // converts string to array
        stringToArray: function(string) {
            string = string.replace(Blues.regex.multispaces, ' ');
            string = string.replace(' ,', ',');
            return string = string.split(',');
        },
        objectToArray: function(obj) {
            if (!Blues.check.ifObject(obj)) return null;
            return Object.keys(obj).map(function(key) {
                return [key, obj[key]];
            });
        }
    };
    ///////////////////////////////////////////////////////
    // Blues Extracting Methods
    Blues.extract = {
        // extracts name from attribute [name=XXXX]
        // ToDo: think off better extractor
        attrNameFromString: function(selector) {
            selector = selector.substring(1);
            selector = selector.substring(0, selector.length - 1);
            return selector.split('=')[1];
        },
        // o = { "one": "apple", "two": "bananna", "three":"prune"};
        // var idx = 0;
        // prop = Object.keys(o)[idx]; // one
        // value = o[prop]             // apple
        // getMapValue(o, "key3");    // value3
        // getMapKeyValue(o, "key1");  // { key: "one", value: "apple" }
        // getMapKeyValueByIndex(o,2); // { key: "three", value: "prune" }
        getMapValue: function(obj, key) {
            if (obj.hasOwnProperty(key))
                return obj[key];
            throw new Error("Invalid map key.");
        },
        getMapKeyValue: function(obj, key) {
            if (obj.hasOwnProperty(key))
                return { key: key, value: obj[key] };
            throw new Error("Invalid map key.");
        },
        getMapKeyValueByIndex: function(obj, idx) {
            var key = Object.keys(obj)[idx];
            return { key: key, value: obj[key] };
        }
    };
    ///////////////////////////////////////////////////////
    // Blues Helpers Methods
    Blues.help = {
        // add nodes to Object NodeList
        combineNodeLists: function(nodelist, newnodes) {
            var tempArr = new Array();
            if (nodelist) {
                var nList = Blues.convert.nodeListToArray(nodelist);
                for (var i = 0; i < nList.length; i++ ) {
                    tempArr.push(nList[i]);
                }
            }
            if (newnodes) {
                var nnList = Blues.convert.nodeListToArray(newnodes);
                for (var j = 0; j < nnList.length; j++ ) {
                    tempArr.push(nnList[j]);
                }
            }
            return tempArr;
        },
        // Time stamp
        timestamp: function () {
            return Date.now() || +new Date();
        }
    };
    ///////////////////////////////////////////////////////
    // Blues DOM Methods
    Blues.dom = {
        // query selector all handler
        qsa: function(selector, incontext, incontextName) {
            var context = incontext || document;
            var elem;
            var parents = function(elem, selector) {
                var parents = [];
                while (elem = elem.parentNode) {
                    (elem.matches && elem.matches(selector)) ? parents.push(elem) : '';
                }
                return parents;
            };
            if (Blues.check.ifSimpleSelector(selector)) {
                // check if selector identifier
                if (Blues.check.ifIdentifier(selector)) {
                    elem = context.getElementById(selector.substring(1));
                }
                // check if selector class
                else if(Blues.check.ifClassname(selector)) {
                    //elem = context.getElementsByClassName(selector.substring(1));
                    var elems = document.getElementsByClassName(selector.substring(1));
                    if (elems.length > 1) {
                        elem = new Array();
                        if (incontextName != undefined) {
                            for (var i=0; i < elems.length; i++) {
                                if (parents(elems[i], incontextName).length > 0) {
                                    elem.push(elems[i]);
                                }
                            }
                        } else {
                            elem = elems;
                        }
                    } else {
                        elem = elems[0];
                    }
                }
                // check if selector attribute name
                else if(Blues.check.ifElemName(selector)) {
                    var name = Blues.extract.attrNameFromString(selector);
                    var elems = document.getElementsByName(name);
                    if (elems.length > 1) {
                        elem = new Array();
                        if (incontextName != undefined) {
                            for (var i=0; i < elems.length; i++) {
                                if (parents(elems[i], incontextName).length > 0) {
                                    elem.push(elems[i]);
                                }
                            }
                        } else {
                            elem = elems;
                        }
                    } else {
                        elem = elems[0];
                    }
                }
                // check if selector attribute
                else if (Blues.check.ifAttrName(selector)) {
                    var elems = document.querySelectorAll(selector);
                    if (elems.length > 1) {
                        elem = new Array();
                        if (incontextName != undefined) {
                            for (var i=0; i < elems.length; i++) {
                                if (parents(elems[i], incontextName).length > 0) {
                                    elem.push(elems[i]);
                                }
                            }
                        } else {
                            elem = elems;
                        }
                    } else {
                        elem = elems[0];
                    }
                }
                // check if selector tag name
                else if(!Blues.check.ifIdentifier(selector) && !Blues.check.ifClassname(selector) && !Blues.check.ifElemName(selector) && Blues.check.ifValidTag(selector)) {
                    //alert(incontextName);
                    //elem = document.getElementsByTagName(selector);

                    var elems = document.getElementsByTagName(selector);
                    if (elems.length > 1) {
                        elem = new Array();
                        if (incontextName != undefined) {
                            for (var i=0; i < elems.length; i++) {
                                if (parents(elems[i], incontextName).length > 0) {
                                    elem.push(elems[i]);
                                }
                            }
                        } else {
                            elem = elems;
                        }
                    } else {
                        elem = elems[0];
                    }

                }
                // if can't handle try querySelectorAll
                else {
                    elem = context.querySelectorAll(selector);
                }
                //alert(elem[0].outerHTML);
            }
            // if can't handle try querySelectorAll
            else {
                elem = context.querySelectorAll(selector);
            }
            return elem;
        },
        // handle selector context
        handleContext: function(selector) {
            var elem, context;
            var selArray = selector.replace(/  +/g, ' ').split(' ');
            function findElements(selector, context, contextName) {
                var felem;
                for (var j = 0; j < context.length; j++) {
                    var foundelem = Blues.dom.qsa(selector, context[j], contextName);
                    felem = Blues.help.combineNodeLists(felem, foundelem);
                }
                return felem;
            }
            for (var i = 0; i < selArray.length - 1; i++) {
                context = Blues.dom.qsa(selArray[i]);
                if (!Blues.check.ifArray(context) && !Blues.check.ifNodeList(context)) {
                    elem = Blues.dom.qsa(selArray[i + 1], context);
                }
                // multiple context
                // if (Blues.check.ifClassname(selArray[i + 1])) {
                //     alert(context);
                //     elem = findElements(selArray[i + 1], context, selArray[i]);
                // } else
                if (context.length > 1) {
                    //elem = findElements(selArray[i + 1], context, selArray[i]);
                    elem = Blues.dom.qsa(selArray[i + 1], context, selArray[i]);
                } else if (context.length === 1 || Blues.check.ifDomNode(context)) {
                    //elem = findElements(selArray[i + 1], context, selArray[i]);
                    elem = Blues.dom.qsa(selArray[i + 1], context, selArray[i]);
                }
            }
            return elem;
        },
        // handle string selector
        handleStringSelector: function(selector) {
            var elem;
            if (Blues.check.ifSelectorParams(selector)) {
                // ToDo: create bette handler
                elem = document.querySelectorAll(selector);
            } else if (Blues.check.ifWhitespaces(selector)) {
                elem = Blues.dom.handleContext(selector);
            } else {
                elem = Blues.dom.qsa(selector);
            }
            return elem;
        },
        // creates fragment or html element
        createFragment: function(selector) {
            var elem;
            var nodeName = selector.replace('<','').replace('>','');
            if (Blues.check.ifValidTag(nodeName)) {
                elem = document.createElement(nodeName);
            }
            if (!elem) {
                var elem = Blues.convert.stringToHtmlNode(selector);
            }
            return elem;
        },
        // universal selector handler
        bluesSelector: function(selector, incontext) {
            // remove whitespaces at start/end of the selector string
            selector = selector.trim();
            var context = incontext || document;
            var elem;
            if (Blues.check.ifString(selector)) {
                if (selector[ 0 ] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3) {
                    elem = Blues.dom.createFragment(selector);
                } else {
                    elem = Blues.dom.handleStringSelector(selector);
                }
                if(elem && elem.length === 1) {
                    return elem[0];
                } else {
                    return elem;
                }
            }
            else if (Blues.check.ifWindow(selector)) {
                return selector;
            }
            else if (Blues.check.ifDocument(selector)) {
                return selector;
            }
            else {
                return null;
            }
        }
    }
    ///////////////////////////////////////////////////////
    //
    // General Blues Selector -/ DOM GBS
    Blues.bzSel = function(selector) {
        if (!selector)
            return null;
        var el = Blues.dom.bluesSelector(selector);
        //alert('bzSel out: ' + el);
        if (Blues.check.ifNodeList(el)) {
            el = Blues.convert.nodeListToArray(el);
        }
        return el;
    };
    // element prototype
    var bzObject = function(selector) {
        this.selector = selector || null; //The selector being targeted
        this.el = null; //The actual DOM element
        this.data = []; // containing data
    };
    // initiate element
    bzObject.prototype.init = function() {
        this.el = Blues.bzSel(this.selector);
        if (Blues.check.ifArray(this.el) || Blues.check.ifNodeList(this.el)) {
            this.length = this.el.length;
        }
    };
    // select or create element by selector bzDom('selector')
    Blues.bzDom = function(selector, settings){
        var element = null,
            key = 0; // to avoid wrong object Detection
        if (selector === undefined || selector === null) {
            //alert('0 nope' + selector);
            element = new bzObject();
            return element.el = null;
        }
        if (Blues.check.ifFunction(selector)) {
            //alert('what?' + selector);
            return bzDom(document).ready(selector)
        }
        else if (Object.getPrototypeOf(selector) === bzObject.prototype) {
            //alert('1'+ selector);
            element = selector;
            key = 1;
        }
        else if (selector[0] !== '<' && key === 0 && (selector instanceof Node || selector instanceof Window)) {
            //alert('2'+ selector);
            element = new bzObject(); // new bzObject
            element.el = selector;
        }
        else {
            //alert('3'+ selector);
            element = new bzObject(selector); // new bzObject
            element.init();// initialize the bzObject
        }
        // if bzDom is single dom node and not a window or document
        if (!Blues.check.ifWindow(element.el) && !Blues.check.ifDocument(element.el) && (Blues.check.ifDomElement(element.el) || Blues.check.ifDomNode(element.el))) {
            // add settings to node element
            Blues.addSettings(element, settings);
            // add quick settings selectors node element
            if (element.el !== null) {
                element.display = getComputedStyle(element.el)['display'];
                var elmt = element.el;
                // get quick element info
                element.class = elmt.className;
                if (elmt.hasAttribute('id'))
                    element.id = elmt.getAttribute('id');
                // get element name
                if (elmt.hasAttribute('name'))
                    element.name = elmt.getAttribute('name');
                // get href of the <a> element
                if (elmt.hasAttribute('href'))
                    element.href = elmt.getAttribute('href');
                // get action url assigned to the element
                if (elmt.hasAttribute('data-action'))
                    element.action = elmt.getAttribute('data-action');
                // get controller name assigned to the element
                if (elmt.hasAttribute('data-ctr'))
                    element.ctr = elmt.getAttribute('data-ctr');
                // get action name assigned to the element
                if (elmt.hasAttribute('data-act'))
                    element.act = elmt.getAttribute('data-act');
                // get src assigned to the <img> element
                if (elmt.hasAttribute('src'))
                    element.src = elmt.getAttribute('src');
            }
        }
        //return the bzObject
        if (Blues.check.ifArray(element.el)) {
            //alert('array');
            return element;
        } else if (Blues.check.ifNodeList(element.el)) {
            //alert('node list');
            Blues.convert.nodeListToArray(element.el);
            return element;
        } else {
            return element;
        }
    };
    /////- DHM -// DOM MANIPULATION (DOMM) ////////////
    // on document ready
    bzObject.prototype.ready = function(callback) {
        var ready = false;
        var completed = function() {
            if(!ready && (document.addEventListener || event.type === "load" || document.readyState === "complete")) {
                ready = true;
                detach();
                callback();
            }
        };
        var detach = function() {
            if(document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", completed);
                window.removeEventListener("load", completed);
            } else {
                document.detachEvent("onreadystatechange", completed);
                window.detachEvent("onload", completed);
            }
        };
        if(document.readyState === "complete") {
            callback();
        } else if(document.addEventListener) {
            document.addEventListener("DOMContentLoaded", completed);
            window.addEventListener("load", completed);
        } else {
            document.attachEvent("onreadystatechange", completed);
            window.attachEvent("onload", completed);
            var top = false;
            try {
                top = window.frameElement == null && document.documentElement;
            } catch(e) {}
            if(top && top.doScroll) {
                (function scrollCheck() {
                    if(ready) return;
                    try {
                        top.doScroll("left");
                    } catch(e) {
                        return setTimeout(scrollCheck, 50);
                    }
                    ready = true;
                    detach();
                    callback();
                })();
            }
        }
    };
    // check if element exist
    bzObject.prototype.exist = function() {
        if (this === undefined || this === null ||
            this.el === undefined || this.el === null)
            return false;
        if (this.el.length > 0 && (Blues.check.ifArray(this.el) || Blues.check.ifNodeList(this.el)))
            return true;
        // if (this.el) {
        //     this.el.outerHTML === undefined || this.el.outerHTML === null
        //     return false;
        // }
        if (this.el) {
            if (this.el.outerHTML) return true;
        }
        return false;
    };
    //// ATTRIBUTES //////////////////////////////////////////////////
    // if the element has a class
    bzObject.prototype.ifclass = function(classname) {
        var elem = this.el;
        return elem.className && new RegExp("(^|\\s)" + classname + "(\\s|$)").test(elem.className);
    };
    // add class to the element
    bzObject.prototype.onclass = function(classname) {
        var elem = this.el;
        if (!classname)
            return elem.className;
        // add handle multi classes
        // if unknown return element object
        else if (typeof classname === 'string')
        //ToDo: check browser compatibility
        // new way
        //elem.classList.add(classname);
        //old way
            elem.className ? elem.className += ' ' + classname : elem.className = classname;
        else
            return this;
        return this;
    };
    // remove class from the element
    bzObject.prototype.offclass = function(classname) {
        var elem = this.el;
        if (!classname)
            return this;
        // add handle multi classes
        // if unknown return element object
        else if (typeof classname === 'string') {
            //ToDo: check browser compatibility
            // new way
            //elem.classList.remove(classname);
            var regex = new RegExp('(?:\\s|^)' + classname + '(?:\\s|$)');
            elem.className = elem.className.replace(regex, ' ').replace(/  +/g, ' ');
        }
        else
            return this;
        return this;
    };
    // toggle element class
    bzObject.prototype.toggleclass = function(classname) {
        var elem = this;
        elem.ifclass(classname) ? elem.offclass(classname) : elem.onclass(classname);
        return elem;
    };
    // get all attributes array
    bzObject.prototype.allattr = function() {
        var elem = this.el;
        var atts = {};
        Array.prototype.slice.call(elem.attributes).forEach(function(item) {
            atts[item.name] = item.value;
        });
        return atts;
    };
    // get/set/check the element's attribute
    bzObject.prototype.onattr = function(name, value) {
        var elem = this.el;
        if (value) {
            elem.setAttribute(name, value);
            return this;
        } else if (elem.hasAttribute(name))
            return elem.getAttribute(name);
        else
            return elem.hasAttribute(name);
    };
    // remove attribute of the element
    bzObject.prototype.offattr = function(name) {
        var elem = this.el;
        elem.removeAttribute(name);
        return this;
    };
    // get/set/check element data-* attribute
    bzObject.prototype.ondata = function(name, value) {
        var elem = this.el,
            name = 'data-' + name;
        // if method has income value set attribute
        if (value) {
            elem.setAttribute(name, value);
            return this;
            //if elem has such attribute return it's value
        } else if (elem.hasAttribute(name))
            return elem.getAttribute(name);
        // if no such attribute return true/false
        else
            return elem.hasAttribute(name);
    };
    // remove data of the element
    bzObject.prototype.offdata = function(name) {
        var elem = this.el;
        elem.removeAttribute('data-' + name);
        return this;
    };
    //// STYLES /////////////////////////////////////////////////////
    // get/set element width
    bzObject.prototype.width = function(width) {
        var elem = this.el;
        if (width && typeof width === 'string')
            elem.style.width = width;
        else
            return elem.clientWidth;
    };
    // get/set element height
    bzObject.prototype.height = function(height) {
        var elem = this.el;
        if (typeof height === 'string')
            elem.style.width = height;
        else
            return elem.clientHeight;
    };
    // get/set element offset width
    bzObject.prototype.offWidth = function() {
        var elem = this.el;
        return elem.offsetWidth;
    };
    // get/set element offset height
    bzObject.prototype.offHeight = function() {
        var elem = this.el;
        return elem.offsetHeight;
    };
    // apply css style or { style's object } to element
    bzObject.prototype.oncss = function(prop, value) {
        var elem = this.el;
        // ToDo: check if prop object
        if (typeof prop !== 'string') {
            var s = null;
            var keys = Object.keys(prop);
            if (keys.length > 0) {
                for (s in prop)
                    elem.style[s] = prop[s];
            }
        } else if (!value) {
            value = window.getComputedStyle(elem, null).getPropertyValue(prop);
            return value;
        }
        else {
            elem.style[prop] = value;
            return this;
        }
    };
    //// EVENTS /////////////////////////////////////////////////////
    // element event handler
    bzObject.prototype.eventHandler = {
        events: [], //Array of events the element is subscribed to.
        bindEvent: function(event, callback, targetElement) {
            if (targetElement) {
                //remove any duplicate event
                this.unbindEvent(event,targetElement);
                //bind event listener to DOM element
                targetElement.addEventListener(event, callback, false);
                this.events.push({
                    type: event,
                    event: callback,
                    target: targetElement
                }); //push the new event into our events array.
            }
        },
        findEvent: function(event) {
            return this.events.filter(function(evt) {
                return (evt.type === event); //if event type is a match return
            }, event)[0];
        },
        unbindEvent: function(event, targetElement) {
            if (targetElement) {
                //search events
                var foundEvent = this.findEvent(event);
                //remove event listener if found
                if (foundEvent !== undefined) {
                    targetElement.removeEventListener(event, foundEvent.event, false);
                }
                //update the events array
                this.events = this.events.filter(function(evt) {
                    return (evt.type !== event);
                }, event);
            }
        }
    };
    // addEvenetListener to element
    bzObject.prototype.on = function(event, callback) {
        var elem = this.el;
        if (Blues.check.ifArray(elem) || Blues.check.ifNodeList(elem))
        {
            for (var i = 0; i < elem.length; i++)
                bzDom(elem[i]).on(event, callback);
        }
        else {
            this.eventHandler.bindEvent(event, callback, elem);
        }
    };
    // removeElementListener
    bzObject.prototype.off = function(event) {
        var elem = this.el;
        if (Blues.check.ifArray(elem) || Blues.check.ifNodeList(elem))
        {
            for (var i = 0; i < elem.length; i++)
                bzDom(elem[i]).off(event, callback);
        }
        else {
            this.eventHandler.unbindEvent(event, elem);
        }
        return this;
    };
    // bind multiple events
    bzObject.prototype.bind = function(events) {
        for (var evnt in events) {
            this.eventHandler.bindEvent(evnt, events[evnt], this.el);
        }
    };
    //unbind multiple events
    //ToDo: check it
    bzObject.prototype.unbind = function(events) {
        events = convert.stringToArray(events);
        for (var i = 0; i < events.length; i++) {
            this.eventHandler.unbindEvent(events[i], this.el);
        }
        return this;
    };
    // trigger element event
    bzObject.prototype.trigger = function(evnt) {
        var elem = this.el;
        var triggit = new Event(evnt);
        elem.dispatchEvent(triggit);
    };
    // check checkbox, radio or switch
    bzObject.prototype.checkon = function() {
        var elem = this.el;
        if (!elem.hasAttribute('checked')) {
            // check
            //elem.setAttribute('checked', 'checked');
            //elem.checked = true;
            bzDom(elem).trigger('change');
        }
    };
    // uncheck checkbox, radio or switch
    bzObject.prototype.checkoff = function() {
        var elem = this.el;
        if (elem.hasAttribute('checked')) {
            // uncheck
            //elem.removeAttribute('checked');
            //elem.checked = false;
            bzDom(elem).trigger('change');
        }
    };
    // toggle events of checkbox or switch
    bzObject.prototype.toggle = function(oncallback, offcallback) {
        var elem = this.el;
        if (oncallback === undefined && offcallback === undefined) {
            if (elem.hasAttribute('checked')) {
                // uncheck
                elem.removeAttribute('checked');
                elem.checked = false;
            } else {
                // check
                elem.setAttribute('checked', 'checked');
                elem.checked = true;
            }
        }
        function callback() {
            if (elem.hasAttribute('checked')) {
                // uncheck
                elem.removeAttribute('checked');
                elem.checked = false;
                if (offcallback && Blues.check.ifFunction(offcallback))
                    offcallback();
            } else {
                // check
                elem.setAttribute('checked', 'checked');
                elem.checked = true;
                if (oncallback && Blues.check.ifFunction(oncallback))
                    oncallback();
            }
        }
        this.eventHandler.bindEvent('change', callback, elem);
    };
    ///////////////////////////////////////////////////////
    // get element.value
    bzObject.prototype.val = function(newVal) {
        return (newVal !== undefined ? this.el.value = newVal : this.el.value);
    };
    // get element HTML
    bzObject.prototype.inhtml = function(html) {
        if(html === undefined)
            return this.el.innerHTML;
        this.el.innerHTML = html;
        return this;
    };
    // get element outer HTML
    bzObject.prototype.outhtml = function() {
        return this.el.outerHTML;
    };
    // get/add text to an element
    bzObject.prototype.text = function(text, add) {
        if(text === undefined)
            return this.el.textContent;
        if (add === 'add')
            this.el.textContent = this.el.textContent + text;
        else
            this.el.textContent = text;
        return this;
    };
    // focus element
    bzObject.prototype.focus = function(mode) {
        if (mode === 'check' && this.el.hasFocus())
            return true;
        else this.el.focus();
    };
    //// FILTERS ///////////////////////////////////////////////////
    // check if element has other element
    bzObject.prototype.has = function(selector) {
        var nodeList = document.querySelectorAll(this.el);
        [].filter.call(nodeList, function (node) {
            return node.querySelector(selector);
        });
    };
    // check if element
    bzObject.prototype.is = function(selector) {
        var nodeList = document.querySelectorAll(this.el);
        [].some.call(nodeList, function (node) {
            return node.matches(selector);
        });
    };
    // get first child
    bzObject.prototype.first = function(selector) {
        var items = this.el;
        return bzDom(items[0]);
    };
    // get child by index
    bzObject.prototype.itemon = function(index) {
        var items = this.el;
        return bzDom(items[index - 1]);
    };
    // get last child
    bzObject.prototype.last = function(selector) {
        var items = this.el;
        return bzDom(items[items.length - 1]);
    };
    //// EFFECTS ///////////////////////////////////////////////////
    // fade out element
    bzObject.prototype.fadeOut = function(duration, callback) {
        var elem  = this.el;
        var opacity = 1,
            interval = 50,
            duration = duration || 450,
            gap = interval / duration;
        function fade() {
            opacity = opacity - gap;
            elem.style.opacity = opacity;
            if(opacity <= 0) {
                // ToDo: check for browser compatibility
                // var display = getComputedStyle(elem)['display'];
                // if (display && display !== 'none')
                //     this.display = display;
                elem.style.display = 'none';
                window.clearInterval(fading);
                callback;
            }
        }
        var fading = window.setInterval(fade, interval);
        return this;
    };
    // fade in element
    bzObject.prototype.fadeIn = function(duration, callback) {
        var elem  = this.el;
        var opacity = 0,
            interval = 50,
            duration = duration || 450;
        if (duration === null)
            duration = 450;
        var gap = interval / duration;
        elem.style.display = 'block';
        elem.style.opacity = opacity;
        function fade() {
            opacity = opacity + gap;
            elem.style.opacity = opacity;
            if(opacity >= 1) {
                window.clearInterval(fading);
                callback;
            }

        }
        var fading = window.setInterval(fade, interval);
        return this;
    };
    // apply css to element
    bzObject.prototype.hide = function() {
        var elem = this.el;
        // ToDo: check for browser compatibility
        // var display = getComputedStyle(elem)['display'];
        // if (display && display !== 'none')
        //     this.display = display;
        elem.style.display = 'none';
        return this;
    };
    // apply css to element
    bzObject.prototype.show = function(display) {
        var elem = this.el;
        if (display)
            elem.style.display = display;
        else if (this.display && this.display !== 'none')
            elem.style.display = this.display;
        else
            elem.style.display = 'block';
        return this;
    };
    //// TRAVERSING ///////////////////////////////////////////////
    // parent element
    bzObject.prototype.parent = function(selector) {
        var elem = this.el.parentNode;
        var parent = new bzObject();
        if (!selector)
            parent.el = elem;
        else {
            if (typeof selector !== 'string') {
                //alert('0');
                return null;
            }
            else if (Blues.check.ifValidTag(selector)) {
                //alert('1');
                while (elem.tagName.toLowerCase() !== selector.toLowerCase())
                    elem = elem.parentNode;
            }
            else if (selector[0] === '#') {
                //alert('2');
                while (elem.getAttribute('id') !== selector.replace('#', ''))
                    elem = elem.parentNode;
            }
            else if (selector[0] === '.') {
                //alert('3');
                while (!bzDom(elem).ifclass(selector.replace('.', ''))) {
                    elem = elem.parentNode;
                }
            } else if(Blues.check.ifElemName(selector)) {
                //alert('4');
                //ToDo: fix it up
                elem = elem.getElementsByName(selector)[0];
            } else {
                //alert('5');
                return null;
            }
        }
        parent.el = elem;
        return parent;
    };
    // get child
    bzObject.prototype.children = function() {
        var elem = this.el.firstChild,
            child = new bzObject();
        child.el = elem;
        return child;
    };
    // test this method
    bzObject.prototype.parents = function(selector) {
        var elem = this.el;
        var parents = [];
        while (elem = elem.parentNode) {
            (elem.matches && elem.matches(selector)) ? parents.push(elem) : '';
            // More fast alternative but not supported by IE/Edge
            // while (htmlElement = htmlElement.parentNode.closest(<parentSelector>)) {
            //     parents.push(htmlElement);
            // }
        }
        return parents;
    };
    // find child elements by selector
    bzObject.prototype.find = function(selector) {
        var elem = this.el;
        var findingelem;
        if (typeof selector !== 'string') {
            //alert('0');
            return null;
        }
        else if (!Blues.check.ifWhitespaces(selector) && Blues.check.ifValidTag(selector)) {
            //alert('1');
            //ToDo: make better selector by tagname
            findingelem = elem.getElementsByTagName(selector);
            //findingelem = elem.querySelectorAll(selector);
        }
        else if (!Blues.check.ifWhitespaces(selector) && selector[0] === '#') {
            //alert('2');
            findingelem = elem.getElementById(selector.replace('#', ''));
        }
        else if (!Blues.check.ifWhitespaces(selector) && selector[0] === '.') {
            //alert(selector);
            findingelem = elem.getElementsByClassName(selector.replace('.', ''));
        } else if (!Blues.check.ifWhitespaces(selector) && Blues.check.ifElemName(selector)) {
            //alert('4' + elem.outerHTML);
            //ToDo: think of better way
            //findingelem = document.getElementsByName(extract.getAttrNameFromString(selector));
            findingelem = elem.querySelectorAll(selector);
        } else {
            //alert('5');
            findingelem = elem.querySelectorAll(selector);
        }
        var foundelem = new bzObject();
        if (Blues.check.ifNodeList(findingelem)) {
            var transEle = Blues.convert.nodeListToArray(findingelem);
            if (transEle.length === 1)
                foundelem.el = transEle[0];
            else if (transEle.length > 1)
                foundelem.el = transEle;
        } else {
            foundelem.el = findingelem;
        }
        return foundelem;
    };
    // find next sibling by selector
    bzObject.prototype.prev = function(selector, key, filter) {
        var elem = this.el;
        var newelem = new bzObject();
        if (selector) {
            // matches() polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
            }
            // Setup siblings array
            var siblings = [];
            // Get the next sibling element
            elem = elem.previousElementSibling;
            // As long as a sibling exists
            while (elem) {
                // If we've reached our match, bail
                if (elem.matches(selector)) {
                    if (key != 'until') {
                        newelem.el = elem;
                        break;
                    } else break;
                }
                if (key == 'until') {
                    // If filtering by a selector, check if the sibling matches
                    if (filter && !elem.matches(filter)) {
                        elem = elem.previousElementSibling;
                        continue;
                    }
                    // Otherwise, push it to the siblings array
                    siblings.push(elem);
                }
                // Get the next sibling element
                elem = elem.previousElementSibling;
            }
            if (key == 'until')
                newelem.el = siblings;
        } else {
            elem = elem.previousElementSibling;
            newelem.el = elem;
        }
        return newelem;
    };
    // find next sibling by selector
    bzObject.prototype.next = function(selector, key, filter) { // key = null or 'until'
        var elem = this.el;
        var newelem = new bzObject();
        if (selector) {
            // matches() polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
            }
            // Setup siblings array
            var siblings = [];
            // Get the next sibling element
            elem = elem.nextElementSibling;
            // As long as a sibling exists
            while (elem) {
                // If we've reached our match, bail
                if (elem.matches(selector)) {
                    if (key != 'until') {
                        newelem.el = elem;
                        break;
                    } else break;
                }
                if (key == 'until') {
                    // If filtering by a selector, check if the sibling matches
                    if (filter && !elem.matches(filter)) {
                        elem = elem.nextElementSibling;
                        continue;
                    }
                    // Otherwise, push it to the siblings array
                    siblings.push(elem);
                }
                // Get the next sibling element
                elem = elem.nextElementSibling;
            }
            if (key == 'until')
                newelem.el = siblings;
        } else {
            elem = elem.nextElementSibling;
            newelem.el = elem;
        }
        return newelem;
    };
    //// MANIPULATION ////////////////////////////////////////////
    // append child to the element
    bzObject.prototype.append = function(child) {
        var elem = this.el,
            key = 0; // to avoid wrong object Detection
        if (Object.getPrototypeOf(child)  === bzObject.prototype) {
            elem.appendChild(child.el);
            return this;
        } else if (key === 0 && (child instanceof Node || child instanceof Window)) {
            elem.appendChild(child);
        } else {
            elem.innerHTML += child;
            return this;
        }
    };
    // prepend child to the element
    bzObject.prototype.prepend = function(child) {
        var elem = this.el,
            key = 0; // to avoid wrong object Detection
        if (Object.getPrototypeOf(child)  === bzObject.prototype) {
            elem.insertBefore(child.el, elem.firstChild);
            return this;
        } else if (key === 0 && (child instanceof Node || child instanceof Window)) {
            elem.insertBefore(child, elem.firstChild);
        } else {
            elem.innerHTML = child + elem.innerHTML;
            return this;
        }
    };
    // insert before element
    bzObject.prototype.before = function(insertingelem) {
        var elem = this.el;
        var telem = insertingelem.el;
        var parent = elem.parentNode;
        parent.insertBefore(telem, elem);
    };
    // insert after element
    bzObject.prototype.after = function(insertingelem) {
        var elem = this.el;
        var telem = insertingelem.el;
        var parent = this.el.parentNode;
        if (parent.lastChild == elem)
            parent.appendChild(telem);
        else
            parent.insertBefore(telem, elem.nextSibling);
    };
    // wrap element into wrapper element
    bzObject.prototype.wrapinto = function(wraper) {
        var html = this.outhtml();
        wraper.inhtml(html);
        return wraper;
    };
    // clone element
    bzObject.prototype.clone = function() {
        var elem = this.el,
            cloned = new bzObject();
        cloned.el = elem.cloneNode(true);
        return cloned;
    };
    // replace one node element with another
    bzObject.prototype.replacewith = function(element) {
        var elem = this.el;
        elem.parentNode.replaceChild(element.el, elem);
    };
    // remove element from DOM element
    bzObject.prototype.remove = function() {
        if (this.el) {
            var eltodel = this.el;
            eltodel.parentNode.removeChild(eltodel);
        }
    };
    // get distance between element top/left side and
    // top/left side of the screen
    // according to the screen
    bzObject.prototype.scrollPos = function() {
        //ToDo: check for browser compatibility
        var rect = this.el.getBoundingClientRect(),
            body = document.body;
        return {
            top: rect.top + Blues.bodyScrollTop(), //body.scrollTop,
            left: rect.left + Blues.bodyScrollLeft() //body.scrollLeft
        }
    };
    // check if element in viewport
    bzObject.prototype.inViewport = function (elem) {
        //ToDo: check for browser compatibility
        var dist = this.el.getBoundingClientRect();
        return (
            dist.top >= 0 &&
            dist.left >= 0 &&
            dist.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            dist.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    // each method
    bzObject.prototype.each = function(callback) {
        var elem = this.el;
        if (Blues.check.ifArray(elem) || Blues.check.ifNodeList(elem)) {
            for (var i = 0; i < elem.length; i++) {
                callback(i, elem[i]);
            }
        } else if (Blues.check.ifDomNode(elem) || Blues.check.ifDomElement(elem)) {
            callback(0, elem);
        }
        return this;
    };
    /////- DHM -// DOCUMENT DATA MANIPULATION (DOMDM) //////////
    // Blues General Methods
    // ToDo: method then()
    // bzObject.prototype.then = function(callback) {
    //
    // };
    // form data collector
    bzObject.prototype.getformdata = function(result) {
        var form = this.el;
        if (!form || form.nodeName !== "FORM")
            return;
        result = result || 'data';
        var datastr, dataObj = {};
        var i, j, q = [];
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
            if (form.elements[i].name === "") {
                continue;
            }
            switch (form.elements[i].nodeName) {
                case 'INPUT':
                    // switch (form.elements[i].type) {
                    //     case 'text':
                    //     case 'hidden':
                    //     case 'password':1
                    //     case 'button':
                    //     case 'reset':
                    //     case 'submit':
                    //         if (result === 'string')
                    //             q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    //         if (result === 'data')
                    //             dataObj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                    //         break;
                    //     case 'checkbox':
                    //     case 'radio':
                    //         if (form.elements[i].checked) {
                    //             if (result === 'string')
                    //                 q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    //             if (result === 'data')
                    //                 dataObj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                    //         }
                    //         break;
                    // }
                    // break;
                    if (result === 'string')
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    if (result === 'data')
                        dataObj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                case 'file':
                    break;
                case 'TEXTAREA':
                    if (result === 'string')
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    if (result === 'data')
                        dataObj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                    break;
                case 'SELECT':
                    switch (form.elements[i].type) {
                        case 'select-one':
                            if (result === 'string')
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            if (result === 'data')
                                dataObj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                            break;
                        case 'select-multiple':
                            for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                if (form.elements[i].options[j].selected) {
                                    if (result === 'string')
                                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                                    if (result === 'data')
                                        dataObj[form.elements[i].name] = encodeURIComponent(form.elements[i].options[j].value)
                                }
                            }
                            break;
                    }
                    break;
                case 'BUTTON':
                    switch (form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            if (result === 'string')
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                            if (result === 'data')
                                dataObj[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                            break;
                    }
                    break;
            }
        }
        if (result === 'string')
            return datastr = q.join("&");
        if (result === 'data')
            return dataObj;
    };
    // submit form
    bzObject.prototype.submit = function() {
        var elem = this.el;
        if (elem.tagName.toLowerCase() === 'form')
            elem.submit();
        else return;
    };
    ///- DHM -// DOM BASIC SETTINGS(DOMBS) /////////////////////
    // add settings to the element
    Blues.addSettings = function(el, settings) {
        var s = settings || {};
        var elem = el.el;
        // append element into the targeted element
        if (s.appendto) {
            var target = s.appendto,
                key = 0; // to avoid wrong object Detection
            if (Object.getPrototypeOf(target) === bzObject.prototype) {
                target.el.appendChild(elem);
                key = 1;
            } else if (key === 0 && (target instanceof Node || target instanceof Window)) {
                target.appendChild(elem);
            } else if (typeof s.appendto === 'string') {
                document.querySelector(s.appendto).appendChild(elem); // check js version
            } else return;
        }
        // prepend element into the targeted element
        if (s.prependto) {
            var target = s.prependto,
                key = 0;
            if (Object.getPrototypeOf(target) === bzObject.prototype) {
                (target.el).insertBefore(elem, (target.el).firstChild);
            }
            else if (key === 0 && (target instanceof Node || target instanceof Window)) {
                target.insertBefore(elem, target.firstChild);
            }
            else if (typeof target === 'string') {
                target = document.querySelector(target);
                target.insertBefore(elem, target.firstChild);
            } else return;
        }
        // add html
        if (s.html)
            elem.innerHTML = s.html;
        // append html
        if (s.appendhtml)
            elem.innerHTML += s.appendhtml;
        //prepend html
        if (s.prependhtml)
            elem.innerHTML = s.prependhtml + elem.innerHTML;

        // append text into the element
        if (s.text)
            elem.innerHTML += (s.text).replace(/<[^>]*>/g, "");
        // attach events to the element
        if (s.bind) {
            var evnts = s.bind,
                e = null;
            for (e in evnts)
                el.eventHandler.bindEvent(e, evnts[e], elem);
        }
        // unbind event
        if (s.unbind) {
            var evnts = s.bind,
                e = null;
            for (e in evnts)
                // check multiple unbinding
                el.eventHandler.unbindEvent(e, elem);
        }
        // add classes to the element
        if (s.addclass)
            elem.className ? elem.className += ' ' + s.addclass : elem.className = s.addclass;
        // add styles to the element
        if (s.addcss) {
            var styles = s.addcss,
                stl = null;
            for (stl in styles)
                elem.style[stl] = styles[stl];
        }
        if (s.addattr) {
            var attrs = s.addattr,
                attr = null;
            for (attr in attrs)
                elem.setAttribute(attr, attrs[attr]);
        }
        // set table
        // if (s.tabledata) {
        //     var tbldata = s.tabledata;
        //     var row = null;
        //     for (var row in tbldata) {
        //         if (row === 'thead') {
        //             var tr = document.createElement('thead');
        //             var trdata = tbldata[row];
        //             var col = null;
        //             for (var col in trdata) {
        //                 var td = document.createElement('td');
        //                 td.innerHTML = col;
        //                 tr.appendChild(td);
        //             }
        //             elem.appendChild(tr);
        //         } else {
        //             var tr = document.createElement('tr');
        //             tr.setAttribute('iwe-item', row);
        //             var trdata = tbldata[row];
        //             var col = null;
        //             for (var col in trdata) {
        //                 var td = document.createElement('td');
        //                 td.innerHTML = trdata[col];
        //                 tr.appendChild(td);
        //             }
        //             elem.appendChild(tr);
        //         }
        //     }
        // }
    };
    ////////////////////////////////////////////////////////////
    Blues.parseHTML = function(htmlString) {
        var body = document.implementation.createHTMLDocument().body;
        body.innerHTML = htmlString;
        return body.childNodes;
    }
    //--> Blues Ajax Call
    Blues.ajax = function(options) {
        var ajax = ajax || {};
        var o, data, onsuccess, onerror;
        var allTypes = "*/".concat( "*" );
        var settings = {
            url: location.href,
            type: "GET",
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            dataType: '*',
            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            }
        };
        o = options || {};
        // set the type: @string 'POST/GET'
        settings.type = o.type || settings.type;
        // set the async: @boolean true/false
        settings.async = o.async || settings.async;
        // set the Content-type: @string 'application/x-www-form-urlencoded'
        settings.contentType = o.contentType || settings.contentType;
        // set Data-type
        settings.dataType = o.dataType || settings.dataType;
        // set the request url: @string '/controller/action'
        settings.url = o.url || settings.url;
        // set the data: @object { key: 'value', key2: 'value2', etc. }
        data = o.data || {};
        // function that runs on good response success: function() {}
        onsuccess = o.success || function(data) {return null;};
        // function that fires on bad response error: function() {}
        onerror = o.error || function(e) {return null;};
        // request dataTypes
        var s = settings;
        function createRequest(type, url, async){
            var xhr = typeof XMLHttpRequest != 'undefined' ?
                new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open(type, url, async);
            return xhr;
        }
        ajax = {
            init: function() {
                // prepare request data
                var reqData = JSON.stringify(data);
                // create request
                var xhr = createRequest(s.type, s.url, s.async);
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            if (this.responseText)
                                ajax.success(this.responseText);
                        } else
                            ajax.error(this.status);
                    }
                };
                // set Accept data type
                xhr.setRequestHeader('Accept',
                    s.dataType ? s.accepts[s.dataType] + (s.dataType !== '*' ? ', ' + allTypes + '; q=0.01' : '') : allTypes
                );
                // set content data type
                if (s.contentType !== null)
                    xhr.setRequestHeader('Content-type', s.contentType);
                xhr.send(reqData);
            },
            success: function(data) {
                try {
                    onsuccess(JSON.parse(data));
                } catch (e) {
                    onsuccess(data);
                }
            },
            error: function(e) {
                onerror(e);
            }
        };
        ajax.init();
        return ajax;
    };
    //--> Blues Load Spins starts here
    //--> following 2 functions work together
    Blues.Loadspin = function(element, options, hideaction, fireonstart, fireatend) {
        var Loadspin = Loadspin || {};
        options = options || {};
        var outside = options.outside || false,
            position = options.position || 'right',
            timeout = options.timeout || 0,
            spinner = options.spinner || '<div class="bz-loader"><div>',
            hideaction = hideaction || null,
            fireonstart = fireonstart || null,
            fireatend = fireatend || null;

        Loadspin = {
            _spinner: null,
            init: function() {
                this._spinner = document.createElement('span');
                this._spinner.innerHTML = spinner;
                Loadspin.show(element, this._spinner);
            },
            show: function(elem, spinner) {
                if (outside == true) {
                    if (position === 'right')
                       Blues.bzDom(elem).after(Blues.bzDom(spinner).oncss('margin-left', '5px'));
                    else if (position === 'left')
                       Blues.bzDom(elem).before(Blues.bzDom(spinner).oncss('margin-right', '5px'));
                } else {
                    if (position === 'left')
                        Blues.bzDom(elem).prepend(spinner);
                    else
                        Blues.bzDom(elem).append(spinner);
                }
                if (timeout > 0) {
                    setTimeout(function(){
                        Loadspin.hide(spinner);
                    }, timeout);
                }
                if (hideaction && (Blues.check.ifIdentifier(hideaction) || Blues.check.ifDomElement(hideaction) || hideaction instanceof bzObject)) {
                    bzDom(hideaction).on('click', function() {
                        Loadspin.hide(spinner);
                        if (fireatend && Blues.check.ifFunction(fireatend))
                            fireatend();
                    })
                }
                if (fireonstart && Blues.check.ifFunction(fireonstart))
                    fireonstart();
            },
            hide: function(elem) {
                Blues.bzDom(elem).remove();
            }
        };
        Loadspin.init();
        return Loadspin;
    };
    // deprecated
    // Blues.Hidespin = function(element, timeout) {
    //     var Hidespin = Hidespin || {},
    //         timeout = timeout || 0;
    //     Hidespin = {
    //         hide: function(elem) {
    //             var delspin = elem.getElementsByClassName('bz-loader')[0];
    //             delspin.parentNode.removeChild(delspin);
    //         }
    //     };
    //     if (timeout > 0) {
    //         setTimeout(function(){
    //             Hidespin.hide(element);
    //         }, timeout);
    //     } else
    //         Hidespin.hide(element);
    //     return Hidespin;
    // };
    // add fader
    Blues.showfader = function(target, zindex) {
        var defTarget = '.bz-content-to-fade';
        if (target === null)
            target = defTarget;
        target = target || defTarget;
        zindex = zindex || 8999;
        var fader = Blues.bzDom('<div>').onclass('bz-fader').oncss('z-index', zindex);
        Blues.bzDom(target).append(fader);
        fader.fadeIn();
        return fader;
    };
    // remove fader
    Blues.hidefader = function(hidecall) {
        hidecall = hidecall || false;
        var fader = Blues.bzDom('.bz-fader').fadeOut(500);
        setTimeout(function() {
            if (hidecall)
                hidecall();
            fader.remove();
        }, 501);
    };
    // scroll to any Dom element
    Blues.bodyScrollTop = function (position) {
        if (position)
            window.pageYOffset = document.documentElement.scrollTop = document.body.scrollTop = position;
        else return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    };
    Blues.bodyScrollLeft = function (position) {
        if (position)
            window.pageXOffset = document.documentElement.scrollLeft = document.body.scrollLeft = position;
        else return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    };
    Blues.scrollToElement = function (selector, duration) {
        var perTick = 0, difference = 0, to = 0;
        duration = duration || 500;
        if (selector)
            to = document.querySelector(selector).offsetTop;
        function scrollTo(to, duration) {
            difference = to - bz.bodyScrollTop();
            perTick = (difference / duration) * 10;
            var timeout = window.setTimeout(function() {
                window.scrollTo(0, bz.bodyScrollTop() + perTick);
                if (bz.bodyScrollTop() >= to + 100 && bz.bodyScrollTop() <= to - 100 ) {
                    window.clearTimeout(timeout);
                    return;
                }
                scrollTo(to, duration - 10);
            }, 10);
            if (duration <= 0) {
                window.clearTimeout(timeout);
                return;
            }
        }
        scrollTo(to, duration);
    };
    //--> Wave Effect on Clicks
    Blues.Waves = function(el) {
        var $this = bzDom(el),
            wave = bzDom('<div class="wave">');
        $this.append(wave);
        $this.on('click', function(e) {
            var $self = bzDom(this);
            var waveColor = $self.ondata('wave');
            var $wave = $self.find('.wave');
            if (!$wave.find(".ink").exist()) {
                var $ink = bzDom('<span class="ink"></span>');
                if (waveColor)
                    $ink.oncss('background-color', waveColor);
                $wave.append($ink);
            }
            var ink = $wave.find(".ink");
            ink.offclass("animate");
            //set size of .ink
            if (ink.height() == 0 && ink.width() == 0) {
                var d = Math.max(parseInt($wave.offWidth()), parseInt($wave.offHeight()));
                ink.oncss({ height: d + 'px', width: d + 'px' });
            }
            var x = e.pageX - $wave.scrollPos().left - ink.width() / 2;
            var y = e.pageY - $wave.scrollPos().top - ink.height() / 2;
            ink.oncss({ top: y + 'px', left: x + 'px' });
            ink.onclass("animate");
        });

    };
    ////////////////////////////////////////////////////////////////////
    // JSON TO <head><style> CSS
    var start = true;
    Blues.JSONCSS = function (jss, depth, breakline) {
        String.prototype.repeat = function (n) {
            return new Array(1 + n).join(this);
        };
        var strAttr = function (name, value, depth) {
            return '\t'.repeat(depth) + name + ': ' + value + ';\n';
        },
        strNode = function (name, value, depth) {
            var cssString = '\t'.repeat(depth) + name + ' {\n';
            cssString += Blues.JSONCSS(value, depth + 1);
            cssString += '\t'.repeat(depth) + '}\n';
            return cssString;
        };
        var cssString = '';
        if (start)
            cssString = '\n';
        if (typeof depth == 'undefined')
            depth = 0;
        if (typeof breakline == 'undefined')
            breakline = false;
        if (jss.attr) {
            for (var i in jss.attr) {
                var att = jss.attr[i];
                if (att instanceof Array) {
                    for (var j = 0; j < att.length; j++) {
                        cssString += strAttr(i, att[j], depth);
                    }
                } else {
                    cssString += strAttr(i, att, depth);
                }
            }
        }
        if (jss.rule) {
            var first = true;
            for (var k in jss.rule) {
                if (breakline && !first) {
                    cssString += '\n';
                    start = false;
                } else {
                    first = false;
                    start = false;
                }
                cssString += strNode(k, jss.rule[k], depth);
            }
        }
        start = true;
        return cssString;
    };
    Blues.JSS = function (data, id, replace) {
        var head = document.getElementsByTagName('head')[0];
        var xnode = document.getElementById(id);
        var _xnodeTest = (xnode !== null && xnode instanceof HTMLStyleElement);
        if (Blues.check.ifEmpty(data) || !(head instanceof HTMLHeadElement)) return;
        if (_xnodeTest) {
            if (replace === true || Blues.check.ifEmpty(replace)) {
                xnode.removeAttribute('id');
            } else return;
        }

        if (Blues.check.ifCssJson(data))
            data = Blues.JSONCSS(data);
        var node = document.createElement('style');
        node.type = 'text/css';
        if (!Blues.check.ifEmpty(id)) {
            node.id = id;
        } else {
            node.id = 'jss_' + Blues.help.timestamp();
        }
        if (node.styleSheet) {
            node.styleSheet.cssText = data;
        } else {
            node.appendChild(document.createTextNode(data));
        }
        head.appendChild(node);
        if (Blues.check.ifValidStyleNode(node)) {
            if (_xnodeTest) {
                xnode.parentNode.removeChild(xnode);
            }
        } else {
            node.parentNode.removeChild(node);
            if (_xnodeTest) {
                xnode.setAttribute('id', id);
                node = xnode;
            } else return;
        }
        //return node;
    };
    ////////////////////////////////////////////////////////////
    // setup Blues methods
    // var SetBlues = function() {
    //     Blues.Waves();
    // };
    // Blues initialization
    // Blues.init = function () {
    //     SetBlues();
    // };
    window.Bz = window.bz = window.Blues = Blues;
    window.bzDom === undefined && (window.bzDom = Blues.bzDom);
    window.bz.ajax = Blues.ajax;
    window.bz.addwave = Blues.Waves;
    window.bz.Loadspin = Blues.Loadspin;
    window.bz.jss = Blues.JSS;
    return Blues;
});
//Blues.init();