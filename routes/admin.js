const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();
const User = require('../models/user');
const Service = require('../models/Service');
const Form = require('../models/Form');
const Booking = require('../models/Booking');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'services');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname) || '.jpg';
    const safeBase = path.basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'service';

    cb(null, `${Date.now()}-${safeBase}${extension}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }

    cb(new Error('Please upload a valid image file.'));
  }
});

function requireAdmin(req, res, next) {
  if (!req.session.admin) return res.redirect('/login');
  next();
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: 'admin' });

    if (!admin || admin.password !== password) {
      return res.render('admin/login', { adminError: 'Invalid admin credentials' });
    }

    req.session.admin = admin;
    res.redirect('/admin');
  } catch (err) {
    res.render('admin/login', { adminError: err.message });
  }
});

router.get('/', requireAdmin, async (req, res) => {
  const users = await User.find({ role: 'member' });
  const forms = await Form.find().sort({ createdAt: -1 });
  const bookings = await Booking.find()
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.render('admin/dashboard', {
    admin: req.session.admin,
    users,
    forms,
    bookings
  });
});

router.get('/services/new', requireAdmin, async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });

  res.render('admin/services-form', {
    admin: req.session.admin,
    services,
    success: req.query.success,
    error: req.query.error
  });
});

router.post('/services', requireAdmin, (req, res) => {
  upload.single('serviceImage')(req, res, async err => {
    if (err) {
      return res.redirect(`/admin/services/new?error=${encodeURIComponent(err.message)}`);
    }

    const { title, description } = req.body;

    if (!title || !description || !req.file) {
      return res.redirect('/admin/services/new?error=' + encodeURIComponent('Title, description, and photo are required.'));
    }

    try {
      await Service.create({
        title: title.trim(),
        description: description.trim(),
        image: `/uploads/services/${req.file.filename}`
      });

      res.redirect('/admin/services/new?success=' + encodeURIComponent('Service added successfully.'));
    } catch (saveError) {
      res.redirect(`/admin/services/new?error=${encodeURIComponent(saveError.message)}`);
    }
  });
});

router.get('/delete/:id', requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
