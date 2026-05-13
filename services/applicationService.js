const Application = require('../models/Application');
const Farmer = require('../models/Farmer');
const Contractor = require('../models/Contractor');

exports.createApplication = async (farmerId, contractorId, data = {}) => {
  try {
    const farmer = await Farmer.findById(farmerId);
    const contractor = await Contractor.findById(contractorId);

    if (!farmer || !contractor) {
      throw new Error('Invalid farmer or contractor');
    }

    const application = new Application({
      farmerId,
      contractorId,
      message: data.message || '',
      plannedRevenue: data.plannedRevenue || null,
      termsAccepted: data.termsAccepted || false,
      status: data.status || 'pending',
      farmerSignature: data.farmerSignature || {},
      applicationDate: new Date()
    });

    await application.save();
    return application;
  } catch (err) {
    console.error('Error creating application:', err);
    throw err;
  }
};

exports.getApplicationsForFarmer = async (farmerId, status = null) => {
  try {
    const query = { farmerId };
    if (status) query.status = status;
    return await Application.find(query)
      .populate('farmerId')
      .populate('contractorId')
      .sort({ createdAt: -1 });
  } catch (err) {
    console.error('Error fetching farmer applications:', err);
    return [];
  }
};

exports.getApplicationsForContractor = async (contractorId, status = null) => {
  try {
    const query = { contractorId };
    if (status) query.status = status;
    return await Application.find(query)
      .populate('farmerId')
      .populate('contractorId')
      .sort({ createdAt: -1 });
  } catch (err) {
    console.error('Error fetching contractor applications:', err);
    return [];
  }
};

exports.getApplicationById = async (id) => {
  try {
    return await Application.findById(id)
      .populate('farmerId')
      .populate('contractorId');
  } catch (err) {
    console.error('Error fetching application by id:', err);
    return null;
  }
};

exports.updateApplicationStatus = async (applicationId, status, signature = null) => {
  try {
    const update = { status };
    if (signature) {
      update.contractorSignature = {
        date: new Date(),
        signedBy: signature.signedBy || 'Contractor'
      };
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      update,
      { new: true }
    ).populate('farmerId').populate('contractorId');

    return application;
  } catch (err) {
    console.error('Error updating application status:', err);
    throw err;
  }
};

exports.signApplication = async (applicationId, contractorName) => {
  try {
    return await this.updateApplicationStatus(applicationId, 'accepted', {
      signedBy: contractorName
    });
  } catch (err) {
    console.error('Error signing application:', err);
    throw err;
  }
};

exports.rejectApplication = async (applicationId, reason = '') => {
  try {
    return await Application.findByIdAndUpdate(
      applicationId,
      {
        status: 'rejected',
        contractorSignature: {
          date: new Date(),
          signedBy: 'Rejected',
          reason
        }
      },
      { new: true }
    ).populate('farmerId').populate('contractorId');
  } catch (err) {
    console.error('Error rejecting application:', err);
    throw err;
  }
};

exports.validateContractTerms = (farmerData, contractorRequirements) => {
  const errors = [];

  if (contractorRequirements.requiredAcreageHa && farmerData.acreageHa < contractorRequirements.requiredAcreageHa) {
    errors.push(`Farm size ${farmerData.acreageHa} ha is below required ${contractorRequirements.requiredAcreageHa} ha`);
  }

  if (contractorRequirements.crops && contractorRequirements.crops.length > 0) {
    const hasMatchingCrop = contractorRequirements.crops.some(crop =>
      farmerData.crops && farmerData.crops.some(fc => fc.toLowerCase() === crop.toLowerCase())
    );
    if (!hasMatchingCrop) {
      errors.push(`No matching crops. Contractor requires: ${contractorRequirements.crops.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
