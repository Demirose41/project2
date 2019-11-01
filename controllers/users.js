const express = require('express');
const router  = express.Router();
const User    = require('../models/users');
const bcrypt  = require('bcryptjs');


router.post('/registration', async (req, res) => {

  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.email    = req.body.email;
  userDbEntry.password = hashedPassword;

  
  const createdUser = await User.create(userDbEntry);
  console.log('=====================================');
  console.log(createdUser);
  console.log('=====================================');;
  req.session.username = createdUser.username;
  req.session.userID = createdUser._id;
  req.session.logged   = true;

  res.redirect('/events');
});







router.post('/login', async (req, res) => {

  try {
    // See if the User exists
    const foundUser = await User.findOne({email: req.body.email});
    console.log(foundUser + '1')
    if(foundUser){

      // now that the user exist lets compare passwords
      if(bcrypt.compareSync(req.body.password, foundUser.password)){

        req.session.message = '';
        req.session.email = foundUser.email;
        req.session.logged   = true;
        req.session.userID = foundUser._id;

        res.redirect('/events')

      } else {

        req.session.message = 'Username or password are incorrect';
        res.redirect('/')
      }


    } else {

      req.session.message = 'Username or password are incorrect';
      res.redirect('/')

    }


  } catch(err){
    console.log('hitting', err)
    res.send(err);
  }

});


router.get('/logout', (req, res) => {

  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/');
    }
  });
});






module.exports = router;
