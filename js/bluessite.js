(function() {
    var menuitems = [
        { name: 'Blues 2.0', url: '', clas: 'subheader bz-fc-primary bz-ft-xl' },
        { name: 'Home', url: 'index.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Layout', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Sidenav', url: 'sidenav.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Navigation', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Toolbar', url: 'toolbar.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Tabs', url: 'tabs.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Context menu', url: 'contextmenu.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Breadcrumbs', url: 'breadcrumbs.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Pagination', url: 'pagination.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Style', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Colors', url: 'colors.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Typography', url: 'typography.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'CSS Helpers', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Flexgrid', url: 'flexgrid.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Forms', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Input', url: 'forms.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Colored Forms', url: 'colored-forms.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Conditional', url: 'conditional.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Autocomplete', url: 'autocomplete.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Selectors', url: 'selectors.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Card validation', url: 'card-validation.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Buttons', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Buttons', url: 'buttons.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Group Buttons', url: 'group-buttons.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Grouping', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Grouping elements', url: 'grouping.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Cards', url: 'cards.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Popups', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Modal', url: 'modal.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Dialog', url: 'dialog.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Tooltip', url: 'tooltip.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Popover', url: 'popover.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Toast', url: 'toast.html', clas: 'bz-list-item bz-t-concat' },
        { name: '', url: '', clas: 'divider' },
        { name: 'Progress', url: '', clas: 'subheader bz-ft-l' },
        { name: 'Progress bar', url: 'progress.html', clas: 'bz-list-item bz-t-concat' },
        { name: 'Spinner', url: 'spinner.html', clas: 'bz-list-item bz-t-concat' }
        //{ name: '', url: '', clas: '' }
    ];
    var populateMenu = function(menuitems) {
        var leftside =  bzDom('#leftSide').find('.bz-sidenav-list');
        for (var i = 0; i < menuitems.length; i++) {
            var item = menuitems[i],
                name = Blues.extract.getMapValue(item, 'name'),
                url = Blues.extract.getMapValue(item, 'url'),
                clas = Blues.extract.getMapValue(item, 'clas');
            var li = bzDom('<li>'),
                a = bzDom('<a>');
            a.inhtml(name);
            a.onattr('href', url);
            li.onclass(clas);
            li.append(a);
            leftside.append(li);
        }
    };
    populateMenu(menuitems);
})();