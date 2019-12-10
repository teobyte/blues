(function() {
    'use strict';
    var validateCard = function(selector) {
        if (!selector) return;
        var $form = bzDom(selector),
            $btn = $form.find('button'),
            $inputs = $form.find('.bz-card-input'),
            $type = $form.find('.bz-card-type');
        function ifLetter(str) {
            var regex = /^[A-Za-z]+$/;
            if(str.match(regex)) return true;
            else return false;
        }
        function ifValidName(str) {
            var regex = /^[a-zA-Z\s\-\.]*$/;
            if(str.match(regex)) return true;
            else return false;

        }
        function ifNumeric(str) {
            var regex = /^[0-9]+$/;
            if(str.match(regex)) return true;
            else return false;
        }
        var checkString = function(str, patern) {
            var smblType = null,
                chkSmbl = str.length - 1;
            if (patern.charAt(chkSmbl) === '0'){
                if (ifNumeric(str.charAt(chkSmbl)))
                    smblType = 'number';
            } else if (patern.charAt(chkSmbl) === 'X') {
                if (ifLetter(str.charAt(chkSmbl)))
                    smblType = 'letter';
            } else if (patern.charAt(chkSmbl) === ' ')
                smblType = 'space';
            else if (patern.charAt(chkSmbl) === '/')
                smblType = 'slash';
            return smblType;
        };
        var patern = function(type) {
            if (type === 'number')
                return '0000 0000 0000 0000';
            else if (type === 'name')
                return 'XXXXXXXXXXXXXXXXXXXXXX';
            else if (type === 'date')
                return '00/00';
            else if (type === 'code')
                return '000';
            else {
                return type;
            }
        };
        var showMsg = function(elem, state, msg) {
            resetMsg(elem);
            var $msg = bzDom('<div class="error">');
            $msg.inhtml(msg);
            if (state === 'invalid') {
                if (!elem.ifclass('invalid'))
                    elem.onclass('invalid');
            }
            if (state === 'valid') {
                if (!elem.ifclass('valid'))
                    elem.onclass('valid');
            }
            elem.after($msg);
        };
        var resetMsg = function(elem) {
            elem.offclass('valid').offclass('invalid');
            if (elem.parent().find('.error').exist()) {
                var $error = elem.parent().find('.error');
                $error.remove();
            }
        };
        var generalMsg = function(state, msg) {
            var $gMsg = $form.find('.bz-state-msg');
            $gMsg.offclass('valid').offclass('invalid');
            $gMsg.inhtml('');
            if (!state)
                return;
            if (state && msg) {
                if (!$gMsg.ifclass(state))
                    $gMsg.onclass(state);
                $gMsg.inhtml(msg);
            }
        };
        var chkBtn = function() {
            var _inpts = $inputs.el.length,
                _valid = 0;
            $inputs.each(function(i, item) {
                var _$inpt = bzDom(item);
                if (_$inpt.ifclass('valid'))
                    _valid += 1;
            });
            if (_inpts === _valid) {
                $btn.offattr('disabled');
                $btn.onclass('bz-fc-mandy');
            }
        };
        var validator = function(evt, type, value) {
            if (value === '') {
                if (bzDom(evt.target).onattr('name') === 'CARDNO')
                    $type.offattr('class').onclass('bz-card-type');
                resetMsg(bzDom(evt.target));
                return;
            }
            var keepLook = function(e, patern) {
                var number = String(e.target.value);
                if (e.key !== 'Backspace') {
                    var formatNumber = '',
                        str;
                    for (var i = 0; i < number.length; i++){
                        str = checkString(number, patern);
                        if (str === 'number' || str === 'letter') {
                            formatNumber = formatNumber + number.charAt(i);
                        } if (str === 'space') {
                            formatNumber = number.slice(0, -1) + ' ' + number.charAt(i);
                        } if (str === 'slash') {
                            formatNumber = number.slice(0, -1) + '/' + number.charAt(i);
                        } else if (str === null) {
                            formatNumber = number.slice(0, -1);
                        }
                    }
                    e.target.value = formatNumber;
                }
            };
            var checkname = function(e, patern) {
                var number = String(e.target.value),
                    _$inpt = bzDom(e.target);
                if (number.length > 2 && ifValidName(number))
                    showMsg(_$inpt, 'valid', 'Name is valid');
                else
                    showMsg(_$inpt, 'invalid', 'Name is invalid');
            };
            var checkcode = function(e, patern) {
                var number = String(e.target.value),
                    _$inpt = bzDom(e.target);
                if (number.length == _$inpt.onattr('maxlength')) {
                    showMsg(_$inpt, 'valid', 'Code is valid');
                } else {
                    showMsg(_$inpt, 'invalid', 'Code is invalid');
                }
            };
            var checkdate = function(e, patern) {
                var number = String(e.target.value);
                keepLook(e, patern);
                if (e.key !== 'Backspace' && number.length === 2) {
                    e.target.value = e.target.value + '/';
                }
                if (number.length === patern.length) {
                    var num = number.split('/'),
                        mm = num[0],
                        yy = num[1];
                    var monthValid = false;
                    if (mm > 0 && mm <= 12)
                        monthValid = true;
                    var currentDate = new Date(),
                        day = currentDate.getDate(),
                        month = currentDate.getMonth() + 1,
                        year = currentDate.getFullYear();
                    var today =  year + '-' + month + '-' + day,
                        date = '20' + yy + '-' + mm + '-' + '20',
                        d1 = Date.parse(date),
                        d2 = Date.parse(today),
                        _$inpt = bzDom(e.target);
                    if (!monthValid || d1 < d2) {
                        showMsg(_$inpt, 'invalid', 'Date is invalid');
                    } else {
                        showMsg(_$inpt, 'valid', 'Date is valid');
                    }
                }
            };
            var checknumber = function(e, patern) {
                var number = String(e.target.value);
                keepLook(e, patern);
                //run the Luhn algorithm on the number if it is at least equal to the shortest card length
                var cleanNumber = '';
                for (var k = 0; k < number.length; k++){
                    if (/^[0-9]+$/.test(number.charAt(k)))
                        cleanNumber += number.charAt(k);
                }
                var luhn = function(number){
                    var numberArray = number.split('').reverse();
                    for (var i=0; i<numberArray.length; i++){
                        if (i%2 != 0){
                            numberArray[i] = numberArray[i] * 2;
                            if (numberArray[i] > 9)
                                numberArray[i] = parseInt(String(numberArray[i]).charAt(0)) + parseInt(String(numberArray[i]).charAt(1))
                        }
                    }
                    var sum = 0;
                    for (var j=1; j<numberArray.length; j++){
                        sum += parseInt(numberArray[j]);
                    }
                    sum = sum * 9 % 10;
                    if (numberArray[0] == sum) return true;
                    else return false;
                };
                var card_types = [
                    {
                        name: 'amex',
                        look: '0000 000000 00000',
                        pattern: /^3[47]/,
                        length: [15],
                        cvc: '0000',
                        spaces: [2]
                    },
                    // {
                    //     name: 'diners_club_carte_blanche',
                    //     look: '0000 000000 0000',
                    //     pattern: /^30[0-5]/,
                    //     length: [14],
                    //     cvc: '000',
                    //     spaces: [2]
                    // },
                    // {
                    //     name: 'dinersclubint',
                    //     look: '0000 000000 0000',
                    //     pattern: /^36/,
                    //     length: [14],
                    //     cvc: '000',
                    //     spaces: [2]
                    // },
                    {
                        name: 'jcb',
                        look: '0000 0000 0000 0000',
                        pattern: /^35(2[89]|[3-8][0-9])/,
                        length: [16],
                        cvc: '000',
                        spaces: [3]
                    },
                    // {
                    //     name: 'laser',
                    //     look: '0000 0000 0000 0000 000',
                    //     pattern: /^(6304|670[69]|6771)/,
                    //     length: [16, 17, 18, 19],
                    //     cvc: '000',
                    //     spaces: [4]
                    // },
                    {
                        name: 'visaelectron',
                        look: '0000 0000 0000 0000',
                        pattern: /^(4026|417500|4508|4844|491(3|7))/,
                        length: [16],
                        cvc: '000',
                        spaces: [3]
                    },
                    {
                        name: 'visa',
                        look: '0000 0000 0000 0000',
                        pattern: /^4/,
                        length: [16],
                        cvc: '000',
                        spaces: [3]
                    },
                    {
                        name: 'mastercard',
                        look: '0000 0000 0000 0000',
                        pattern: /^5[1-5]/,
                        length: [16],
                        cvc: '000',
                        spaces: [3]
                    },
                    // {
                    //     name: 'maestro',
                    //     look: '0000 0000 0000 0000 000',
                    //     pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
                    //     length: [12, 13, 14, 15, 16, 17, 18, 19],
                    //     cvc: '000',
                    //     spaces: [4]
                    // },
                    {
                        name: 'discover',
                        look: '0000 0000 0000 0000',
                        pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
                        length: [16],
                        cvc: '000',
                        spaces: [3]
                    }
                    // ,
                    // {
                    //     name: 'unionpay',
                    //     look: '0000 0000 0000 0000',
                    //     pattern: /^(62[0-9]{14,17})$/,
                    //     length: [16],
                    //     cvc: '000',
                    //     spaces: [3]
                    // }
                ];
                //test the number against each of the above card types and regular expressions
                for (var m = 0; m < card_types.length; m++){
                    if (number.match(card_types[m].pattern)){
                        //if a match is found add the card type as a class
                        if (!$type.ifclass(card_types[m].name))
                            $type.onclass(card_types[m].name);
                        var _$inpt = bzDom(e.target);
                        _$inpt.onattr('bz-pattern', card_types[m].look);
                        _$inpt.onattr('maxlength', parseInt(card_types[m].length) + parseInt(card_types[m].spaces));
                        if (_$inpt.onattr('name') === 'CARDNO') {
                            var $cvc = bzDom('[name=CVC]');
                            $cvc.onattr('bz-pattern', card_types[m].cvc);
                            $cvc.onattr('placeholder', card_types[m].cvc);
                            $cvc.onattr('maxlength', card_types[m].cvc.length);
                        }
                    }
                }
                var isLuhn = false;
                if (cleanNumber.length >= 12){
                    isLuhn = luhn(cleanNumber);
                }
                //if the number passes the Luhn algorithm highlight validation
                var _$inpt = bzDom(e.target);
                if (isLuhn == true) showMsg(_$inpt, 'valid', 'Card is valid');
                else showMsg(_$inpt, 'invalid', 'Card is invalid');
            };
            if (type === 'name')
                checkname(evt, patern(type));
            else if (type === 'number' || type === '0000 000000 00000' || type === '0000 0000 0000 0000')
                checknumber(evt, patern(type));
            else if (type === 'date')
                checkdate(evt, patern(type));
            else if (type === 'code' || type === '0000'  || type === '000')
                checkcode(evt, patern(type));
        };
        $inputs.each(function(i, item) {
            var _$inpt = bzDom(item),
                __type = _$inpt.ondata('pattern'),
                _patern = patern(__type);
            var fired = false;
            if (__type !== 'name')
                _$inpt.onattr('placeholder', _patern);
            if (_$inpt.onattr('name') !== 'CN') {
                _$inpt.on('keydown', function(e) {
                    var keycode = (e.keyCode ? e.keyCode : event.which);
                    if (!fired) {
                        fired = true;
                    } else if (keycode != '8' || keycode != '16') {  // 8-backspace,16-shift
                        e.preventDefault();
                    }
                });
            }
            _$inpt.on('keyup', function(e) {
                fired = false;
                var $th = bzDom(this),
                    _type = $th.ondata('pattern'),
                    _val = $th.val();
                validator(e, _type, _val);
                chkBtn();
            });
        });
        $btn.on('click', function() {
            var $theBtn = bzDom(this);
            //    fData = $form.getformdata();
            $theBtn.find('.text').inhtml('Sending...');
            $form.submit();
            //alert(JSON.stringify(fData));
            //generalMsg('valid', 'Payment has been processed successfully!');
            // $inputs.each(function(i, item) {
            //     var $th_form = bzDom(item);
            //     $th_form.val('');
            //     resetMsg($th_form);
            //     $type.offattr('class').onclass('bz-card-type');
            // });
        });
        bzDom('.bz-code-tip').on('click', function() {
            bzDom('.bz-card-help').fadeIn();
        });
        bzDom('.bz-card-help').find('.bzi-remove').on('click', function() {
            bzDom('.bz-card-help').fadeOut();
        });
    };
    validateCard('.bz-payment-form');
})();
