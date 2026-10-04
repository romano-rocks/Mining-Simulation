import { MethodSpec, MiningMethodKey, ScenarioKey, ScenarioSpec } from '../types';

export const SCENARIOS: Record<ScenarioKey, ScenarioSpec> = {
  1: {
    id: 1,
    title: 'Scenario 1: High-Grade Copper Seam in Arid Basin',
    shortName: 'Arid Basin (Copper)',
    depositType: 'Copper Ore Deposit (Porphyry Copper)',
    targetOre: 10000,
    oreValuePerTon: 850,
    baseLandSensitivity: 1.0,
    baseWaterSensitivity: 0.6,
    baseAirSensitivity: 1.4,
    description: 'A dry desert valley bordered by steep sandstone mountain mesas with sparse plants and a deep underground aquifer.',
    rockContext: 'Sandstone and limestone layers with deep groundwater far below the surface.'
  },
  2: {
    id: 2,
    title: 'Scenario 2: Critical Rare-Earth Deposit in Forested Wetland',
    shortName: 'Forested Wetland (REEs)',
    depositType: 'Rare Earth Element Clay Deposit (For Tech & Batteries)',
    targetOre: 10000,
    oreValuePerTon: 1400,
    baseLandSensitivity: 1.8,
    baseWaterSensitivity: 2.2,
    baseAirSensitivity: 0.8,
    description: 'A fragile forest wetland and river valley with a shallow water table, rich wildlife, and an adjoining forested mountain ridge.',
    rockContext: 'Wetland soils and weathered clay layers where water easily flows directly into streams and wetlands.'
  },
  3: {
    id: 3,
    title: 'Scenario 3: Shallow Coal/Iron Seam on Rural Ridge & Valley',
    shortName: 'Rural Ridge (Coal/Iron)',
    depositType: 'Coal and Iron Rock Layers (Energy & Steel Resources)',
    targetOre: 10000,
    oreValuePerTon: 600,
    baseLandSensitivity: 1.3,
    baseWaterSensitivity: 1.2,
    baseAirSensitivity: 1.5,
    description: 'A steep forested mountain ridge directly above a small rural farming town and mountain headwater stream.',
    rockContext: 'Layered sandstone and sulfur-rich coal beds that produce acid runoff when exposed to air and water.'
  }
};

