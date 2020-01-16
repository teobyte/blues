// Blues Code Highlighter - Codelighter
// Set Styles
var jss = {
    'rule': {
        'pre.bz-code': {
            'attr': {
                padding: '16px 0',
                background: 'transparent',
                border: '1px solid var(--color-primary)',
                clear: 'both',
                display: 'inline-block',
                'font-size': '14px',
                margin: '8px 0',
                resize: 'none',
                outline: 'none',
                overflow: 'auto',
                position: 'relative'
            }
        },
        '.bz-code code': {
            'attr': {
                padding: '0 16px 0 0',
                background: 'transparent',
                border: 'none',
                display: 'block',
                margin: '0',
                position: 'relative',
                resize: 'none',
                outline: 'none'
            }
        },
        '.bz-code ul': {
            'attr': {
                padding: '0',
                background: 'transparent',
                border: 'none',
                display: 'inline-block',
                float: 'left',
                margin: '0',
                'text-align': 'right',
                position: 'absolute',
                top: '16px',
                width: '100%',
                'z-index': '-1'
            }
        },
        '.bz-code ul > li': {
            'attr': {
                display: 'block',
                width: '100%'
            }
        },
        '.bz-code ul > li:nth-child(even)': {
            'attr': {
                background: '#f3f3f3'
            }
        },
        '.bz-code ul li div': {
            'attr': {
                padding: '0 8px',
                width: '30px'
            }
        },
    },
    'attr': {}
};
var css = bz.JSONCSS(jss);
bz.JSS(css, 'css_codelighter');
// with respect to
// https://www.w3schools.com/howto/howto_syntax_highlight.asp
function w3CodeColor(code, lang) {
    var lang = (lang || "html"); // html, css, js
    var elmntTxt = code;
    var tagcolor = "#4a4a4a";
    var tagnamecolor = "#a25a9f";
    var attributecolor = "#0f9d58";
    var attributevaluecolor = "#2a8ac7";
    var commentcolor = "#0f9d58";
    var cssselectorcolor = "#a25a9f";
    var csspropertycolor = "#db4437";
    var csspropertyvaluecolor = "#2a8ac7";
    var cssdelimitercolor = "#000";
    var cssimportantcolor = "#db4437";
    var jscolor = "#000";
    var jskeywordcolor = "#2a8ac7";
    var jsstringcolor = "#0f9d58";
    var jsnumbercolor = "#db4437";
    var jspropertycolor = "black";
    if (!lang) {lang = "html"; }
    if (lang === "html") {elmntTxt = htmlMode(elmntTxt);}
    if (lang === "css") {elmntTxt = cssMode(elmntTxt);}
    if (lang === "js") {elmntTxt = jsMode(elmntTxt);}
    return elmntTxt;
    function extract(str, start, end, func, repl) {
        var s, e, d = "", a = [];
        while (str.search(start) > -1) {
            s = str.search(start);
            e = str.indexOf(end, s);
            if (e == -1) {e = str.length;}
            if (repl) {
                a.push(func(str.substring(s, e + (end.length))));
                str = str.substring(0, s) + repl + str.substr(e + (end.length));
            } else {
                d += str.substring(0, s);
                d += func(str.substring(s, e + (end.length)));
                str = str.substr(e + (end.length));
            }
        }
        this.rest = d + str;
        this.arr = a;
    }
    function htmlMode(txt) {
        var rest = txt, done = "", php, comment, angular, startpos, endpos, note, i;
        comment = new extract(rest, "&lt;!--", "--&gt;", commentMode, "W3HTMLCOMMENTPOS");
        rest = comment.rest;
        while (rest.indexOf("&lt;") > -1) {
            note = "";
            startpos = rest.indexOf("&lt;");
            if (rest.substr(startpos, 9).toUpperCase() == "&LT;STYLE") {note = "css";}
            if (rest.substr(startpos, 10).toUpperCase() == "&LT;SCRIPT") {note = "javascript";}
            endpos = rest.indexOf("&gt;", startpos);
            if (endpos == -1) {endpos = rest.length;}
            done += rest.substring(0, startpos);
            done += tagMode(rest.substring(startpos, endpos + 4));
            rest = rest.substr(endpos + 4);
            if (note == "css") {
                endpos = rest.indexOf("&lt;/style&gt;");
                if (endpos > -1) {
                    done += cssMode(rest.substring(0, endpos));
                    rest = rest.substr(endpos);
                }
            }
            if (note == "javascript") {
                endpos = rest.indexOf("&lt;/script&gt;");
                if (endpos > -1) {
                    done += jsMode(rest.substring(0, endpos));
                    rest = rest.substr(endpos);
                }
            }
        }
        rest = done + rest;
        for (i = 0; i < comment.arr.length; i++) {
            rest = rest.replace("W3HTMLCOMMENTPOS", comment.arr[i]);
        }
        return rest;
    }
    function tagMode(txt) {
        var rest = txt, done = "", startpos, endpos, result;
        while (rest.search(/(\s|<br>)/) > -1) {
            startpos = rest.search(/(\s|<br>)/);
            endpos = rest.indexOf("&gt;");
            if (endpos == -1) {endpos = rest.length;}
            done += rest.substring(0, startpos);
            done += attributeMode(rest.substring(startpos, endpos));
            rest = rest.substr(endpos);
        }
        result = done + rest;
        result = "<span style=color:" + tagcolor + ">&lt;</span>" + result.substring(4);
        if (result.substr(result.length - 4, 4) == "&gt;") {
            result = result.substring(0, result.length - 4) + "<span style=color:" + tagcolor + ">&gt;</span>";
        }
        return "<span style=color:" + tagnamecolor + ">" + result + "</span>";
    }
    function attributeMode(txt) {
        var rest = txt, done = "", startpos, endpos, singlefnuttpos, doublefnuttpos, spacepos;
        while (rest.indexOf("=") > -1) {
            endpos = -1;
            startpos = rest.indexOf("=");
            singlefnuttpos = rest.indexOf("'", startpos);
            doublefnuttpos = rest.indexOf('"', startpos);
            spacepos = rest.indexOf(" ", startpos + 2);
            if (spacepos > -1 && (spacepos < singlefnuttpos || singlefnuttpos == -1) && (spacepos < doublefnuttpos || doublefnuttpos == -1)) {
                endpos = rest.indexOf(" ", startpos);
            } else if (doublefnuttpos > -1 && (doublefnuttpos < singlefnuttpos || singlefnuttpos == -1) && (doublefnuttpos < spacepos || spacepos == -1)) {
                endpos = rest.indexOf('"', rest.indexOf('"', startpos) + 1);
            } else if (singlefnuttpos > -1 && (singlefnuttpos < doublefnuttpos || doublefnuttpos == -1) && (singlefnuttpos < spacepos || spacepos == -1)) {
                endpos = rest.indexOf("'", rest.indexOf("'", startpos) + 1);
            }
            if (!endpos || endpos == -1 || endpos < startpos) {endpos = rest.length;}
            done += rest.substring(0, startpos);
            done += attributeValueMode(rest.substring(startpos, endpos + 1));
            rest = rest.substr(endpos + 1);
        }
        return "<span style=color:" + attributecolor + ">" + done + rest + "</span>";
    }
    function attributeValueMode(txt) {
        return "<span style=color:" + attributevaluecolor + ">" + txt + "</span>";
    }
    function commentMode(txt) {
        return "<span style=color:" + commentcolor + ">" + txt + "</span>";
    }
    function cssMode(txt) {
        var rest = txt, done = "", s, e, comment, i, midz, c, cc;
        comment = new extract(rest, /\/\*/, "*/", commentMode, "W3CSSCOMMENTPOS");
        rest = comment.rest;
        while (rest.search("{") > -1) {
            s = rest.search("{");
            midz = rest.substr(s + 1);
            cc = 1;
            c = 0;
            for (i = 0; i < midz.length; i++) {
                if (midz.substr(i, 1) == "{") {cc++; c++}
                if (midz.substr(i, 1) == "}") {cc--;}
                if (cc == 0) {break;}
            }
            if (cc != 0) {c = 0;}
            e = s;
            for (i = 0; i <= c; i++) {
                e = rest.indexOf("}", e + 1);
            }
            if (e == -1) {e = rest.length;}
            done += rest.substring(0, s + 1);
            done += cssPropertyMode(rest.substring(s + 1, e));
            rest = rest.substr(e);
        }
        rest = done + rest;
        rest = rest.replace(/{/g, "<span style=color:" + cssdelimitercolor + ">{</span>");
        rest = rest.replace(/}/g, "<span style=color:" + cssdelimitercolor + ">}</span>");
        for (i = 0; i < comment.arr.length; i++) {
            rest = rest.replace("W3CSSCOMMENTPOS", comment.arr[i]);
        }
        return "<span style=color:" + cssselectorcolor + ">" + rest + "</span>";
    }
    function cssPropertyMode(txt) {
        var rest = txt, done = "", s, e, n, loop;
        if (rest.indexOf("{") > -1 ) { return cssMode(rest); }
        while (rest.search(":") > -1) {
            s = rest.search(":");
            loop = true;
            n = s;
            while (loop == true) {
                loop = false;
                e = rest.indexOf(";", n);
                if (rest.substring(e - 5, e + 1) == "&nbsp;") {
                    loop = true;
                    n = e + 1;
                }
            }
            if (e == -1) {e = rest.length;}
            done += rest.substring(0, s);
            done += cssPropertyValueMode(rest.substring(s, e + 1));
            rest = rest.substr(e + 1);
        }
        return "<span style=color:" + csspropertycolor + ">" + done + rest + "</span>";
    }
    function cssPropertyValueMode(txt) {
        var rest = txt, done = "", s;
        rest = "<span style=color:" + cssdelimitercolor + ">:</span>" + rest.substring(1);
        while (rest.search(/!important/i) > -1) {
            s = rest.search(/!important/i);
            done += rest.substring(0, s);
            done += cssImportantMode(rest.substring(s, s + 10));
            rest = rest.substr(s + 10);
        }
        result = done + rest;
        if (result.substr(result.length - 1, 1) == ";" &&
            result.substr(result.length - 6, 6) != "&nbsp;" &&
            result.substr(result.length - 4, 4) != "&lt;" &&
            result.substr(result.length - 4, 4) != "&gt;" &&
            result.substr(result.length - 5, 5) != "&amp;") {
            result = result.substring(0, result.length - 1) + "<span style=color:" + cssdelimitercolor + ">;</span>";
        }
        return "<span style=color:" + csspropertyvaluecolor + ">" + result + "</span>";
    }
    function cssImportantMode(txt) {
        return "<span style=color:" + cssimportantcolor + ";font-weight:bold;>" + txt + "</span>";
    }
    function jsMode(txt) {
        var rest = txt, done = "", esc = [], i, cc, tt = "", sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, numpos, mypos, dotpos, y;
        for (i = 0; i < rest.length; i++)  {
            cc = rest.substr(i, 1);
            if (cc == "\\") {
                esc.push(rest.substr(i, 2));
                cc = "W3JSESCAPE";
                i++;
            }
            tt += cc;
        }
        rest = tt;
        y = 1;
        while (y == 1) {
            sfnuttpos = getPos(rest, "'", "'", jsStringMode);
            dfnuttpos = getPos(rest, '"', '"', jsStringMode);
            compos = getPos(rest, /\/\*/, "*/", commentMode);
            comlinepos = getPos(rest, /\/\//, "<br>", commentMode);
            numpos = getNumPos(rest, jsNumberMode);
            keywordpos = getKeywordPos("js", rest, jsKeywordMode);
            dotpos = getDotPos(rest, jsPropertyMode);
            if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], keywordpos[0], dotpos[0]) == -1) {break;}
            mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, dotpos);
            if (mypos[0] == -1) {break;}
            if (mypos[0] > -1) {
                done += rest.substring(0, mypos[0]);
                done += mypos[2](rest.substring(mypos[0], mypos[1]));
                rest = rest.substr(mypos[1]);
            }
        }
        rest = done + rest;
        for (i = 0; i < esc.length; i++) {
            rest = rest.replace("W3JSESCAPE", esc[i]);
        }
        return "<span style=color:" + jscolor + ">" + rest + "</span>";
    }
    function jsStringMode(txt) {
        return "<span style=color:" + jsstringcolor + ">" + txt + "</span>";
    }
    function jsKeywordMode(txt) {
        return "<span style=color:" + jskeywordcolor + ">" + txt + "</span>";
    }
    function jsNumberMode(txt) {
        return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";
    }
    function jsPropertyMode(txt) {
        return "<span style=color:" + jspropertycolor + ">" + txt + "</span>";
    }
    function getDotPos(txt, func) {
        var x, i, j, s, e, arr = [".","<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%"];
        s = txt.indexOf(".");
        if (s > -1) {
            x = txt.substr(s + 1);
            for (j = 0; j < x.length; j++) {
                cc = x[j];
                for (i = 0; i < arr.length; i++) {
                    if (cc.indexOf(arr[i]) > -1) {
                        e = j;
                        return [s + 1, e + s + 1, func];
                    }
                }
            }
        }
        return [-1, -1, func];
    }
    function getMinPos() {
        var i, arr = [];
        for (i = 0; i < arguments.length; i++) {
            if (arguments[i][0] > -1) {
                if (arr.length == 0 || arguments[i][0] < arr[0]) {arr = arguments[i];}
            }
        }
        if (arr.length == 0) {arr = arguments[i];}
        return arr;
    }
    function getKeywordPos(typ, txt, func) {
        var words, i, pos, rpos = -1, rpos2 = -1, patt;
        if (typ == "js") {
            words = ["abstract","arguments","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete",
                "do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import",
                "in","instanceof","int","interface","let","long","NaN","native","new","null","package","private","protected","public","return","short","static",
                "super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield"];
        }
        for (i = 0; i < words.length; i++) {
            pos = txt.indexOf(words[i]);
            if (pos > -1) {
                patt = /\W/g;
                if (txt.substr(pos + words[i].length,1).match(patt) && txt.substr(pos - 1,1).match(patt)) {
                    if (pos > -1 && (rpos == -1 || pos < rpos)) {
                        rpos = pos;
                        rpos2 = rpos + words[i].length;
                    }
                }
            }
        }
        return [rpos, rpos2, func];
    }
    function getPos(txt, start, end, func) {
        var s, e;
        s = txt.search(start);
        e = txt.indexOf(end, s + (end.length));
        if (e == -1) {e = txt.length;}
        return [s, e + (end.length), func];
    }
    function getNumPos(txt, func) {
        var arr = ["<br>", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%", "="], i, j, c, startpos = 0, endpos, word;
        for (i = 0; i < txt.length; i++) {
            for (j = 0; j < arr.length; j++) {
                c = txt.substr(i, arr[j].length);
                if (c == arr[j]) {
                    if (c == "-" && (txt.substr(i - 1, 1) == "e" || txt.substr(i - 1, 1) == "E")) {
                        continue;
                    }
                    endpos = i;
                    if (startpos < endpos) {
                        word = txt.substring(startpos, endpos);
                        if (!isNaN(word)) {return [startpos, endpos, func];}
                    }
                    i += arr[j].length;
                    startpos = i;
                    i -= 1;
                    break;
                }
            }
        }
        return [-1, -1, func];
    }
}
// set number of rows for all bz-code containers
var ccs = bzDom('.bz-code');
ccs.each(function(i, item) {
    var cc = bzDom(item),
        lang,
        rows = cc.val().split('\n');
    if (rows.length > 0)
        cc.onattr('rows', rows.length);
    cc.onattr('readonly', 'readonly');
    var pre = bzDom('<pre class="bz-code">');
    var code = bzDom('<code>');
    if (cc.ifclass('html')) {
        lang = 'html';
        code.onclass('language-html');
    }
    if (cc.ifclass('js')) {
        lang = 'js';
        code.onclass('language-javascript');
    }
    if (cc.ifclass('css')) {
        lang = 'css';
        code.onclass('language-css');
    }
    var code_txt = cc.val();
    if (cc.ifclass('html'))
        code_txt = code_txt.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    var outcode = w3CodeColor(code_txt, lang);
    var $ul = bzDom('<ul class="bz-list-no-style">'),
        $li = bzDom('<li>'),
        $cont = bzDom('<div>');
    for (var i = 0; i < rows.length - 1; i++) {
        var _$li = $li.clone(),
            _$cont = $cont.clone(),
            no = i + 1;
        _$cont.inhtml(no);
        _$li.append(_$cont);
        $ul.append(_$li);
    }
    pre.append($ul);
    code.append(outcode);
    pre.append(code);
    cc.replacewith(pre);
});