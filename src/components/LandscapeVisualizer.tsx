import React from 'react';
import { Language, MiningMethodKey, ScenarioKey } from '../types';

interface LandscapeVisualizerProps {
  scenario: ScenarioKey;
  method: MiningMethodKey | 'none';
  showLabels: boolean;
  lang?: Language;
}

interface DiagramLabel {
  x: number;
  y: number;
  text: string;
  bgHex: string;
  textHex?: string;
  width?: number;
}

export const LandscapeVisualizer: React.FC<LandscapeVisualizerProps> = ({
  scenario,
  method,
  showLabels,
  lang = 'en',
}) => {
  const t = (en: string, es: string) => (lang === 'es' ? es : en);

  // Label renderer placed in front-layer
  const renderLabelElement = (label: DiagramLabel, index: number) => {
    const charWidth = 6.2;
    const calculatedWidth = label.width && label.width > 0 ? label.width : Math.max(76, label.text.length * charWidth + 14);
    const height = 19;
    const rx = 4;
    const rectX = label.x - calculatedWidth / 2;
    const rectY = label.y - height / 2;
    const textHex = label.textHex || '#ffffff';

    return (
      <g key={index} className="svg-diagram-label" pointerEvents="none" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))">
        <rect
          x={rectX}
          y={rectY}
          width={calculatedWidth}
          height={height}
          rx={rx}
          fill={label.bgHex}
          opacity="0.96"
          stroke="#0f172a"
          strokeWidth="1"
        />
        <text
          x={label.x}
          y={label.y + 4.5}
          fill={textHex}
          fontSize="9.5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.02em"
        >
          {label.text}
        </text>
      </g>
    );
  };

  // -------------------------------------------------------------
  // SCENARIO 1: ARID BASIN (COPPER) WITH PROMINENT MESA/RIDGE TOPOGRAPHY
  // -------------------------------------------------------------
  const renderScenario1 = () => {
    // Exact elevation function for the Arid Basin with elevated Mesa / Mountain Ridge
    // Left side (0..270): Basin floor at y=214 down to y=210
    // Middle (270..500): Steep escarpment/slope rising from 210 to 72
    // Right (500..800): Elevated desert mesa summit plateau at y=72 to 68
    const getGroundY = (x: number): number => {
      if (x <= 270) {
        return 214 - (x / 270) * 4;
      } else if (x <= 500) {
        const t = (x - 270) / (500 - 270);
        const ease = t * t * (3 - 2 * t);
        return 210 - ease * (210 - 72);
      } else {
        // Mesa top
        return 72 - Math.sin(((x - 500) / 300) * Math.PI) * 4;
      }
    };

    const isMountaintop = method === 'mountaintop';
    const isOpenPit = method === 'openpit';
    const labels: DiagramLabel[] = [];

    // Deep Aquifer Label
    labels.push({ x: 130, y: 284, text: t("DEEP FRESHWATER AQUIFER", "ACUÍFERO SUBTERRÁNEO PROFUNDO"), bgHex: "#0369a1" });
    labels.push({ x: 130, y: 242, text: t("LIMESTONE BEDROCK STRATA", "ESTRATOS DE ROCA CALIZA"), bgHex: "#78350f", textHex: "#fef3c7" });

    if (isMountaintop) {
      labels.push({ x: 480, y: 35, text: t("⚠ PM10/PM2.5 DUST & BLAST PLUME", "⚠ POLVO PM10/PM2.5 Y DETONACIÓN"), bgHex: "#78350f", textHex: "#fef08a" });
      labels.push({ x: 570, y: 124, text: t("EXPOSED COPPER (Cu) ORE", "MINERAL DE COBRE (Cu) EXPUESTO"), bgHex: "#ca8a04", textHex: "#0f172a" });
      labels.push({ x: 260, y: 165, text: t("VALLEY FILL (WASTE ROCK DUMP)", "RELLENO DE VALLE (ESCOMBRERA)"), bgHex: "#991b1b" });
      labels.push({ x: 670, y: 75, text: t("MESA SUMMIT BLASTED FLAT (MTR)", "CIMA APLANADA POR DETONACIONES"), bgHex: "#451a03", textHex: "#fef08a" });
      labels.push({ x: 90, y: 195, text: t("DESERT BASIN FLOOR", "FONDO DE LA CUENCA DESÉRTICA"), bgHex: "#92400e" });
    } else if (isOpenPit) {
      labels.push({ x: 440, y: 35, text: t("⚠ FUGITIVE DUST FROM EXCAVATION", "⚠ POLVO FUGITIVO DE EXCAVACIÓN"), bgHex: "#78350f", textHex: "#fef08a" });
      labels.push({ x: 90, y: 125, text: t("SURFACE TAILINGS DUMP", "DEPÓSITO SUPERFICIAL DE RELAVES"), bgHex: "#451a03", textHex: "#fde047" });
      labels.push({ x: 500, y: 190, text: t("ACTIVE OPEN-PIT BENCHES", "BANCOS DE MINA A CIELO ABIERTO"), bgHex: "#78350f" });
      labels.push({ x: 500, y: 226, text: t("EXPOSED COPPER (Cu) ORE", "MINERAL DE COBRE (Cu) EXPUESTO"), bgHex: "#ca8a04", textHex: "#0f172a" });
      labels.push({ x: 90, y: 195, text: t("DESERT BASIN FLOOR", "FONDO DE LA CUENCA DESÉRTICA"), bgHex: "#92400e" });
    } else {
      labels.push({ x: 110, y: 195, text: t("DESERT ALLUVIAL BASIN", "CUENCA ALUVIAL DESÉRTICA"), bgHex: "#92400e" });
      labels.push({ x: 660, y: 38, text: t("DESERT MOUNTAIN MESA SUMMIT", "CIMA DE LA MESETA DESÉRTICA"), bgHex: "#78350f", textHex: "#fef08a" });
      labels.push({ x: 600, y: 135, text: t("HIGH-GRADE COPPER SEAM (Cu)", "VETA DE COBRE DE ALTA LEY (Cu)"), bgHex: "#ca8a04", textHex: "#0f172a" });

      if (method === 'underground') {
        labels.push({ x: 340, y: 95, text: t("HEADFRAME HOIST", "TORRE DE EXTRACCIÓN"), bgHex: "#1e293b" });
        labels.push({ x: 470, y: 190, text: t("VERTICAL MINE SHAFT", "POZO VERTICAL DE MINA"), bgHex: "#0f172a" });
        labels.push({ x: 600, y: 160, text: t("HORIZONTAL COPPER TUNNELS", "TÚNELES HORIZONTALES DE COBRE"), bgHex: "#0f172a" });
        labels.push({ x: 480, y: 260, text: t("⚠ ACID DRAINAGE SEEPAGE (AMD)", "⚠ DRENAJE ÁCIDO DE MINA (DAM)"), bgHex: "#b45309" });
      } else if (method === 'insitu') {
        labels.push({ x: 542, y: 25, text: t("INJECTION WELL", "POZO DE INYECCIÓN"), bgHex: "#0284c7" });
        labels.push({ x: 702, y: 25, text: t("EXTRACTION WELL", "POZO DE EXTRACCIÓN"), bgHex: "#0284c7" });
        labels.push({ x: 620, y: 165, text: t("ACID LEACH PLUME IN ORE", "PLUMA ÁCIDA DE LIXIVIACIÓN"), bgHex: "#0891b2" });
      }
    }

    return (
      <>
        {/* Sky Gradient */}
        <rect width="800" height="300" fill="url(#skyDesert)" />

        {/* Desert Sun with Atmospheric Haze */}
        <circle cx="710" cy="45" r="42" fill="#fef08a" opacity="0.25" filter="blur(6px)" />
        <circle cx="710" cy="45" r="24" fill="#fef9c3" opacity="0.95" />
        <circle cx="710" cy="45" r="18" fill="#ffffff" opacity="0.9" />

        {/* Distant Desert Ranges in Background */}
        <path
          d="M 0,190 Q 150,110 320,165 T 700,120 L 800,105 L 800,240 L 0,240 Z"
          fill="#92400e"
          opacity="0.4"
        />

        {/* Deep Regional Aquifer Under the Basin (y=268..300) */}
        <rect x="0" y="268" width="800" height="32" fill="#0284c7" opacity="0.6" />
        <path
          d="M 0,274 Q 200,270 400,274 T 800,274"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="10 8"
          className="water-flow-anim"
          opacity="0.7"
        />

        {/* Subsurface Sedimentary Strata Layer (y=210..268) */}
        <rect x="0" y="210" width="800" height="58" fill="url(#sandstone)" />

        {/* Marine Fossil Beds in Limestone */}
        {[50, 140, 230, 480, 660, 750].map((fx, idx) => (
          <use key={idx} href="#fossil" x={fx} y={230 + (idx % 3) * 6} />
        ))}

        {/* 1. MOUNTAINTOP REMOVAL (MTR) IN ARID BASIN */}
        {isMountaintop ? (
          <>
            {/* Blasting Dust Cloud over Blown Mesa */}
            <g className="dust-cloud">
              <ellipse cx="460" cy="90" rx="300" ry="75" fill="#a16207" opacity="0.45" />
              <ellipse className="dust-core" cx="470" cy="108" rx="180" ry="48" fill="#78350f" opacity="0.55" />
            </g>

            {/* Blasted Decapitated Mesa Ridge (Summit blasted down from y=72 to y=150) */}
            <path
              d="M 270,300 L 270,210 L 320,195 L 380,150 L 520,150 L 620,140 L 730,140 L 770,165 L 800,175 L 800,300 Z"
              fill="#78350f"
            />
            {/* Blasted Bench Lines */}
            <path
              d="M 380,150 L 520,150 M 620,140 L 730,140"
              stroke="#451a03"
              strokeWidth="2.5"
            />

            {/* Exposed Copper Porphyry Ore Body in Blasted Crater */}
            <path d="M 400,152 L 540,152 L 510,185 L 430,185 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />
            <path d="M 610,142 L 720,142 L 700,170 L 630,170 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />

            {/* MASSIVE VALLEY FILL OVERBURDEN (NGSS CORE MECHANISM) */}
            <path
              d="M 180,225 C 220,170 300,150 390,155 L 360,210 C 310,230 250,232 180,225 Z"
              fill="#57280b"
            />
            <path
              d="M 140,240 C 180,210 250,190 370,200 L 330,242 C 260,252 180,250 140,240 Z"
              fill="#451a03"
            />
            {/* Scree boulders in the valley fill */}
            <circle cx="170" cy="235" r="4.5" fill="#361403" />
            <circle cx="215" cy="225" r="5" fill="#240e02" />
            <circle cx="270" cy="205" r="6" fill="#361403" />
            <circle cx="320" cy="190" r="5.5" fill="#240e02" />

            {/* Basin Floor (Left side: 0..270) */}
            <path
              d="M 0,214 L 270,210 L 270,300 L 0,300 Z"
              fill="#b45309"
            />

            {/* Grounded Cacti on the intact Basin floor */}
            {[45, 110].map((cx, idx) => {
              const cy = getGroundY(cx);
              return (
                <g key={idx}>
                  <ellipse cx={cx} cy={cy} rx={9} ry={3} fill="#78350f" opacity="0.45" />
                  <circle cx={cx - 6} cy={cy + 1} r={2} fill="#92400e" />
                  <circle cx={cx + 5} cy={cy + 0.5} r={1.5} fill="#a16207" />
                  <path
                    d={`M ${cx},${cy} L ${cx},${cy - 22} M ${cx - 6},${cy - 12} L ${cx - 6},${cy - 18} L ${cx},${cy - 18} M ${cx},${cy - 15} L ${cx + 6},${cy - 15} L ${cx + 6},${cy - 20}`}
                    stroke="#15803d"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              );
            })}
          </>
        ) : isOpenPit ? (
          <>
            {/* 2. OPEN PIT MINING: Massive Stepped Bowl carved into the Mesa */}
            <g className="dust-cloud">
              <ellipse cx="440" cy="100" rx="260" ry="70" fill="#a16207" opacity="0.35" />
              <ellipse className="dust-core" cx="460" cy="115" rx="160" ry="45" fill="#78350f" opacity="0.45" />
            </g>

            {/* Intact Mesa flanks with Stepped Pit in Center */}
            <path
              d="M 0,214 L 160,212 L 220,170 L 280,120 L 330,120 L 370,150 L 410,180 L 440,210 L 560,210 L 590,180 L 630,150 L 670,120 L 730,72 L 800,68 L 800,300 L 0,300 Z"
              fill="#78350f"
            />
            {/* Stepped bench terraces */}
            <path
              d="M 330,120 L 370,150 L 410,180 L 440,210 L 560,210 L 590,180 L 630,150 L 670,120"
              stroke="#57280b"
              strokeWidth="2.5"
            />
            {/* Waste Rock Tailings on Basin Floor */}
            <path d="M 20,214 C 50,140 110,140 150,212 Z" fill="#451a03" />
            <path d="M 35,214 C 65,160 100,160 135,212 Z" fill="#78350f" />
            <circle cx="28" cy="213" r="3" fill="#361403" />
            <circle cx="140" cy="212" r="3" fill="#361403" />

            {/* Haul Truck on Pit Bench (firmly grounded at y=210) */}
            <g transform="translate(480, 196)">
              <rect x="0" y="3" width="22" height="9" fill="#eab308" rx="1" />
              <rect x="14" y="0" width="7" height="6" fill="#ca8a04" />
              <circle cx="4" cy="13" r="3.2" fill="#1e293b" />
              <circle cx="17" cy="13" r="3.2" fill="#1e293b" />
            </g>

            {/* Exposed Copper Ore on Pit Floor */}
            <path d="M 450,210 L 550,210 L 500,238 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />
          </>
        ) : (
          <>
            {/* 3. INTACT / NATURAL TOPOGRAPHY (Baseline, Underground, In-Situ) */}
            <path
              d="M 0,214 L 270,210 C 340,210 400,72 500,72 L 800,68 L 800,300 L 0,300 Z"
              fill="#b45309"
            />
            {/* Red Sandstone Cliff Escarpment Bands */}
            <path
              d="M 330,175 C 380,165 440,95 500,85 L 800,80 L 800,95 L 500,100 C 440,110 380,180 330,190 Z"
              fill="#78350f"
              opacity="0.65"
            />
            <path
              d="M 290,205 C 350,195 420,135 480,125 L 800,120 L 800,132 L 480,137 C 420,147 350,207 290,215 Z"
              fill="#78350f"
              opacity="0.5"
            />

            {/* High-Grade Copper Porphyry Seam inside the Mesa Body */}
            <path
              d="M 440,125 C 520,125 640,115 760,115 L 760,145 C 640,145 520,155 440,155 Z"
              fill="#ca8a04"
              stroke="#a16207"
              strokeWidth="1.5"
            />

            {/* 100% MATHEMATICALLY GROUNDED CACTI ACROSS BASIN & MESA */}
            {[50, 130, 220, 560, 640, 730, 775].map((cx, idx) => {
              const cy = getGroundY(cx);
              return (
                <g key={idx}>
                  <ellipse cx={cx} cy={cy} rx={9} ry={3} fill="#78350f" opacity="0.45" />
                  <circle cx={cx - 6} cy={cy + 1} r={2} fill="#92400e" />
                  <circle cx={cx + 5} cy={cy + 0.5} r={1.5} fill="#a16207" />
                  <path
                    d={`M ${cx},${cy} L ${cx},${cy - 22} M ${cx - 6},${cy - 12} L ${cx - 6},${cy - 18} L ${cx},${cy - 18} M ${cx},${cy - 15} L ${cx + 6},${cy - 15} L ${cx + 6},${cy - 20}`}
                    stroke="#15803d"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              );
            })}
          </>
        )}

        {/* Underground Shaft Mining Overlay */}
        {method === 'underground' && (
          <g>
            <rect x="390" y="142" width="40" height="6" fill="#475569" stroke="#1e293b" strokeWidth="1" rx="1" />
            <rect x="398" y="92" width="22" height="50" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="396,92 409,72 422,92" fill="#1e293b" />
            <circle cx="409" cy="82" r="5" fill="#f8fafc" stroke="#1e293b" strokeWidth="1" />
            <rect x="404" y="148" width="10" height="95" fill="#1e293b" />
            <rect x="414" y="138" width="340" height="12" fill="#1e293b" />
            <path
              className="acid-flow"
              d="M 409,243 L 409,268"
              stroke="#f59e0b"
              strokeWidth="4"
              fill="none"
            />
          </g>
        )}

        {/* In-Situ Solution Leaching Overlay */}
        {method === 'insitu' && (
          <g>
            <rect x="530" y={getGroundY(536) - 4} width="24" height="5" fill="#475569" rx="1" />
            <rect x="536" y={getGroundY(536) - 34} width="12" height="30" fill="#0284c7" rx="2" stroke="#0369a1" />
            <line x1="542" y1={getGroundY(536)} x2="542" y2="135" stroke="#06b6d4" strokeWidth="4" />

            <rect x="690" y={getGroundY(696) - 4} width="24" height="5" fill="#475569" rx="1" />
            <rect x="696" y={getGroundY(696) - 34} width="12" height="30" fill="#0284c7" rx="2" stroke="#0369a1" />
            <line x1="702" y1={getGroundY(696)} x2="702" y2="135" stroke="#06b6d4" strokeWidth="4" />

            <ellipse
              className="leach-plume"
              cx="620"
              cy="135"
              rx="125"
              ry="28"
              fill="#22d3ee"
              opacity="0.7"
              stroke="#0891b2"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Dedicated FRONT Labels Layer - Zero Occlusion */}
        {showLabels && (
          <g id="labels-overlay-s1" className="pointer-events-none">
            {labels.map(renderLabelElement)}
          </g>
        )}
      </>
    );
  };

  // -------------------------------------------------------------
  // SCENARIO 2: FORESTED WETLAND (RARE EARTHS) WITH PROMINENT RIDGE TOPOGRAPHY
  // -------------------------------------------------------------
  const renderScenario2 = () => {
    const getWetlandY = (x: number): number => {
      if (x <= 280) {
        return 214 - (x / 280) * 4;
      } else if (x <= 540) {
        const t = (x - 280) / (540 - 280);
        const ease = t * t * (3 - 2 * t);
        return 210 - ease * (210 - 65);
      } else {
        return 65 - Math.sin(((x - 540) / 260) * Math.PI) * 5;
      }
    };

    const isMountaintop = method === 'mountaintop';
    const isOpenPit = method === 'openpit';
    const labels: DiagramLabel[] = [];

    labels.push({ x: 140, y: 282, text: t("SHALLOW WATER TABLE & RECHARGE", "CAPA FREÁTICA POCO PROFUNDA"), bgHex: "#0284c7" });

    if (isMountaintop) {
      labels.push({ x: 480, y: 35, text: t("⚠ BLASTING DUST & TREE CLEARING", "⚠ POLVO DE DETONACIÓN Y TALA"), bgHex: "#451a03", textHex: "#fef08a" });
      labels.push({ x: 575, y: 122, text: t("EXPOSED RARE EARTH (REE) BED", "MANTO DE TIERRAS RARAS (REE)"), bgHex: "#ca8a04", textHex: "#0f172a" });
      labels.push({ x: 260, y: 165, text: t("VALLEY FILL: BURIED WETLAND STREAM", "RELLENO DE VALLE: ARROYO SEPULTADO"), bgHex: "#991b1b" });
      labels.push({ x: 670, y: 75, text: t("FORESTED RIDGE BLASTED (MTR)", "CRESTA BOSCOSA DETONADA (MTR)"), bgHex: "#451a03", textHex: "#fef08a" });
      labels.push({ x: 75, y: 280, text: t("⚠ TURBID ACID MUD RUNOFF", "⚠ ESCORRENTÍA DE LODO ÁCIDO"), bgHex: "#9a3412" });
    } else if (isOpenPit) {
      labels.push({ x: 460, y: 35, text: t("⚠ DUST & HEAVY CLEAR-CUTTING", "⚠ POLVO Y TALA RASA INTENSA"), bgHex: "#451a03", textHex: "#fef08a" });
      labels.push({ x: 80, y: 180, text: t("STRIPPED TOPSOIL", "SUELO FÉRTIL REMOVIDO"), bgHex: "#451a03", textHex: "#fde047" });
      labels.push({ x: 510, y: 205, text: t("EXPOSED RARE EARTH BED", "MANTO DE TIERRAS RARAS EXPUESTO"), bgHex: "#ca8a04", textHex: "#0f172a" });
    } else {
      labels.push({ x: 140, y: 248, text: t("NATURAL WETLAND STREAM", "ARROYO NATURAL DEL HUMEDAL"), bgHex: "#0369a1" });
      labels.push({ x: 110, y: 185, text: t("WETLAND FLOODPLAIN", "LLANURA DE INUNDACIÓN DEL HUMEDAL"), bgHex: "#14532d" });
      labels.push({ x: 670, y: 36, text: t("FORESTED MOUNTAIN RIDGE", "CRESTA MONTAÑOSA BOSCOSA"), bgHex: "#14532d" });
      labels.push({ x: 605, y: 125, text: t("RARE EARTH (REE) CLAY DEPOSIT", "ARCILLA DE TIERRAS RARAS (REE)"), bgHex: "#be123c" });

      if (method === 'underground') {
        labels.push({ x: 438, y: 80, text: t("UNDERGROUND HEADFRAME", "TORRE DE POZO SUBTERRÁNEO"), bgHex: "#1e293b" });
        labels.push({ x: 600, y: 155, text: t("REE EXTRACTION TUNNEL", "TÚNEL DE EXTRACCIÓN DE REE"), bgHex: "#0f172a" });
        labels.push({ x: 370, y: 185, text: t("⚠ ACID DRAINAGE SEEPAGE (AMD)", "⚠ FILTRACIÓN DE DRENAJE ÁCIDO"), bgHex: "#b45309" });
      } else if (method === 'insitu') {
        labels.push({ x: 532, y: 25, text: t("INJECTION WELL", "POZO DE INYECCIÓN"), bgHex: "#0284c7" });
        labels.push({ x: 692, y: 25, text: t("EXTRACTION WELL", "POZO DE EXTRACCIÓN"), bgHex: "#0284c7" });
        labels.push({ x: 430, y: 160, text: t("⚠ ACID PLUME SEEPS TO WETLAND", "⚠ PLUMA ÁCIDA SE FILTRA AL HUMEDAL"), bgHex: "#0891b2" });
        labels.push({ x: 140, y: 248, text: t("⚠ CONTAMINATED WETLAND STREAM", "⚠ ARROYO DEL HUMEDAL CONTAMINADO"), bgHex: "#dc2626" });
        labels.push({ x: 670, y: 36, text: t("FORESTED MOUNTAIN RIDGE", "CRESTA MONTAÑOSA BOSCOSA"), bgHex: "#14532d" });
      }
    }

    return (
      <>
        {/* Wetland Sky Gradient */}
        <rect width="800" height="300" fill="url(#skyWetland)" />

        {/* Distant Watershed Hills in Mist */}
        <path
          d="M 0,190 C 140,140 280,120 440,140 C 600,150 710,95 800,105 L 800,240 L 0,240 Z"
          fill="#166534"
          opacity="0.4"
        />

        {/* Shallow Unconfined Water Table Zone (y=210..300) */}
        <rect x="0" y="210" width="800" height="90" fill="#0369a1" opacity="0.45" />
        <path
          d="M 0,214 Q 200,210 400,214 T 800,214"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          fill="none"
          opacity="0.7"
          className="water-flow-anim"
        />

        {/* 1. MOUNTAINTOP REMOVAL (MTR) IN FORESTED WETLAND */}
        {isMountaintop ? (
          <>
            <g className="dust-cloud">
              <ellipse cx="480" cy="85" rx="300" ry="70" fill="#451a03" opacity="0.5" />
              <ellipse className="dust-core" cx="490" cy="100" rx="180" ry="42" fill="#290f02" opacity="0.45" />
            </g>

            {/* Blasted Decapitated Ridge Summit */}
            <path
              d="M 280,300 L 280,210 L 330,195 L 390,145 L 530,145 L 630,135 L 740,135 L 780,165 L 800,175 L 800,300 Z"
              fill="#451a03"
            />
            <path
              d="M 390,145 L 530,145 M 630,135 L 740,135"
              stroke="#290f02"
              strokeWidth="2.5"
            />

            {/* Exposed Rare Earth Elements (REE) Clay Bed */}
            <rect x="420" y="147" width="310" height="20" fill="#ca8a04" rx="2" stroke="#a16207" />

            {/* MASSIVE VALLEY FILL */}
            <path
              d="M 180,225 C 220,170 310,145 400,150 L 370,210 C 310,230 250,232 180,225 Z"
              fill="#57280b"
            />
            <path
              d="M 130,240 C 180,205 260,185 380,195 L 330,245 C 260,255 180,252 130,240 Z"
              fill="#361403"
            />
            <circle cx="160" cy="235" r="4.5" fill="#240e02" />
            <circle cx="210" cy="225" r="5.5" fill="#240e02" />
            <circle cx="270" cy="205" r="6" fill="#361403" />

            {/* Polluted, Choked Wetland Stream emerging from Valley Fill */}
            <path
              d="M 130,238 C 90,244 50,250 0,254 L 0,266 C 50,262 90,256 130,250 Z"
              fill="#78350f"
            />
            <path
              d="M 130,242 C 90,247 50,253 0,257"
              stroke="#b45309"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8 6"
              className="water-flow-anim"
            />

            {/* Deforested Stumps along the Blasted Slope */}
            {[340, 420, 650, 750].map((sx, idx) => (
              <g key={idx}>
                <ellipse cx={sx} cy={145} rx={8} ry={2.5} fill="#290f02" opacity="0.6" />
                <use href="#stump" x={sx} y={145} />
              </g>
            ))}
          </>
        ) : isOpenPit ? (
          <>
            <g className="dust-cloud">
              <ellipse cx="460" cy="95" rx="270" ry="65" fill="#451a03" opacity="0.45" />
              <ellipse className="dust-core" cx="480" cy="110" rx="170" ry="40" fill="#290f02" opacity="0.4" />
            </g>

            {/* Excavated Muddy Terraces */}
            <path
              d="M 0,214 L 160,212 L 220,180 L 280,140 L 340,140 L 380,170 L 420,200 L 450,225 L 570,225 L 610,195 L 650,165 L 690,135 L 750,68 L 800,64 L 800,300 L 0,300 Z"
              fill="#451a03"
            />
            <path
              d="M 340,140 L 380,170 L 420,200 L 450,225 L 570,225 L 610,195 L 650,165 L 690,135"
              stroke="#290f02"
              strokeWidth="2.5"
            />
            {/* Exposed REE Bed on Pit floor */}
            <rect x="460" y="222" width="100" height="22" fill="#ca8a04" rx="2" stroke="#a16207" />

            {/* Stumps on Pit margins */}
            {[50, 110, 710, 770].map((sx, idx) => (
              <g key={idx}>
                <ellipse cx={sx} cy={getWetlandY(sx)} rx={8} ry={2.5} fill="#290f02" opacity="0.6" />
                <use href="#stump" x={sx} y={getWetlandY(sx)} />
              </g>
            ))}
          </>
        ) : (
          <>
            {/* 3. INTACT / NATURAL TOPOGRAPHY */}
            <path
              d="M 0,214 L 280,210 C 350,210 420,65 540,65 L 800,60 L 800,300 L 0,300 Z"
              fill="#15803d"
            />
            {/* Subsoil Layer */}
            <path
              d="M 280,215 C 360,215 440,85 540,85 L 800,80 L 800,105 L 540,110 C 440,110 360,230 280,230 Z"
              fill="#4d7c0f"
              opacity="0.5"
            />

            {/* Pristine Wetland Stream & Oxbow in the Valley Floor (0..280) */}
            <path
              d="M 0,222 C 90,220 180,224 280,220 L 280,234 C 180,238 90,234 0,236 Z"
              fill="#0ea5e9"
            />
            <path
              d="M 0,228 C 90,226 180,230 280,226"
              stroke="#7dd3fc"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10 8"
              className="water-flow-anim"
            />

            {/* Cattails & Reeds along Stream Banks */}
            {[30, 95, 175, 255].map((rx, idx) => (
              <g key={idx}>
                <line x1={rx} y1={224} x2={rx - 2} y2={210} stroke="#166534" strokeWidth="1.5" />
                <line x1={rx + 3} y1={224} x2={rx + 4} y2={208} stroke="#166534" strokeWidth="1.5" />
                <rect x={rx - 3} y={208} width="2" height="6" fill="#78350f" rx="1" />
              </g>
            ))}

            {/* Rare Earth Element (REE) Saprolite Deposit in the Ridge */}
            <path
              d="M 440,115 C 530,115 650,105 770,105 L 770,135 C 650,135 530,145 440,145 Z"
              fill="#f43f5e"
              stroke="#be123c"
              strokeWidth="1.5"
            />

            {/* 100% MATHEMATICALLY GROUNDED DECIDUOUS OAK TREES */}
            {[45, 125, 205, 410, 480, 560, 640, 720, 775].map((tx, idx) => {
              const ty = getWetlandY(tx);
              return (
                <g key={idx}>
                  <ellipse cx={tx} cy={ty} rx={12} ry={3.5} fill="#14532d" opacity="0.5" />
                  <g transform={`translate(${tx}, ${ty - 12})`}>
                    <use href="#oak-tree" />
                  </g>
                </g>
              );
            })}
          </>
        )}

        {/* Underground Shaft Mining Overlay */}
        {method === 'underground' && (
          <g>
            <rect x="420" y="148" width="36" height="6" fill="#475569" stroke="#1e293b" strokeWidth="1" rx="1" />
            <rect x="428" y="100" width="20" height="50" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="433" y="154" width="10" height="75" fill="#1e293b" />
            <rect x="443" y="125" width="320" height="12" fill="#1e293b" />
            <path
              className="acid-flow"
              d="M 438,175 L 360,175 M 438,229 L 438,260"
              stroke="#f59e0b"
              strokeWidth="4"
              fill="none"
            />
            <ellipse className="leach-plume" cx="370" cy="210" rx="90" ry="20" fill="#f59e0b" opacity="0.65" />
          </g>
        )}

        {/* In-Situ Solution Leaching Overlay - Visually Demonstrating Toxic Plume Spreading to Wetland */}
        {method === 'insitu' && (
          <g>
            {/* Well 1 Injection Well on Ridge */}
            <rect x="520" y={getWetlandY(526) - 4} width="24" height="5" fill="#475569" rx="1" />
            <rect x="526" y={getWetlandY(526) - 34} width="12" height="30" fill="#0284c7" rx="2" stroke="#0369a1" />
            <line x1="532" y1={getWetlandY(526)} x2="532" y2="125" stroke="#06b6d4" strokeWidth="4" />

            {/* Well 2 Extraction Well on Ridge */}
            <rect x="680" y={getWetlandY(686) - 4} width="24" height="5" fill="#475569" rx="1" />
            <rect x="686" y={getWetlandY(686) - 34} width="12" height="30" fill="#0284c7" rx="2" stroke="#0369a1" />
            <line x1="692" y1={getWetlandY(686)} x2="692" y2="125" stroke="#06b6d4" strokeWidth="4" />

            {/* Expansive Acid Plume Escaping the Ore Zone and Migrating Downslope into the Wetland */}
            <path
              className="leach-plume"
              d="M 720,125 C 600,110 480,150 360,185 C 260,210 180,214 0,218 L 0,260 C 180,260 260,248 360,225 C 480,195 600,165 720,160 Z"
              fill="#22d3ee"
              opacity="0.65"
              stroke="#0891b2"
              strokeWidth="2"
            />

            {/* Active Lateral Acid Solvent Flow Currents into Wetland Water Table */}
            <path
              d="M 532,130 C 440,155 350,195 280,216 C 200,222 100,225 0,227"
              stroke="#a3e635"
              strokeWidth="4"
              fill="none"
              className="acid-flow"
            />
            <path
              d="M 500,140 C 420,165 330,205 250,222 C 170,228 80,230 0,232"
              stroke="#06b6d4"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray="8 6"
              className="water-flow-anim"
            />

            {/* Contaminated Wetland Stream: Turns Fluorescent Toxic Cyan/Yellow */}
            <path
              d="M 0,222 C 90,220 180,224 280,220 L 280,234 C 180,238 90,234 0,236 Z"
              fill="#22d3ee"
              opacity="0.9"
            />
            <path
              d="M 0,228 C 90,226 180,230 280,226"
              stroke="#a3e635"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="6 4"
              className="water-flow-anim"
            />

            {/* Chemical Bubbles & Foam in Polluted Wetland Stream */}
            <circle cx="50" cy="226" r="3.5" fill="#fef08a" opacity="0.85" />
            <circle cx="110" cy="228" r="4.5" fill="#a3e635" opacity="0.85" />
            <circle cx="170" cy="225" r="4" fill="#fef08a" opacity="0.85" />
            <circle cx="230" cy="227" r="3.5" fill="#a3e635" opacity="0.85" />

            {/* Dying Wilted Reeds Along Polluted Water Margin */}
            {[25, 90, 165, 245].map((rx, idx) => (
              <g key={idx}>
                {/* Yellow/brown dying wilted reed bending over */}
                <line x1={rx} y1={224} x2={rx - 8} y2={218} stroke="#854d0e" strokeWidth="1.5" />
                <line x1={rx + 2} y1={224} x2={rx + 10} y2={219} stroke="#a16207" strokeWidth="1.5" />
                <rect x={rx - 10} y={217} width="3" height="4" fill="#713f12" rx="1" />
              </g>
            ))}
          </g>
        )}

        {/* Dedicated FRONT Labels Layer - Zero Occlusion */}
        {showLabels && (
          <g id="labels-overlay-s2" className="pointer-events-none">
            {labels.map(renderLabelElement)}
          </g>
        )}
      </>
    );
  };

  // -------------------------------------------------------------
  // SCENARIO 3: RURAL RIDGE (COAL/IRON) - COMPLETE GRAPHICAL PERFECTION
  // -------------------------------------------------------------
  const renderScenario3 = () => {
    const getMountainRidgeY = (x: number): number => {
      if (x <= 320) return 242;
      if (x <= 640) {
        const t = (x - 320) / (640 - 320);
        const ease = t * t * (3 - 2 * t);
        return 242 - ease * (242 - 48);
      } else {
        const t = (x - 640) / (800 - 640);
        return 48 + t * 30;
      }
    };

    const isBlasted = method === 'mountaintop' || method === 'openpit';
    const labels: DiagramLabel[] = [];

    if (isBlasted) {
      labels.push({ x: 670, y: 284, text: t("SUBTERRANEAN BEDROCK AQUIFER", "ACUÍFERO EN ROCA SUBTERRÁNEA"), bgHex: "#0284c7" });
      labels.push({ x: 440, y: 35, text: t("⚠ BLAST DUST & SHOCKWAVES", "⚠ POLVO Y ONDAS DE CHOQUE"), bgHex: "#1e293b", textHex: "#fde047" });
      labels.push({ x: 575, y: 130, text: t("EXPOSED COAL / IRON BED", "MANTO DE CARBÓN/HIERRO EXPUESTO"), bgHex: "#0f172a", textHex: "#fde047" });
      labels.push({ x: 320, y: 175, text: t("VALLEY FILL: BURIED HEADWATER STREAM", "RELLENO DE VALLE: ARROYO SEPULTADO"), bgHex: "#991b1b" });
      labels.push({ x: 115, y: 282, text: t("⚠ TOXIC ACID RUNOFF (pH 3.8)", "⚠ ESCORRENTÍA ÁCIDA TÓXICA (pH 3.8)"), bgHex: "#9a3412" });
      labels.push({ x: 105, y: 170, text: t("RURAL FARMING TOWN", "PUEBLO RURAL AGRÍCOLA"), bgHex: "#334155" });
    } else {
      labels.push({ x: 670, y: 284, text: t("SUBTERRANEAN BEDROCK AQUIFER", "ACUÍFERO EN ROCA SUBTERRÁNEA"), bgHex: "#0284c7" });
      labels.push({ x: 380, y: 205, text: t("PRISTINE HEADWATER STREAM", "ARROYO DE CABECERA PRÍSTINO"), bgHex: "#0284c7" });
      labels.push({ x: 600, y: 28, text: t("FORESTED APPALACHIAN RIDGE", "CRESTA APALACHE BOSCOSA"), bgHex: "#14532d" });
      labels.push({ x: 650, y: 112, text: t("UPPER COAL SEAM (IN ROCK)", "VETA SUPERIOR DE CARBÓN"), bgHex: "#0f172a", textHex: "#fde047" });
      labels.push({ x: 620, y: 178, text: t("LOWER COAL SEAM (IN ROCK)", "VETA INFERIOR DE CARBÓN"), bgHex: "#0f172a", textHex: "#fde047" });
      labels.push({ x: 105, y: 170, text: t("RURAL FARMING TOWN", "PUEBLO RURAL AGRÍCOLA"), bgHex: "#334155" });

      if (method === 'underground') {
        labels.push({ x: 710, y: 55, text: t("MOUNTAIN ADIT PORTAL", "BOCAMINA EN LA MONTAÑA"), bgHex: "#1e293b" });
        labels.push({ x: 745, y: 195, text: t("VERTICAL HOIST SHAFT", "POZO VERTICAL DE EXTRACCIÓN"), bgHex: "#0f172a" });
        labels.push({ x: 590, y: 92, text: t("UPPER COAL TUNNEL", "TÚNEL SUPERIOR DE CARBÓN"), bgHex: "#0f172a" });
        labels.push({ x: 550, y: 160, text: t("LOWER COAL TUNNEL", "TÚNEL INFERIOR DE CARBÓN"), bgHex: "#0f172a" });
      } else if (method === 'insitu') {
        labels.push({ x: 572, y: 30, text: t("INJECTION WELL", "POZO DE INYECCIÓN"), bgHex: "#0284c7" });
        labels.push({ x: 726, y: 30, text: t("EXTRACTION WELL", "POZO DE EXTRACCIÓN"), bgHex: "#0284c7" });
        labels.push({ x: 640, y: 155, text: t("SOLVENT LEACH PLUME IN COAL", "PLUMA DE DISOLVENTE EN CARBÓN"), bgHex: "#0891b2" });
      }
    }

    return (
      <>
        {/* Appalachian Atmospheric Sky Gradient */}
        <rect width="800" height="300" fill="url(#skyRural)" />

        {/* Distant Mountain Ridges in Blue Mist */}
        <path
          d="M 0,210 C 140,150 260,110 440,120 C 600,130 710,75 800,95 L 800,300 L 0,300 Z"
          fill="#64748b"
          opacity="0.4"
        />

        {isBlasted ? (
          <>
            {/* Blasting Dust & Smoke Plume */}
            <g className="dust-cloud">
              <ellipse cx="440" cy="100" rx="340" ry="75" fill="#475569" opacity="0.65" />
              <ellipse className="dust-core" cx="450" cy="118" rx="200" ry="46" fill="#1e293b" opacity="0.55" />
            </g>

            {/* Blasted Decapitated Ridge Summit */}
            <path
              d="M 330,300 L 330,242 L 380,210 L 440,165 L 530,165 L 610,150 L 710,150 L 760,180 L 800,200 L 800,300 Z"
              fill="#475569"
            />
            <path
              d="M 440,165 L 530,165 M 610,150 L 710,150 M 710,150 L 760,180"
              stroke="#1e293b"
              strokeWidth="2.5"
            />

            {/* Exposed Lower Coal Seam */}
            <path d="M 440,168 L 530,168 L 530,178 L 440,178 Z" fill="#0f172a" />
            <path d="M 610,153 L 710,153 L 710,163 L 610,163 Z" fill="#0f172a" />

            {/* MASSIVE VALLEY FILL OVERBURDEN */}
            <path
              d="M 230,250 C 270,185 360,160 460,165 L 430,225 C 380,252 300,254 230,250 Z"
              fill="#78716c"
            />
            <path
              d="M 190,265 C 230,230 310,210 440,220 L 390,262 C 300,278 220,275 190,265 Z"
              fill="#57534e"
            />
            <circle cx="240" cy="245" r="4" fill="#3f3f46" />
            <circle cx="280" cy="235" r="5" fill="#27272a" />
            <circle cx="340" cy="215" r="6" fill="#3f3f46" />
            <circle cx="390" cy="205" r="5" fill="#27272a" />
            <circle cx="215" cy="260" r="3.5" fill="#27272a" />

            {/* REDESIGNED STREAM - UNDER POLLUTED STATE */}
            <path
              d="M 210,262 C 170,268 130,274 70,278 L 0,283 L 0,296 L 70,291 C 130,287 170,281 210,275 Z"
              fill="#78350f"
              opacity="0.8"
            />
            <path
              d="M 205,266 C 168,271 128,277 68,281 L 0,286 L 0,293 L 68,288 C 128,284 168,278 205,271 Z"
              fill="#b45309"
            />
            <path
              d="M 205,268 C 168,273 128,279 68,283 L 0,288"
              stroke="#d97706"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray="10 6"
              className="water-flow-anim"
            />
            <circle cx="185" cy="272" r="3" fill="#fef08a" opacity="0.7" />
            <circle cx="150" cy="276" r="3.5" fill="#fef08a" opacity="0.6" />
            <circle cx="95" cy="281" r="4" fill="#fef08a" opacity="0.7" />

            {/* Dead Stumps along the Blasted Ridge */}
            {[235, 275, 630, 710, 765].map((sx, idx) => {
              const sy = sx < 320 ? 250 : getMountainRidgeY(sx);
              return (
                <g key={idx}>
                  <ellipse cx={sx} cy={sy} rx={8} ry={2.5} fill="#290f02" opacity="0.6" />
                  <use href="#stump" x={sx} y={sy} />
                </g>
              );
            })}

            {/* Valley Town */}
            {renderDetailedTown(true)}
          </>
        ) : (
          <>
            {/* INTACT / NATURAL MOUNTAIN RIDGE */}
            <path
              d="M 320,300 L 320,242 C 400,242 500,48 640,48 C 720,48 760,78 800,78 L 800,300 Z"
              fill="#334155"
            />
            <path
              d="M 320,280 C 400,280 500,100 640,100 C 720,100 760,135 800,135 L 800,300 L 320,300 Z"
              fill="#475569"
            />

            {/* 100% MOUNTAIN-ENCLOSED COAL SEAMS */}
            {/* Upper Coal Seam: Crops out at (520, 108), stays completely inside rock to x=800 */}
            <path
              d="M 520,108 C 600,108 680,112 800,116 L 800,128 C 680,124 600,120 520,120 Z"
              fill="url(#coal-seam)"
            />
            {/* Lower Coal Seam: Crops out at (440, 172), stays completely inside rock to x=800 */}
            <path
              d="M 440,172 C 550,172 680,178 800,183 L 800,195 C 680,190 550,184 440,184 Z"
              fill="url(#coal-seam)"
            />

            {/* Green Mountain Surface Soil & Forest Slope */}
            <path
              d="M 320,242 C 400,242 500,48 640,48 C 720,48 760,78 800,78 L 800,88 C 760,88 720,58 640,58 C 500,58 400,252 320,252 Z"
              fill="#1e3a1e"
            />

            {/* GORGEOUS INTACT MOUNTAIN HEADWATER STREAM */}
            <ellipse cx="530" cy="125" rx="9" ry="4" fill="#0284c7" />
            <circle cx="522" cy="123" r="3.5" fill="#64748b" />
            <circle cx="538" cy="124" r="4" fill="#475569" />
            <circle cx="532" cy="121" r="2.5" fill="#94a3b8" />

            <path
              d="M 530,125 C 490,155 450,185 390,215 C 350,235 330,245 270,256 C 210,266 140,272 70,278 L 0,283 L 0,296 L 70,291 C 140,285 210,279 270,269 C 330,258 350,248 390,228 C 450,198 490,168 530,138 Z"
              fill="#0f172a"
              opacity="0.35"
            />

            <path
              d="M 530,126 C 490,156 450,186 390,216 C 350,236 330,246 270,257 C 210,267 140,273 70,279 L 0,284 L 0,293 L 70,288 C 140,282 210,276 270,266 C 330,255 350,245 390,225 C 450,195 490,165 530,135 Z"
              fill="#0284c7"
            />
            <path
              d="M 528,128 C 489,158 449,188 389,218 C 349,238 329,248 269,259 C 209,269 139,275 69,281 L 0,286 L 0,291 L 69,286 C 139,280 209,274 269,264 C 329,253 349,243 389,223 C 449,193 489,163 528,133 Z"
              fill="#38bdf8"
              opacity="0.8"
            />

            <path
              d="M 525,130 C 485,160 445,190 385,220 C 345,240 325,250 265,261 C 205,271 135,277 65,283 L 0,288"
              stroke="#e0f2fe"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="10 8"
              className="water-flow-anim"
            />
            <ellipse cx="445" cy="190" rx="6" ry="2.5" fill="#ffffff" opacity="0.8" />
            <ellipse cx="385" cy="220" rx="8" ry="3" fill="#ffffff" opacity="0.85" />
            <ellipse cx="325" cy="248" rx="7" ry="2.5" fill="#ffffff" opacity="0.8" />

            {/* River Stones */}
            <circle cx="480" cy="170" r="3" fill="#64748b" />
            <circle cx="430" cy="200" r="4" fill="#475569" />
            <circle cx="360" cy="235" r="4.5" fill="#64748b" />
            <circle cx="305" cy="260" r="3.5" fill="#475569" />
            <circle cx="230" cy="272" r="4" fill="#64748b" />
            <circle cx="160" cy="280" r="4" fill="#475569" />
            <circle cx="85" cy="286" r="3.5" fill="#64748b" />

            {/* Cattails */}
            {[180, 240, 110, 45].map((rx, idx) => (
              <g key={idx}>
                <line x1={rx} y1={276} x2={rx - 2} y2={264} stroke="#15803d" strokeWidth="1.5" />
                <line x1={rx + 3} y1={276} x2={rx + 4} y2={262} stroke="#15803d" strokeWidth="1.5" />
                <rect x={rx - 3} y={262} width="2" height="5" fill="#78350f" rx="1" />
              </g>
            ))}

            {/* MATHEMATICALLY GROUNDED PINE TREES */}
            {[390, 440, 490, 545, 595, 645, 695, 745, 785].map((px, idx) => {
              const py = getMountainRidgeY(px);
              return (
                <g key={idx}>
                  <ellipse cx={px} cy={py} rx={10} ry={3} fill="#14532d" opacity="0.6" />
                  <circle cx={px - 4} cy={py + 1} r={1.5} fill="#451a03" />
                  <circle cx={px + 5} cy={py + 0.5} r={2} fill="#334155" />
                  <g transform={`translate(${px}, ${py - 28})`}>
                    <use href="#pine-tree" />
                  </g>
                </g>
              );
            })}

            {/* Valley Town */}
            {renderDetailedTown(false)}
          </>
        )}

        {/* Underground Mining Overlay */}
        {method === 'underground' && (
          <g>
            <rect x="695" y="80" width="28" height="38" fill="#0f172a" rx="2" stroke="#334155" strokeWidth="1.5" />
            <polygon points="692,80 709,68 726,80" fill="#334155" />
            <line x1="700" y1="118" x2="720" y2="118" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="709" y1="118" x2="709" y2="250" stroke="#020617" strokeWidth="10" />
            <path d="M 520,114 L 709,114" stroke="#020617" strokeWidth="9" fill="none" />
            <path d="M 440,178 L 709,178" stroke="#020617" strokeWidth="9" fill="none" />
            <path
              className="acid-flow"
              d="M 520,118 L 520,160 M 440,183 L 440,250"
              stroke="#f59e0b"
              strokeWidth="3.5"
              fill="none"
            />
          </g>
        )}

        {/* In-Situ Solution Leaching Overlay */}
        {method === 'insitu' && (
          <g>
            <rect x="560" y={getMountainRidgeY(566) - 3} width="24" height="5" fill="#475569" rx="1" />
            <rect x="566" y={getMountainRidgeY(566) - 35} width="12" height="32" fill="#0284c7" rx="2" stroke="#0369a1" />
            <line x1="572" y1={getMountainRidgeY(566)} x2="572" y2="180" stroke="#06b6d4" strokeWidth="4" />

            <rect x="714" y={getMountainRidgeY(720) - 3} width="24" height="5" fill="#475569" rx="1" />
            <rect x="720" y={getMountainRidgeY(720) - 35} width="12" height="32" fill="#0284c7" rx="2" stroke="#0369a1" />
            <line x1="726" y1={getMountainRidgeY(720)} x2="726" y2="175" stroke="#06b6d4" strokeWidth="4" />

            <ellipse
              className="leach-plume"
              cx="640"
              cy="175"
              rx="110"
              ry="32"
              fill="#22d3ee"
              opacity="0.65"
              stroke="#0891b2"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Subterranean Bedrock Aquifer at Base */}
        <rect x="0" y="270" width="800" height="30" fill="#0284c7" opacity="0.45" />

        {/* Dedicated FRONT Labels Layer - Zero Occlusion */}
        {showLabels && (
          <g id="labels-overlay-s3" className="pointer-events-none">
            {labels.map(renderLabelElement)}
          </g>
        )}
      </>
    );
  };

  // Helper to render the grounded rural town & road in Scenario 3
  const renderDetailedTown = (isPolluted: boolean) => {
    return (
      <g>
        {/* Valley Pasture Meadow Base (x=0 to 320) */}
        <path
          d="M 0,224 C 100,230 200,236 320,242 L 320,300 L 0,300 Z"
          fill={isPolluted ? "#52623a" : "#65a30d"}
        />

        {/* Post-and-Rail Wooden Farm Fence */}
        <path
          d="M 10,230 L 125,235 M 10,234 L 125,239"
          stroke="#451a03"
          strokeWidth="1.2"
        />
        {[10, 35, 60, 85, 110].map((fx, idx) => (
          <line key={idx} x1={fx} y1={228} x2={fx} y2={242} stroke="#451a03" strokeWidth="2" />
        ))}

        {/* Red Timber Barn */}
        <g transform="translate(30, 196)">
          <rect x="-2" y="34" width="56" height="5" fill="#475569" stroke="#1e293b" strokeWidth="1" rx="1" />
          <rect x="0" y="8" width="52" height="28" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
          <polygon points="-4,8 26,-8 56,8" fill="#7f1d1d" stroke="#571111" strokeWidth="1" />
          <rect x="18" y="16" width="16" height="20" fill="#f8fafc" stroke="#7f1d1d" strokeWidth="1" />
          <line x1="18" y1="16" x2="34" y2="36" stroke="#b91c1c" strokeWidth="1.5" />
          <line x1="34" y1="16" x2="18" y2="36" stroke="#b91c1c" strokeWidth="1.5" />
          <polygon points="22,4 26,0 30,4 30,8 22,8" fill="#f8fafc" stroke="#7f1d1d" strokeWidth="0.8" />
        </g>

        {/* Grain Silo */}
        <g transform="translate(86, 172)">
          <rect x="-2" y="60" width="24" height="5" fill="#64748b" stroke="#334155" strokeWidth="1" rx="1" />
          <rect x="0" y="10" width="20" height="52" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          <line x1="0" y1="22" x2="20" y2="22" stroke="#94a3b8" strokeWidth="1" />
          <line x1="0" y1="36" x2="20" y2="36" stroke="#94a3b8" strokeWidth="1" />
          <line x1="0" y1="50" x2="20" y2="50" stroke="#94a3b8" strokeWidth="1" />
          <path d="M 0,10 C 0,0 20,0 20,10 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
        </g>

        {/* Rural Farmhouse */}
        <g transform="translate(126, 206)">
          <rect x="-2" y="28" width="46" height="4" fill="#64748b" stroke="#334155" strokeWidth="1" rx="1" />
          <rect x="0" y="8" width="42" height="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <polygon points="-4,8 21,-7 46,8" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <rect x="30" y="-12" width="6" height="12" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
          <rect x="6" y="13" width="8" height="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <rect x="28" y="13" width="8" height="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <rect x="17" y="16" width="8" height="14" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
        </g>

        {/* Country Road */}
        <path
          d="M 0,252 C 60,250 110,254 180,260 C 230,265 270,268 310,270"
          fill="none"
          stroke="#475569"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 0,252 C 60,250 110,254 180,260 C 230,265 270,268 310,270"
          fill="none"
          stroke="#fde047"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />

        {/* Bridge */}
        <g transform="translate(178, 252)">
          <rect x="-4" y="0" width="8" height="14" fill="#334155" rx="1" stroke="#1e293b" strokeWidth="0.8" />
          <rect x="38" y="4" width="8" height="14" fill="#334155" rx="1" stroke="#1e293b" strokeWidth="0.8" />
          <rect x="-6" y="-2" width="54" height="6" fill="#78350f" stroke="#451a03" strokeWidth="1" rx="1" />
          <line x1="-5" y1="-7" x2="47" y2="-7" stroke="#451a03" strokeWidth="2" />
          <line x1="-3" y1="-2" x2="-3" y2="-8" stroke="#451a03" strokeWidth="2" />
          <line x1="21" y1="-2" x2="21" y2="-8" stroke="#451a03" strokeWidth="2" />
          <line x1="45" y1="-2" x2="45" y2="-8" stroke="#451a03" strokeWidth="2" />
        </g>
      </g>
    );
  };

  return (
    <svg
      id="landscape-svg"
      className="w-full h-full select-none"
      viewBox="0 0 800 300"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Universal Rock & Ore Patterns */}
        <pattern id="coal-seam" width="20" height="15" patternUnits="userSpaceOnUse">
          <rect width="20" height="15" fill="#1e293b" />
          <path d="M 0,7 C 5,4 15,10 20,7" fill="none" stroke="#0f172a" strokeWidth="2" />
        </pattern>
        <pattern id="sandstone" width="30" height="20" patternUnits="userSpaceOnUse">
          <rect width="30" height="20" fill="#b45309" />
          <circle cx="5" cy="5" r="1.5" fill="#92400e" opacity="0.6" />
          <circle cx="20" cy="12" r="1" fill="#92400e" opacity="0.6" />
          <circle cx="10" cy="18" r="2" fill="#92400e" opacity="0.6" />
        </pattern>

        {/* Sky Color Gradients */}
        <linearGradient id="skyDesert" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="skyWetland" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="skyRural" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        {/* Reusable Object Assets */}
        <g id="fossil">
          <ellipse cx="0" cy="0" rx="4.5" ry="3" fill="none" stroke="#78350f" strokeWidth="1.2" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#78350f" strokeWidth="0.8" />
          <path d="M -2,-2 Q 0,-4 2,-2" fill="none" stroke="#78350f" strokeWidth="1" />
        </g>

        <g id="stump">
          <path d="M -6,0 L -3,-8 L 3,-8 L 6,0 Z" fill="#451a03" />
          <path d="M -8,0 C -5,-2 -3,-5 -3,-8" stroke="#290f02" strokeWidth="1.5" fill="none" />
          <path d="M 8,0 C 5,-2 3,-5 3,-8" stroke="#290f02" strokeWidth="1.5" fill="none" />
          <ellipse cx="0" cy="-8" rx="3.5" ry="1.5" fill="#a16207" stroke="#451a03" strokeWidth="1" />
        </g>

        <g id="pine-tree">
          <rect x="-3" y="16" width="6" height="12" fill="#451a03" />
          <polygon points="0,-32 10,-12 4,-12 14,2 6,2 18,16 -18,16 -6,2 -14,2 -4,-12 -10,-12" fill="#14532d" />
          <polygon points="0,-32 0,16 18,16 6,2 14,2 4,-12 10,-12" fill="#166534" opacity="0.35" />
        </g>

        <g id="oak-tree">
          <path d="M -2,0 L -3,12 L 3,12 L 2,0 Z" fill="#451a03" />
          <path
            d="M 0,0 C -16,0 -22,-14 -12,-24 C -18,-38 2,-42 10,-28 C 24,-34 30,-14 16,0 Z"
            fill="#15803d"
          />
          <circle cx="-3" cy="-18" r="9" fill="#16a34a" opacity="0.5" />
          <circle cx="8" cy="-14" r="8" fill="#15803d" />
        </g>
      </defs>

      {/* Render Selected Scenario Visualizer */}
      {scenario === 1 && renderScenario1()}
      {scenario === 2 && renderScenario2()}
      {scenario === 3 && renderScenario3()}
    </svg>
  );
};
