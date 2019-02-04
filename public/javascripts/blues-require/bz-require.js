
(function(window){
    'use strict';
    var Bzrequire = function(obj){
        this.config = {};
        // Checks that the user entered a string with the name of the form
        if(typeof obj === 'string'){
            this.config.form = obj;
            this.config = this.createConfig(this.config);
            this.setForm(obj);
            return;
        }
        // If sent an object with more settings, merges with the default settings
        if (!!obj) this.config = this.createConfig(obj);
        // Initializes the tracking form
        this.setForm(this.config.form);
    };

    // Add to the window object
    window.Bzrequire = Bzrequire;
    Bzrequire.prototype = {
        // Prototype to create the instance Bzrequire settings
        // type {Object}
        defaults : {
            animateScroll : 8,
            checkonblur : false
        },
        // form-name.make(function(data){
		//      code to send form
		// });
        // make: ajax validates the form and return the data in a callback
        // return {callback}
        make : function(callback){
            var self = this,
                objForm = self[self.config.form];
            objForm.dom.addEventListener('submit', function(e){
                objForm.submitted = true;
                self.utils.blockForm(e);
                var data = {},
                    errors = [],
                    arrFields;
                arrFields = [].slice.call(objForm.dom);
                arrFields.map(function(field, key){
                    errors.push(self.validate(objForm[field.name]));
                    if (field.type === 'submit') return;
                    data[field.name] = field.value;
                });
                if (!!errors) self.filter(errors);
                if (!self.fails()) {
                    callback(data);
                    objForm.submitted = false;
                    return;
                }
            }, false);
        },
        // form-name.toSubmit();
        // toSubmit: Submit the form if no error occurs
        toSubmit : function(){
            var self = this,
                objForm = self[self.config.form];
            if (!objForm || objForm.dom == undefined) return;
            objForm.dom.addEventListener('submit', function(e){
                objForm.submitted = true;
                // for each to Validate form fields
                self.utils.convertObjToArray(objForm.dom).map(function(field){
                    var error = self.validate(objForm[field.name]);
                    if (!!error) self.filter(error);
                });
                // If fails, block form and show errors
                if (self.fails()) {
                    self.utils.blockForm(e);
                    objForm.submitted = false;
                }
            }, false);
        },
        // file configuration specifies of the instance of Bzrequire, for multiple forms in single page
        // param  {object} options = Information passed by the user
        // return {object}
        createConfig : function(options){
            var self = this;
            var config = JSON.parse(JSON.stringify(self.defaults));
            for(var option in options){
                if(options.hasOwnProperty(option)){
                    config[option] = options[option];
                }
            }
            return config;
        },
        // setForm: configure and monitor the set form object
        // param {string} nameForm = name the form
        setForm : function(nameForm){
            if (!nameForm) return;
            var self = this;
            self[nameForm] = {
                'submitted' : false,
                'error' : false
            };
            self.prepare(nameForm);
            return;
        },
        // prepare form to validations
        // param  {string} nameForm = name the form
        prepare : function(nameForm){
            if (!nameForm) return;
            var self = this;
            if (!document.querySelector('form[name='+nameForm+']'))
                return;
            var form = document.querySelector('form[name='+nameForm+']');
            form.setAttribute('novalidate', true);
            // cache dom
            self[nameForm].dom = form;
            // slice the form in objects with information the fields
            self.utils.convertObjToArray(form).map(function(value){
                // create object specific field the form
                self[nameForm][value.name] = {
                    'name' : value.name,
                    'checkonblur' : false, // check field on blur
                    'errors' : [],
                    'rules' : self.prepareRules(value.getAttribute('data-rules')),
                    'custom' : value.getAttribute('data-msg-custom'),
                    'field' : value
                };

                if(self.config.checkonblur)
                    self.checkonblur(self[nameForm][value.name]);
            });
        },
        // slice rules to validation
        // param  {string} rules = rules informed the attribute [data-rules]
        // return {Array} = specifics rules of the object
        prepareRules : function(rules){
            if (!rules) return false;
            return rules.split('|');
        },
        // register event listeners, if checkonblur enable
        // param  {obj} obj = Object manager with information on field specific of the form
        checkonblur : function(obj){
            var self = this;
            obj.field.addEventListener('focus', function(){
                obj.checkonblur = true;
            }, false);
            obj.field.addEventListener('blur', function(e){
                if(!obj.rules.length) return;
                self.disablecheckonblur(obj);
            }, false);
        },
        // Validation on blur field
        // param  {object} obj Object manager with information on field specific of the form
        disablecheckonblur : function(obj){
            var self = this;
            obj.checkonblur = false;
            var errors = self.validate(obj);
            self.filter(errors);
        },
        // reset form
        pristine : function(){
            var self = this;
            self[self.config.form].dom.reset();
        },
        // validate rules
        // param  {object} obj = Object manager with information on field specific of the form
        validate : function(obj){
            var self = this,
                rule,
                verify;
            // if not exists rules to validation
            if (obj===undefined||!obj.rules) return false;
            var validation = obj.rules.map(function(value, key){
                if (value.indexOf(':') !== -1) {
                    rule = value.split(':');
                    // verify custom rules with others parameters
                    verify = self.verify[rule[0]](obj.field.value, rule[1]);
                }else{
                    rule = value;
                    var val = obj.field.value;
                    // setting for checkbox inputs
                    if (/(checkbox|radio)/.test(obj.field.type)) {
                        if (obj.field.type !== 'radio') {
                            val = !obj.field.checked ? '' : val;
                        }else{

                            // handle case if form has radios with the same name
                            var radios = self[self.config.form].dom.querySelectorAll('input[name="'+obj.field.name+'"]');
                            var verifyMultipleRadios = self.utils.convertObjToArray(radios).filter(function(value){
                                return !!value.checked;
                            });
                            val = !verifyMultipleRadios.length ? '' : val;
                        }
                    }
                    // verify normal rules
                    verify = self.verify[value](val);
                }
                // remove error to object
                if (obj.errors.indexOf(value) !== -1){
                    obj.errors.splice(obj.errors.indexOf(value), 1);
                }
                // if error, add error to object
                if (verify)
                    obj.errors.push(value);
                // prepare div.error with error message
                if (verify)
                    self.prepareAlertError(obj, rule);
                else
                    self.fieldIsValid(obj);
                return verify;
            });
            // an array with the results of verification rules
            return validation;
        },
        filter : function(errors){
            var self = this;
            // return string with results of validation
            var strError = errors.filter(function(value){
                return !!value;
            }).toString();
            // if there are errors, sets that there is error in form
            if (strError.indexOf('true') !== -1) {
                self[self.config.form].error = true;
                // if error detected move scroll to the div.error (e.g. validated field)
                if (self[self.config.form].error) {
                    self.utils.animateScroll(self);
                }
                return;
            }
            // if no errors returns false
            self[self.config.form].error = false;
        },
        // notifys if there is any failure in the form
        // return {boolean}
        fails : function(){
            var self = this;
            return self[self.config.form].error;
        },
        fieldIsValid: function(obj) {
            if (!bzDom(obj.field).ifclass('valid') && !bzDom(obj.field).ifclass('invalid'))
                bzDom(obj.field).onclass('valid');
        },
        // handle to create the message element
        // param  {Object} obj  = Object manager with information on field specific of the form
        // param  {string} rule = Rule that the error occurred
        prepareAlertError : function(obj, rule){
            var self = this,
                block = obj.field.parentElement,
                alert = self.managerAlertError(obj, block);
            // if alert exists
            if (!alert) return;
            // feeds the alert with the error message
            self.utils.setMessageError(obj, alert.querySelector('.error-text'), rule);
            // feeds the block
            block.style.position = 'relative';
            var prevBlock = block.previousElementSibling;
            var nextBlock = block.nextElementSibling;
            // z-index
            if (!!prevBlock) {
                block.style.zIndex = !prevBlock.style.zIndex.length ? (!nextBlock.style.zIndex.length ? '900' : Number(nextBlock.style.zIndex) + 2) : prevBlock.style.zIndex;
                block.style.zIndex = block.style.zIndex - 1;
            } else
                block.style.zIndex = '1000';
            var elem = obj.field;
            //ToDo: create more elegant way
            // remove invalid class from field
            bzDom(elem).offclass('invalid');
            bzDom(elem).offclass('valid');
            bzDom(elem).onclass('invalid');
            // elem.className += ' invalid';
            block.appendChild(alert);
        },
        // manages the creation of error alerts
        managerAlertError : function(obj, block){
            var self = this;
            if (block.querySelector('.error')) return false;
            return self.utils.createSimpleAlert(obj);
        }
    };
    Bzrequire.prototype.utils = {
        animateScroll : function(data){
            var el = data[data.config.form].dom.querySelector('.error').parentElement,
                offset = el.getBoundingClientRect(),
                doc = el.ownerDocument,
                win = doc.defaultView,
                docEl = doc.documentElement,
                pos = offset.top + win.pageYOffset - docEl.clientTop;
            // runs the scroll at intervals
            var animate = setInterval(function(){
                scroll(data.config.animateScroll);
            }, 10);
            function scroll(interval){
                var scroll = window.scrollY;
                if (pos < scroll){
                    window.scrollTo(0, scroll - interval);
                    return;
                }
                resetScroll();
                return;
            }
            // remove the iteration range
            function resetScroll(){
                clearInterval(animate);
                return;
            }
        },
        // creates a simple alert with the message text
        createSimpleAlert : function(obj){
            var div = document.createElement('div'),
                main = document.createElement('span');
            div.setAttribute('class','error');
            //ToDo: set left align option
            main.setAttribute('class','error-text');
            obj.field.addEventListener('focus', function(e){
                var elem = this;
                e.preventDefault();
                e.stopPropagation();
                // remove div.error from field wrapper
                if(!div.parentElement) return;
                div.parentElement.removeChild(div);
                //ToDo: create more elegant way
                // remove invalid class from field
                bzDom(elem).offclass('valid');
                bzDom(elem).offclass('invalid');
            });
            div.appendChild(main);
            return div;
        },
        // assigns a custom error message alert
        // param {Object} obj = Object manager with information on field specific of the form
        // param {Object} elemText = Element that the message text is displayed
        // param {String} rule = Rule that the error occurred
        setMessageError : function(obj, elemText, rule){
            var self = this,
                custom = !!obj.custom ? obj.custom : obj.name,
                messages = Bzrequire.prototype.messages,
                msgRule;
            //if error type contain any rule
            if (Array.isArray(rule)) {
                //get error message string from Bzrequire.prototype.messages
                msgRule = messages[rule[0]];
                //set rule if message contain any
                msgRule = msgRule.replace('#rule', rule[1]);
            }else{
                //if no rules in error
                msgRule = messages[rule];
            }
            //replace field name with custom name
            msgRule = msgRule.replace(/(#fieldname)/g, custom);
            elemText.innerHTML = msgRule;
            return;
        },
        //just service function name says itself
        convertObjToArray : function(obj){
            return [].slice.call(obj);
        },
        //just service function prevent form of default events
        blockForm : function(event){
            event.preventDefault();
        }
    };
    // error messages default templates (Important! Sync it with locale/*.json)
    Bzrequire.prototype.messages = {
        "required" : "#fieldname is required",
        "email" : "Please, type a valid #fieldname",
        "equalto" : "#fieldname and #rule doesn't match",
        "max" : "#fieldname must contain a maximum of #rule characters",
        "min" : "#fieldname must contain a minimum of #rule characters",
        "card" : "Enter #fieldname correctly",
        "minmax" : "#fieldname typed is invalid",
        "number" : "#fieldname must be a number",
        "url" : "Please enter a valid #fieldname"
    };
    // Returns true if it does not pass verification, returns false if pass the validation
    // return boolean
    Bzrequire.prototype.verify = {
        required : function(value){
            return !value ? true : false;
        },
        equalto: function(value, field) {
            var eqf = document.getElementById(field);
            return value !== eqf.value ? true : false;
        },
        email : function(value) {
            return !/[0-9\-\.\_a-z]+@[0-9\-\.a-z]+\.[a-z]+/.test(value) ? true : false;
        },
        max : function(value, max) {
            return value.length > max ? true : false;
        },
        min : function(value, min) {
            return value.length < min ? true : false;
        },
        card : function(value) {
            var card = value.replace(/(\s|\-|\.)/g, '');
            return !/(^[0-9]{16}$)/.test(card) ? true : false;
        },
        number : function(value) {
            return !Number(value);
        },
        url : function(value) {
            return !/(http|https)+(:\/\/)+(www.|)+[0-9a-z\-]+\.(.)+/.test(value);
        }
    };
    //-- End of Bzrequire <------------------//
    // Ajax call to get messages localization
    function getXHR(){
        if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }
        //ie
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }
    // Create url to script blues-require-*
    function bzquirepath() {
        var scripts = document.getElementsByTagName('script'),
            script = scripts[scripts.length - 1];
        if (!!script.getAttribute.length) {
            var path = script.getAttribute('src').split('/');
            path.splice((path.length - 1), 1);
            path = path.toString().replace(/(,)/g, '/');
            return path;
        }
    }
    // ajax call to get locale messages
    (function go(){
        var htmltag = document.getElementsByTagName('html')[0],
        locale = 'en';
        if (htmltag.getAttribute('lang'))
                locale = htmltag.getAttribute('lang').toLowerCase();
        var xhr = getXHR();
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    Bzrequire.prototype.messages = JSON.parse(xhr.responseText);
                }
            }
        };
        xhr.open('GET', bzquirepath()+'/locale/'+locale+'.json', true);
        xhr.send();
    })();
})(window);
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bzrequire;
}