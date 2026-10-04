import { MiningMethodKey, ScenarioKey, ScenarioSpec, MethodSpec, SettingRiskInfo, BriefingQuestion } from '../types';

export const SCENARIOS_ES: Record<ScenarioKey, ScenarioSpec> = {
  1: {
    id: 1,
    title: 'Escenario 1: Veta de Cobre de Alta Ley en Cuenca Árida',
    shortName: 'Cuenca Árida (Cobre)',
    depositType: 'Yacimiento de Cobre (Pórfido Cuprífero)',
    targetOre: 10000,
    oreValuePerTon: 850,
    baseLandSensitivity: 1.0,
    baseWaterSensitivity: 0.6,
    baseAirSensitivity: 1.4,
    description: 'Un valle desértico seco bordeado por mesetas montañosas de arenisca, con escasa vegetación y un acuífero subterráneo profundo.',
    rockContext: 'Capas de arenisca y caliza con agua subterránea situada a gran profundidad bajo la superficie.'
  },
  2: {
    id: 2,
    title: 'Escenario 2: Yacimiento Crítico de Tierras Raras en Humedal Boscoso',
    shortName: 'Humedal Boscoso (Tierras Raras)',
    depositType: 'Depósito de Arcilla de Tierras Raras (Tecnología y Baterías)',
    targetOre: 10000,
    oreValuePerTon: 1400,
    baseLandSensitivity: 1.8,
    baseWaterSensitivity: 2.2,
    baseAirSensitivity: 0.8,
    description: 'Un frágil humedal boscoso y valle fluvial con una capa freática poco profunda, rica biodiversidad y una cresta montañosa boscosa contigua.',
    rockContext: 'Suelos de humedal y arcillas meteorizadas donde el agua fluye con facilidad directamente hacia arroyos y ciénagas.'
  },
  3: {
    id: 3,
    title: 'Escenario 3: Veta Poco Profunda de Carbón/Hierro en Cresta Rural y Valle',
    shortName: 'Cresta Rural (Carbón/Hierro)',
    depositType: 'Estratos de Carbón e Hierro (Recursos para Energía y Acero)',
    targetOre: 10000,
    oreValuePerTon: 600,
    baseLandSensitivity: 1.3,
    baseWaterSensitivity: 1.2,
    baseAirSensitivity: 1.5,
    description: 'Una empinada cresta montañosa boscosa situada directamente encima de un pequeño pueblo rural agrícola y su arroyo de cabecera.',
    rockContext: 'Arenisca estratificada y mantos de carbón ricos en azufre que generan escorrentía ácida al contacto con el aire y el agua.'
  }
};

