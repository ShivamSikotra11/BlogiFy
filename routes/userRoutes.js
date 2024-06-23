const express = require('express');
const User = require('../models/user');
const { Router } = express;

const router = Router();

router.get('/signin',(req,res)=>{
  res.render('signin')
})
router.get('/signup',(req,res)=>{
  res.render('signup')
})
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie('BlogAppToken', token).redirect('/');  
  } catch (err) {
    res.render('signin',{
      error:'Incorrect Email or Password'
    });
  }
})
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  res.redirect('/');
})

router.get('/logout', (req, res) => {
  res.clearCookie('BlogAppToken').redirect('/');
})

module.exports = router;