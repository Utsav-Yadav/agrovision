const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const formController = require('../controllers/formController');
const authController = require('../controllers/authController');
const { isFarmerLoggedIn, isContractorLoggedIn } = require('../middleware/auth');

const isFarmerLoggedInOld = (req, res, next) => {
  if (req.session.farmerId) {
    next();
  } else {
    res.redirect('/farmer/login');
  }
};

// Page routes (GET)
router.get('/', pageController.homePage);
router.get('/farmers', pageController.farmersPage);
router.get('/contractors', pageController.contractorsPage);
router.get('/revenue', pageController.revenueCalculatorPage);
router.get('/planner', pageController.plannerPage);

// Auth routes - Farmer
router.get('/farmer/login', (req, res) => {
  if (req.session.farmerId) {
    return res.redirect('/farmer/profile');
  }
  res.render('farmer-login', {
    title: 'Farmer Login - AgroVision'
  });
});

router.get('/farmer/signup', (req, res) => {
  if (req.session.farmerId) {
    return res.redirect('/farmer/profile');
  }
  res.render('farmer-signup', {
    title: 'Farmer Signup - AgroVision'
  });
});

router.get('/farmer/profile', isFarmerLoggedIn, pageController.farmerProfile);
router.get('/farmer/logout', authController.farmerLogout);

// Auth routes - Contractor (NEW)
router.get('/contractor/login', (req, res) => {
  if (req.session.contractorId) {
    return res.redirect('/contractor/dashboard');
  }
  res.render('contractor-login', {
    title: 'Contractor Login - AgroVision'
  });
});

router.get('/contractor/signup', (req, res) => {
  if (req.session.contractorId) {
    return res.redirect('/contractor/dashboard');
  }
  res.render('contractor-signup', {
    title: 'Contractor Signup - AgroVision'
  });
});

router.post('/contractor/login', authController.contractorLogin);
router.post('/contractor/signup', authController.contractorSignup);
router.get('/contractor/logout', authController.contractorLogout);

// Protected contractor routes (NEW)
router.get('/contractor/dashboard', isContractorLoggedIn, pageController.contractorDashboard);
router.get('/contractor/applications', isContractorLoggedIn, pageController.contractorApplications);

// Protected farmer routes (NEW)
router.get('/farmer/my-contracts', isFarmerLoggedIn, pageController.farmerContracts);
router.get('/farmer/revenue-history', isFarmerLoggedIn, pageController.farmerRevenueHistory);
router.get('/farmer/plan-history', isFarmerLoggedIn, pageController.farmerPlanHistory);

// Form submission routes (POST)
router.post('/farmers/create', formController.createFarmer);
router.post('/farmers/calculate-revenue', formController.calculateRevenueFromFarmers);
router.post('/farmers/generate-plan', formController.generatePlanFromFarmers);
router.post('/contractors/create', formController.createContractor);
router.post('/revenue/calculate', formController.calculateRevenue);
router.post('/planner/generate', formController.generatePlan);

// NEW: Sign contract route (requires farmer to be logged in)
router.post('/farmers/sign-contract', isFarmerLoggedIn, formController.signContract);

// Auth form submissions
router.post('/farmer/login', authController.farmerLogin);
router.post('/farmer/signup', authController.farmerSignup);

module.exports = router;