export const METHOD_SPECS_ES: Record<MiningMethodKey, MethodSpec> = {
  openpit: {
    key: 'openpit',
    name: 'Minería a Cielo Abierto / Por Franjas',
    shortDesc: 'Excava enormes terrazas abiertas en la superficie. Extrae gran volumen de mineral a bajo costo financiero, pero destruye ecosistemas, arrasa la capa vegetal y genera enormes nubes de polvo.',
    landCostAcres: 18.5,
    waterContamGal: 12000,
    waterpH: 4.8,
    co2Tons: 3400,
    aqiDrop: 45,
    safetyRating: 8.5,
    baseOpCost: 3200000,
    communityImpact: 'Alto (Mucho Polvo y Tráfico de Camiones Pesados)',
    communityLevel: 'High',
    pros: 'Extracción de alto volumen, bajo costo por tonelada y fácil acceso para palas mecánicas y camiones mineros.',
    cons: 'Destruye la capa vegetal y hábitats superficiales, deja enormes escombreras y genera densas nubes de polvo tóxico.',
    geologicalMechanism: 'Maquinaria pesada y explosivos retiran las capas de roca superficiales para excavar directamente los yacimientos minerales cercanos a la superficie.'
  },
  underground: {
    key: 'underground',
    name: 'Minería de Pozos Subterráneos',
    shortDesc: 'Excava pozos verticales y túneles horizontales bajo la superficie. Protege los bosques y hábitats superficiales, pero conlleva riesgo de derrumbes y genera Drenaje Ácido de Mina (DAM).',
    landCostAcres: 2.8,
    waterContamGal: 28000,
    waterpH: 4.2,
    co2Tons: 1900,
    aqiDrop: 15,
    safetyRating: 5.8,
    baseOpCost: 5800000,
    communityImpact: 'Bajo (Oculto Bajo Tierra)',
    communityLevel: 'Low',
    pros: 'Deja intactos los bosques, el suelo y el paisaje natural de la superficie; huella superficial mínima.',
    cons: 'Muy costoso de construir y operar; peligros para los mineros (derrumbes, gases tóxicos); expone rocas sulfuradas al aire y agua, generando Drenaje Ácido de Mina (DAM).',
    geologicalMechanism: 'Los mineros bajan en elevadores a pozos profundos para labrar túneles horizontales en la veta mineral sin derribar la montaña encima.'
  },
  mountaintop: {
    key: 'mountaintop',
    name: 'Minería por Remoción de Cimas',
    shortDesc: 'Emplea potentes explosivos para detonar la cima de las montañas, arrojando millones de toneladas de roca a los valles adyacentes (rellenos de valle) y sepultando arroyos de cabecera.',
    landCostAcres: 26.0,
    waterContamGal: 45000,
    waterpH: 3.8,
    co2Tons: 4200,
    aqiDrop: 60,
    safetyRating: 7.2,
    baseOpCost: 2900000,
    communityImpact: 'Muy Alto (Detonaciones Sacuden el Pueblo y Sepultan Valles)',
    communityLevel: 'Very High',
    pros: 'Forma rápida y económica de extraer vetas horizontales de carbón o metales ubicadas bajo crestas empinadas.',
    cons: 'Destruye permanentemente las cumbres montañosas; los rellenos de valle sepultan arroyos naturales; vierte químicos tóxicos y ácido sulfúrico a la cuenca.',
    geologicalMechanism: 'Las explosiones destrozan la cumbre; maquinaria gigante empuja los escombros a los valles laterales (relleno de valle), dejando al descubierto los mantos de recursos.'
  },
  insitu: {
    key: 'insitu',
    name: 'Lixiviación de Soluciones In-Situ',
    shortDesc: 'Bombea disolventes químicos líquidos directamente a la roca subterránea para disolver minerales y extraerlos bombeando la solución a la superficie sin excavar la tierra.',
    landCostAcres: 1.2,
    waterContamGal: 65000,
    waterpH: 3.2,
    co2Tons: 850,
    aqiDrop: 5,
    safetyRating: 9.0,
    baseOpCost: 4100000,
    communityImpact: 'Moderado (Tráfico de Camiones Cisterna Químicos)',
    communityLevel: 'Moderate',
    pros: 'Prácticamente cero daño a la superficie; sin escombreras ni relaves; las emisiones más bajas de carbono por maquinaria.',
    cons: 'Los disolventes ácidos pueden escapar por grietas subterráneas de la roca, amenazando con contaminar de forma irreversible los acuíferos de agua dulce potable.',
    geologicalMechanism: 'Pozos de inyección introducen disolventes ácidos en roca permeable subterránea para disolver metales, y pozos de extracción bombean la solución líquida a la superficie.'
  }
};

