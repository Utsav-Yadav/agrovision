const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const formController = require('../controllers/formController');
const authController = require('../controllers/authController');

// Middleware to check if farmer is logged in
const isFarmerLoggedIn = (req, res, next) => {
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

// Auth routes
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

// Form submission routes (POST)
router.post('/farmers/create', formController.createFarmer);
router.post('/farmers/calculate-revenue', formController.calculateRevenueFromFarmers);
router.post('/farmers/generate-plan', formController.generatePlanFromFarmers);
router.post('/contractors/create', formController.createContractor);
router.post('/revenue/calculate', formController.calculateRevenue);
router.post('/planner/generate', formController.generatePlan);

// Auth form submissions
router.post('/farmer/login', authController.farmerLogin);
router.post('/farmer/signup', authController.farmerSignup);

module.exports = router;

