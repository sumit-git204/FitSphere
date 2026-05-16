const express = require('express');
const router = express.Router();
const User = require('../models/user');

// ================= GET LOGIN PAGE =================
router.get('/login', (req, res) => {
  if (req.query.redirect) {
    req.session.returnTo = req.query.redirect;
  }

  if (req.query.service) {
    req.session.selectedServiceId = req.query.service;
  }

  res.render('admin/login'); 
});
// ================= LOGIN =================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.render('admin/login', { error: "Invalid email or password" }); 
    }

    req.session.user = user;

    const redirectTo = req.session.returnTo || '/dashboard';

    delete req.session.returnTo;

    res.redirect(redirectTo);

  } catch (err) {
    res.render('admin/login', { error: err.message }); 
  }
});

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, plan, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.render('admin/login', { regError: "Passwords do not match" }); 
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('admin/login', { regError: "Email already exists" }); 
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      plan,
      planStartDate: new Date(),
      planEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      password
    });

    await newUser.save();

    res.render('admin/login', { success: "Account created! Login now." }); 

  } catch (err) {
    res.render('admin/login', { regError: err.message }); 
  }
});

module.exports = router;
