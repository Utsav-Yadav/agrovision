const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const formController = require('../controllers/formController');

// Page routes (GET)
router.get('/', pageController.homePage);
router.get('/farmers', pageController.farmersPage);
router.get('/contractors', pageController.contractorsPage);
router.get('/revenue', pageController.revenueCalculatorPage);
router.get('/planner', pageController.plannerPage);

// Form submission routes (POST)
router.post('/farmers/create', formController.createFarmer);
router.post('/farmers/calculate-revenue', formController.calculateRevenueFromFarmers);
router.post('/farmers/generate-plan', formController.generatePlanFromFarmers);
router.post('/contractors/create', formController.createContractor);
router.post('/revenue/calculate', formController.calculateRevenue);
router.post('/planner/generate', formController.generatePlan);

module.exports = router;

