const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');
const RevenueRequest = require('../models/RevenueRequest');
const Application = require('../models/Application');
const plannerController = require('./plannerController');
const revenueController = require('./revenueController');
const portalController = require('./portalController');

// Services
const revenueService = require('../services/revenueService');
const plannerService = require('../services/plannerService');
const applicationService = require('../services/applicationService');

exports.createFarmer = async (req, res, next) => {
  try {
    const { name, contact, location, acreageHa, crops } = req.body;

    const contractors = await Contractor.find();

    if (!name || !contact || !location || !acreageHa || !crops) {
      return res.render('farmers', {
        title: 'Farmers - AgroVision',
        error: 'All fields are required',
        farmers: [],
        contractors
      });
    }

    const cropsArray = crops.split(',').map(c => c.trim()).filter(c => c);

    const farmer = new Farmer({
      name,
      contact,
      location,
      acreageHa: parseFloat(acreageHa),
      crops: cropsArray
    });

    await farmer.save();

    // Fetch updated list
    const farmers = await Farmer.find().sort({ createdAt: -1 });

    res.render('farmers', {
      title: 'Farmers - AgroVision',
      message: 'Farmer registered successfully!',
      farmers,
      contractors
    });
  } catch (err) {
    next(err);
  }
};

exports.createContractor = async (req, res, next) => {
  try {
    const { name, contact, region, requiredAcreageHa, crops } = req.body;

    if (!name || !contact || !region || !requiredAcreageHa || !crops) {
      return res.render('contractors', {
        title: 'Contractors - AgroVision',
        error: 'All fields are required',
        contractors: []
      });
    }

    const cropsArray = crops.split(',').map(c => c.trim()).filter(c => c);

    const contractor = new Contractor({
      name,
      contact,
      region,
      requiredAcreageHa: parseFloat(requiredAcreageHa),
      crops: cropsArray
    });

    await contractor.save();

    // Fetch updated list
    const contractors = await Contractor.find().sort({ createdAt: -1 });

    res.render('contractors', {
      title: 'Contractors - AgroVision',
      message: 'Contractor registered successfully!',
      contractors
    });
  } catch (err) {
    next(err);
  }
};

exports.calculateRevenue = async (req, res, next) => {
  try {
    const { fieldSizeHa, cropType, season, soilQuality } = req.body;

    if (!fieldSizeHa || !cropType || !season || !soilQuality) {
      return res.render('revenue', {
        title: 'Revenue Calculator - AgroVision',
        error: 'All fields are required'
      });
    }

    const fieldSize = parseFloat(fieldSizeHa);
    const quality = parseFloat(soilQuality);

    if (fieldSize <= 0 || quality < 0 || quality > 1) {
      return res.render('revenue', {
        title: 'Revenue Calculator - AgroVision',
        error: 'Invalid input values'
      });
    }

    const result = await revenueService.calculateRevenue(fieldSize, cropType, season, quality);

    res.render('revenue', {
      title: 'Revenue Calculator - AgroVision',
      result
    });
  } catch (err) {
    next(err);
  }
};

exports.generatePlan = async (req, res, next) => {
  try {
    const { cropType, sowingDate, duration } = req.body;

    if (!cropType || !sowingDate || !duration) {
      return res.render('planner', {
        title: 'Crop Planner - AgroVision',
        error: 'All fields are required'
      });
    }

    const dur = parseInt(duration);
    if (dur <= 0) {
      return res.render('planner', {
        title: 'Crop Planner - AgroVision',
        error: 'Duration must be greater than 0'
      });
    }

    const schedule = await plannerService.generateSchedule(cropType, sowingDate, dur);

    res.render('planner', {
      title: 'Crop Planner - AgroVision',
      schedule,
      message: 'Plan generated successfully!'
    });
  } catch (err) {
    next(err);
  }
};