export const METHOD_SPECS: Record<MiningMethodKey, MethodSpec> = {
  openpit: {
    key: 'openpit',
    name: 'Open-Pit / Strip Mining',
    shortDesc: 'Digs giant open terraced pits on the surface. Extracts large amounts of ore at low financial cost, but destroys ecosystems, strips topsoil, and creates huge dust clouds.',
    landCostAcres: 18.5,
    waterContamGal: 12000,
    waterpH: 4.8,
    co2Tons: 3400,
    aqiDrop: 45,
    safetyRating: 8.5,
    baseOpCost: 3200000,
    communityImpact: 'High (Heavy Dust & Truck Traffic)',
    communityLevel: 'High',
    pros: 'High volume extraction, low cost per ton, easy access for large excavators and haul trucks.',
    cons: 'Destroys surface topsoil and habitats, leaves massive waste rock piles, generates heavy dust pollution.',
    geologicalMechanism: 'Heavy machinery and explosives strip away surface rock layers to directly excavate near-surface mineral deposits.'
  },
  underground: {
    key: 'underground',
    name: 'Underground Shaft Mining',
    shortDesc: 'Digs deep vertical shafts and horizontal tunnels beneath the surface. Protects surface forests and habitats, but brings cave-in risks and creates Acid Mine Drainage (AMD).',
    landCostAcres: 2.8,
    waterContamGal: 28000,
    waterpH: 4.2,
    co2Tons: 1900,
    aqiDrop: 15,
    safetyRating: 5.8,
    baseOpCost: 5800000,
    communityImpact: 'Low (Hidden Underground)',
    communityLevel: 'Low',
    pros: 'Leaves surface forests, soil, and scenic mountain views intact; small surface footprint.',
    cons: 'Very expensive to build and operate; worker safety hazards (cave-ins, harmful gases); exposes deep sulfur rocks to air and water, creating Acid Mine Drainage (AMD).',
    geologicalMechanism: 'Miners take elevator shafts deep underground to carve out horizontal tunnels directly within the valuable ore layer without removing the mountain above.'
  },
  mountaintop: {
    key: 'mountaintop',
    name: 'Mountaintop Removal Mining',
    shortDesc: 'Uses heavy explosives to blast off the top of mountains, pushing millions of tons of waste rock into nearby valleys (valley fills) and burying headwater streams.',
    landCostAcres: 26.0,
    waterContamGal: 45000,
    waterpH: 3.8,
    co2Tons: 4200,
    aqiDrop: 60,
    safetyRating: 7.2,
    baseOpCost: 2900000,
    communityImpact: 'Very High (Blasting Shakes Town & Buries Valleys)',
    communityLevel: 'Very High',
    pros: 'Fast and cheap way to extract shallow horizontal coal or metal seams underneath steep ridges.',
    cons: 'Permanently destroys mountain peaks; valley fills completely bury natural streams; releases toxic chemicals and sulfuric acid into downstream waterways.',
    geologicalMechanism: 'Explosives shatter the mountain summit; giant machinery pushes the rock rubble into adjacent stream valleys (valley fill), exposing horizontal resource beds.'
  },
  insitu: {
    key: 'insitu',
    name: 'In-Situ Solution Leaching',
    shortDesc: 'Pumps liquid chemical solvents directly into underground rock to dissolve minerals, pumping the liquid back up without any digging or surface removal.',
    landCostAcres: 1.2,
    waterContamGal: 65000,
    waterpH: 3.2,
    co2Tons: 850,
    aqiDrop: 5,
    safetyRating: 9.0,
    baseOpCost: 4100000,
    communityImpact: 'Moderate (Chemical Tanker Traffic)',
    communityLevel: 'Moderate',
    pros: 'Almost no surface land damage; no waste rock piles or tailings dumps; lowest machinery carbon emissions.',
    cons: 'Acid chemicals can leak through cracked underground rock, threatening permanent contamination of freshwater aquifers and drinking wells.',
    geologicalMechanism: 'Injection wells pump liquid chemical solvents into porous underground rock to dissolve metals, and recovery wells pump the dissolved solution to the surface.'
  }
};

