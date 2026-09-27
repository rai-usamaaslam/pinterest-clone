var express = require("express");
var router = express.Router();
var userModel = require("./users");

const LocalStrategy = require("passport-local");
const passport = require("passport");
const upload = require('/multer');
// Passport setup
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


// Home
router.get("/", function (req, res) {
  res.render('index');
});


// Profile
router.get("/profile",isLoggedIn, async function (req, res) {
  const user = await userModel.findOne(
    {username:req.session.passport.user}
  )
  res.render("Profile",{user});
});

router.get('/login',function(req,res){
  res.render('login',{error:req.flash('error')});
})
router.get('/feed',function(req,res){
  res.render('feed');
})
router.post('/upload',upload.single('file'),function(req,res){
 if(!req.file){
  return res.status(400).send('No files were Uploaded')
 }
 res.send('File uploaded Succesfully')
})

// Register
router.post("/register", function (req, res) {
  const { username, email, fullname, password } = req.body;
  const userData = new userModel({ username, email,fullname });

  userModel.register(userData, password)
    .then(function () {

      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });

    })
    .catch(function (err) {
      res.status(500).send(err.message);
    });
});


// Login
router.post("/login",passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash:true
  })
);


// Logout
router.get("/logout", function (req, res, next) {

  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}
module.exports = router;