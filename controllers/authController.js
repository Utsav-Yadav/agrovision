const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');

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

    req.session.farmerId = farmer._id;
    req.session.farmerName = farmer.name;
    req.session.farmerEmail = farmer.email;

    res.redirect('/farmer/profile');
  } catch (err) {
    next(err);
  }
};

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

    req.session.farmerId = farmer._id;
    req.session.farmerName = farmer.name;
    req.session.farmerEmail = farmer.email;

    res.redirect('/farmer/profile');
  } catch (err) {
    next(err);
  }
};

exports.farmerLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/farmers');
  });
};

// Contractor Login
exports.contractorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('contractor-login', {
        title: 'Contractor Login - AgroVision',
        error: 'Please provide email and password'
      });
    }

    const contractor = await Contractor.findOne({ email: email.toLowerCase() });

    if (!contractor) {
      return res.render('contractor-login', {
        title: 'Contractor Login - AgroVision',
        error: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await contractor.matchPassword(password);

    if (!isPasswordMatch) {
      return res.render('contractor-login', {
        title: 'Contractor Login - AgroVision',
        error: 'Invalid email or password'
      });
    }

    req.session.contractorId = contractor._id;
    req.session.contractorName = contractor.name;
    req.session.contractorEmail = contractor.email;

    res.redirect('/contractor/dashboard');
  } catch (err) {
    next(err);
  }
};

// Contractor Signup
exports.contractorSignup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, contact, region, requiredAcreageHa, crops } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.render('contractor-signup', {
        title: 'Contractor Signup - AgroVision',
        error: 'Please provide all required fields'
      });
    }

    if (password !== passwordConfirm) {
      return res.render('contractor-signup', {
        title: 'Contractor Signup - AgroVision',
        error: 'Passwords do not match'
      });
    }

    const contractorExists = await Contractor.findOne({ email: email.toLowerCase() });

    if (contractorExists) {
      return res.render('contractor-signup', {
        title: 'Contractor Signup - AgroVision',
        error: 'Email is already registered'
      });
    }

    const cropsArray = crops ? crops.split(',').map(c => c.trim()).filter(c => c) : [];

    const contractor = new Contractor({
      name,
      email: email.toLowerCase(),
      password,
      contact,
      region,
      requiredAcreageHa: requiredAcreageHa ? parseFloat(requiredAcreageHa) : null,
      crops: cropsArray,
      status: 'active'
    });

    await contractor.save();

    req.session.contractorId = contractor._id;
    req.session.contractorName = contractor.name;
    req.session.contractorEmail = contractor.email;

    res.redirect('/contractor/dashboard');
  } catch (err) {
    next(err);
  }
};

// Contractor Logout
exports.contractorLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/contractors');
  });
};
