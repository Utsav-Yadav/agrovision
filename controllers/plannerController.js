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
    {
      activity: 'Soil Preparation',
      dayOffset: -7,
      details: 'Till the soil, remove weeds, and apply organic compost for good structure and drainage.',
      materials: 'Compost, manure, soil test kit'
    },
    {
      activity: 'Sowing',
      dayOffset: 0,
      details: 'Use certified seeds and sow at the recommended depth and spacing for your variety.',
      materials: 'Certified wheat seeds'
    },
    {
      activity: 'First Fertiliser Application',
      dayOffset: 30,
      details: 'Apply nitrogen-rich fertiliser to support strong tillering and early growth.',
      materials: 'Urea or DAP'
    },
    {
      activity: 'Irrigation & Moisture Check',
      dayOffset: 20,
      details: 'Check soil moisture and irrigate if the top 5 cm is dry.',
      notes: 'Repeat every 20-25 days',
      materials: 'Water, moisture sensor (optional)'
    },
    {
      activity: 'Pest Monitoring',
      dayOffset: 45,
      details: 'Inspect leaves and stems for aphids, rust, and armyworm. Treat early if pests appear.',
      materials: 'Pest monitoring kit, neem spray'
    },
    {
      activity: 'Second Fertiliser Application',
      dayOffset: 60,
      details: 'Apply a balanced fertiliser with potassium and phosphorus for grain filling.',
      materials: 'Potash, single super phosphate'
    },
    {
      activity: 'Pre-harvest Inspection',
      dayOffset: 90,
      details: 'Monitor crop maturity, grain hardness, and moisture before harvesting.',
      materials: 'Moisture meter, harvesting tools'
    }
  ],
  'Rice': [
    {
      activity: 'Soil Preparation & Puddling',
      dayOffset: -7,
      details: 'Level and puddle the field for good water retention and seedbed consistency.',
      materials: 'Water, levelling tools'
    },
    {
      activity: 'Sowing/Transplanting',
      dayOffset: 0,
      details: 'Plant seedlings or broadcast seeds depending on the chosen rice system.',
      materials: 'Rice seedlings or seeds'
    },
    {
      activity: 'Water Management Check',
      dayOffset: 15,
      details: 'Maintain standing water depth and adjust to avoid stress during early growth.',
      materials: 'Irrigation water management tools'
    },
    {
      activity: 'First Fertiliser Application',
      dayOffset: 25,
      details: 'Use nitrogen-based fertiliser after establishment for vigorous tillering.',
      materials: 'Urea, ammonium sulphate'
    },
    {
      activity: 'Pest & Disease Monitoring',
      dayOffset: 40,
      details: 'Watch for stem borer, leaf blast, and brown spot. Use biological controls early.',
      materials: 'Pest traps, biocontrol sprays'
    },
    {
      activity: 'Second Fertiliser Application',
      dayOffset: 50,
      details: 'Top dress with phosphorus and potassium to support grain development.',
      materials: 'Potash, SSP'
    },
    {
      activity: 'Maturity Check',
      dayOffset: 110,
      details: 'Check grain moisture and plant yellowing to determine the optimal harvest time.',
      materials: 'Moisture meter, cutting tools'
    }
  ],
  'Maize': [
    {
      activity: 'Land Preparation',
      dayOffset: -7,
      details: 'Prepare a well-drained seedbed and apply compost to improve soil fertility.',
      materials: 'Compost, tillage tools'
    },
    {
      activity: 'Sowing',
      dayOffset: 0,
      details: 'Sow seeds at the proper depth and spacing for the selected maize variety.',
      materials: 'Maize seeds'
    },
    {
      activity: 'Irrigation Cycle',
      dayOffset: 20,
      details: 'Water regularly, especially during early vegetative growth and tasseling.',
      notes: 'Apply water every 20-25 days',
      materials: 'Irrigation system or watering cans'
    },
    {
      activity: 'First Fertiliser',
      dayOffset: 30,
      details: 'Apply nitrogen-rich fertiliser to boost leaf and stalk growth.',
      materials: 'Urea or NPK'
    },
    {
      activity: 'Pest Control',
      dayOffset: 45,
      details: 'Scouting for stem borers and armyworms. Treat with recommended insecticides if needed.',
      materials: 'Insecticide spray'
    },
    {
      activity: 'Second Fertiliser',
      dayOffset: 50,
      details: 'Apply a balanced fertiliser for strong ear development and grain fill.',
      materials: 'NPK'
    },
    {
      activity: 'Tasseling Stage',
      dayOffset: 55,
      details: 'Ensure good pollination by keeping plants healthy and well-watered.',
      materials: 'Water, support if needed'
    }
  ],
  'Cotton': [
    {
      activity: 'Seed Treatment & Preparation',
      dayOffset: -7,
      details: 'Treat seeds with fungicide and prepare rows for even germination.',
      materials: 'Treated cotton seeds, fungicide'
    },
    {
      activity: 'Sowing',
      dayOffset: 0,
      details: 'Sow seeds in rows with proper spacing to avoid overcrowding.',
      materials: 'Cotton seeds'
    },
    {
      activity: 'First Fertiliser',
      dayOffset: 30,
      details: 'Apply nitrogen to support early plant growth and leaf development.',
      materials: 'Urea'
    },
    {
      activity: 'Pest Monitoring',
      dayOffset: 50,
      details: 'Inspect plants for bollworms and aphids. Use integrated pest management techniques.',
      materials: 'Pheromone traps, biological sprays'
    },
    {
      activity: 'Weeding & Thinning',
      dayOffset: 45,
      details: 'Control weeds and thin crowded plants to improve air circulation and growth.',
      materials: 'Weeding tools'
    },
    {
      activity: 'Second Fertiliser',
      dayOffset: 60,
      details: 'Add potassium and phosphorus to strengthen the crop and support boll formation.',
      materials: 'Potash, SSP'
    },
    {
      activity: 'Boll Opening',
      dayOffset: 140,
      details: 'Monitor boll maturity and prepare for scheduled harvesting.',
      materials: 'Harvest tools'
    }
  ],
  'Sugarcane': [
    {
      activity: 'Soil Preparation & Furrow Making',
      dayOffset: -7,
      details: 'Prepare furrows and ensure the soil is loose with good drainage.',
      materials: 'Furrow maker, organic matter'
    },
    {
      activity: 'Sett Planting',
      dayOffset: 0,
      details: 'Plant sugarcane setts with healthy buds at the correct depth and spacing.',
      materials: 'Sugarcane setts'
    },
    {
      activity: 'First Fertiliser Application',
      dayOffset: 30,
      details: 'Apply balanced fertiliser to support early establishment and root growth.',
      materials: 'NPK'
    },
    {
      activity: 'Earthing Up',
      dayOffset: 60,
      details: 'Hill soil around plants to improve root support and moisture retention.',
      materials: 'Soil, earthing tools'
    },
    {
      activity: 'Second Fertiliser Application',
      dayOffset: 90,
      details: 'Top dress with nutrient-rich fertiliser to maintain vigour during growth.',
      materials: 'Fertilisers'
    },
    {
      activity: 'Trash Mulching',
      dayOffset: 120,
      details: 'Apply mulch to conserve moisture and suppress weeds.',
      materials: 'Mulch, crop residue'
    },
    {
      activity: 'Maturity Stage',
      dayOffset: 300,
      details: 'Assess cane maturity and prepare for harvest when sugar content peaks.',
      materials: 'Harvest tools'
    }
  ],
  'Groundnut': [
    {
      activity: 'Land Preparation',
      dayOffset: -7,
      details: 'Prepare a fine seedbed and remove stones to help pod development.',
      materials: 'Tillage tools'
    },
    {
      activity: 'Sowing',
      dayOffset: 0,
      details: 'Sow seeds at the correct depth and spacing for good pod formation.',
      materials: 'Groundnut seeds'
    },
    {
      activity: 'Thinning',
      dayOffset: 25,
      details: 'Thin seedlings to reduce competition and allow healthy plants to develop.',
      materials: 'Thinning tools'
    },
    {
      activity: 'First Fertiliser',
      dayOffset: 30,
      details: 'Apply phosphorus-rich fertiliser to support flower and pod formation.',
      materials: 'Single super phosphate'
    },
    {
      activity: 'Pest Monitoring',
      dayOffset: 40,
      details: 'Inspect for leaf spots, aphids, and pod rot. Apply treatment as needed.',
      materials: 'Insecticides, fungicides'
    },
    {
      activity: 'Flowering Stage',
      dayOffset: 50,
      details: 'Maintain even moisture and protect flowers from stress for good pod set.',
      materials: 'Irrigation water'
    },
    {
      activity: 'Harvesting',
      dayOffset: 110,
      details: 'Harvest when pods are mature and begin to dry for best quality.',
      materials: 'Harvest tools'
    }
  ]
};

