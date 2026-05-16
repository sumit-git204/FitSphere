const express = require('express');
const router  = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const User = require('../models/user');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

const profileUploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'profiles');
fs.mkdirSync(profileUploadsDir, { recursive: true });

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileUploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Please upload a valid image file.'));
  }
});

// AUTH GUARD
function requireUser(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

// SAMPLE SESSIONS
const sampleSessions = [
  { date: 'Mon, 7 Apr', time: '07:00 AM', type: 'Strength Training', trainer: 'Arjun Singh', status: 'confirmed' },
  { date: 'Wed, 9 Apr', time: '06:00 AM', type: 'HIIT Cardio', trainer: 'Rahul Verma', status: 'confirmed' }
];

// DASHBOARD
router.get('/', requireUser, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const bookings = await Booking.find({ user: req.session.user._id }).sort({ createdAt: -1 });

  res.render('user/dashboard', {
    user,
    upcomingSessions: bookings.length ? bookings : sampleSessions
  });
});

router.get('/bookings/new', requireUser, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const services = await Service.find().sort({ title: 1 });
  const bookings = await Booking.find({ user: req.session.user._id }).sort({ createdAt: -1 });
  const selectedServiceId = req.query.service || req.session.selectedServiceId || '';

  delete req.session.selectedServiceId;

  res.render('user/bookings', {
    user,
    services,
    bookings,
    selectedServiceId,
    success: req.query.success,
    error: req.query.error
  });
});

router.get('/membership', requireUser, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const planStartDate = user.planStartDate || user.createdAt;
  const planEndDate = user.planEndDate || new Date(planStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  res.render('user/membership', {
    user,
    planStartDate,
    planEndDate
  });
});

router.get('/profile', requireUser, async (req, res) => {
  const user = await User.findById(req.session.user._id);

  res.render('user/profile', {
    user,
    success: req.query.success,
    error: req.query.error
  });
});

router.post('/profile', requireUser, (req, res) => {
  uploadProfile.single('profilePicture')(req, res, async err => {
    if (err) {
      return res.redirect('/dashboard/profile?error=' + encodeURIComponent(err.message));
    }

    try {
      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        height: req.body.height ? parseFloat(req.body.height) : undefined,
        currentWeight: req.body.currentWeight ? parseFloat(req.body.currentWeight) : undefined
      };

      if (req.file) {
        updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
      }

      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const updatedUser = await User.findByIdAndUpdate(req.session.user._id, updateData, { new: true });
      req.session.user = updatedUser;

      res.redirect('/dashboard/profile?success=' + encodeURIComponent('Profile updated successfully.'));
    } catch (error) {
      res.redirect('/dashboard/profile?error=' + encodeURIComponent(error.message));
    }
  });
});

router.post('/bookings', requireUser, async (req, res) => {
  const { serviceId, preferredDate, preferredTime, notes } = req.body;

  try {
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.redirect('/dashboard/bookings/new?error=' + encodeURIComponent('Selected service not found.'));
    }

    await Booking.create({
      user: req.session.user._id,
      service: service._id,
      serviceTitle: service.title,
      preferredDate,
      preferredTime,
      notes: notes ? notes.trim() : ''
    });

    res.redirect('/dashboard/bookings/new?success=' + encodeURIComponent('Service booked successfully.'));
  } catch (error) {
    res.redirect('/dashboard/bookings/new?error=' + encodeURIComponent(error.message));
  }
});

// SAVE BMI
router.post('/bmi/save', requireUser, async (req, res) => {
  const { bmi, weight, height } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.session.user._id,
    {
      bmi: parseFloat(bmi),
      currentWeight: parseFloat(weight),
      height: parseFloat(height)
    },
    { new: true }
  );

  req.session.user = updatedUser;

  res.redirect('/dashboard');
});

module.exports = router;