export const SETTING_RISKS: Record<ScenarioKey, Record<MiningMethodKey, import('../types').SettingRiskInfo>> = {
  1: {
    openpit: {
      scenarioId: 1,
      methodKey: 'openpit',
      alertTitle: 'Desert Climate Vulnerability: Severe Dust Storms',
      severity: 'high',
      settingContext: 'Arid Basin has dry desert air, strong winds, and little vegetation to hold soil.',
      tradeoffExplanation: 'While open-pit is cheap, stripping dry desert topsoil creates massive blowing dust clouds (PM10/PM2.5 particles) that travel for miles across the basin, creating dangerous air quality for nearby communities.',
      criticalQuestion: 'Why does an open-pit mine create far more airborne dust in an arid desert than in a wet forest?'
    },
    underground: {
      scenarioId: 1,
      methodKey: 'underground',
      alertTitle: 'Deep Bedrock Protection vs. High Expense',
      severity: 'moderate',
      settingContext: 'Deep desert bedrock with the aquifer located hundreds of feet below the surface.',
      tradeoffExplanation: 'Underground mining prevents desert dust storms by working beneath the surface. However, sinking deep shafts through hard desert rock is extremely expensive and subjects workers to underground heat.',
      criticalQuestion: 'Is paying more for underground mining worth it to avoid desert dust storms?'
    },
    mountaintop: {
      scenarioId: 1,
      methodKey: 'mountaintop',
      alertTitle: 'Mesa Blasting & Arroyo Destruction',
      severity: 'high',
      settingContext: 'Desert mesa summits tower above natural arroyos and drainage washes.',
      tradeoffExplanation: 'Blasting the top of desert mesas creates violent shockwaves and dumps rubble into natural drainage arroyos, permanently altering the desert landscape and generating huge dust clouds.',
      criticalQuestion: 'How does blasting a desert mesa summit impact desert wildlife and drainage channels?'
    },
    insitu: {
      scenarioId: 1,
      methodKey: 'insitu',
      alertTitle: 'Deep Aquifer Containment vs. Well Integrity',
      severity: 'moderate',
      settingContext: 'Deep regional aquifer protected beneath thick sandstone and limestone layers.',
      tradeoffExplanation: 'Because the desert aquifer is deep, in-situ creates zero surface dust and no waste rock piles. However, well casings must never crack to protect deep regional drinking water.',
      criticalQuestion: 'Why is in-situ solution leaching less dangerous in a deep desert basin than in a shallow wetland?'
    }
  },
  2: {
    insitu: {
      scenarioId: 2,
      methodKey: 'insitu',
      alertTitle: 'CRITICAL HYDROGEOLOGICAL HAZARD: Acid Plume Leaks into Wetland',
      severity: 'critical',
      settingContext: 'Forested wetland has a very shallow water table directly connected to surface streams and marshes.',
      tradeoffExplanation: 'WARNING: Looking only at the numbers, In-Situ seems appealing because of low land loss (1.2 acres) and high profit. BUT IN A WETLAND, THIS IS EXTREMELY DANGEROUS! Pumping acid solvents underground when the water table is right near the surface causes toxic chemicals to leak into the wetland stream, poisoning aquatic life and drinking water!',
      criticalQuestion: 'Why is low land disruption NOT a good justification for using acid leaching in a wetland?'
    },
    mountaintop: {
      scenarioId: 2,
      methodKey: 'mountaintop',
      alertTitle: 'CRITICAL WATERSHED DAMAGE: Valley Fills Smother Wetlands',
      severity: 'critical',
      settingContext: 'Forested mountain ridges act as natural watersheds that feed clean water into wetland streams.',
      tradeoffExplanation: 'Blasting the forested mountain ridge destroys ancient trees that absorb rainfall. Dumping millions of tons of blasted waste rock into the wetland hollows (valley fills) permanently smothers headwater streams in toxic mud.',
      criticalQuestion: 'How does filling a wetland hollow with rock rubble destroy flood control and clean water filtration?'
    },
    openpit: {
      scenarioId: 2,
      methodKey: 'openpit',
      alertTitle: 'Heavy Topsoil Erosion & Stream Mud Siltation',
      severity: 'high',
      settingContext: 'Rich, moist wetland soils with high biodiversity and high rainfall.',
      tradeoffExplanation: 'Stripping the forest canopy and topsoil leaves giant mud craters. Heavy rainfall washes mud, silt, and chemicals directly into the wetland stream, suffocating fish and plants.',
      criticalQuestion: 'How does clear-cutting trees in a rainy wetland increase stream pollution?'
    },
    underground: {
      scenarioId: 2,
      methodKey: 'underground',
      alertTitle: 'Surface Forest Preservation vs. Subsurface Acid Seepage',
      severity: 'moderate',
      settingContext: 'Lush surface forest canopy with a vulnerable shallow water table below.',
      tradeoffExplanation: 'Underground mining preserves the surface wetland trees and wildlife habitat. However, water draining from deep shafts can create Acid Mine Drainage that seeps into the shallow water table.',
      criticalQuestion: 'Why is underground mining safer for surface trees, but still a risk for wetland water?'
    }
  },
  3: {
    mountaintop: {
      scenarioId: 3,
      methodKey: 'mountaintop',
      alertTitle: 'CRITICAL COMMUNITY IMPACT: Buried Headwaters Above Town',
      severity: 'critical',
      settingContext: 'Mountain ridge situated directly above a rural farming town and its drinking water stream.',
      tradeoffExplanation: 'Mountaintop removal dumps shattered waste rock directly into the mountain valley, completely burying the headwater stream under valley fill! Toxic acid runoff flows right past town homes and farm fields, causing very high community friction.',
      criticalQuestion: 'Why does dumping valley fill into a headwater stream create very high community friction?'
    },
    openpit: {
      scenarioId: 3,
      methodKey: 'openpit',
      alertTitle: 'Severe Community Conflict: Noise, Dust & Scars',
      severity: 'high',
      settingContext: 'Town homes, barns, and roads located right in the valley below the mountain slope.',
      tradeoffExplanation: 'Blasting open pits on the ridge creates loud noise, shaking ground, and diesel haul truck traffic directly overlooking homes, sparking heavy protests from residents.',
      criticalQuestion: 'How does being close to a town make open-pit mining far more disruptive?'
    },
    underground: {
      scenarioId: 3,
      methodKey: 'underground',
      alertTitle: 'Scenic Mountain Protection vs. Acid Drainage (AMD)',
      severity: 'moderate',
      settingContext: 'Sulfur-rich coal layers situated in mountain rock above town groundwater.',
      tradeoffExplanation: 'Underground mining preserves the mountain ridge view and keeps the stream flowing on top. However, exposing underground sulfur coal to air and water creates Acid Mine Drainage that threatens groundwater.',
      criticalQuestion: 'How does underground mining protect the town\'s scenery while still creating hidden water hazards?'
    },
    insitu: {
      scenarioId: 3,
      methodKey: 'insitu',
      alertTitle: 'Fractured Mountain Rock Migration Risk',
      severity: 'moderate',
      settingContext: 'Fractured mountain bedrock overlooking valley farming water wells.',
      tradeoffExplanation: 'Pumping chemical solvents into mountain coal seams risks acidic fluids escaping through natural rock cracks and contaminating valley wells.',
      criticalQuestion: 'What risks do natural cracks in mountain bedrock create when pumping liquid chemicals?'
    }
  }
};

