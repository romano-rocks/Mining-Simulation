import React, { useState, useRef, useEffect } from 'react';
import {
  Mountain,
  Pickaxe,
  Droplets,
  TreePine,
  Cloud,
  HardHat,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Volume2,
  VolumeX,
  Target,
  BookOpen,
  CheckCircle2,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Lock,
  Play,
  X,
  Layers,
  House,
  ShieldCheck,
  Tags,
  HelpCircle,
  FileDown,
  Languages,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import {
  Language,
  MiningMethodKey,
  RunData,
  ScenarioKey,
} from './types';
import { SCENARIOS, METHOD_SPECS, SETTING_RISKS, BRIEFING_QUESTIONS } from './data/miningData';
import { SCENARIOS_ES, METHOD_SPECS_ES, SETTING_RISKS_ES, BRIEFING_QUESTIONS_ES } from './data/translations';
import { LandscapeVisualizer } from './components/LandscapeVisualizer';

export default function App() {
  // Core State
  const [currentScenario, setCurrentScenario] = useState<ScenarioKey>(1);
  const [currentMethod, setCurrentMethod] = useState<MiningMethodKey>('openpit');
  const [activeVisualMethod, setActiveVisualMethod] = useState<MiningMethodKey | 'none'>('none');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showDiagramLabels, setShowDiagramLabels] = useState(true);

  // Method Briefings Verification Tracking & Interactive Questions
  const [verifiedBriefings, setVerifiedBriefings] = useState<Record<MiningMethodKey, boolean>>({
    openpit: false,
    underground: false,
    mountaintop: false,
    insitu: false,
  });
  const [briefingAnswers, setBriefingAnswers] = useState<Record<MiningMethodKey, number | null>>({
    openpit: null,
    underground: null,
    mountaintop: null,
    insitu: null,
  });
  const [briefingErrors, setBriefingErrors] = useState<Record<MiningMethodKey, string | null>>({
    openpit: null,
    underground: null,
    mountaintop: null,
    insitu: null,
  });

  // Metrics and Logs
  const [runCounter, setRunCounter] = useState(0);
  const [latestRun, setLatestRun] = useState<RunData | null>(null);
  const [loggedRuns, setLoggedRuns] = useState<RunData[]>([]);
  const [filterCurrentScenario, setFilterCurrentScenario] = useState(true);

  // Animation and UI State
  const [isShaking, setIsShaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    'Welcome to Mining Strategy Simulator! Review method briefings in the library to unlock testing.'
  );
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [highlightedMethod, setHighlightedMethod] = useState<MiningMethodKey | null>(null);

  // Language State & Bilingual Lookups
  const [lang, setLang] = useState<Language>('en');
  const activeScenarios = lang === 'es' ? SCENARIOS_ES : SCENARIOS;
  const activeMethods = lang === 'es' ? METHOD_SPECS_ES : METHOD_SPECS;
  const activeSettingRisks = lang === 'es' ? SETTING_RISKS_ES : SETTING_RISKS;
  const activeBriefingQuestions = lang === 'es' ? BRIEFING_QUESTIONS_ES : BRIEFING_QUESTIONS;

  // CER Worksheet State
  const [cerClaim, setCerClaim] = useState('');
  const [cerEvidence, setCerEvidence] = useState('');
  const [cerReasoning, setCerReasoning] = useState('');
  const [sentenceStartersActive, setSentenceStartersActive] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound Synthesizer via Web Audio API
  const playSound = (type: 'blast' | 'click' | 'success' | 'unlock') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'blast') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + 0.55);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.08);
        osc.frequency.setValueAtTime(659.25, now + 0.16);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'unlock') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch {
      // Audio not supported or blocked
    }
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Toggle Language
  const toggleLanguage = () => {
    playSound('click');
    const nextLang = lang === 'en' ? 'es' : 'en';
    setLang(nextLang);
    showToast(nextLang === 'es' ? 'Idioma cambiado a Español' : 'Language switched to English');
  };

  // Scenario Switch
  const handleScenarioChange = (s: ScenarioKey) => {
    playSound('click');
    setCurrentScenario(s);
    setActiveVisualMethod('none');
    showToast(lang === 'es' ? `Cambiado a ${activeScenarios[s].shortName}` : `Switched to ${activeScenarios[s].shortName}`);
  };

  // Strategy Select
  const handleMethodSelect = (m: MiningMethodKey) => {
    playSound('click');
    setCurrentMethod(m);
    setActiveVisualMethod('none');
    if (!verifiedBriefings[m]) {
      showToast(lang === 'es' ? `Revisa la instrucción de ${activeMethods[m].name} para desbloquear.` : `Review briefing for ${activeMethods[m].name} to unlock.`);
    } else {
      showToast(lang === 'es' ? `Seleccionado ${activeMethods[m].name} (Desbloqueado)` : `Selected ${activeMethods[m].name} (Unlocked)`);
    }
  };

  // Verify Briefing
  const verifyBriefing = (m: MiningMethodKey) => {
    playSound('unlock');
    setVerifiedBriefings((prev) => ({ ...prev, [m]: true }));
    showToast(lang === 'es' ? `¡Instrucción de ${activeMethods[m].name} Verificada!` : `Briefing for ${activeMethods[m].name} Verified!`);
  };

  // Briefing Question Option Selection
  const handleBriefingAnswerSelect = (m: MiningMethodKey, optionIdx: number) => {
    playSound('click');
    setBriefingAnswers((prev) => ({ ...prev, [m]: optionIdx }));
    setBriefingErrors((prev) => ({ ...prev, [m]: null }));
  };

  // Check Briefing Question
  const handleCheckBriefingQuestion = (m: MiningMethodKey) => {
    const selectedIdx = briefingAnswers[m];
    const q = activeBriefingQuestions[m];
    if (selectedIdx === null || selectedIdx === undefined) {
      playSound('click');
      setBriefingErrors((prev) => ({
        ...prev,
        [m]: lang === 'es' ? 'Por favor elige una opción de respuesta antes de verificar.' : 'Please choose an answer choice before verifying.',
      }));
      return;
    }
    if (selectedIdx === q.correctIndex) {
      verifyBriefing(m);
      setBriefingErrors((prev) => ({ ...prev, [m]: null }));
    } else {
      playSound('click');
      setBriefingErrors((prev) => ({
        ...prev,
        [m]: lang === 'es' ? 'Respuesta incorrecta. Revisa los pros, contras y el mecanismo geológico arriba, ¡y vuelve a intentar!' : 'Incorrect. Review the briefing pros, cons, and geological mechanism above, then try again!',
      }));
    }
  };

  const unlockAllBriefings = () => {
    playSound('unlock');
    setVerifiedBriefings({
      openpit: true,
      underground: true,
      mountaintop: true,
      insitu: true,
    });
    setBriefingAnswers({
      openpit: activeBriefingQuestions.openpit.correctIndex,
      underground: activeBriefingQuestions.underground.correctIndex,
      mountaintop: activeBriefingQuestions.mountaintop.correctIndex,
      insitu: activeBriefingQuestions.insitu.correctIndex,
    });
    setBriefingErrors({
      openpit: null,
      underground: null,
      mountaintop: null,
      insitu: null,
    });
    showToast(lang === 'es' ? 'Acceso del Docente: ¡Todas las Instrucciones Desbloqueadas!' : 'Teacher Bypass: All Mining Briefings Unlocked!');
  };

  // Open Library with Highlight
  const openLibraryForMethod = (m: MiningMethodKey) => {
    playSound('click');
    setHighlightedMethod(m);
    setLibraryModalOpen(true);
  };

  // Run Mining Operation
  const runMiningOperation = () => {
    if (!verifiedBriefings[currentMethod]) {
      playSound('click');
      showToast(lang === 'es' ? `¡Revisa la instrucción en la Biblioteca para ${activeMethods[currentMethod].name} primero!` : `Review the Method Library briefing for ${activeMethods[currentMethod].name} first!`);
      openLibraryForMethod(currentMethod);
      return;
    }

    playSound('blast');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);

    const scenario = activeScenarios[currentScenario];
    const spec = activeMethods[currentMethod];
    const activeRisk = activeSettingRisks[currentScenario][currentMethod];
    const nextId = runCounter + 1;
    setRunCounter(nextId);

    // Calculate Standard Earth Science Impacts
    const finalLand = Number((spec.landCostAcres * scenario.baseLandSensitivity).toFixed(1));
    const finalpH = Number(spec.waterpH.toFixed(1));
    const finalWaterGal = Math.round(spec.waterContamGal * scenario.baseWaterSensitivity);
    const finalCO2 = Math.round(spec.co2Tons * scenario.baseAirSensitivity);
    const finalSafety = Number(spec.safetyRating.toFixed(1));
    const grossRevenue = scenario.targetOre * scenario.oreValuePerTon;
    const netProfit = grossRevenue - spec.baseOpCost;

    const newRun: RunData = {
      id: nextId,
      scenario: currentScenario,
      scenarioTitle: scenario.title,
      methodKey: currentMethod,
      methodName: spec.name,
      land: finalLand,
      waterpH: finalpH,
      waterGal: finalWaterGal,
      co2: finalCO2,
      safety: finalSafety,
      profit: netProfit,
      communityImpact: spec.communityImpact,
      communityLevel: spec.communityLevel,
      settingRiskTitle: activeRisk.alertTitle,
      settingRiskSeverity: activeRisk.severity,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLatestRun(newRun);
    setLoggedRuns((prev) => [newRun, ...prev]);
    setActiveVisualMethod(currentMethod);
    playSound('success');
    showToast(lang === 'es' ? `¡Simulación #${nextId} completada con ${spec.name}! Datos añadidos al Registro.` : `Run #${nextId} completed using ${spec.name}! Data added to Evidence Log.`);
  };

  // Toggle Simplified Sentence Starters for 10th Grade CER
  const toggleSentenceStarters = () => {
    playSound('click');
    const newState = !sentenceStartersActive;
    setSentenceStartersActive(newState);
    if (newState) {
      if (!cerClaim) {
        setCerClaim(
          lang === 'es'
            ? `En ${activeScenarios[currentScenario].shortName}, el mejor método minero para utilizar es [Nombre del Método] porque...`
            : `In ${activeScenarios[currentScenario].shortName}, the best mining method to use is [Method Name] because...`
        );
      }
      if (!cerEvidence) {
        setCerEvidence(
          lang === 'es'
            ? `En la Simulación #[#], [Nombre del Método] causó [Número] acres de daño al terreno, un pH de agua de [Número] y [Nivel] de fricción comunitaria. En comparación, [Otro Método] causó...`
            : `In Run #[#], [Method Name] caused [Number] acres of land damage, a water pH of [Number], and [Level] community friction. In comparison, [Other Method] caused...`
        );
      }
      if (!cerReasoning) {
        setCerReasoning(
          lang === 'es'
            ? `Esta evidencia respalda mi elección porque en este entorno, [explicar qué le ocurre al agua o a la tierra]. Además, la verificación de riesgo muestra que [explicar el riesgo, como filtración de ácido o polvo pesado]. Por lo tanto, este método es la opción más segura.`
            : `This evidence supports my choice because in this setting, [explain what happens to water or land]. Also, the setting risk shows that [explain risk, such as acid leaking or heavy dust]. Therefore, this method is the safest choice.`
        );
      }
      showToast(lang === 'es' ? 'Frases guía agregadas a los recuadros del CER.' : 'Simplified sentence starters added to CER boxes.');
    } else {
      showToast(lang === 'es' ? 'Frases guía desactivadas.' : 'Sentence starters disabled.');
    }
  };

  // Export CER as a Clean, Printable PDF Report
  const exportPDFReport = () => {
    playSound('click');
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const contentWidth = pageWidth - margin * 2;
      let y = 36;

      // Header Banner
      doc.setFillColor(30, 41, 59); // slate-800
      doc.roundedRect(margin, y, contentWidth, 54, 4, 4, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(
        lang === 'es' ? 'SIMULADOR DE ESTRATEGIAS MINERAS' : 'MINING STRATEGY SIMULATOR',
        margin + 14,
        y + 24
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(245, 158, 11); // amber-400
      doc.text(
        lang === 'es'
          ? 'Informe Estudiantil de Afirmación-Evidencia-Razonamiento (CER)'
          : 'Student Claim-Evidence-Reasoning (CER) Report',
        margin + 14,
        y + 42
      );

      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text('NGSS HS-ESS3-1', pageWidth - margin - 85, y + 24);

      y += 66;

      // Student Meta Line
      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(
        lang === 'es'
          ? 'Nombre del Estudiante: _________________________________'
          : 'Student Name: _________________________________',
        margin,
        y
      );
      doc.text(
        lang === 'es' ? `Fecha: ${new Date().toLocaleDateString()}` : `Date: ${new Date().toLocaleDateString()}`,
        margin + 270,
        y
      );
      doc.text(lang === 'es' ? 'Período: _______' : 'Period: _______', margin + 440, y);

      y += 18;

      // Active Scenario Details Box
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(
        lang === 'es'
          ? `Escenario: ${activeScenarios[currentScenario].title}`
          : `Scenario: ${activeScenarios[currentScenario].title}`,
        margin + 10,
        y + 15
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(
        lang === 'es'
          ? `Yacimiento: ${activeScenarios[currentScenario].depositType}`
          : `Deposit: ${activeScenarios[currentScenario].depositType}`,
        margin + 10,
        y + 27
      );

      y += 48;

      // Section Renderer Helper
      const renderSectionBox = (
        title: string,
        subtitle: string,
        content: string,
        headerColor: [number, number, number]
      ) => {
        if (y > 700) {
          doc.addPage();
          y = 40;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.text(title, margin, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(subtitle, margin + doc.getTextWidth(title) + 6, y);

        y += 6;

        const defaultEmpty = lang === 'es' ? '[Sin respuesta ingresada por el estudiante]' : '[No response entered by student]';
        const textToPrint = content.trim() || defaultEmpty;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        const splitText = doc.splitTextToSize(textToPrint, contentWidth - 20);
        const boxHeight = Math.max(44, splitText.length * 13 + 16);

        if (y + boxHeight > 750) {
          doc.addPage();
          y = 40;
        }

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

        doc.setTextColor(15, 23, 42);
        doc.text(splitText, margin + 10, y + 14);

        y += boxHeight + 14;
      };

      // 1. CLAIM
      renderSectionBox(
        lang === 'es' ? '1. AFIRMACIÓN (CLAIM)' : '1. CLAIM',
        lang === 'es' ? '(¿Cuál es el mejor método minero para este escenario?)' : '(What is the best mining method for this scenario?)',
        cerClaim,
        [79, 70, 229]
      );

      // 2. EVIDENCE
      renderSectionBox(
        lang === 'es' ? '2. EVIDENCIA (EVIDENCE)' : '2. EVIDENCE',
        lang === 'es' ? '(Datos y cifras cuantitativas de las simulaciones)' : '(Data and numbers cited from simulation runs)',
        cerEvidence,
        [16, 185, 129]
      );

      // 3. REASONING
      renderSectionBox(
        lang === 'es' ? '3. RAZONAMIENTO (REASONING)' : '3. REASONING',
        lang === 'es' ? '(Explicación científica y factores de riesgo del entorno)' : '(Scientific explanation & setting risk factors)',
        cerReasoning,
        [217, 119, 6]
      );

      // Attached Evidence Table from Active Scenario Runs
      const scenarioRuns = loggedRuns.filter((r) => r.scenario === currentScenario);
      if (scenarioRuns.length > 0) {
        if (y + 90 > 750) {
          doc.addPage();
          y = 40;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(
          lang === 'es'
            ? 'Resumen de Evidencias Registradas (Simulaciones):'
            : 'Evidence Log Data Summary (Logged Runs):',
          margin,
          y
        );
        y += 8;

        // Table Header Row
        doc.setFillColor(226, 232, 240);
        doc.rect(margin, y, contentWidth, 15, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text(lang === 'es' ? 'Sim' : 'Run', margin + 4, y + 10);
        doc.text(lang === 'es' ? 'Método' : 'Method', margin + 30, y + 10);
        doc.text(lang === 'es' ? 'Tierra Dañada' : 'Land Disrupted', margin + 125, y + 10);
        doc.text(lang === 'es' ? 'Calidad de Agua' : 'Water Quality', margin + 195, y + 10);
        doc.text(lang === 'es' ? 'CO2 y Polvo' : 'CO2 Pollution', margin + 265, y + 10);
        doc.text(lang === 'es' ? 'Seguridad' : 'Safety', margin + 335, y + 10);
        doc.text(lang === 'es' ? 'Fricción' : 'Friction', margin + 375, y + 10);
        doc.text(lang === 'es' ? 'Riesgo del Entorno' : 'Setting Risk Check', margin + 425, y + 10);
        y += 15;

        // Table Rows (up to 6 runs)
        doc.setFont('helvetica', 'normal');
        scenarioRuns.slice(0, 6).forEach((r, idx) => {
          if (y + 13 > 755) {
            doc.addPage();
            y = 40;
          }
          if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(margin, y, contentWidth, 13, 'F');
          }
          doc.setFontSize(7);
          doc.setTextColor(30, 41, 59);
          doc.text(`#${r.id}`, margin + 4, y + 9);
          doc.text(r.methodName.substring(0, 20), margin + 30, y + 9);
          doc.text(`${r.land} ac`, margin + 125, y + 9);
          doc.text(`pH ${r.waterpH} (${r.waterGal.toLocaleString()}g)`, margin + 195, y + 9);
          doc.text(`${r.co2.toLocaleString()} t`, margin + 265, y + 9);
          doc.text(`${r.safety}/10`, margin + 335, y + 9);
          doc.text(r.communityLevel, margin + 375, y + 9);
          doc.text(`${r.settingRiskSeverity.toUpperCase()}: ${r.settingRiskTitle.substring(0, 24)}...`, margin + 425, y + 9);
          y += 13;
        });
      }

      // Page Footers
      const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(148, 163, 184);
        doc.text(
          lang === 'es'
            ? `Simulador de Estrategias Mineras • Informe Estudiantil CER • Página ${i} de ${totalPages}`
            : `Mining Strategy Simulator Pro • Student CER Report • Page ${i} of ${totalPages}`,
          margin,
          775
        );
      }

      const fileName = `CER_Report_Scenario_${currentScenario}_${activeScenarios[currentScenario].shortName
        .replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
      playSound('success');
      showToast(lang === 'es' ? `Informe PDF descargado: ${fileName}` : `CER Report PDF downloaded: ${fileName}`);
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast(lang === 'es' ? 'Error al generar PDF. Texto copiado al portapapeles.' : 'Error generating PDF. Copied text report to clipboard instead.');
      copyCERReport();
    }
  };

  // Copy CER Report (Text Format)
  const copyCERReport = () => {
    playSound('click');
    const report = lang === 'es'
      ? `SIMULADOR DE ESTRATEGIAS MINERAS - INFORME ESTUDIANTIL CER\nESCENARIO: ${activeScenarios[currentScenario].title}\n\n1. AFIRMACIÓN:\n${cerClaim || '[Sin afirmación ingresada]'}\n\n2. EVIDENCIA:\n${cerEvidence || '[Sin evidencia ingresada]'}\n\n3. RAZONAMIENTO:\n${cerReasoning || '[Sin razonamiento ingresado]'}\n\n---\nCompletado con el Simulador de Estrategias Mineras (NGSS HS-ESS3-1)`
      : `MINING STRATEGY SIMULATOR - STUDENT CER REPORT\nSCENARIO: ${activeScenarios[currentScenario].title}\n\n1. CLAIM:\n${cerClaim || '[No claim provided]'}\n\n2. EVIDENCE:\n${cerEvidence || '[No evidence provided]'}\n\n3. REASONING:\n${cerReasoning || '[No reasoning provided]'}\n\n---\nCompleted with Mining Strategy Simulator (NGSS HS-ESS3-1)`;
    navigator.clipboard.writeText(report).then(() => {
      setCopiedReport(true);
      showToast(lang === 'es' ? '¡Informe CER copiado al portapapeles!' : 'CER Report copied to clipboard!');
      setTimeout(() => setCopiedReport(false), 2500);
    });
  };

  // Verified Count
  const verifiedCount = Object.values(verifiedBriefings).filter(Boolean).length;

  // Filtered Runs
  const displayedRuns = filterCurrentScenario
    ? loggedRuns.filter((r) => r.scenario === currentScenario)
    : loggedRuns;

  const currentSpec = activeMethods[currentMethod];
  const activeScenarioSpec = activeScenarios[currentScenario];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* Top Header / App Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-inner">
              <Mountain className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight flex items-center gap-2">
                {lang === 'es' ? 'Simulador de Estrategias Mineras' : 'Mining Strategy Simulator'}
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  HS-ESS3-1
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {lang === 'es'
                  ? 'Investigación de Ciencias de la Tierra y Herramienta CER'
                  : 'Earth Science Investigation & CER Tool'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer border border-emerald-400 active:scale-95"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Español' : 'English'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                showToast(!audioEnabled ? (lang === 'es' ? 'Sonido activado' : 'Audio Sound FX Enabled') : (lang === 'es' ? 'Sonido silenciado' : 'Audio Muted'));
              }}
              title={audioEnabled ? (lang === 'es' ? 'Silenciar audio' : 'Mute Audio FX') : (lang === 'es' ? 'Activar audio' : 'Enable Audio FX')}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Student Goal Modal Trigger */}
            <button
              onClick={() => {
                playSound('click');
                setGoalModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'es' ? 'Objetivo y Guía' : 'Lab Goal & Guide'}</span>
            </button>

            {/* Method Library Trigger */}
            <button
              onClick={() => {
                playSound('click');
                setLibraryModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{lang === 'es' ? 'Biblioteca' : 'Method Library'}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 text-[10px] font-black rounded-full ${
                  verifiedCount === 4
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                {verifiedCount}/4 {lang === 'es' ? 'Verif.' : 'Verified'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Scenario Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-2.5 gap-2">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mr-1">
              {lang === 'es' ? 'Seleccionar Escenario:' : 'Select Scenario:'}
            </span>

            {([1, 2, 3] as ScenarioKey[]).map((sNum) => {
              const spec = activeScenarios[sNum];
              const isActive = currentScenario === sNum;
              return (
                <button
                  key={sNum}
                  onClick={() => handleScenarioChange(sNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-slate-400 text-white'
                    }`}
                  >
                    {sNum}
                  </span>
                  <span>{spec.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Summary Banner */}
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 w-full sm:w-auto justify-between sm:justify-end">
            <span>
              <span className="font-semibold text-slate-500">
                {lang === 'es' ? 'Yacimiento Activo:' : 'Active Deposit:'}
              </span>{' '}
              <strong className="text-slate-900">{activeScenarioSpec.title}</strong>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strategy Selection & Controls (4 Cols) */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          {/* Strategy Selector Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-bold text-sm flex items-center gap-2">
                <Pickaxe className="w-4 h-4 text-amber-400" />
                {lang === 'es' ? '1. Elige una Estrategia Minera' : '1. Choose Mining Strategy'}
              </h2>
              <span className="text-[11px] text-slate-400">
                {lang === 'es' ? 'Meta: 10,000 Tons Mineral' : 'Target: 10,000 Tons Ore'}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* Method Radio Options */}
              <div className="grid grid-cols-1 gap-2">
                {(['openpit', 'underground', 'mountaintop', 'insitu'] as MiningMethodKey[]).map(
                  (methodKey) => {
                    const spec = activeMethods[methodKey];
                    const isSelected = currentMethod === methodKey;
                    const isVerified = verifiedBriefings[methodKey];

                    return (
                      <label
                        key={methodKey}
                        className={`strategy-option relative flex items-start p-3 rounded-lg border-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="mining-method"
                          value={methodKey}
                          checked={isSelected}
                          onChange={() => handleMethodSelect(methodKey)}
                          className="mt-1 text-amber-600 focus:ring-amber-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{spec.name}</span>
                            {isVerified ? (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" /> {lang === 'es' ? 'Desbloqueado' : 'Unlocked'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                <Lock className="w-3 h-3 text-amber-600" /> {lang === 'es' ? 'Falta Instrucción' : 'Briefing Needed'}
                              </span>
                            )}
                          </div>
                          <span className="block text-[11px] text-slate-500 mt-1 leading-snug">
                            {spec.shortDesc}
                          </span>
                        </div>
                      </label>
                    );
                  }
                )}
              </div>

              {/* Simulation Action Button */}
              {verifiedBriefings[currentMethod] ? (
                <button
                  onClick={runMiningOperation}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-lg shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-amber-400 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" /> {lang === 'es' ? 'Ejecutar Operación Minera' : 'Run Mining Operation'}
                </button>
              ) : (
                <button
                  onClick={() => openLibraryForMethod(currentMethod)}
                  className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider border-2 border-dashed border-amber-400 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-600 animate-bounce" /> {lang === 'es' ? 'Revisar Instrucción para Desbloquear' : 'Review Briefing in Library to Unlock'}
                </button>
              )}
            </div>
          </div>

          {/* Current Strategy Quick Info Box */}
          <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <strong className="font-bold block text-sm text-slate-900">
                  {lang === 'es' ? `${currentSpec.name} Seleccionado` : `${currentSpec.name} Selected`}
                </strong>
                <button
                  onClick={() => openLibraryForMethod(currentMethod)}
                  className="text-[11px] text-amber-700 underline font-bold hover:text-amber-900 cursor-pointer"
                >
                  {lang === 'es' ? 'Leer Instrucción →' : 'Read Briefing →'}
                </button>
              </div>
              <p className="mt-1 text-slate-700 leading-relaxed">{currentSpec.shortDesc}</p>
            </div>
          </div>

          {/* Geological Setting vs. Method Match & Risk Analyzer */}
          {(() => {
            const activeRisk = activeSettingRisks[currentScenario][currentMethod];
            return (
              <div
                className={`rounded-xl p-4 border text-xs flex flex-col gap-2 transition-all ${
                  activeRisk.severity === 'critical'
                    ? 'bg-rose-50/90 border-rose-300 text-rose-950 ring-1 ring-rose-400'
                    : activeRisk.severity === 'high'
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-blue-50/90 border-blue-300 text-blue-950'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-extrabold text-xs flex items-center gap-1.5">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        activeRisk.severity === 'critical'
                          ? 'text-rose-600'
                          : activeRisk.severity === 'high'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    />
                    {lang === 'es' ? 'Verificación de Riesgo del Entorno' : 'Setting Risk Check'}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      activeRisk.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : activeRisk.severity === 'high'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}
                  >
                    {activeRisk.severity === 'critical'
                      ? (lang === 'es' ? 'Riesgo Crítico' : 'Critical Risk')
                      : activeRisk.severity === 'high'
                      ? (lang === 'es' ? 'Riesgo Alto' : 'High Risk')
                      : activeRisk.severity === 'moderate'
                      ? (lang === 'es' ? 'Riesgo Moderado' : 'Moderate Risk')
                      : (lang === 'es' ? 'Riesgo Bajo' : 'Low Risk')}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 mt-0.5">
                  {activeRisk.alertTitle}
                </div>

                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {activeRisk.tradeoffExplanation}
                </p>

                <div className="mt-1 pt-2 border-t border-slate-200/80 bg-white/75 rounded p-2 text-[11px]">
                  <strong className="text-slate-900 block mb-0.5 font-bold">
                    {lang === 'es'
                      ? '💡 Reflexión Estudiantil (Aborda esto en tu Razonamiento CER):'
                      : '💡 Student Reflection (Address this in your CER Reasoning):'}
                  </strong>
                  <span className="text-slate-700 italic">
                    &ldquo;{activeRisk.criticalQuestion}&rdquo;
                  </span>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Right Column: Visualizer & Metrics Dashboard (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* 2D Vector Dynamic Landscape Visualizer */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="font-bold text-sm text-slate-900">
                  {lang === 'es' ? 'Visualizador Geológico 2D del Terreno' : '2D Geological Site Visualizer'}
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Diagram Labels Toggle */}
                <button
                  onClick={() => {
                    playSound('click');
                    setShowDiagramLabels(!showDiagramLabels);
                    showToast(
                      !showDiagramLabels
                        ? (lang === 'es' ? 'Etiquetas activadas' : 'Diagram Labels Enabled')
                        : (lang === 'es' ? 'Etiquetas ocultas' : 'Diagram Labels Hidden')
                    );
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                    showDiagramLabels
                      ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border-indigo-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  <Tags className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{lang === 'es' ? 'Etiquetas:' : 'Diagram Labels:'}</span>{' '}
                  <span
                    className={`font-black ${
                      showDiagramLabels ? 'text-indigo-800' : 'text-slate-500'
                    }`}
                  >
                    {showDiagramLabels ? (lang === 'es' ? 'SÍ (Frente)' : 'ON (Front)') : (lang === 'es' ? 'NO' : 'OFF')}
                  </span>
                </button>

                {/* Reset Site */}
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveVisualMethod('none');
                    showToast(lang === 'es' ? 'Terreno restablecido al estado natural' : 'Landscape reset to natural baseline');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> {lang === 'es' ? 'Restablecer Sitio' : 'Reset Site'}
                </button>

                {/* Site Status Badge */}
                <span
                  className={`font-bold text-xs px-2.5 py-0.5 rounded-full border ${
                    activeVisualMethod === 'none'
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : activeVisualMethod === 'openpit'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : activeVisualMethod === 'underground'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : activeVisualMethod === 'mountaintop'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-cyan-100 text-cyan-800 border-cyan-300'
                  }`}
                >
                  {activeVisualMethod === 'none'
                    ? (lang === 'es' ? 'Terreno Natural de Referencia' : 'Baseline Natural Terrain')
                    : activeVisualMethod === 'openpit'
                    ? (lang === 'es' ? 'Excavación Activa a Cielo Abierto' : 'Active Open-Pit Excavation')
                    : activeVisualMethod === 'underground'
                    ? (lang === 'es' ? 'Túneles Subterráneos Activos' : 'Subsurface Tunnels Active')
                    : activeVisualMethod === 'mountaintop'
                    ? (lang === 'es' ? 'Cumbre Detonada y Valle Relleno' : 'Summit Blasted & Valley Filled')
                    : (lang === 'es' ? 'Lixiviación Química Activa' : 'Chemical Leaching Active')}
                </span>
              </div>
            </div>

            {/* SVG Visualizer Container with Front-Layer Labels */}
            <div
              className={`w-full h-72 rounded-lg border border-slate-300 bg-slate-200 relative overflow-hidden select-none ${
                isShaking ? 'anim-shake' : ''
              }`}
            >
              <LandscapeVisualizer
                scenario={currentScenario}
                method={activeVisualMethod}
                showLabels={showDiagramLabels}
                lang={lang}
              />

              {/* Realtime Notification Toast Overlay */}
              {toastMessage && (
                <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg border border-slate-700 transition-opacity duration-300 flex items-center gap-2 z-30">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Simulation Metrics Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-blue-600" />
                {lang === 'es' ? 'Datos de Impacto de la Última Ejecución (Evidencia)' : 'Latest Run Impact Data (Evidence)'}
              </h2>
              <span className="text-xs text-slate-500">
                {lang === 'es' ? 'ID Ejecución:' : 'Run ID:'}{' '}
                <span className="font-mono font-bold text-slate-900">
                  {latestRun ? `#${latestRun.id}` : '#---'}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Land Disrupted */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{lang === 'es' ? 'Tierra Alterada' : 'Land Disrupted'}</span>
                  <TreePine className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-black text-slate-900">
                  {latestRun ? `${latestRun.land} Acres` : '0.0 Acres'}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full progress-bar-fill ${
                      latestRun && latestRun.land > 15 ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: latestRun ? `${Math.min(100, (latestRun.land / 30) * 100)}%` : '0%',
                    }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {latestRun
                    ? (lang === 'es' ? `${latestRun.land} acres pérdida de hábitat` : `${latestRun.land} acres habitat loss`)
                    : (lang === 'es' ? 'Referencia natural' : 'Baseline natural')}
                </span>
              </div>

              {/* Water pH & Contamination */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{lang === 'es' ? 'pH del Agua y Contam.' : 'Water pH & Contam.'}</span>
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-black text-slate-900">
                  {latestRun
                    ? `pH ${latestRun.waterpH} / ${latestRun.waterGal.toLocaleString()} Gal`
                    : 'pH 7.0 / 0 Gal'}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full progress-bar-fill ${
                      latestRun && latestRun.waterpH < 5.0 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: latestRun ? `${(latestRun.waterpH / 7.0) * 100}%` : '100%',
                    }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {latestRun
                    ? latestRun.waterpH < 5.0
                      ? (lang === 'es' ? '⚠ Drenaje Ácido de Mina Dañino' : '⚠ Harmful Acid Mine Drainage')
                      : (lang === 'es' ? 'Condiciones de agua saludables' : 'Healthy water conditions')
                    : (lang === 'es' ? 'Agua neutra (pH 7.0)' : 'Neutral water (pH 7.0)')}
                </span>
              </div>

              {/* Carbon / Emissions */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{lang === 'es' ? 'Emisiones de CO₂ y Polvo' : 'CO₂ Emissions & Dust'}</span>
                  <Cloud className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div className="text-lg font-black text-slate-900">
                  {latestRun ? `${latestRun.co2.toLocaleString()} Tons` : '0 Tons'}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-amber-500 progress-bar-fill"
                    style={{
                      width: latestRun ? `${Math.min(100, (latestRun.co2 / 5000) * 100)}%` : '0%',
                    }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {latestRun
                    ? (lang === 'es' ? 'Polvo y emisiones de maquinaria' : 'Dust & machinery emissions')
                    : (lang === 'es' ? 'Aire limpio de referencia' : 'Clean air baseline')}
                </span>
              </div>

              {/* Safety & Worker Hazard */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{lang === 'es' ? 'Seguridad Laboral' : 'Worker Safety Index'}</span>
                  <HardHat className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-lg font-black text-slate-900">
                  {latestRun ? `${latestRun.safety} / 10` : '10 / 10'}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full progress-bar-fill ${
                      latestRun && latestRun.safety < 7.0 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: latestRun ? `${(latestRun.safety / 10) * 100}%` : '100%',
                    }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {latestRun
                    ? latestRun.safety < 6.5
                      ? (lang === 'es' ? 'Peligro de derrumbes y gases' : 'Cave-in and gas hazards')
                      : (lang === 'es' ? 'Condiciones de superficie más seguras' : 'Safer surface working conditions')
                    : (lang === 'es' ? 'Condiciones de seguridad óptimas' : 'Optimal safety conditions')}
                </span>
              </div>

              {/* Economic Profit */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{lang === 'es' ? 'Ganancia Neta / Pérdida' : 'Net Profit / Loss'}</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-black text-emerald-600">
                  {latestRun
                    ? new Intl.NumberFormat(lang === 'es' ? 'es-MX' : 'en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(latestRun.profit)
                    : '$0'}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500 progress-bar-fill"
                    style={{
                      width: latestRun
                        ? `${Math.max(
                            10,
                            Math.min(
                              100,
                              (latestRun.profit /
                                (SCENARIOS[latestRun.scenario].targetOre *
                                  SCENARIOS[latestRun.scenario].oreValuePerTon)) *
                                100
                            )
                          )}%`
                        : '0%',
                    }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {lang === 'es' ? 'Rendimiento: 10,000 Tons Mineral' : 'Yield: 10,000 Tons Ore'}
                </span>
              </div>

              {/* Community Impact */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{lang === 'es' ? 'Fricción Comunitaria' : 'Community Friction'}</span>
                  <House className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-sm font-black text-slate-900 truncate">
                  {latestRun
                    ? (lang === 'es'
                        ? (latestRun.communityLevel === 'Very High'
                            ? 'Muy Alta'
                            : latestRun.communityLevel === 'High'
                            ? 'Alta'
                            : latestRun.communityLevel === 'Moderate'
                            ? 'Moderada'
                            : 'Baja')
                        : latestRun.communityLevel)
                    : (lang === 'es' ? 'Bajo Impacto' : 'Low Impact')}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full progress-bar-fill ${
                      latestRun && latestRun.communityLevel === 'Very High'
                        ? 'bg-red-500'
                        : latestRun && latestRun.communityLevel === 'High'
                        ? 'bg-amber-500'
                        : latestRun && latestRun.communityLevel === 'Moderate'
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: latestRun
                        ? latestRun.communityLevel === 'Very High'
                          ? '95%'
                          : latestRun.communityLevel === 'High'
                          ? '75%'
                          : latestRun.communityLevel === 'Moderate'
                          ? '50%'
                          : '25%'
                        : '10%',
                    }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {latestRun ? latestRun.communityImpact : (lang === 'es' ? 'Comunidad rural tranquila' : 'Peaceful rural community')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Full Width Section: Evidence Log Table & CER Synthesis Worksheet */}
        <section className="lg:col-span-12 flex flex-col gap-6">
          {/* Fully Color-Coded Evidence Log Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-amber-400" />
                <h2 className="font-bold text-sm">
                  {lang === 'es' ? '2. Registro de Evidencias del Estudiante (Ejecuciones)' : '2. Student Evidence Log (Logged Runs)'}
                </h2>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {displayedRuns.length} {lang === 'es' ? 'Ejecuciones' : 'Runs'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {/* Table Filter by Active Scenario */}
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterCurrentScenario}
                    onChange={(e) => setFilterCurrentScenario(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>{lang === 'es' ? 'Mostrar Solo Escenario Actual' : 'Show Current Scenario Only'}</span>
                </label>

                <button
                  onClick={() => {
                    playSound('click');
                    setLoggedRuns([]);
                    showToast(lang === 'es' ? 'Registro de evidencias borrado.' : 'Evidence log cleared.');
                  }}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {lang === 'es' ? 'Borrar' : 'Clear'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">{lang === 'es' ? 'ID Ejecución' : 'Run ID'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Escenario' : 'Scenario'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Método Minero' : 'Mining Method'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Pérdida de Suelo' : 'Land Loss'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Calidad del Agua' : 'Water Quality'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Polución de CO₂' : 'CO₂ Pollution'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Seguridad Laboral' : 'Worker Safety'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Fricción Comunitaria' : 'Community Friction'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Riesgo del Entorno' : 'Setting Risk Check'}</th>
                    <th className="py-2.5 px-3">{lang === 'es' ? 'Ganancia Neta' : 'Net Profit'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {displayedRuns.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 italic">
                        {lang === 'es'
                          ? 'Aún no se han registrado simulaciones. Selecciona una estrategia arriba, revisa su instrucción en la Biblioteca y haz clic en "Ejecutar Operación Minera".'
                          : 'No mining simulation runs recorded yet. Select a strategy above, review its Method Library briefing, and click "Run Mining Operation".'}
                      </td>
                    </tr>
                  ) : (
                    displayedRuns.map((run) => {
                      // Scenario color badge
                      const scenarioColor =
                        run.scenario === 1
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : run.scenario === 2
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-blue-100 text-blue-900 border-blue-300';

                      // Method color badge
                      const methodColor =
                        run.methodKey === 'openpit'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : run.methodKey === 'underground'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : run.methodKey === 'mountaintop'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-300';

                      // Land Loss Color Coding
                      const landBadgeColor =
                        run.land > 15
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : run.land > 5
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                      // Water pH Color Coding
                      const waterBadgeColor =
                        run.waterpH < 5.0
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : run.waterpH < 6.5
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200';

                      // CO2 Color Coding
                      const co2BadgeColor =
                        run.co2 > 3500
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : run.co2 > 1500
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                      // Safety Color Coding
                      const safetyBadgeColor =
                        run.safety >= 8.0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : run.safety >= 6.5
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200';

                      // Community Impact Color Coding
                      const communityBadgeColor =
                        run.communityLevel === 'Very High'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : run.communityLevel === 'High'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : run.communityLevel === 'Moderate'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                      // Setting Risk Color Coding
                      const settingRiskBadgeColor =
                        run.settingRiskSeverity === 'critical'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : run.settingRiskSeverity === 'high'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : run.settingRiskSeverity === 'low'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300';

                      const localizedCommunityLevel = lang === 'es'
                        ? (run.communityLevel === 'Very High'
                            ? 'Muy Alta'
                            : run.communityLevel === 'High'
                            ? 'Alta'
                            : run.communityLevel === 'Moderate'
                            ? 'Moderada'
                            : 'Baja')
                        : run.communityLevel;

                      const localizedSeverity = lang === 'es'
                        ? (run.settingRiskSeverity === 'critical'
                            ? 'Riesgo Crítico'
                            : run.settingRiskSeverity === 'high'
                            ? 'Riesgo Alto'
                            : run.settingRiskSeverity === 'low'
                            ? 'Riesgo Bajo'
                            : 'Riesgo Moderado')
                        : `${run.settingRiskSeverity.toUpperCase()} Risk`;

                      return (
                        <tr key={run.id} className="hover:bg-slate-50 transition border-b border-slate-200 text-[11px]">
                          {/* Run ID */}
                          <td className="py-2.5 px-3">
                            <span className="font-mono font-bold bg-slate-800 text-white px-2 py-0.5 rounded text-[10px]">
                              #{run.id}
                            </span>
                          </td>

                          {/* Scenario */}
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold border ${scenarioColor}`}>
                              S{run.scenario}: {activeScenarios[run.scenario].shortName.split(' ')[0]}
                            </span>
                          </td>

                          {/* Mining Method */}
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold border ${methodColor}`}>
                              {activeMethods[run.methodKey].name}
                            </span>
                          </td>

                          {/* Land Loss */}
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold border ${landBadgeColor}`}>
                              {run.land} ac
                            </span>
                          </td>

                          {/* Water Quality */}
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold border ${waterBadgeColor}`}>
                              pH {run.waterpH} ({run.waterGal.toLocaleString()} gal)
                            </span>
                          </td>

                          {/* CO2 Emissions */}
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold border ${co2BadgeColor}`}>
                              {run.co2.toLocaleString()} t
                            </span>
                          </td>

                          {/* Worker Safety */}
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold border ${safetyBadgeColor}`}>
                              {run.safety} / 10
                            </span>
                          </td>

                          {/* Community Friction */}
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold border ${communityBadgeColor}`}>
                              {localizedCommunityLevel}
                            </span>
                          </td>

                          {/* Setting Risk Check */}
                          <td className="py-2.5 px-3">
                            <div className="flex flex-col gap-1 min-w-[170px] max-w-[220px]">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide border w-fit ${settingRiskBadgeColor}`}
                              >
                                {localizedSeverity}
                              </span>
                              <span className="font-semibold text-slate-800 text-[11px] leading-snug">
                                {activeSettingRisks[run.scenario][run.methodKey].alertTitle}
                              </span>
                            </div>
                          </td>

                          {/* Net Profit */}
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {new Intl.NumberFormat(lang === 'es' ? 'es-MX' : 'en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits: 0,
                              }).format(run.profit)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Claim-Evidence-Reasoning (CER) Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  {lang === 'es'
                    ? '3. Hoja de Síntesis de Afirmación - Evidencia - Razonamiento (CER)'
                    : '3. Claim-Evidence-Reasoning (CER) Synthesis Worksheet'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'es' ? (
                    <>
                      Utiliza los datos de tu Registro de Evidencias para argumentar qué estrategia minera es la mejor opción para{' '}
                      <strong className="text-slate-800">{activeScenarioSpec.shortName}</strong>.
                    </>
                  ) : (
                    <>
                      Use numbers from your Evidence Log to argue which mining strategy is the best choice for{' '}
                      <strong className="text-slate-800">{activeScenarioSpec.shortName}</strong>.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Toggle Sentence Starters */}
                <button
                  onClick={toggleSentenceStarters}
                  className={`px-3 py-1.5 rounded-lg border font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                    sentenceStartersActive
                      ? 'border-indigo-500 bg-indigo-100 text-indigo-800 shadow-inner'
                      : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {sentenceStartersActive
                    ? (lang === 'es' ? 'Iniciadores: SÍ' : 'Sentence Starters: ON')
                    : (lang === 'es' ? 'Iniciadores: NO' : 'Sentence Starters: OFF')}
                </button>

                {/* Download PDF CER Report */}
                <button
                  onClick={exportPDFReport}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FileDown className="w-4 h-4 text-white" />
                  {lang === 'es' ? 'Descargar Informe CER (PDF)' : 'Download CER Report (PDF)'}
                </button>

                {/* Copy Text Option */}
                <button
                  onClick={copyCERReport}
                  title={lang === 'es' ? 'Copiar texto plano al portapapeles' : 'Copy plain text to clipboard'}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {lang === 'es' ? '¡Texto Copiado!' : 'Copied Text'}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      {lang === 'es' ? 'Copiar Texto' : 'Copy Text'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Environmental Setting & Data Synthesis Callout */}
            <div className="bg-indigo-50/90 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong>{lang === 'es' ? 'Consejo de Entorno y Evidencia para Estudiantes:' : 'Setting & Evidence Tip for Students:'}</strong>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {lang === 'es'
                    ? `¡No elijas un método solo porque su daño al terreno fue bajo o su ganancia fue alta sobre el papel! Observa atentamente la Verificación de Riesgo del Entorno para ${activeScenarioSpec.shortName}. En tu Razonamiento, explica por qué las características del medio ambiente (como una capa freática poco profunda en un humedal, el aire seco del desierto o las casas al pie de la montaña) hacen que ciertos métodos sean peligrosos. ¡Revisa tus números codificados por colores arriba y escribe tu evidencia directamente en el Recuadro 2!`
                    : `Don't just pick a method because its land disruption was low or its profit was high on paper! Look closely at the Setting Risk Check for ${activeScenarioSpec.shortName}. In your Reasoning, explain why the environment (such as a shallow wetland water table, dry desert air, or homes below the mountain) makes certain methods dangerous. Read your color-coded numbers above and write your evidence directly into Box 2!`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Claim Box */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>{lang === 'es' ? '1. AFIRMACIÓN (CLAIM)' : '1. CLAIM'}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {lang === 'es' ? 'Tu Conclusión' : 'Answer Question'}
                  </span>
                </label>
                <p className="text-[11px] text-slate-500">
                  {lang === 'es'
                    ? `¿Qué método minero es la mejor opción para ${activeScenarioSpec.shortName}?`
                    : `Which mining method is the best choice for ${activeScenarioSpec.shortName}?`}
                </p>
                <textarea
                  value={cerClaim}
                  onChange={(e) => setCerClaim(e.target.value)}
                  rows={4}
                  placeholder={
                    lang === 'es'
                      ? 'En este entorno, el mejor método minero para utilizar es [Nombre del Método] porque...'
                      : 'In this setting, the best mining method to use is [Method Name] because...'
                  }
                  className="w-full rounded-lg border-slate-300 text-xs p-2.5 border focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed"
                ></textarea>
              </div>

              {/* Evidence Box */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>{lang === 'es' ? '2. EVIDENCIA (EVIDENCE)' : '2. EVIDENCE'}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {lang === 'es' ? 'Citar Números' : 'Cite Numbers'}
                  </span>
                </label>
                <p className="text-[11px] text-slate-500">
                  {lang === 'es'
                    ? 'Cita números exactos de tus ejecuciones (acres dañados, pH del agua, CO₂, fricción comunitaria y ganancias).'
                    : 'Cite exact numbers from your runs (acres damaged, water pH, CO₂ pollution, community friction, and profit).'}
                </p>
                <textarea
                  value={cerEvidence}
                  onChange={(e) => setCerEvidence(e.target.value)}
                  rows={4}
                  placeholder={
                    lang === 'es'
                      ? 'En la Simulación #1, [Nombre del Método] causó [Número] acres de daño al terreno y un pH de agua de [Número]. En comparación, [Otro Método] causó...'
                      : 'In Run #1, [Method Name] caused [Number] acres of land damage and a water pH of [Number]. In comparison, [Other Method] caused...'
                  }
                  className="w-full rounded-lg border-slate-300 text-xs p-2.5 border focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed"
                ></textarea>
              </div>

              {/* Reasoning Box */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>{lang === 'es' ? '3. RAZONAMIENTO (REASONING)' : '3. REASONING'}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {lang === 'es' ? 'Ciencias de la Tierra' : 'Earth Science Concepts'}
                  </span>
                </label>
                <p className="text-[11px] text-slate-500">
                  {lang === 'es'
                    ? 'Explica POR QUÉ la ciencia respalda tu afirmación (menciona flujo de agua subterránea, drenaje ácido o riesgos del entorno).'
                    : 'Explain WHY the science supports your claim (mention groundwater flow, acid drainage, or setting risks).'}
                </p>
                <textarea
                  value={cerReasoning}
                  onChange={(e) => setCerReasoning(e.target.value)}
                  rows={4}
                  placeholder={
                    lang === 'es'
                      ? 'Esta evidencia respalda mi elección porque en este entorno, [explicar qué ocurre con el agua o la tierra]. Además, la verificación de riesgo muestra que...'
                      : 'This evidence supports my choice because in this setting, [explain water or land impact]. Also, the setting risk shows that...'
                  }
                  className="w-full rounded-lg border-slate-300 text-xs p-2.5 border focus:ring-indigo-500 focus:border-indigo-500 leading-relaxed"
                ></textarea>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {lang === 'es'
              ? 'Simulador de Estrategias Mineras • Ciencias de la Tierra y el Espacio para Secundaria (NGSS HS-ESS3-1 / HS-ESS3-2)'
              : 'Mining Strategy Simulator • High School Earth & Space Science (NGSS HS-ESS3-1 / HS-ESS3-2)'}
          </p>
          <p className="text-slate-500">
            {lang === 'es' ? 'Recurso de Investigación Estudiantil' : 'Student Investigation Resource'}
          </p>
        </div>
      </footer>

      {/* MODAL 1: Lab Goal & CER Guide */}
      {goalModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                {lang === 'es' ? 'Objetivo y Guía de la Investigación Estudiantil' : 'Student Investigation Goal & Guide'}
              </h3>
              <button
                onClick={() => setGoalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-indigo-900">
                <strong className="block font-bold mb-1 text-sm">
                  {lang === 'es' ? 'Tu Meta de Investigación:' : 'Your Investigation Goal:'}
                </strong>
                {lang === 'es' ? (
                  <>
                    Evalúa las compensaciones reales (ventajas y desventajas) de 4 métodos mineros principales en 3 entornos geológicos distintos. Tu objetivo es redactar un párrafo científico de{' '}
                    <strong>Afirmación - Evidencia - Razonamiento (CER)</strong> justificando la mejor práctica minera para cada escenario.
                  </>
                ) : (
                  <>
                    Evaluate the real-world trade-offs (pros and cons) of 4 major mining methods across
                    3 different geological environments. Your goal is to write a scientific{' '}
                    <strong>Claim-Evidence-Reasoning (CER)</strong> paragraph justifying the best mining
                    practice for each scenario.
                  </>
                )}
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-2">
                {lang === 'es' ? 'Cómo Realizar Tu Investigación:' : 'How to Conduct Your Investigation:'}
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>
                  <strong>{lang === 'es' ? 'Revisa la Biblioteca de Métodos:' : 'Review the Method Library:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Lee la instrucción rápida de cada método para comprender su mecanismo y responde la pregunta de verificación para desbloquearlo.'
                    : 'Read the quick briefing for each mining method to understand how it works and answer the verification question to unlock it.'}
                </li>
                <li>
                  <strong>{lang === 'es' ? 'Prueba Estrategias en un Escenario:' : 'Test Strategies in a Scenario:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Elige un escenario (como Cuenca Árida o Cresta Rural) y ejecuta los métodos para comparar sus impactos ecológicos y económicos.'
                    : 'Pick a scenario (such as Arid Basin or Rural Ridge) and run mining methods to compare their impacts.'}
                </li>
                <li>
                  <strong>{lang === 'es' ? 'Analiza las Gráficas y los Números:' : 'Analyze the Visuals & Numbers:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Observa cómo cada método altera el paisaje 2D y analiza los datos registrados en tu Registro de Evidencias (acres de suelo perdidos, pH del agua, polución de CO₂, fricción comunitaria y ganancias).'
                    : 'Watch how each method transforms the 2D landscape, and observe the logged numbers in your Evidence Log (acres lost, water pH, CO₂ pollution, community friction, and profit).'}
                </li>
                <li>
                  <strong>{lang === 'es' ? 'Compara Diferentes Escenarios:' : 'Compare Different Scenarios:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Cambia de escenario para comprobar si el método que funcionó mejor en un lugar sigue siendo seguro cuando la geología y la capa freática cambian.'
                    : 'Switch to a new scenario to see if the method that worked best before is still the best choice when the geology and water table change!'}
                </li>
                <li>
                  <strong>{lang === 'es' ? 'Sintetiza Tu CER:' : 'Synthesize Your CER:'}</strong>{' '}
                  {lang === 'es'
                    ? 'Revisa tus datos y cita manualmente tus números (acres, pH, CO₂, fricción comunitaria, riesgo del entorno) en tu párrafo CER para respaldar tu conclusión.'
                    : 'Review your Evidence Log data and manually cite your numbers (acres, pH, CO₂, friction, setting risk) in your CER paragraph to support your claim.'}
                </li>
              </ol>

              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                <strong className="block font-bold text-slate-900 mb-0.5">
                  {lang === 'es' ? 'Estándar NGSS:' : 'NGSS Standard:'}
                </strong>
                <em>HS-ESS3-1:</em>{' '}
                {lang === 'es'
                  ? 'Construir una explicación basada en evidencia sobre cómo la disponibilidad de recursos naturales ha moldeado la actividad humana y la sostenibilidad ambiental.'
                  : 'Construct an explanation based on evidence for how the availability of natural resources has shaped human activity and environmental sustainability.'}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setGoalModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition cursor-pointer"
              >
                {lang === 'es' ? 'Entendido - Iniciar Investigación' : 'Got It - Start Investigation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Geological Method Reference Library */}
      {libraryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  {lang === 'es' ? 'Biblioteca Geológica de Estrategias Mineras' : 'Geological Mining Strategy Library'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'es'
                    ? 'Lee la instrucción de cada método y responde la pregunta de verificación para desbloquearlo.'
                    : 'Read each method briefing and answer the verification question to unlock it for testing.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setLibraryModalOpen(false);
                  setHighlightedMethod(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {(['openpit', 'underground', 'mountaintop', 'insitu'] as MiningMethodKey[]).map((key) => {
                const spec = activeMethods[key];
                const q = activeBriefingQuestions[key];
                const isVerified = verifiedBriefings[key];
                const isHigh = highlightedMethod === key;

                return (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 space-y-3 transition flex flex-col justify-between ${
                      isHigh ? 'library-highlight ring-2 ring-amber-400' : ''
                    } ${
                      isVerified
                        ? 'bg-emerald-50/60 border-emerald-500'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {key === 'openpit' && <Layers className="w-4 h-4 text-amber-600" />}
                          {key === 'underground' && <Pickaxe className="w-4 h-4 text-blue-600" />}
                          {key === 'mountaintop' && <Mountain className="w-4 h-4 text-red-600" />}
                          {key === 'insitu' && <Droplets className="w-4 h-4 text-cyan-600" />}
                          {spec.name}
                        </h4>
                        {isVerified ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {lang === 'es' ? 'Verificado' : 'Verified'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-600" />
                            {lang === 'es' ? 'Responde para Desbloquear' : 'Answer Question to Unlock'}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 leading-relaxed text-xs">{spec.geologicalMechanism}</p>

                      <div className="pt-1 text-[11px] text-slate-600 space-y-1 bg-white/70 p-2.5 rounded border border-slate-200">
                        <div>
                          <strong className="text-slate-800">{lang === 'es' ? 'Ventajas:' : 'Pros:'}</strong> {spec.pros}
                        </div>
                        <div>
                          <strong className="text-slate-800">{lang === 'es' ? 'Desventajas:' : 'Cons:'}</strong> {spec.cons}
                        </div>
                        <div>
                          <strong className="text-slate-800">{lang === 'es' ? 'Impacto Comunitario:' : 'Community Impact:'}</strong>{' '}
                          <span className="font-semibold text-purple-700">{spec.communityImpact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Verification Question */}
                    <div className="pt-2.5 border-t border-slate-200 mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-700 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                          {lang === 'es' ? 'Pregunta de Verificación:' : 'Verification Question:'}
                        </span>
                        {isVerified ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                            {lang === 'es' ? '✓ Verificado y Desbloqueado' : '✓ Verified & Unlocked'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            {lang === 'es' ? 'Requerido para Desbloquear' : 'Required to Unlock'}
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-slate-900 text-xs leading-snug">
                        {q.question}
                      </p>

                      <div className="space-y-1.5 mt-1.5">
                        {q.options.map((optionText, optIdx) => {
                          const isSelected = briefingAnswers[key] === optIdx;
                          const isCorrectOption = optIdx === q.correctIndex;

                          return (
                            <label
                              key={optIdx}
                              className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                                isVerified && isCorrectOption
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                                  : isSelected
                                  ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-medium'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`briefing-q-${key}`}
                                checked={isSelected}
                                disabled={isVerified}
                                onChange={() => handleBriefingAnswerSelect(key, optIdx)}
                                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="leading-snug">{optionText}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Incorrect Feedback Alert */}
                      {briefingErrors[key] && (
                        <div className="p-2 rounded bg-rose-50 border border-rose-300 text-rose-900 text-[11px] flex items-start gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{briefingErrors[key]}</span>
                        </div>
                      )}

                      {/* Correct Feedback Explanation */}
                      {isVerified && (
                        <div className="p-2 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{q.explanation}</span>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-2 flex justify-end">
                        {isVerified ? (
                          <div className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded flex items-center gap-1.5 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {lang === 'es' ? 'Instrucción Verificada y Desbloqueada' : 'Briefing Verified & Unlocked'}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCheckBriefingQuestion(key)}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                          >
                            <Check className="w-4 h-4 text-slate-950" />
                            {lang === 'es' ? 'Verificar Respuesta y Desbloquear' : 'Verify Answer & Unlock'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chemical Equation Callout for 10th Grade */}
            <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <strong className="font-bold block text-sm">
                {lang === 'es'
                  ? 'Enfoque de Ciencias de la Tierra y Química: Drenaje Ácido de Mina (DAM)'
                  : 'Earth Science & Chemistry Focus: Acid Mine Drainage (AMD)'}
              </strong>
              <p>
                {lang === 'es'
                  ? 'Cuando la minería fractura rocas subterráneas profundas, los minerales de azufre (como la Pirita: FeS₂) se exponen al agua y oxígeno del aire:'
                  : 'When mining cracks open deep underground rocks, sulfur minerals (like Pyrite: FeS₂) are exposed to water and oxygen in the air:'}
              </p>
              <div className="font-mono bg-white p-2 rounded border border-amber-300 my-1 text-center font-bold text-amber-950 text-xs">
                {lang === 'es'
                  ? 'Pirita (FeS₂) + Oxígeno (O₂) + Agua (H₂O) → Ácido Sulfúrico + Metales Pesados Disueltos'
                  : 'Pyrite (FeS₂) + Oxygen (O₂) + Water (H₂O) → Sulfuric Acid + Dissolved Heavy Metals'}
              </div>
              <p className="text-[11px] text-amber-800">
                {lang === 'es'
                  ? 'Esta reacción reduce el pH del agua a niveles altamente tóxicos (pH 2.5–4.5, tan ácido como el vinagre), dañando peces, plantas y fuentes de agua potable a menos que el lecho de caliza lo amortigüe de forma natural.'
                  : 'This reaction drops water pH down to toxic levels (pH 2.5–4.5, as acidic as vinegar), harming fish, plants, and drinking water sources unless naturally buffered by limestone.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={unlockAllBriefings}
                className="text-slate-500 hover:text-slate-800 text-[11px] underline cursor-pointer"
              >
                {lang === 'es' ? 'Pase para Docentes: Desbloquear Todos los Métodos' : 'Teacher Bypass: Unlock All Methods'}
              </button>
              <button
                onClick={() => {
                  setLibraryModalOpen(false);
                  setHighlightedMethod(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition cursor-pointer"
              >
                {lang === 'es' ? 'Cerrar Biblioteca' : 'Close Reference'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
