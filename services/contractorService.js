const Contractor = require('../models/Contractor');
const Farmer = require('../models/Farmer');

exports.createContractor = async (data) => {
  try {
    if (data.email) {
      const existingContractor = await Contractor.findOne({ email: data.email.toLowerCase() });
      if (existingContractor) {
        throw new Error('Email already registered');
      }
    }

    const cropsArray = data.crops
      ? (typeof data.crops === 'string'
          ? data.crops.split(',').map(c => c.trim()).filter(c => c)
          : data.crops)
      : [];

    const contractor = new Contractor({
      name: data.name,
      email: data.email ? data.email.toLowerCase() : null,
      password: data.password || null,
      contact: data.contact,
      region: data.region,
      requiredAcreageHa: data.requiredAcreageHa ? parseFloat(data.requiredAcreageHa) : null,
      crops: cropsArray,
      status: 'active'
    });

    await contractor.save();
    return contractor;
  } catch (err) {
    console.error('Error creating contractor:', err);
    throw err;
  }
};

exports.getContractorWithRelations = async (contractorId) => {
  try {
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) return null;

    const Application = require('../models/Application');
    const applications = await Application.find({ contractorId }).populate('farmerId');

    return {
      ...contractor.toObject(),
      applications
    };
  } catch (err) {
    console.error('Error fetching contractor with relations:', err);
    return null;
  }
};

exports.getEligibleFarmersForContractor = async (contractorId) => {
  try {
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) return [];

    const farmers = await Farmer.find({
      $or: [
        { acreageHa: { $gte: contractor.requiredAcreageHa || 0 } },
        { acreageHa: null }
      ]
    });

    return farmers.filter(f => {
      if (!contractor.crops || contractor.crops.length === 0) return true;
      return contractor.crops.some(cc => f.crops && f.crops.some(fc => fc.toLowerCase() === cc.toLowerCase()));
    });
  } catch (err) {
    console.error('Error fetching eligible farmers:', err);
    return [];
  }
};

exports.getContractorDashboard = async (contractorId) => {
  try {
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) return null;

    const Application = require('../models/Application');

    const [applications, eligibleFarmers] = await Promise.all([
      Application.find({ contractorId }).populate('farmerId').sort({ createdAt: -1 }),
      this.getEligibleFarmersForContractor(contractorId)
    ]);

    const pendingApplications = applications.filter(a => a.status === 'pending' || a.status === 'signed');
    const activeApplications = applications.filter(a => a.status === 'active' || a.status === 'accepted');
    const rejectedApplications = applications.filter(a => a.status === 'rejected');

    return {
      contractor,
      pendingApplications,
      activeApplications,
      rejectedApplications,
      totalApplications: applications.length,
      eligibleFarmers
    };
  } catch (err) {
    console.error('Error fetching contractor dashboard:', err);
    return null;
  }
};

exports.updateContractorStatus = async (contractorId, status) => {
  try {
    return await Contractor.findByIdAndUpdate(
      contractorId,
      { status },
      { new: true }
    );
  } catch (err) {
    console.error('Error updating contractor status:', err);
    throw err;
  }
};
