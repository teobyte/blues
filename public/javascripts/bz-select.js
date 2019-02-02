var bzSel3 = function(selector) {
    var elem = null, key = 0;
    if (!selector)
        return null;
    else if (Blues.check.ifString(selector) && selector[ 0 ] !== "<") {
        if (!Blues.check.ifWhitespaces(selector)) {
            // check if single #id and return element
            if (Blues.check.ifIdentifier(selector)) {
                elem = document.getElementById(selector.substring(1));
                return elem;
            }
            // check if single .class amd return element
            if(Blues.check.ifClassname(selector))
                elem = document.querySelectorAll(selector);
            // check if single tag and return element
            if (Blues.check.ifValidTag(selector))
                elem = document.querySelectorAll(selector);
            // check if single [name] and return element
            if(Blues.check.ifElemName(selector)) {
                var name = Blues.extract.attrNameFromString(selector);
                elem = document.querySelectorAll(name);
            }
            // check if single attribute and return element
            if (Blues.check.ifAttrName(selector) || selector.indexOf(',') > -1)
                elem = document.querySelectorAll(selector);
        }
        // handle context
        else {
            var selArray = selector.replace(/  +/g, ' ').split(' ');
            var context = selArray[0];
            if (Blues.check.ifIdentifier(context)) {
                var subcontext = '';
                for (var i = 1; i < selArray.length; i++)
                    subcontext = subcontext + selArray[i] + ' ';
                var contextElem = document.getElementById(context.substring(1));
                elem = contextElem.querySelectorAll(subcontext);
            } else
                elem = document.querySelectorAll(selector);
        }
    }
    // if selector is Window or Document
    else if (Blues.check.ifWindow(selector) ||
             Blues.check.ifDocument(selector) ||
             Blues.check.ifFunction(selector) ||
             Object.getPrototypeOf(selector) === bzObject.prototype) {
        elem = selector;
        key = 1;
    }
    else if (Blues.check.ifString(selector) && selector[ 0 ] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3) {
        elem = Blues.dom.createFragment(selector);
    }
    else return null;
    if (Blues.check.ifNodeList(elem)) {
        if (elem.length > 0)
            elem = Blues.convert.nodeListToArray(elem);
        if (elem.length === 1)
            elem = elem[0];
    }
    return elem;
};