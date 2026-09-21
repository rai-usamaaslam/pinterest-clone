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

router.post('/register',function(req,res){
  const {username,email,fullname}=req.body;
  const userData = new userModel({
    username,
    email,
    fullname   
  });
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
})

module.exports = router;
