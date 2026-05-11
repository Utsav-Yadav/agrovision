const Farmer = require('../models/Farmer');

// Farmer Login
exports.farmerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('farmer-login', {
        title: 'Farmer Login - AgroVision',
        error: 'Please provide email and password'
      });
    }

    const farmer = await Farmer.findOne({ email: email.toLowerCase() });

    if (!farmer) {
      return res.render('farmer-login', {
        title: 'Farmer Login - AgroVision',
        error: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await farmer.matchPassword(password);

    if (!isPasswordMatch) {
      return res.render('farmer-login', {
        title: 'Farmer Login - AgroVision',
        error: 'Invalid email or password'
      });
    }

    // Create session
    req.session.farmerId = farmer._id;
    req.session.farmerName = farmer.name;
    req.session.farmerEmail = farmer.email;

    res.redirect('/farmer/profile');
  } catch (err) {
    next(err);
  }
};

// Farmer Signup
exports.farmerSignup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, contact, location, acreageHa, crops } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.render('farmer-signup', {
        title: 'Farmer Signup - AgroVision',
        error: 'Please provide all required fields'
      });
    }

    if (password !== passwordConfirm) {
      return res.render('farmer-signup', {
        title: 'Farmer Signup - AgroVision',
        error: 'Passwords do not match'
      });
    }

    const userExists = await Farmer.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.render('farmer-signup', {
        title: 'Farmer Signup - AgroVision',
        error: 'Email is already registered'
      });
    }

    const cropsArray = crops ? crops.split(',').map(c => c.trim()).filter(c => c) : [];

    const farmer = new Farmer({
      name,
      email: email.toLowerCase(),
      password,
      contact,
      location,
      acreageHa: acreageHa ? parseFloat(acreageHa) : null,
      crops: cropsArray
    });

    await farmer.save();

    // Create session
    req.session.farmerId = farmer._id;
    req.session.farmerName = farmer.name;
    req.session.farmerEmail = farmer.email;

    res.redirect('/farmer/profile');
  } catch (err) {
    next(err);
  }
};

// Farmer Logout
exports.farmerLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/farmers');
  });
};