exports.plan = (req, res) => {
  const { crop = 'Wheat', sowingDate = new Date().toISOString().slice(0, 10), durationDays = 120 } = req.body;
  const sow = new Date(sowingDate);
  const schedule = this.generateSchedule(crop, sowingDate, durationDays);
  res.json({ crop, sowingDate: formatDate(sow), durationDays, schedule });
};

exports.generateSchedule = (crop, sowingDate, durationDays) => {
  const sow = new Date(sowingDate);
  const activities = cropSchedules[crop] || null;

  const genericSchedule = [
    {
      activity: 'Soil Preparation',
      dayOffset: -7,
      details: 'Prepare the field by removing weeds, loosening the soil, and adding compost or fertiliser as needed.',
      materials: 'Compost, tillage tools'
    },
    {
      activity: 'Sowing/Planting',
      dayOffset: 0,
      details: 'Plant seeds or seedlings at the recommended depth and spacing for the crop.',
      materials: 'Seeds or seedlings'
    },
    {
      activity: 'Establishment Check',
      dayOffset: Math.max(5, Math.round(durationDays * 0.1)),
      details: 'Monitor emergence and ensure plants are healthy with good soil moisture.',
      materials: 'Water, hand lens'
    },
    {
      activity: 'Fertiliser Application',
      dayOffset: Math.max(20, Math.round(durationDays * 0.25)),
      details: 'Apply appropriate fertiliser based on crop needs and soil fertility.',
      materials: 'Balanced fertiliser'
    },
    {
      activity: 'Irrigation & Moisture Management',
      dayOffset: Math.max(20, Math.round(durationDays * 0.2)),
      details: 'Check soil moisture regularly and irrigate to maintain even growth.',
      materials: 'Irrigation water'
    },
    {
      activity: 'Pest & Disease Monitoring',
      dayOffset: Math.max(35, Math.round(durationDays * 0.4)),
      details: 'Inspect plants for pests and disease symptoms and treat promptly if needed.',
      materials: 'Monitoring tools, treatment sprays'
    },
    {
      activity: 'Mid-Season Growth Review',
      dayOffset: Math.max(50, Math.round(durationDays * 0.5)),
      details: 'Assess plant health and adjust irrigation or nutrient management.',
      materials: 'Growth chart, soil test kit'
    },
    {
      activity: 'Pre-Harvest Preparation',
      dayOffset: Math.max(70, Math.round(durationDays * 0.8)),
      details: 'Check maturity signs and prepare harvesting equipment.',
      materials: 'Harvest tools'
    },
    {
      activity: 'Harvest',
      dayOffset: durationDays,
      details: 'Harvest at optimal maturity to maximize quality and yield.',
      materials: 'Harvest tools'
    }
  ];

  const schedule = (activities || genericSchedule).map(activity => {
    const activityDate = addDays(sow, activity.dayOffset);
    const day = Math.abs(activity.dayOffset);

    return {
      activity: activity.activity,
      date: formatDate(activityDate),
      day: day,
      notes: activity.notes || '',
      details: activity.details || '',
      materials: activity.materials || ''
    };
  });

  return schedule;
};

module.exports = exports;