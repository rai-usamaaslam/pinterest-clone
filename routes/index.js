var express = require("express");
var router = express.Router();
var userModel = require("./users");
var postModel = require('./post');

const upload = require('./multer');
const LocalStrategy = require("passport-local");
const passport = require("passport");

// Passport setup
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


// Home
router.get("/", function(req, res) {
    res.render('index');
});


// Profile
router.get("/profile", isLoggedIn, async function(req, res) {
    const user = await userModel.findOne({ username: req.session.passport.user })
        .populate('posts');
    res.render("Profile", { user });
});

router.get('/login', function(req, res) {
    res.render('login', { error: req.flash('error') });
})
router.get('/feed', async function(req, res) {
    try {
        const posts = await postModel
            .find()
            .populate('user');

        res.render('feed', { posts });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading feed");
    }
});
router.post('/upload', isLoggedIn, upload.single('file'), async function(req, res) {
    if (!req.file) {
        return res.status(400).send('No files were Uploaded')
    }
    const user = await userModel.findOne({ username: req.session.passport.user });

    const post = await postModel.create({
        image: req.file.filename,
        imageText: req.body.filecaption,
        description: req.body.description,
        user: user._id
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');

})
router.get('/upload', isLoggedIn, function(req, res) {
        res.render('upload');
    })
    // Register
router.post("/register", function(req, res) {
    const { username, email, fullname, password } = req.body;
    const userData = new userModel({ username, email, fullname });

    userModel.register(userData, password)
        .then(function() {

            passport.authenticate("local")(req, res, function() {
                res.redirect("/profile");
            });

        })
        .catch(function(err) {
            res.status(500).send(err.message);
        });
});


// Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
}));


// Logout
router.get("/logout", function(req, res, next) {

    req.logout(function(err) {
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