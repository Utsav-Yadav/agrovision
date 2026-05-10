function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

const cropSchedules = {
  'Wheat': [
    { activity: 'Soil Preparation', dayOffset: -7 },
    { activity: 'Sowing', dayOffset: 0 },
    { activity: 'First Fertiliser Application', dayOffset: 30 },
    { activity: 'Second Fertiliser Application', dayOffset: 60 },
    { activity: 'Irrigation (as needed)', dayOffset: 20, notes: 'Repeat every 20-25 days' },
    { activity: 'Pest Monitoring', dayOffset: 45 },
    { activity: 'Pre-harvest Inspection', dayOffset: 90 },
  ],
  'Rice': [
    { activity: 'Soil Preparation & Puddling', dayOffset: -7 },
    { activity: 'Sowing/Transplanting', dayOffset: 0 },
    { activity: 'First Fertiliser Application', dayOffset: 25 },
    { activity: 'Second Fertiliser Application', dayOffset: 50 },
    { activity: 'Water Management Check', dayOffset: 15 },
    { activity: 'Pest & Disease Monitoring', dayOffset: 40 },
    { activity: 'Maturity Check', dayOffset: 110 },
  ],
  'Maize': [
    { activity: 'Land Preparation', dayOffset: -7 },
    { activity: 'Sowing', dayOffset: 0 },
    { activity: 'First Fertiliser', dayOffset: 30 },
    { activity: 'Second Fertiliser', dayOffset: 50 },
    { activity: 'Irrigation Cycle', dayOffset: 20, notes: 'Apply water every 20-25 days' },
    { activity: 'Pest Control', dayOffset: 45 },
    { activity: 'Tasseling Stage', dayOffset: 55 },
  ],
  'Cotton': [
    { activity: 'Seed Treatment & Preparation', dayOffset: -7 },
    { activity: 'Sowing', dayOffset: 0 },
    { activity: 'First Fertiliser', dayOffset: 30 },
    { activity: 'Weeding', dayOffset: 45 },
    { activity: 'Second Fertiliser', dayOffset: 60 },
    { activity: 'Pest Monitoring', dayOffset: 50 },
    { activity: 'Boll Opening', dayOffset: 140 },
  ],
  'Sugarcane': [
    { activity: 'Soil Preparation & Furrow Making', dayOffset: -7 },
    { activity: 'Sett Planting', dayOffset: 0 },
    { activity: 'First Fertiliser Application', dayOffset: 30 },
    { activity: 'Earthing Up', dayOffset: 60 },
    { activity: 'Second Fertiliser Application', dayOffset: 90 },
    { activity: 'Trash Mulching', dayOffset: 120 },
    { activity: 'Maturity Stage', dayOffset: 300 },
  ],
  'Groundnut': [
    { activity: 'Land Preparation', dayOffset: -7 },
    { activity: 'Sowing', dayOffset: 0 },
    { activity: 'Thinning', dayOffset: 25 },
    { activity: 'First Fertiliser', dayOffset: 30 },
    { activity: 'Flowering Stage', dayOffset: 50 },
    { activity: 'Pest Monitoring', dayOffset: 40 },
    { activity: 'Harvesting', dayOffset: 110 },
  ],
};

exports.plan = (req, res) => {
  const { crop = 'Wheat', sowingDate = new Date().toISOString().slice(0, 10), durationDays = 120 } = req.body;
  const sow = new Date(sowingDate);
  const schedule = this.generateSchedule(crop, sowingDate, durationDays);
  res.json({ crop, sowingDate: formatDate(sow), durationDays, schedule });
};

exports.generateSchedule = (crop, sowingDate, durationDays) => {
  const sow = new Date(sowingDate);
  const activities = cropSchedules[crop] || cropSchedules['Wheat'];

  const schedule = activities.map(activity => {
    const activityDate = addDays(sow, activity.dayOffset);
    const day = Math.abs(activity.dayOffset);

    return {
      activity: activity.activity,
      date: formatDate(activityDate),
      day: day,
      notes: activity.notes || ''
    };
  });

  return schedule;
};

module.exports = exports;