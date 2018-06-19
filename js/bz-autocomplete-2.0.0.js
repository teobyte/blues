/**
 * Blues Autocomplete by Aiwee 2016-2018 v.2.0.0
 * Modes: - autocomplete (standard mode name = "ac")
 *        - dropdown list with search
 *        ///////// set attribute data-dllmode="true" for the Autocomplete's <input>
 *        - drop chips on selection
 *        ///////// set attribute data-mode="chip+" or data-mode="+chip" for the Autocomplete's <input>
 *        - add new value if one that you're searching for is not exist
 *        ///////// set attribute data-mode="add" for the Autocomplete's <input>
 *        - add new value and drop chips
 *        ///////// set attribute data-mode="chip+add" for the Autocomplete's <input>
 *        ! To specify add data params just set attribute for the Autocomplete's <input>
 *        ///////// data-add-params="[param1: 'param01', param2: 'param02']"
 *
 * **/
//////////////////////////////////////////////////////////////////////////////////////
"use strict";
var Autocomplete = function (inpt, options) {
    this.o = {};
    this.inpt = inpt;
    this.mode = 'ac';
    this.ddlmode = false;
    this.listenInput = true;
    this.indata = [];
    this.cache = {};
    this.dataType = null;
    this.srchString = '';
    for (var k in Autocomplete.defaultOptions) {
        if (Autocomplete.defaultOptions.hasOwnProperty(k)) {
            if (options.hasOwnProperty(k)) {
                this.o[k] = options[k] ;
            }
            else {
                this.o[k] = Autocomplete.defaultOptions[k] ;
            }
        }
    }
    if (options.hasOwnProperty('source')) {
        this.o.source = options.source ;
    } else {
        this.dataType = 'ajax';
    }
    // helper method checks if Object is a function
    // ToDo: check why Blues isFunction doesn't works here
    var isFunction = function (functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    };
    // prepares data incomes and settings
    if (this.o.source instanceof Array) {
        if (JSON.stringify(this.o.source).match('{')) {
            this.dataType = 'array';
            var tempArr = [],
                tempData = this.o.source;
            for (var i = 0; i < tempData.length; i++) {
                var arr = Object.values(tempData[i]);
                tempArr.push(arr);
            }
            this.indata = tempArr;
        } else {
            this.indata = this.o.source;
        }
    } else if (isFunction(this.o.source)) {
        this.dataType = 'func';
    }
    // sets Autocomplete mode
    if (bzDom(inpt).ondata('mode'))
        this.mode = bzDom(inpt).ondata('mode');
    // sets Autocomplete ddl mode
    if (bzDom(inpt).ondata('ddlmode'))
        this.ddlmode = bzDom(inpt).ondata('ddlmode');
    // init Autocomplete
    this.init();
};
Autocomplete.prototype = {
    constructor: Autocomplete,
    /**
     * #setdata method checks Autocomplete.options and sets a data to work with
     *
     * @param searchstr - search string
     *
     * if income data is cached it sets cached data
     *
     * if income data not cached it sets data from Autocomplete.options.source
     *
     * @return fires #selectdata method
     *
     **/
    setdata: function(searchstr, $inpt) {
        var ac = this;
        ac.inpt = $inpt.el;
        var getData = function() {
            if (ac.dataType === 'func') {
                if (ac.o.dataurl !== '' && ac.o.dataurl !== null && ac.o.dataurl !== 'undefined') {
                    ac.dataurl = ac.o.dataurl;
                // deprecated to avoid conflicts
                // } else if ($inpt.ondata('action')) {
                //     ac.dataurl = $inpt.ondata('action');
                } else if ($inpt.ondata('ctr') && $inpt.ondata('act')) {
                    ac.dataurl = '/' +  $inpt.ondata('ctr') + '/' + $inpt.ondata('act');
                } else {
                    alert('request url not specified');
                    return null;
                }
                ac.o.source(ac.passdata, ac.dataurl, searchstr, ac);
            } else {
                ac.passdata(ac.o.source, searchstr, ac);
            }
        };

        if (ac.ddlmode == 'true') {
            if ('ddl' in ac.cache) {
                ac.indata = ac.cache['ddl'];
            } else {
                getData();
            }
            ac.selectdata(searchstr);
        } else if (searchstr.toLowerCase() !== ac.srchString.toLowerCase()) {
            ac.srchString = searchstr;
            if (searchstr.substring(0, ac.o.searchAfter) in ac.cache) {
                ac.indata = ac.cache[searchstr.substring(0, ac.o.searchAfter)];
            } else {
                getData();
            }
            ac.selectdata(searchstr);
        }
    },
    // stores data into the Autocomplete object
    passdata: function(data, searchstr, ac) {
        ac.indata = data;
        if (ac.ddlmode == 'true') {
            ac.cache['ddl'] = ac.indata;
        } else {
            ac.cache[searchstr] = ac.indata;
        }
    },
    // checks and prepares data according to the search string
    checkdata: function(searchstr) {
        var ac = this,
            tempRes = [];
        var addnew = false;
        if (ac.indata.length > 0) {
            for (var i = 0; i < ac.indata.length; i++) {
                var _data = ac.indata[i];
                if (typeof _data == 'string') {
                    if (ac.ddlmode == 'true') {
                        tempRes.push([i+1, _data]);
                    } else if (_data.toLowerCase().indexOf(searchstr.toLowerCase()) !== -1) {
                        tempRes.push([i+1, _data]);
                    } else if (ac.mode == 'add' || ac.mode == 'chip+add') {
                        addnew = true;
                    }
                } else {
                    if (_data[1].toLowerCase().indexOf(searchstr.toLowerCase()) !== -1) {
                        tempRes.push(_data);
                    } else if (ac.mode == 'add' || ac.mode == 'chip+add') {
                        addnew = true;
                    }
                }
            }
        } else {
            if (ac.mode == 'add' || ac.mode == 'chip+add')
                addnew = true;
        }
        if (addnew === true && (ac.mode == 'add' || ac.mode == 'chip+add')) {
            ac.hidesuggestnew();
            ac.suggestnew();
        }
        return tempRes;
    },
    /**
     * #selectdata method selects Autocomplete.data to show as <select> <options>
     *
     * @param searchstr - search string
     *
     * it passes data to #checkdata method to filter data according to the searchstr
     *
     * @return fires #suggest method
     *
     **/
    selectdata: function(searchstr) {
        var ac = this;
        var result = ac.checkdata(searchstr);
        if (ac.indata.length > 0) {
            ac.o.suggest(searchstr, result, ac);
        }
    },
    // add suggestions container into the Autocomplete's DOM
    addSuggestions: function() {
        var ac = this;
        var $suggestions = bzDom('<ul>');
        $suggestions.onclass('bz-list-no-style bz-suggestions bz-transition bz-shadow');
        $suggestions.inhtml('');
        $suggestions.on('mouseover', function() {
            var $that = bzDom(this),
                $inpt = $that.parent('.bz-ac').find('input');
            $inpt.ondata('hover', '1');
        });
        $suggestions.on('mouseleave', function() {
            var $that = bzDom(this),
                $inpt = $that.parent('.bz-ac').find('input');
            $inpt.ondata('hover', '0');
        });
        if (bzDom(ac.inpt).exist()) {
            bzDom(ac.inpt).after($suggestions);
        }
    },
    // fill suggestions container with selecting items
    fillSuggestions: function($listItem) {
        var ac = this;
        if (bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions').exist()) {
            var $suggestions = bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions');
            $suggestions.append($listItem);
        }
    },
    // show sugestions container
    // ToDo: make show transitional
    showSuggestions: function() {
        var ac = this;
        if (bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions').exist()) {
            var $suggestions = bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions');
            if ($suggestions.ifclass('hide'))
                $suggestions.offclass('hide');
        }
    },
    // hide suggestions container
    // ToDo: make hide transitional
    hideSuggestions: function() {
        var ac = this;
        if (bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions').exist()) {
            var $suggestions = bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions');
            if (!$suggestions.ifclass('hide'))
                $suggestions.onclass('hide');
        }
    },
    // remove suggestions container from Autocomplete's DOM
    removeSuggestions: function() {
        var ac = this;
        if (bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions').exist()) {
            var $suggestions = bzDom(ac.inpt).parent('.bz-ac').find('.bz-suggestions');
            $suggestions.remove();
        }
    },
    // makes item selection
    selection: function(selectionId, selectionName) {
        var ac = this;
        var $inpt = bzDom(ac.inpt);
        $inpt.ondata('id', selectionId);
        $inpt.val(selectionName);
        if (ac.o.selAction) {
            ac.o.selAction($inpt, selectionId, selectionName, ac);
        }
        ac.removeSuggestions();
    },
    // highlights selection on keyUp and keyDown events
    highlightSelection: function($selection, item) {
        var ac = this;
        var $inpt = bzDom(ac.inpt);
        var selectionId = $selection.ondata('id');
        var selectionName = $selection.inhtml();
        $inpt.ondata('id', selectionId);
        $inpt.val(selectionName);
        if (!$selection.ifclass('highlight')) {
            $selection.onclass('highlight');
        }
        return item;
    },
    // adds Add button if searching value hasn't been found
    suggestnew: function() {
        var ac = this;
        if (ac.mode == 'add' || ac.mode == 'chip+add') {
            var $inpt = bzDom(ac.inpt);
            var params = {};
            if ($inpt.ondata('add-params'))
                params = $inpt.ondata('add-params');
            var $addBtn = bzDom('<button type="button">');
            if (ac.o.addBtnClass != '')
                $addBtn.onclass(ac.o.addBtnClass);
            $addBtn.inhtml('Add');
            $addBtn.on('click', function() {
                var $that = bzDom(this);
                var _val = $inpt.val();
                ac.o.addAction(_val, params, ac);
                $that.remove();
            });
            $inpt.parent('.bz-ac').after($addBtn);
        }
    },
    // removes Add button
    hidesuggestnew: function() {
        var ac = this;
        var $inpt = bzDom(ac.inpt);
        if ($inpt.parent('.bz-ac-box').find('button').exist()) {
            var $addnew = $inpt.parent('.bz-ac-box').find('button');
            $addnew.remove();
        }
    },
    // adds actions to the Autocomplete <input>
    addactions: function($inpt) {
        var ac = this;
        ac.activeIndex = -1;
        $inpt.on('click', function() {
            // var $that = bzDom(this),
            //     _searchstr = $that.val();
            // if (ac.ddlmode == 'true' && ac.listenInput == true) {
            //     ac.setdata(_searchstr, $that);
            // }

            var $that = bzDom(this),
                _searchstr = $that.val();

            if (ac.ddlmode == 'true' && ac.listenInput == true) {
                ac.setdata(_searchstr, $that);
            } else {
                if (_searchstr.length > 0) {
                    ac.showSuggestions();
                }
            }
        });
        $inpt.on('keyup', function() {
            var $that = bzDom(this),
                _searchstr = $that.val();
            if (_searchstr.length >= ac.o.searchAfter  && ac.listenInput == true) {
                ac.setdata(_searchstr, $that);
            }
        });
        $inpt.on('blur', function() {
            var $that = bzDom(this),
                _searchstr = $that.val();
            if (_searchstr.length > 0 || ac.ddlmode == 'true') {
                if ($that.ondata('hover') == '0')
                    ac.hideSuggestions();
            }
        });
        $inpt.on('keydown', function(e) {
            var $that = bzDom(this);
            var $selectItems = null;
            if (bzDom(ac.inpt).parent().find('.bz-suggestions').exist()) {
                var $suggestions = bzDom(ac.inpt).parent().find('.bz-suggestions');
                $selectItems = $suggestions.find('li');
            }
            if ($selectItems === null && $selectItems == 0) {
                return;
            }
            var itemsLength = 0;
            if ($selectItems !== null && $selectItems.el.length != 0) {
                itemsLength = $selectItems.el.length;
            }
            var item = null;
            // down
            if (e.keyCode == 40) {
                ac.listenInput = false;
                e.preventDefault();
                if(ac.activeIndex == -1){
                    item = $selectItems.el[0];
                    ac.activeIndex = ac.highlightSelection(bzDom(item), 0);
                } else {
                    //deselect current active item
                    var activeItem = bzDom($selectItems.el[ac.activeIndex]);
                    if (activeItem.ifclass('highlight'))
                        activeItem.offclass('highlight');
                    // select next item
                    var k = ac.activeIndex;
                    if (k + 1 == itemsLength) {
                        k = 0;
                        item = $selectItems.el[k];
                        ac.activeIndex = ac.highlightSelection(bzDom(item), k);
                    } else {
                        k = k + 1;
                        item = $selectItems.el[k];
                        ac.activeIndex = ac.highlightSelection(bzDom(item), k);
                    }
                }
            }
            // up
            else if (e.keyCode == 38) {
                ac.listenInput = false;
                e.preventDefault();
                if(ac.activeIndex == -1){
                    item = $selectItems.el[itemsLength - 1];
                    ac.activeIndex = ac.highlightSelection(bzDom(item), itemsLength - 1);
                } else {
                    //deselect current active item
                    var activeItem = bzDom($selectItems.el[ac.activeIndex]);
                    if (activeItem.ifclass('highlight'))
                        activeItem.offclass('highlight');
                    // select previous item
                    var k = ac.activeIndex;
                    if (k - 1 == -1) {
                        k = itemsLength - 1;
                        item = $selectItems.el[k];
                        ac.activeIndex = ac.highlightSelection(bzDom(item), k);
                    } else {
                        k = k - 1;
                        item = $selectItems.el[k];
                        ac.activeIndex = ac.highlightSelection(bzDom(item), k);
                    }
                }
            }
            // esc
            else if (e.keyCode == 27) {
                e.preventDefault();
                //deselect current active item
                var activeItem = bzDom($selectItems.el[ac.activeIndex]);
                if (activeItem.ifclass('highlight'))
                    activeItem.offclass('highlight');
                ac.activeIndex = -1;
                ac.removeSuggestions();
                ac.listenInput = true;
                var $inpt = bzDom(ac.inpt);
                $inpt.ondata('id', null);
                $inpt.val(ac.srchString);
                ac.hidesuggestnew();
            }
            // enter or tab
            else if (e.keyCode == 13 || e.keyCode == 9) {
                e.preventDefault();
                ac.listenInput = true;
                ac.removeSuggestions();
                ac.hidesuggestnew();
                if ($selectItems.el[ac.activeIndex] !== 'undefined') {
                    if (ac.mode == '+chip' || ac.mode == 'chip+' || ac.mode == 'chip+add') {
                        var activeItem = bzDom($selectItems.el[ac.activeIndex]);
                        var _selectionId = activeItem.ondata('id');
                        var _selectionName = activeItem.inhtml();
                        ac.o.addchip(_selectionId, _selectionName, ac);
                        ac.hidesuggestnew();
                    }
                }
            } else {
                // normalize
                ac.listenInput = true;
            }
        });
    },
    setstyle: function() {
        var jss = {
            'rule': {
                '.bz-ac-box, .bz-ac-box .bz-ac': {
                    'attr': {
                        position: 'relative',
                        display: 'inline-block'
                    }
                },
                '.bz-ac-box .bz-ac input' : {
                    'attr': {
                        'min-width': '60px'
                    }
                },
                '.bz-ac-box button' : {
                    'attr': {
                        position: 'absolute',
                        bottom: '16px',
                        right: '-4px'
                    }
                },
                '.bz-ac-box .bz-ac .bz-suggestions': {
                    'attr': {
                        background: '#fff',
                        'list-style-type': 'none',
                        'max-height': '250px',
                        height: 'auto',
                        'overflow-x': 'hidden',
                        'overflow-y': 'auto',
                        position: 'absolute',
                        margin: 0,
                        padding: 0,
                        left: '0',
                        top: '48px',
                        'min-width': '325px',
                        width:' 100%',
                        'z-index': '1000',
                        transition: 'all 0.5s ease',
                        '-webkit-transition': 'all 0.5s ease',
                        '-moz-transition': 'all 0.5s ease'

                    }
                },
                '.bz-ac-box .bz-ac .bz-suggestions.hide': {
                    'attr': {
                        height:'0px',
                        '-webkit-transition': 'all 0.5s ease',
                        '-moz-transition': 'all 0.5s ease',
                        transition: 'all 0.5s ease'
                    }
                },
                '.bz-ac-box .bz-ac .bz-suggestions li': {
                    'attr': {
                        cursor:'pointer'
                    }
                },
                '.bz-ac-box .bz-ac .bz-suggestions li.highlight, .bz-ac-box .bz-ac .bz-suggestions li:hover': {
                    'attr': {
                        background:'#87939a'
                    }
                },
            },
            'attr': {}
        }
        var css = Blues.JSONCSS(jss);
        Blues.JSS(css, 'css_autocomplete');
    },
    // Autocomplete initialization
    init: function() {
        var ac = this,
            _input = bzDom(ac.inpt);
        ac.setstyle();
        ac.addactions(_input);
    }
};
Autocomplete.defaultOptions = {
    // sets chars amount after that searching starts
    searchAfter: 1,
    // sets url for data request
    // try to specify it in the Autocomplete's <input> or
    // in the source function.
    dataurl: null,
    // suggestions class
    // suggesting item class
    /**
     * Add copy of this method to the to a new Autocomplete as parameter
     * to customize ajax/ or other way of data request
     *
     * !!! Keep @params url, q, passdata, _this
     *
     * @return render the list of suggestions on the page
     *
     * **/
    source: function (passdata, url, q, _this) {
        var data = new FormData();
        data.append('q', q);
        if (bzDom(_this.inpt).ondata('prop')) {
            var props = bzDom(_this.inpt).ondata('prop'),
                props = props.split(',');
            for (var j=0; j<props.length; j++) {
                var paramVal = props[j],
                    paramName = paramVal.split(':');
                data.append('' + paramName[0] + '', paramName[1]);
            }
        }
        // if (param !== 0) {
        //     param = param.split(',');
        //     for (var j=0;j<param.length;j++) {
        //         var paramVal = param[j],
        //             paramName = paramVal.split(':');
        //         data.append('' + paramName[0] + '', paramName[1]);
        //     }
        // }
        var xhr = new XMLHttpRequest();
        try { xhr.abort(); } catch(e){

        }
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                passdata(JSON.parse(this.responseText), q, _this);
            }
        };
        xhr.open('POST', url, true);
        xhr.send(data);
    },
    /**
     * Add copy of this method to the to a new Autocomplete as parameter
     * to customize the way select list items are rendering
     *
     * !!! Keep @params suggesteddata and ac
     * !!! and be careful with ac.methods
     *
     * @return render the list of suggestions on the page
     *
     * **/
    suggest: function(searchstr, suggesteddata, ac) {
        ac.removeSuggestions();
        ac.addSuggestions();
        if (suggesteddata.length > 0) {
            for (var i = 0; i < suggesteddata.length; i++) {
                var $listItem = ac.o.render(suggesteddata[i][1], searchstr, suggesteddata[i][0]);
                $listItem.on('click', function() {
                    var $that = bzDom(this),
                        _selectionName = $that.ondata('value'),
                        _selectionId = $that.ondata('id');
                    ac.selection(_selectionId, _selectionName);
                    if (ac.mode == '+chip' || ac.mode == 'chip+' || ac.mode == 'chip+add') {
                        ac.o.addchip(_selectionId, _selectionName, ac);
                    }
                    ac.hidesuggestnew();
                });
                ac.fillSuggestions($listItem);
            }
        }
        //bzDom(ac.inpt).after($suggestions);
    },
    render: function (item, searchstr, itemid){
        searchstr = searchstr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var listitem = bzDom('<li class="bz-padding-8">');
        listitem.ondata('id', itemid);
        listitem.ondata('value', item);
        var re = new RegExp("(" + searchstr.split(' ').join('|') + ")", "gi");
        item = item.replace(re, "<b class='bz-fc-primary'>$1</b>");
        listitem.inhtml(item);
        return listitem;
    },
    /**
     * Add copy of this method to the to a new Autocomplete as parameter
     * to customize chips and chip's actions
     *
     * !!! Keep @params selectionId, selectionName, ac
     * !!! and be careful with ac.methods
     *
     * @return add chip after item has been selected
     *
     * **/
    addchip: function(selectionId, selectionName, ac) {
        var $chip = bzDom('<div>');
        $chip.onclass('bz-chip small');
        var $img = bzDom('<img>');
        // img or icon
        //$img.onattr('src', 'https://adm.aiweesports.com/assets/aiwee-logo-n-1627b3e27fe1e292d509e3b11e54ff91.png');
        var $chipName = bzDom('<div>');
        $chipName.onclass('text');
        $chipName.inhtml(selectionName);
        var $chipDel = bzDom('<div>');
        $chipDel.onclass('chip-close');
        $chipDel.inhtml('✕');
        $chipDel.ondata('id', selectionId);
        $chipDel.on('click', function() {
            var $that = bzDom(this),
                _itemid = $that.ondata('id');
            alert('remove: ' + _itemid);
            $that.parent('.bz-chip').remove();
        });
        // img or icon
        //$chip.append($img);
        $chip.append($chipName);
        $chip.append($chipDel);
        bzDom(ac.inpt).before($chip);
        bzDom(ac.inpt).val('');
    },
    /**
     * Add copy of this method to the to a new Autocomplete as parameter
     * to a callback to select list items
     *
     * !!! Keep @params selectionId and selectionName
     *
     * @return fires callback on the selected item
     *
     * **/
    selAction: function(inpt, selectionId, selectionName, ac) {
        //alert('selected: ' + selectionId + '/' + selectionName);
    },
    // sets Add button class
    addBtnClass: '',
    // specifies Add action
    addAction: function(val, params, ac) {
        alert('Adding action not specified. value: ' + val + ', params: ' + JSON.stringify(params));
        // if (ac.mode == 'chip+add') {
        //     ac.o.addchip(null, null, ac);
        // }
    }
};