var express = require('express');
var router = express.Router();
var userModel=require('./users');
var postModel=require('./post');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