export const SETTING_RISKS_ES: Record<ScenarioKey, Record<MiningMethodKey, SettingRiskInfo>> = {
  1: {
    openpit: {
      scenarioId: 1,
      methodKey: 'openpit',
      alertTitle: 'Vulnerabilidad por Clima Desértico: Tormentas de Polvo Graves',
      severity: 'high',
      settingContext: 'La Cuenca Árida tiene aire seco, vientos fuertes y muy poca vegetación para retener el suelo.',
      tradeoffExplanation: 'Aunque la minería a cielo abierto es económica, remover la capa superficial desértica genera enormes nubes de polvo en suspensión (partículas PM10/PM2.5) que recorren kilómetros por la cuenca, dañando la calidad del aire de las comunidades.',
      criticalQuestion: '¿Por qué una mina a cielo abierto genera mucho más polvo en el desierto que en un bosque húmedo?'
    },
    underground: {
      scenarioId: 1,
      methodKey: 'underground',
      alertTitle: 'Protección en Roca Profunda vs. Costo Muy Elevado',
      severity: 'moderate',
      settingContext: 'Roca desértica profunda con el acuífero ubicado a cientos de pies bajo la superficie.',
      tradeoffExplanation: 'La minería subterránea evita las tormentas de polvo al operar bajo tierra. Sin embargo, excavar pozos profundos en roca dura desértica es sumamente caro y expone a los trabajadores al calor extremo del subsuelo.',
      criticalQuestion: '¿Vale la pena pagar mucho más por minería subterránea para evitar las tormentas de polvo en el desierto?'
    },
    mountaintop: {
      scenarioId: 1,
      methodKey: 'mountaintop',
      alertTitle: 'Detonación de Mesetas y Destrucción de Arroyos',
      severity: 'high',
      settingContext: 'Las cimas de las mesetas desérticas dominan sobre los arroyos y cauces naturales.',
      tradeoffExplanation: 'Detonar las mesetas produce violentas ondas de choque y arroja escombros a los cauces secos naturales (arroyos), alterando el paisaje de manera irreversible y desatando tormentas de polvo.',
      criticalQuestion: '¿Cómo afecta la detonación de una meseta desértica a la fauna silvestre y a los canales naturales de drenaje?'
    },
    insitu: {
      scenarioId: 1,
      methodKey: 'insitu',
      alertTitle: 'Acuífero Profundo Confinado vs. Integridad del Pozo',
      severity: 'moderate',
      settingContext: 'Acuífero regional profundo protegido bajo gruesas capas de arenisca y caliza.',
      tradeoffExplanation: 'Dado que el acuífero desértico es profundo, la lixiviación in-situ no genera polvo superficial ni escombreras. No obstante, las tuberías no deben fracturarse jamás para proteger el agua potable regional.',
      criticalQuestion: '¿Por qué la lixiviación in-situ es menos peligrosa en una cuenca desértica profunda que en un humedal poco profundo?'
    }
  },
  2: {
    insitu: {
      scenarioId: 2,
      methodKey: 'insitu',
      alertTitle: 'PELIGRO HIDROGEOLÓGICO CRÍTICO: Pluma Ácida se Filtra al Humedal',
      severity: 'critical',
      settingContext: 'El humedal boscoso tiene una capa freática muy poco profunda conectada a arroyos y ciénagas.',
      tradeoffExplanation: '¡ADVERTENCIA! Al ver solo los números, la lixiviación In-Situ parece ideal por baja pérdida de tierra (1.2 acres) y alta ganancia. ¡PERO EN UN HUMEDAL ES EXTREMADAMENTE PELIGROSO! Bombear ácidos bajo tierra cuando el agua está casi a flor de piel hace que los químicos tóxicos alcancen el arroyo del humedal, envenenando la fauna acuática y el agua potable.',
      criticalQuestion: '¿Por qué la baja alteración del terreno NO es una justificación válida para usar lixiviación ácida en un humedal?'
    },
    mountaintop: {
      scenarioId: 2,
      methodKey: 'mountaintop',
      alertTitle: 'DAÑO CRÍTICO A LA CUENCA: Rellenos de Valle Asfixian el Humedal',
      severity: 'critical',
      settingContext: 'Las crestas montañosas boscosas actúan como cuencas naturales que aportan agua limpia a los humedales.',
      tradeoffExplanation: 'Detonar la cresta boscosa destruye árboles centenarios que absorben la lluvia torrencial. Arrojar millones de toneladas de roca detonada a las hondonadas (rellenos de valle) sepulta para siempre los arroyos de cabecera bajo lodo tóxico.',
      criticalQuestion: '¿De qué forma rellenar un valle con escombros destruye el control natural de inundaciones y la filtración de agua limpia?'
    },
    openpit: {
      scenarioId: 2,
      methodKey: 'openpit',
      alertTitle: 'Erosión Masiva de Suelo y Sedimentación de Arroyos',
      severity: 'high',
      settingContext: 'Suelos de humedal ricos y húmedos con alta biodiversidad y abundantes lluvias.',
      tradeoffExplanation: 'Talar el bosque y retirar la capa vegetal deja gigantescos cráteres de barro. Las lluvias intensas arrastran lodo, sedimentos y químicos directo al arroyo, asfixiando peces y plantas.',
      criticalQuestion: '¿Por qué la tala rasa de árboles en un humedal lluvioso multiplica la contaminación del arroyo?'
    },
    underground: {
      scenarioId: 2,
      methodKey: 'underground',
      alertTitle: 'Conservación del Bosque Superficial vs. Filtración Ácida Subterránea',
      severity: 'moderate',
      settingContext: 'Exuberante bosque superficial con una capa freática vulnerable situada debajo.',
      tradeoffExplanation: 'La minería subterránea conserva los árboles del humedal y el hábitat animal en la superficie. No obstante, el drenaje de los pozos profundos puede generar Drenaje Ácido de Mina que se filtre a la capa freática superficial.',
      criticalQuestion: '¿Por qué la minería subterránea es más segura para los árboles, pero sigue representando un riesgo para el agua del humedal?'
    }
  },
  3: {
    mountaintop: {
      scenarioId: 3,
      methodKey: 'mountaintop',
      alertTitle: 'IMPACTO COMUNITARIO CRÍTICO: Cabeceras Sepultadas Sobre el Pueblo',
      severity: 'critical',
      settingContext: 'Cresta montañosa ubicada directamente encima de un pueblo rural y su arroyo de agua potable.',
      tradeoffExplanation: 'La remoción de cimas arroja escombros detonados directo al valle, ¡sepultando por completo el arroyo de cabecera bajo el relleno de valle! El drenaje ácido tóxico corre frente a las casas y campos agrícolas, provocando una fricción comunitaria muy alta.',
      criticalQuestion: '¿Por qué arrojar escombros a un arroyo de cabecera genera un conflicto social tan grave con la comunidad?'
    },
    openpit: {
      scenarioId: 3,
      methodKey: 'openpit',
      alertTitle: 'Conflicto Comunitario Grave: Ruido, Polvo y Cicatrices',
      severity: 'high',
      settingContext: 'Viviendas, granjas y caminos rurales situados al pie de la ladera montañosa.',
      tradeoffExplanation: 'Excavar fosas abiertas en la ladera produce ruido ensordecedor, temblores en el terreno y tráfico de camiones pesados con vista directa a las casas, desatando fuertes protestas de los residentes.',
      criticalQuestion: '¿Cómo influye la cercanía a un pueblo para que la minería a cielo abierto sea mucho más perjudicial?'
    },
    underground: {
      scenarioId: 3,
      methodKey: 'underground',
      alertTitle: 'Protección del Paisaje Montañoso vs. Drenaje Ácido (DAM)',
      severity: 'moderate',
      settingContext: 'Capas de carbón ricas en azufre situadas en la montaña sobre los pozos de agua del pueblo.',
      tradeoffExplanation: 'La minería subterránea protege la vista de la montaña y mantiene el arroyo fluyendo en la cima. No obstante, exponer carbón sulfurado bajo tierra al aire y al agua crea Drenaje Ácido de Mina que pone en riesgo el agua subterránea.',
      criticalQuestion: '¿Cómo protege la minería subterránea el paisaje del pueblo mientras oculta riesgos para el agua?'
    },
    insitu: {
      scenarioId: 3,
      methodKey: 'insitu',
      alertTitle: 'Riesgo de Migración por Roca Montañosa Fracturada',
      severity: 'moderate',
      settingContext: 'Roca montañosa fracturada ubicada por encima de los pozos de agua agrícola del valle.',
      tradeoffExplanation: 'Bombear solventes químicos a las vetas de carbón montañoso implica el riesgo de que los líquidos ácidos escapen por fisuras naturales y contaminen los pozos de las granjas.',
      criticalQuestion: '¿Qué peligros representan las fisuras naturales en la roca al bombear químicos líquidos?'
    }
  }
};

