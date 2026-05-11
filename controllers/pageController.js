const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');
const RevenueRequest = require('../models/RevenueRequest');
const Application = require('../models/Application');
const Plan = require('../models/Plan');
const farmerService = require('../services/farmerService');
const contractorService = require('../services/contractorService');

exports.homePage = async (req, res, next) => {
  try {
    const farmerCount = await Farmer.countDocuments();
    const contractorCount = await Contractor.countDocuments();
    const calculationCount = await RevenueRequest.countDocuments();

    res.render('home', {
      title: 'Home - AgroVision',
      stats: {
        farmers: farmerCount,
        contractors: contractorCount,
        calculations: calculationCount
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.farmersPage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const farmers = await Farmer.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const contractors = await Contractor.find();

    res.render('farmers', {
      title: 'Farmers - AgroVision',
      farmers,
      contractors,
      req
    });
  } catch (err) {
    next(err);
  }
};

exports.contractorsPage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const contractors = await Contractor.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const farmers = await Farmer.find().sort({ createdAt: -1 });

    res.render('contractors', {
      title: 'Contractors - AgroVision',
      contractors,
      farmers,
      req
    });
  } catch (err) {
    next(err);
  }
};

exports.revenueCalculatorPage = (req, res) => {
  res.render('revenue', {
    title: 'Revenue Calculator - AgroVision'
  });
};

exports.plannerPage = (req, res) => {
  res.render('planner', {
    title: 'Crop Planner - AgroVision'
  });
};

exports.farmerProfile = async (req, res, next) => {
  try {
    const farmer = await Farmer.findById(req.session.farmerId);

    if (!farmer) {
      req.session.destroy();
      return res.redirect('/farmer/login');
    }

    res.render('farmer-profile', {
      title: 'My Profile - AgroVision',
      farmer
    });
  } catch (err) {
    next(err);
  }
};

// NEW: Contractor Dashboard
exports.contractorDashboard = async (req, res, next) => {
  try {
    const contractorId = req.session.contractorId;
    const contractor = await Contractor.findById(contractorId);

    if (!contractor) {
      req.session.destroy();
      return res.redirect('/contractor/login');
    }

    const applications = await Application.find({ contractorId })
      .populate('farmerId')
      .sort({ createdAt: -1 });

    const pendingApplications = applications.filter(a => a.status === 'pending' || a.status === 'signed');
    const activeApplications = applications.filter(a => a.status === 'active' || a.status === 'accepted');

    res.render('contractor-dashboard', {
      title: 'Contractor Dashboard - AgroVision',
      contractor,
      pendingApplications,
      activeApplications,
      totalApplications: applications.length
    });
  } catch (err) {
    next(err);
  }
};

// NEW: Contractor Applications
exports.contractorApplications = async (req, res, next) => {
  try {
    const contractorId = req.session.contractorId;
    const contractor = await Contractor.findById(contractorId);

    if (!contractor) {
      req.session.destroy();
      return res.redirect('/contractor/login');
    }

    const applications = await Application.find({ contractorId })
      .populate('farmerId')
      .sort({ createdAt: -1 });

    res.render('contractor-applications', {
      title: 'Applications - AgroVision',
      contractor,
      applications
    });
  } catch (err) {
    next(err);
  }
};

// NEW: Farmer Contracts
exports.farmerContracts = async (req, res, next) => {
  try {
    const farmerId = req.session.farmerId;
    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      req.session.destroy();
      return res.redirect('/farmer/login');
    }

    const applications = await Application.find({ farmerId })
      .populate('contractorId')
      .sort({ createdAt: -1 });

    const pendingApplications = applications.filter(a => a.status === 'pending' || a.status === 'signed');
    const activeApplications = applications.filter(a => a.status === 'active' || a.status === 'accepted');
    const completedApplications = applications.filter(a => a.status === 'completed');

    res.render('farmer-contracts', {
      title: 'My Contracts - AgroVision',
      farmer,
      pendingApplications,
      activeApplications,
      completedApplications
    });
  } catch (err) {
    next(err);
  }
};

// NEW: Farmer Revenue History
exports.farmerRevenueHistory = async (req, res, next) => {
  try {
    const farmerId = req.session.farmerId;
    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      req.session.destroy();
      return res.redirect('/farmer/login');
    }

    const revenueRequests = await RevenueRequest.find({ farmerId })
      .sort({ createdAt: -1 });

    res.render('farmer-revenue-history', {
      title: 'Revenue History - AgroVision',
      farmer,
      revenueRequests
    });
  } catch (err) {
    next(err);
  }
};

// NEW: Farmer Plan History
exports.farmerPlanHistory = async (req, res, next) => {
  try {
    const farmerId = req.session.farmerId;
    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      req.session.destroy();
      return res.redirect('/farmer/login');
    }

    const plans = await Plan.find({ farmerId })
      .sort({ createdAt: -1 });

    res.render('farmer-plan-history', {
      title: 'Plan History - AgroVision',
      farmer,
      plans
    });
  } catch (err) {
    next(err);
  }
};
