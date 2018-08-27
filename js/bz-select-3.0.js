var bzSel3 = function(selector) {
    let elem = null, key = 0;
    if (!selector)
        return null;
    if (Blues.check.ifString(selector)) {
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
                let name = Blues.extract.attrNameFromString(selector);
                elem = document.querySelectorAll(name);
            }
            // check if single attribute and return element
            if (Blues.check.ifAttrName(selector) || selector.indexOf(',') > -1)
                elem = document.querySelectorAll(selector);
        }
        // handle context
        else {
            let selArray = selector.replace(/  +/g, ' ').split(' ');
            let context = selArray[0];
            if (Blues.check.ifIdentifier(context)) {
                let subcontext = '';
                for (let i = 1; i < selArray.length; i++)
                    subcontext = subcontext + selArray[i] + ' ';
                let contextElem = document.getElementById(context.substring(1));
                elem = contextElem.querySelectorAll(subcontext);
            } else
                elem = document.querySelectorAll(selector);
        }
    }
    // if selector is Window or Document
    else if (Blues.check.ifWindow(selector) || Blues.check.ifDocument(selector))
        elem = selector;
    else if (Blues.check.ifFunction(selector))
        elem = selector;
    else if (Object.getPrototypeOf(selector) === bzObject.prototype) {
        elem = selector;
        key = 1;
    } else return null;
    if (Blues.check.ifNodeList(elem)) {
        if (elem.length > 0)
            elem = Blues.convert.nodeListToArray(elem);
        if (elem.length === 1)
            elem = elem[0];
    }
    return elem;
};