export const BRIEFING_QUESTIONS_ES: Record<MiningMethodKey, BriefingQuestion> = {
  openpit: {
    methodKey: 'openpit',
    question: '¿Por qué la minería a cielo abierto causa graves daños a los ecosistemas superficiales?',
    options: [
      'Porque utiliza pozos subterráneos muy profundos que molestan a las lombrices de tierra.',
      'Porque elimina toda la vegetación y capa fértil del suelo, destruyendo hábitats y generando densas nubes de polvo en el aire.',
      'Porque deja la montaña y sus bosques completamente intactos y prístinos.',
      'Porque solo extrae minerales de noche para no evaporar el agua local.'
    ],
    correctIndex: 1,
    explanation: '¡Correcto! La minería a cielo abierto retira todos los árboles, plantas y capa fértil superficial para acceder a los minerales, destruyendo hábitats y provocando intensas tormentas de polvo.'
  },
  underground: {
    methodKey: 'underground',
    question: '¿Qué peligro químico para el agua surge cuando la minería subterránea profunda expone minerales con azufre (como la pirita, FeS₂) al aire y al agua?',
    options: [
      'Drenaje Ácido de Mina (DAM), el cual genera ácido sulfúrico y disuelve metales pesados altamente tóxicos.',
      'Purifica de manera natural el agua del río convirtiéndola en agua mineral potable embotellada.',
      'Libera vapor de agua inofensivo que produce neblina matutina en el bosque.',
      'Neutraliza toda el agua ácida convirtiéndola en agua alcalina básica (pH 10).'
    ],
    correctIndex: 0,
    explanation: '¡Correcto! La exposición de rocas sulfuradas (pirita) al oxígeno y agua desencadena oxidación, produciendo ácido sulfúrico y metales pesados que reducen el pH del agua a niveles muy tóxicos.'
  },
  mountaintop: {
    methodKey: 'mountaintop',
    question: '¿Qué es un "relleno de valle" en la minería por remoción de cimas y por qué es ecológicamente catastrófico?',
    options: [
      'Una represa construida para almacenar agua dulce limpia para los ciervos y aves.',
      'Una capa protectora de abono orgánico plantada con flores silvestres sobre la cumbre.',
      'Arrojar millones de toneladas de roca detonada de la montaña a los valles adyacentes, sepultando permanentemente arroyos de cabecera.',
      'Un túnel subterráneo diseñado para que los animales salvajes crucen la montaña de forma segura.'
    ],
    correctIndex: 2,
    explanation: '¡Correcto! En la remoción de cimas, maquinaria pesada empuja millones de toneladas de escombros de la cumbre a los valles laterales (relleno de valle), sepultando por completo los arroyos naturales de cabecera.'
  },
  insitu: {
    methodKey: 'insitu',
    question: '¿Por qué la lixiviación in-situ se considera una apuesta de muy alto riesgo en entornos con una capa freática poco profunda y permeable (como un humedal)?',
    options: [
      'Porque las fuertes detonaciones derribarán todos los árboles de la superficie.',
      'Porque los solventes ácidos tóxicos bombeados bajo tierra pueden filtrarse fácilmente a la capa freática cercana y contaminar todo el arroyo del humedal.',
      'Porque la lixiviación in-situ requiere talar más acres de bosque que la minería a cielo abierto.',
      'Porque produce la mayor cantidad de gases de efecto invernadero de todos los métodos mineros.'
    ],
    correctIndex: 1,
    explanation: '¡Correcto! La lixiviación in-situ bombea químicos ácidos bajo tierra. En terrenos permeables con una capa freática cercana a la superficie, el solvente escapa fácilmente de la zona mineral y envenena toda la cuenca del humedal.'
  }
};
