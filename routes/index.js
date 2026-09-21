var express = require('express');
var router = express.Router();
var userModel=require('./users');
var postModel=require('./post');
const localStrategy=require('passport-local');
const passport = require('passport');
passport.authenticate(new localStrategy(userModel.authenticate()));

      

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
