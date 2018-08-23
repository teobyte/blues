// Blues Code Highlighter - Codelighter
// Set Styles
var jss = {
    'rule': {
        '.bz-code': {
            'attr': {
                padding: '24px 0 0 8px',
                background: 'var(--color-faded)',
                border: '1px solid var(--color-primary)',
                clear: 'both',
                color: '#fff',
                display: 'block',
                'font-size': '12px',
                margin: '8px 0',
                resize: 'none',
                outline: 'none',
                width: '640px',
            }
        },
    },
    'attr': {}
};
var css = Blues.JSONCSS(jss);
Blues.JSS(css, 'css_codelighter');
// set number of rows for all bz-code containers
var ccs = bzDom('.bz-code');
ccs.each(function(i, item) {
    var cc = bzDom(item),
        rows = cc.val().split('\n');
    if (rows.length > 0)
        cc.onattr('rows', rows.length);
    cc.onattr('readonly', 'readonly');
});