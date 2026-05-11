exports.isFarmerLoggedIn = (req, res, next) => {
  if (req.session && req.session.farmerId) {
    next();
  } else {
    res.redirect('/farmer/login');
  }
};

exports.isContractorLoggedIn = (req, res, next) => {
  if (req.session && req.session.contractorId) {
    next();
  } else {
    res.redirect('/contractor/login');
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (req.session && (req.session.farmerId || req.session.contractorId)) {
    next();
  } else {
    res.redirect('/farmer/login');
  }
};

exports.requireFarmerSession = (req, res, next) => {
  if (!req.session || !req.session.farmerId) {
    return res.status(401).json({ error: 'Farmer authentication required' });
  }
  next();
};

exports.requireContractorSession = (req, res, next) => {
  if (!req.session || !req.session.contractorId) {
    return res.status(401).json({ error: 'Contractor authentication required' });
  }
  next();
};

exports.optionalAuth = (req, res, next) => {
  next();
};
