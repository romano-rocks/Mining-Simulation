export type MiningMethodKey = 'openpit' | 'underground' | 'mountaintop' | 'insitu';

export type ScenarioKey = 1 | 2 | 3;

export type Language = 'en' | 'es';

export interface RunData {
  id: number;
  scenario: ScenarioKey;
  scenarioTitle: string;
  methodKey: MiningMethodKey;
  methodName: string;
  land: number;
  waterpH: number;
  waterGal: number;
  co2: number;
  safety: number;
  profit: number;
  communityImpact: string;
  communityLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  settingRiskTitle: string;
  settingRiskSeverity: 'critical' | 'high' | 'moderate' | 'low';
  timestamp: string;
}

export interface MethodSpec {
  key: MiningMethodKey;
  name: string;
  shortDesc: string;
  landCostAcres: number;
  waterContamGal: number;
  waterpH: number;
  co2Tons: number;
  aqiDrop: number;
  safetyRating: number;
  baseOpCost: number;
  communityImpact: string;
  communityLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  pros: string;
  cons: string;
  geologicalMechanism: string;
}

export interface ScenarioSpec {
  id: ScenarioKey;
  title: string;
  shortName: string;
  depositType: string;
  targetOre: number;
  oreValuePerTon: number;
  baseLandSensitivity: number;
  baseWaterSensitivity: number;
  baseAirSensitivity: number;
  description: string;
  rockContext: string;
}

export interface SettingRiskInfo {
  scenarioId: ScenarioKey;
  methodKey: MiningMethodKey;
  alertTitle: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  settingContext: string;
  tradeoffExplanation: string;
  criticalQuestion: string;
}

export interface BriefingQuestion {
  methodKey: MiningMethodKey;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
