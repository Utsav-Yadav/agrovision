const CropConfig = require('../models/CropConfig');

const cropSchedules = {
  wheat: [
    { activity: 'Land Preparation', dayOffset: 0, duration: 10 },
    { activity: 'Sowing', dayOffset: 10, duration: 5 },
    { activity: 'Weed Control', dayOffset: 30, duration: 5 },
    { activity: 'Fertilizer Application', dayOffset: 45, duration: 3 },
    { activity: 'Pest Management', dayOffset: 60, duration: 3 },
    { activity: 'Harvesting', dayOffset: 120, duration: 10 }
  ],
  rice: [
    { activity: 'Nursery Preparation', dayOffset: 0, duration: 7 },
    { activity: 'Field Preparation', dayOffset: 7, duration: 14 },
    { activity: 'Transplanting', dayOffset: 21, duration: 7 },
    { activity: 'Weed Control', dayOffset: 35, duration: 5 },
    { activity: 'Pest Management', dayOffset: 50, duration: 3 },
    { activity: 'Harvesting', dayOffset: 120, duration: 10 }
  ],
  maize: [
    { activity: 'Soil Preparation', dayOffset: 0, duration: 5 },
    { activity: 'Sowing', dayOffset: 5, duration: 3 },
    { activity: 'Weed Control', dayOffset: 30, duration: 5 },
    { activity: 'Fertilizer Application', dayOffset: 45, duration: 3 },
    { activity: 'Tasseling', dayOffset: 60, duration: 5 },
    { activity: 'Harvesting', dayOffset: 110, duration: 10 }
  ],
  cotton: [
    { activity: 'Field Preparation', dayOffset: 0, duration: 10 },
    { activity: 'Sowing', dayOffset: 10, duration: 5 },
    { activity: 'Weed Control', dayOffset: 30, duration: 7 },
    { activity: 'Fertilizer Application', dayOffset: 45, duration: 3 },
    { activity: 'Pest Management', dayOffset: 60, duration: 5 },
    { activity: 'Picking', dayOffset: 150, duration: 30 }
  ]
};

exports.generateSchedule = async (crop, sowingDate, durationDays) => {
  const schedule = await this.getCropSchedule(crop);
  const sowDate = new Date(sowingDate);

  return (schedule || cropSchedules[crop.toLowerCase()] || []).map(activity => ({
    activity: activity.activity,
    date: new Date(sowDate.getTime() + activity.dayOffset * 24 * 60 * 60 * 1000),
    day: activity.dayOffset,
    duration: activity.duration || 5,
    notes: activity.notes || ''
  }));
};

exports.getCropSchedule = async (cropType) => {
  try {
    const config = await CropConfig.findOne({ cropName: new RegExp(cropType, 'i') });
    if (config && config.cropSchedules && config.cropSchedules.length > 0) {
      return config.cropSchedules;
    }
  } catch (err) {
    console.error('CropConfig lookup failed, using fallback:', err.message);
  }
  return cropSchedules[cropType.toLowerCase()] || [];
};

exports.savePlan = async (data, farmerId) => {
  try {
    const Plan = require('../models/Plan');
    const plan = new Plan({
      farmerId,
      cropType: data.cropType,
      sowingDate: new Date(data.sowingDate),
      durationDays: data.durationDays,
      schedule: data.schedule
    });
    await plan.save();
    return plan;
  } catch (err) {
    console.error('Error saving plan:', err);
    throw err;
  }
};

exports.getPlanHistory = async (farmerId) => {
  try {
    const Plan = require('../models/Plan');
    return await Plan.find({ farmerId }).sort({ createdAt: -1 }).populate('farmerId');
  } catch (err) {
    console.error('Error fetching plan history:', err);
    return [];
  }
};

exports.getPlanById = async (id) => {
  try {
    const Plan = require('../models/Plan');
    return await Plan.findById(id).populate('farmerId');
  } catch (err) {
    console.error('Error fetching plan by id:', err);
    return null;
  }
};