export const BRIEFING_QUESTIONS: Record<MiningMethodKey, import('../types').BriefingQuestion> = {
  openpit: {
    methodKey: 'openpit',
    question: 'Why does open-pit and strip mining cause severe damage to surface ecosystems?',
    options: [
      'It uses deep underground shafts that disturb earthworms.',
      'It strips away all vegetation and topsoil, destroying surface habitats and generating heavy airborne dust.',
      'It leaves the surface mountain ridge completely untouched and pristine.',
      'It only extracts minerals at night to avoid evaporating local water.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Open-pit mining removes all surface trees, plants, and topsoil to reach mineral beds, causing massive habitat destruction and severe dust storms.'
  },
  underground: {
    methodKey: 'underground',
    question: 'What major chemical water hazard occurs when deep underground mining exposes sulfur minerals (like pyrite, FeS₂) to air and water?',
    options: [
      'Acid Mine Drainage (AMD), which produces sulfuric acid and toxic dissolved heavy metals.',
      'It naturally purifies local river water into bottled drinking water.',
      'It releases harmless water vapor that creates morning clouds.',
      'It neutralizes all acidic groundwater into basic water (pH 10).'
    ],
    correctIndex: 0,
    explanation: 'Correct! Exposing underground sulfur rocks (pyrite) to oxygen and water triggers oxidation, generating sulfuric acid and dissolved heavy metals that drop water pH to toxic levels.'
  },
  mountaintop: {
    methodKey: 'mountaintop',
    question: 'What is a "valley fill" in mountaintop removal mining, and why is it ecologically catastrophic?',
    options: [
      'A reservoir built to store clean freshwater for wildlife.',
      'A protective organic soil blanket planted with wildflowers across the mountain summit.',
      'Dumping millions of tons of blasted mountain waste rock into valleys, permanently burying headwater streams.',
      'An underground tunnel designed to transport wild animals safely.'
    ],
    correctIndex: 2,
    explanation: 'Correct! In mountaintop removal, giant machines push millions of tons of shattered mountain peak rubble into adjacent valley hollows (valley fills), completely burying natural headwater streams.'
  },
  insitu: {
    methodKey: 'insitu',
    question: 'Why is in-situ solution leaching considered a high-risk gamble in environments with a shallow, permeable water table (like a wetland)?',
    options: [
      'Because heavy blasting shockwaves will shake surface trees down.',
      'Because toxic acid solvents pumped underground can easily leak into the shallow water table and contaminate the connected wetland stream.',
      'Because in-situ requires clear-cutting more surface forest acres than open-pit mining.',
      'Because it generates the highest greenhouse gas carbon emissions of any mining method.'
    ],
    correctIndex: 1,
    explanation: 'Correct! In-situ solution mining pumps toxic chemical solvents into underground rock. In permeable ground with a high water table, that acid solvent can easily escape confinement and permanently poison the wetland watershed.'
  }
};
