var express = require('express');
var router = express.Router();
var sitevars = require('./sitevars');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blues Framework', pages: sitevars.pages });
});

module.exports = router;