exports.calculateRevenueFromFarmers = async (req, res, next) => {
  try {
    const { fieldSizeHa, cropType, season, soilQuality } = req.body;

    if (!fieldSizeHa || !cropType || !season || !soilQuality) {
      const farmers = await Farmer.find().sort({ createdAt: -1 });
      return res.render('farmers', {
        title: 'Farmers - AgroVision',
        farmers,
        error: 'All fields are required'
      });
    }

    const fieldSize = parseFloat(fieldSizeHa);
    const quality = parseFloat(soilQuality);

    if (fieldSize <= 0 || quality < 0 || quality > 1) {
      const farmers = await Farmer.find().sort({ createdAt: -1 });
      return res.render('farmers', {
        title: 'Farmers - AgroVision',
        farmers,
        error: 'Invalid input values'
      });
    }

    const result = await revenueService.calculateRevenue(fieldSize, cropType, season, quality);
    const farmers = await Farmer.find().sort({ createdAt: -1 });

    res.render('farmers', {
      title: 'Farmers - AgroVision',
      farmers,
      result
    });
  } catch (err) {
    next(err);
  }
};

exports.generatePlanFromFarmers = async (req, res, next) => {
  try {
    const { cropType, sowingDate, duration } = req.body;

    if (!cropType || !sowingDate || !duration) {
      const farmers = await Farmer.find().sort({ createdAt: -1 });
      return res.render('farmers', {
        title: 'Farmers - AgroVision',
        farmers,
        error: 'All fields are required'
      });
    }

    const dur = parseInt(duration);
    if (dur <= 0) {
      const farmers = await Farmer.find().sort({ createdAt: -1 });
      return res.render('farmers', {
        title: 'Farmers - AgroVision',
        farmers,
        error: 'Duration must be greater than 0'
      });
    }

    const schedule = await plannerService.generateSchedule(cropType, sowingDate, dur);
    const farmers = await Farmer.find().sort({ createdAt: -1 });

    res.render('farmers', {
      title: 'Farmers - AgroVision',
      farmers,
      schedule,
      message: 'Plan generated successfully!'
    });
  } catch (err) {
    next(err);
  }
};

// NEW: Sign Contract Endpoint
exports.signContract = async (req, res, next) => {
  try {
    if (!req.session || !req.session.farmerId) {
      return res.redirect('/farmer/login');
    }

    const { contractorId, farmerName, farmerContact, farmerLocation, farmAcreage, signatureDate, signature } = req.body;

    if (!contractorId) {
      const farmers = await Farmer.find().sort({ createdAt: -1 });
      const contractors = await Contractor.find().sort({ createdAt: -1 });
      return res.render('farmers', {
        title: 'Farmers - AgroVision',
        farmers,
        contractors,
        error: 'Contractor is required'
      });
    }

    const farmer = await Farmer.findById(req.session.farmerId);
    const contractor = await Contractor.findById(contractorId);

    if (!farmer || !contractor) {
      const farmers = await Farmer.find().sort({ createdAt: -1 });
      const contractors = await Contractor.find().sort({ createdAt: -1 });
      return res.render('farmers', {
        title: 'Farmers - AgroVision',
        farmers,
        contractors,
        error: 'Invalid farmer or contractor'
      });
    }

    const application = await applicationService.createApplication(
      req.session.farmerId,
      contractorId,
      {
        farmerSignature: {
          name: farmerName,
          date: new Date(signatureDate),
          initials: signature,
          contact: farmerContact,
          location: farmerLocation,
          farmAcreage: parseFloat(farmAcreage)
        },
        termsAccepted: true
      }
    );

    const farmers = await Farmer.find().sort({ createdAt: -1 });
    const contractors = await Contractor.find().sort({ createdAt: -1 });

    res.render('farmers', {
      title: 'Farmers - AgroVision',
      farmers,
      contractors,
      message: 'Contract signed successfully! Pending contractor approval.'
    });
  } catch (err) {
    next(err);
  }
};
