var express = require("express");
var router = express.Router();
var userModel = require("./users");

const LocalStrategy = require("passport-local");
const passport = require("passport");
// Passport setup
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


// Home
router.get("/", function (req, res) {
  res.render('index');
});


// Profile
router.get("/profile",isLoggedIn, function (req, res) {
  res.send("Profile");
});

router.get('/login',function(req,res){
  res.render('login');
})
router.get('/feed',function(req,res){
  res.render('feed');
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
    failureRedirect: "/"
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