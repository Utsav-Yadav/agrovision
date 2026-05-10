const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');
const RevenueRequest = require('../models/RevenueRequest');

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
      contractors
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

    res.render('contractors', {
      title: 'Contractors - AgroVision',
      contractors
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
