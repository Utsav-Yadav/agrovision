const express = require('express');
const router = express.Router();
const revenue = require('../controllers/revenueController');
const planner = require('../controllers/plannerController');
const portal = require('../controllers/portalController');
const authController = require('../controllers/authController');
const { requireFarmerSession, requireContractorSession } = require('../middleware/auth');

function safeHandler(module, fnName) {
  if (module && typeof module[fnName] === 'function') return module[fnName];
  console.error(`[api] Missing handler: ${fnName} on module`, module);
  return (req, res) => res.status(500).json({ error: `Handler ${fnName} unavailable` });
}

// Revenue endpoints
router.get('/msp', safeHandler(revenue, 'getMSP'));
router.post('/revenue', safeHandler(revenue, 'calculate'));
router.post('/crop-planner', safeHandler(planner, 'plan'));

// Portal endpoints (existing)
router.post('/portals/farmers', safeHandler(portal, 'createFarmer'));
router.get('/portals/farmers', safeHandler(portal, 'listFarmers'));
router.post('/portals/contractors', safeHandler(portal, 'createContractor'));
router.get('/portals/contractors', safeHandler(portal, 'listContractors'));

// Auth endpoints - Contractor (NEW)
router.post('/auth/contractor/signup', authController.contractorSignup);
router.post('/auth/contractor/login', authController.contractorLogin);

// Auth endpoints - Farmer (NEW)
router.post('/auth/farmer/signup', authController.farmerSignup);
router.post('/auth/farmer/login', authController.farmerLogin);

module.exports = router;