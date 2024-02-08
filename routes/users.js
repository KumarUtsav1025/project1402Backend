const express = require('express');
const router = express.Router();
const userModel = require('../models/users');
const Student = require('../models/students');

//setting up passport auth
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router.get('/home', isLoggedIn, async function(req, res){
  try {
    // Fetch all students from the database
    const students = await Student.find();

    // Render the studentCard.ejs template for each student
    res.render('welcome', { students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/register', function(req, res) {
  const errorMessage = '';
  res.render("signUp",{errorMessage});
});

router.get('/login', function(req, res){
  const errorMessage = req.flash('error')[0];
  res.render('login', { errorMessage });
});

router.post('/register', function(req, res) {
  console.log(req.body);
  
  var userData = new userModel({
    username: req.body.username,
    email: req.body.email,
  });

  userModel.register(userData, req.body.password).then(
    function(registereduser){
      console.log(registereduser);
      res.redirect('/users/login');
    }).catch(function(err){
      const errorMessage = err.message;
      res.render('signUp', { errorMessage });
    })
});

router.post('/login', passport.authenticate("local",{
  successRedirect: "/users/home",
  failureRedirect: "/users/login",
  failureFlash: true,
}), function(req,res){
});



router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if(err) return next(err);
    res.redirect('/');
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
      const err = new Error('Unauthorized access');
      err.status = 401; // Set the status code to 401 (Unauthorized)
      return next(err);
  }
}

module.exports = {
  usersRouter: router,
  isLoggedIn: isLoggedIn,
};
