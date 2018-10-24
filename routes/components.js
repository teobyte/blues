var express = require('express');
var router = express.Router();
var sitevars = require('./sitevars');

router.get('/', function(req, res, next) {
    res.render('./components/inputs', { title: 'Fields', pages: sitevars.pages });
});
router.get('/inputs', function(req, res, next) {
    res.render('./components/inputs', { title: 'Fields', pages: sitevars.pages });
});
router.get('/flex', function(req, res, next) {
    res.render('./components/flex', { title: 'Flex Grid', pages: sitevars.pages });
});
router.get('/buttons', function(req, res, next) {
    res.render('./components/buttons', { title: 'Buttons', pages: sitevars.pages });
});
router.get('/toolbar', function(req, res, next) {
    res.render('./components/toolbar', { title: 'Toolbar', pages: sitevars.pages });
});
router.get('/tabs', function(req, res, next) {
    res.render('./components/tabs', { title: 'Tabs', pages: sitevars.pages });
});
router.get('/contextmenu', function(req, res, next) {
    res.render('./components/contextmenu', { title: 'Tabs', pages: sitevars.pages });
});
router.get('/breadcrumbs', function(req, res, next) {
    res.render('./components/breadcrumbs', { title: 'Tabs', pages: sitevars.pages });
});
router.get('/pagination', function(req, res, next) {
    res.render('./components/pagination', { title: 'Pagination', pages: sitevars.pages });
});
router.get('/colors', function(req, res, next) {
    res.render('./components/colors', { title: 'Colors', pages: sitevars.pages });
});
router.get('/typography', function(req, res, next) {
    res.render('./components/typography', { title: 'Typography', pages: sitevars.pages });
});
router.get('/icons', function(req, res, next) {
    res.render('./components/icons', { title: 'Icons', pages: sitevars.pages });
});
router.get('/selectors', function(req, res, next) {
    res.render('./components/selectors', { title: 'Selectors', pages: sitevars.pages });
});
router.get('/grouping', function(req, res, next) {
    res.render('./components/grouping', { title: 'Grouping', pages: sitevars.pages });
});
router.get('/cards', function(req, res, next) {
    res.render('./components/cards', { title: 'Cards', pages: sitevars.pages });
});
router.get('/conditional', function(req, res, next) {
    res.render('./components/conditional', { title: 'Conditional', pages: sitevars.pages });
});
router.get('/autocomplete', function(req, res, next) {
    res.render('./components/autocomplete', { title: 'Autocomplete', pages: sitevars.pages });
});
router.get('/cardvalidation', function(req, res, next) {
    res.render('./components/cardvalidation', { title: 'Card Validation', pages: sitevars.pages });
});
router.get('/rating', function(req, res, next) {
    res.render('./components/rating', { title: 'Rating', pages: sitevars.pages });
});
router.get('/ajaxcalls', function(req, res, next) {
    res.render('./components/ajaxcalls', { title: 'AJAX Calls', pages: sitevars.pages });
});
router.get('/progress', function(req, res, next) {
    res.render('./components/progress', { title: 'Progress', pages: sitevars.pages });
});
router.get('/spinner', function(req, res, next) {
    res.render('./components/spinner', { title: 'Spinner', pages: sitevars.pages });
});
router.get('/modals', function(req, res, next) {
    res.render('./components/modals', { title: 'Modal', pages: sitevars.pages });
});
router.get('/pagealert', function(req, res, next) {
    res.render('./components/pagealert', { title: 'Page Alert', pages: sitevars.pages });
});
router.get('/dialog', function(req, res, next) {
    res.render('./components/dialog', { title: 'Dialog', pages: sitevars.pages });
});
router.get('/tooltip', function(req, res, next) {
    res.render('./components/tooltip', { title: 'Tooltip', pages: sitevars.pages });
});
router.get('/popover', function(req, res, next) {
    res.render('./components/popover', { title: 'Popover', pages: sitevars.pages });
});
router.get('/toast', function(req, res, next) {
    res.render('./components/toast', { title: 'Toast', pages: sitevars.pages });
});

module.exports = router;