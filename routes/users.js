var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title':'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title':'Login'
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
    res.redirect('/');
  }
});


module.exports = router;
