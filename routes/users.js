var express = require('express');
var router = express.Router();

var User = require('../models/user');

var passport = require('passport');
var localStrategy = require('passport-local');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title':'Register'
  });
});

router.post('/register', function (req, res, next) {
  //Get form Values
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Form Validation using the Express Validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Please enter a valid Email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'confirm your password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  //check for errors
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username
    });
  }
  else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    //Create User
    User.createUser(newUser, function (err, user) {
      if (err) throw err;
      console.log(user);
    });
    // //Success Message
    req.flash('success', 'You are now registered and may login');
    res.location('/');
    res.redirect('/users/login');
  }
});


router.get('/login', function(req, res, next) {
  res.render('login', {
    'title':'Login'
  });
});


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user){
      console.log('Unknown User!');
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) throw err;
      if(isMatch){
        return done(null, user);
      }
      else{
        console.log('Invalid Password');
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));

router.post('/login', passport.authenticate('local', {failureRedirect:'/users/login',
  failureFlash:'Invalid Username or password'}), function (req, res) {
  console.log("Its Worked!");

});




module.exports = router;
