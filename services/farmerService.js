const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');

exports.createFarmer = async (data) => {
  try {
    const existingFarmer = await Farmer.findOne({ email: data.email.toLowerCase() });
    if (existingFarmer) {
      throw new Error('Email already registered');
    }

    const cropsArray = data.crops
      ? (typeof data.crops === 'string'
          ? data.crops.split(',').map(c => c.trim()).filter(c => c)
          : data.crops)
      : [];

    const farmer = new Farmer({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      contact: data.contact,
      location: data.location,
      acreageHa: data.acreageHa ? parseFloat(data.acreageHa) : null,
      crops: cropsArray
    });

    await farmer.save();
    return farmer;
  } catch (err) {
    console.error('Error creating farmer:', err);
    throw err;
  }
};

exports.getFarmerWithRelations = async (farmerId) => {
  try {
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return null;

    const Application = require('../models/Application');
    const RevenueRequest = require('../models/RevenueRequest');

    const applications = await Application.find({ farmerId }).populate('contractorId');
    const revenueRequests = await RevenueRequest.find({ farmerId });

    return {
      ...farmer.toObject(),
      applications,
      revenueRequests
    };
  } catch (err) {
    console.error('Error fetching farmer with relations:', err);
    return null;
  }
};

exports.getEligibleContractorsForFarmer = async (farmerId) => {
  try {
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return [];

    const contractors = await Contractor.find({
      status: 'active',
      $or: [
        { requiredAcreageHa: { $lte: farmer.acreageHa || 0 } },
        { requiredAcreageHa: null }
      ]
    });

    return contractors.filter(c => {
      if (!c.crops || c.crops.length === 0) return true;
      return c.crops.some(cc => farmer.crops && farmer.crops.some(fc => fc.toLowerCase() === cc.toLowerCase()));
    });
  } catch (err) {
    console.error('Error fetching eligible contractors:', err);
    return [];
  }
};

exports.getFarmerDashboard = async (farmerId) => {
  try {
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return null;

    const Application = require('../models/Application');
    const RevenueRequest = require('../models/RevenueRequest');

    const [applications, revenueRequests, eligibleContractors] = await Promise.all([
      Application.find({ farmerId }).populate('contractorId').sort({ createdAt: -1 }),
      RevenueRequest.find({ farmerId }).sort({ createdAt: -1 }).limit(5),
      this.getEligibleContractorsForFarmer(farmerId)
    ]);

    const pendingApplications = applications.filter(a => a.status === 'pending');
    const activeApplications = applications.filter(a => a.status === 'active' || a.status === 'accepted');

    return {
      farmer,
      pendingApplications,
      activeApplications,
      totalApplications: applications.length,
      revenueRequests,
      eligibleContractors
    };
  } catch (err) {
    console.error('Error fetching farmer dashboard:', err);
    return null;
  }
};
