exports.validateRevenueCalculation = (req, res, next) => {
  const { fieldSizeHa, cropType, soilQuality } = req.body;

  if (!fieldSizeHa || isNaN(parseFloat(fieldSizeHa)) || parseFloat(fieldSizeHa) <= 0) {
    return res.status(400).json({ error: 'Field size must be a positive number' });
  }

  if (!cropType || typeof cropType !== 'string' || cropType.trim().length === 0) {
    return res.status(400).json({ error: 'Crop type is required' });
  }

  if (soilQuality && (isNaN(parseFloat(soilQuality)) || parseFloat(soilQuality) < 0 || parseFloat(soilQuality) > 1)) {
    return res.status(400).json({ error: 'Soil quality must be between 0 and 1' });
  }

  next();
};

exports.validatePlanGeneration = (req, res, next) => {
  const { cropType, sowingDate, durationDays } = req.body;

  if (!cropType || typeof cropType !== 'string' || cropType.trim().length === 0) {
    return res.status(400).json({ error: 'Crop type is required' });
  }

  if (!sowingDate || isNaN(Date.parse(sowingDate))) {
    return res.status(400).json({ error: 'Valid sowing date is required' });
  }

  if (!durationDays || isNaN(parseInt(durationDays)) || parseInt(durationDays) <= 0) {
    return res.status(400).json({ error: 'Duration must be a positive number' });
  }

  next();
};

exports.validateContractForm = (req, res, next) => {
  const { contractorId, farmerName, farmerContact, farmAcreage, signatureDate } = req.body;

  if (!contractorId || contractorId.trim().length === 0) {
    return res.status(400).json({ error: 'Contractor is required' });
  }

  if (!farmerName || farmerName.trim().length === 0) {
    return res.status(400).json({ error: 'Farmer name is required' });
  }

  if (!farmAcreage || isNaN(parseFloat(farmAcreage)) || parseFloat(farmAcreage) <= 0) {
    return res.status(400).json({ error: 'Farm acreage must be a positive number' });
  }

  if (!signatureDate || isNaN(Date.parse(signatureDate))) {
    return res.status(400).json({ error: 'Valid signature date is required' });
  }

  next();
};

exports.validateFarmerRegistration = (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  next();
};

exports.validateContractorRegistration = (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  next();
};
