/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSet {
  tacticalConsole: string;
  hypothesisSuite: string;
  relationshipGraph: string;
  lawLibrary: string;
  jurisdictionDirectory: string;
  investigativeChat: string;
  searchPlaceholder: string;
  activeQuery: string;
  systemSync: string;
  languageLabel: string;
  auditLog: string;
  exportBrief: string;
  welcome: string;
  themeLabel: string;
  brightMode: string;
  darkMode: string;
  latencyText: string;
  databaseSecured: string;
  userRoleLabel: string;
  investigator: string;
  analyst: string;
  supervisor: string;
  policymaker: string;

  // Dashboard translations
  firRegistry: string;
  activeStatus: string;
  inSurveillance: string;
  investigations: string;
  loggedCases: string;
  openTrials: string;
  accusedNodes: string;
  activeFieldCases: string;
  heatBreakdown: string;
  liveDatabaseFeed: string;
  socioEconomicIndicators: string;
  districtMacroMetrics: string;
  selectDistrictPrompt: string;
  unemploymentIndex: string;
  populationDensity: string;
  incomeIndex: string;
  stateTacticalGrid: string;
  interconnectedLayoutText: string;
  clearMapFilter: string;
  tacticalGridActiveAll: string;
  activeMapFilter: string;
  firsShort: string;
  sourceCensusData: string;

  // Jurisdiction Directory translations
  jurisdictionTitle: string;
  jurisdictionDesc: string;
  searchJurisdictionPlaceholder: string;
  totalDistricts: string;
  totalMandals: string;
  totalVillages: string;
  viewDetails: string;
  connectedCases: string;
  expandAll: string;
  collapseAll: string;
  noVillagesFound: string;
  karnatakaAdministrativeDirectory: string;
  villageWiseList: string;
  googleDataSourced: string;
  closeDetails: string;
  districtLabel: string;
  mandalLabel: string;
  villageLabel: string;
  selectDistrictToExplore: string;
  detailsForVillage: string;
  demographics: string;
  elevation: string;
  primaryCrop: string;
  policingStation: string;
}

export const TRANSLATIONS: Record<'EN' | 'KN' | 'HI' | 'TE' | 'TA', TranslationSet> = {
  EN: {
    tacticalConsole: "Tactical Console",
    hypothesisSuite: "Hypothesis Suite",
    relationshipGraph: "Relationship Graph",
    lawLibrary: "Law & Constitution",
    jurisdictionDirectory: "Jurisdiction & Villages",
    investigativeChat: "Investigative Chat",
    searchPlaceholder: "Type query (e.g. repeat offenders in Bengaluru)...",
    activeQuery: "Active Query",
    systemSync: "System Sync: 100%",
    languageLabel: "LANGUAGE",
    auditLog: "Audit Log",
    exportBrief: "Export Brief",
    welcome: "Welcome to Drishti Copilot v2.5. I am your expert criminologist assistant. Ask me to lookup FIRs, analyze regional crime patterns, or generate hypotheses grounded in academic criminological theory.",
    themeLabel: "THEME",
    brightMode: "BRIGHT MODE",
    darkMode: "DARK MODE",
    latencyText: "LATENCY: 14ms // RECONSTRUCTION DELTA ACCURATE",
    databaseSecured: "TACTICAL DATABASE SECURED BY KSP GRID SECURITIES",
    userRoleLabel: "Role:",
    investigator: "Investigator",
    analyst: "Analyst",
    supervisor: "Supervisor",
    policymaker: "Policymaker",

    // Dashboard
    firRegistry: "FIR Registry",
    activeStatus: "ACTIVE STATUS",
    inSurveillance: "IN-SURVEILLANCE",
    investigations: "INVESTIGATIONS",
    loggedCases: "Grounded cases logged",
    openTrials: "Open/Pending trials",
    accusedNodes: "Unique Accused Nodes",
    activeFieldCases: "Active field cases",
    heatBreakdown: "Crime Type Heat Breakdown",
    liveDatabaseFeed: "Live Database Feed",
    socioEconomicIndicators: "Socio-Economic Index Indicators",
    districtMacroMetrics: "District Macro Metrics",
    selectDistrictPrompt: "Select a district on the tactical map to load regional socio-economic index values. Grounding hypotheses relies heavily on correlating crime density with these ecological stressors.",
    unemploymentIndex: "Unemployment index:",
    populationDensity: "Population Density:",
    incomeIndex: "Income Index:",
    stateTacticalGrid: "KSP State Tactical Grid",
    interconnectedLayoutText: "Interconnected layout representing districts. Clicking isolates FIR and Person logs dynamically.",
    clearMapFilter: "Clear Map Filter",
    tacticalGridActiveAll: "TACTICAL GRID ACTIVE - ALL REGIONS SHOWING",
    activeMapFilter: "FILTER",
    firsShort: "FIRs",
    sourceCensusData: "Source: Karnataka Planning Commission Census Data",

    // Jurisdiction Directory
    jurisdictionTitle: "Karnataka Administrative Directory",
    jurisdictionDesc: "Explore Karnataka's official districts, mandals (taluks), and villages. Fully separated by village-wise list formats using Google reference data.",
    searchJurisdictionPlaceholder: "Search districts, mandals, or villages...",
    totalDistricts: "Total Districts",
    totalMandals: "Total Mandals",
    totalVillages: "Total Villages",
    viewDetails: "View Info",
    connectedCases: "Associated Incidents",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    noVillagesFound: "No jurisdictions or villages matched your query.",
    karnatakaAdministrativeDirectory: "Karnataka Administrative Directory",
    villageWiseList: "Village-Wise Detailed List",
    googleDataSourced: "Google Sourced Administrative Reference Data",
    closeDetails: "Close Details",
    districtLabel: "District",
    mandalLabel: "Mandal / Taluk",
    villageLabel: "Village",
    selectDistrictToExplore: "Select a district to view its mandals & villages",
    detailsForVillage: "Administrative Dossier",
    demographics: "Demographics / Pop:",
    elevation: "Elevation / Climate:",
    primaryCrop: "Primary Crop:",
    policingStation: "Nearest Police Station:"
  },
  KN: {
    tacticalConsole: "ಯುದ್ಧತಂತ್ರದ ಕನ್ಸೋಲ್",
    hypothesisSuite: "ಹೈಪೋಥೆಸಿಸ್ ಸೂಟ್",
    relationshipGraph: "ಸಂಬಂಧಗಳ ಗ್ರಾಫ್",
    lawLibrary: "ಸಂವಿಧಾನ ಮತ್ತು ಕಾನೂನು",
    jurisdictionDirectory: "ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ ಮತ್ತು ಹಳ್ಳಿಗಳು",
    investigativeChat: "ತನಿಖಾ ಚಾಟ್",
    searchPlaceholder: "ಬೆಂಗಳೂರು ಮೆಜೆಸ್ಟಿಕ್‌ನಲ್ಲಿ ಅಪರಾಧಿಗಳ ಪತ್ತೆ ಮಾಡು...",
    activeQuery: "ಸಕ್ರಿಯ ಪ್ರಶ್ನೆ",
    systemSync: "ಸಿಸ್ಟಮ್ ಸಿಂಕ್: 100%",
    languageLabel: "ಭಾಷೆ",
    auditLog: "ಆಡಿಟ್ ಲಾಗ್",
    exportBrief: "ಬ್ರೀಫ್ ರಫ್ತು ಮಾಡು",
    welcome: "ದೃಷ್ಟಿ ಕೊ-ಪೈಲಟ್ v2.5 ಗೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮ್ಮ ತಜ್ಞ ಕ್ರಿಮಿನಾಲಜಿಸ್ಟ್ ಸಹಾಯಕ. ಎಫ್‌ಐಆರ್‌ಗಳನ್ನು ಹುಡುಕಲು, ಪ್ರಾದೇಶಿಕ ಅಪರಾಧ ಮಾದರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಅಥವಾ ಸಿದ್ಧಾಂತಗಳ ಆಧಾರದ ಮೇಲೆ ಕಲ್ಪನೆಗಳನ್ನು ರಚಿಸಲು ನನ್ನನ್ನು ಕೇಳಿ.",
    themeLabel: "ಥೀಮ್",
    brightMode: "ಪ್ರಕಾಶಮಾನ ಮೋಡ್",
    darkMode: "ಕತ್ತಲೆ ಮೋಡ್",
    latencyText: "ವಿಳಂಬ: 14ms // ಮರುನಿರ್ಮಾಣ ನಿಖರವಾಗಿದೆ",
    databaseSecured: "ಕೆಎಸ್ಪಿ ಗ್ರಿಡ್ ಸೆಕ್ಯುರಿಟೀಸ್ ಮೂಲಕ ಸುರಕ್ಷಿತ ಡೇಟಾಬೇಸ್",
    userRoleLabel: "ಪಾತ್ರ:",
    investigator: "ತನಿಖಾಧಿಕಾರಿ",
    analyst: "ವಿಶ್ಲೇಷಕ",
    supervisor: "ಮೇಲ್ವಿಚಾರಕ",
    policymaker: "ನೀತಿ ನಿರೂಪಕ",

    // Dashboard
    firRegistry: "ಎಫ್ಐಆರ್ ನೋಂದಣಿ ಪುಸ್ತಕ",
    activeStatus: "ಸಕ್ರಿಯ ಸ್ಥಿತಿ",
    inSurveillance: "ಕಾವಲು ನಿಗಾದಲ್ಲಿ",
    investigations: "ತನಿಖೆಗಳು",
    loggedCases: "ದಾಖಲಾದ ಒಟ್ಟು ಪ್ರಕರಣಗಳು",
    openTrials: "ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಪ್ರಕರಣಗಳು",
    accusedNodes: "ವಿಶಿಷ್ಟ ಆರೋಪಿಗಳು",
    activeFieldCases: "ಸಕ್ರಿಯ ಕ್ಷೇತ್ರ ಪ್ರಕರಣಗಳು",
    heatBreakdown: "ಅಪರಾಧ ಪ್ರಕಾರದ ವಿಶ್ಲೇಷಣೆ",
    liveDatabaseFeed: "ಲೈವ್ ಡೇಟಾಬೇಸ್ ಫೀಡ್",
    socioEconomicIndicators: "ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಸೂಚಕಗಳು",
    districtMacroMetrics: "ಜಿಲ್ಲಾ ಸ್ಥೂಲ ಸೂಚಕಗಳು",
    selectDistrictPrompt: "ಪ್ರಾದೇಶಿಕ ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಸೂಚ್ಯಂಕ ಮೌಲ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಯುದ್ಧತಂತ್ರದ ನಕ್ಷೆಯಲ್ಲಿ ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ. ಅಪರಾಧ ಸಾಂದ್ರತೆಯನ್ನು ಪರಿಸರ ಒತ್ತಡಗಳೊಂದಿಗೆ ಪರಸ್ಪರ ಸಂಬಂಧಿಸುವುದರ ಮೇಲೆ ಸಿದ್ಧಾಂತಗಳ ವಿಶ್ಲೇಷಣೆ ಅವಲಂಬಿತವಾಗಿದೆ.",
    unemploymentIndex: "ನಿರುದ್ಯೋಗ ದರ:",
    populationDensity: "ಜನಸಂಖ್ಯಾ ಸಾಂದ್ರತೆ (ಚ.ಕಿಮೀ):",
    incomeIndex: "ಆದಾಯ ಸೂಚ್ಯಂಕ:",
    stateTacticalGrid: "ಕೆಎಸ್ಪಿ ರಾಜ್ಯ ಯುದ್ಧತಂತ್ರದ ಗ್ರಿಡ್",
    interconnectedLayoutText: "ಜಿಲ್ಲೆಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುವ ಅಂತರ್ಸಂಪರ್ಕಿತ ವಿನ್ಯಾಸ. ಕ್ಲಿಕ್ ಮಾಡುವುದರಿಂದ ಎಫ್‌ಐಆರ್ ಮತ್ತು ಆರೋಪಿಗಳ ವಿವರಗಳು ಪ್ರತ್ಯೇಕಗೊಳ್ಳುತ್ತವೆ.",
    clearMapFilter: "ನಕ್ಷೆ ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ",
    tacticalGridActiveAll: "ಯುದ್ಧತಂತ್ರದ ಗ್ರಿಡ್ ಸಕ್ರಿಯವಾಗಿದೆ - ಎಲ್ಲಾ ಪ್ರದೇಶಗಳು",
    activeMapFilter: "ಫಿಲ್ಟರ್",
    firsShort: "ಎಫ್‌ಐಆರ್‌ಗಳು",
    sourceCensusData: "ಮೂಲ: ಕರ್ನಾಟಕ ಯೋಜನೆ ಆಯೋಗದ ಜನಗಣತಿ ಮಾಹಿತಿ",

    // Jurisdiction Directory
    jurisdictionTitle: "ಕರ್ನಾಟಕ ಆಡಳಿತಾತ್ಮಕ ಡೈರೆಕ್ಟರಿ",
    jurisdictionDesc: "ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಜಿಲ್ಲೆಗಳು, ಮಂಡಲಗಳು (ತಾಲ್ಲೂಕುಗಳು) ಮತ್ತು ಗ್ರಾಮಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ಗೂಗಲ್ ಉಲ್ಲೇಖ ದತ್ತಾಂಶವನ್ನು ಬಳಸಿಕೊಂಡು ಗ್ರಾಮವಾರು ಪಟ್ಟಿ ಸ್ವರೂಪದಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಪ್ರತ್ಯೇಕಿಸಲಾಗಿದೆ.",
    searchJurisdictionPlaceholder: "ಜಿಲ್ಲೆಗಳು, ಮಂಡಲಗಳು ಅಥವಾ ಹಳ್ಳಿಗಳನ್ನು ಹುಡುಕಿ...",
    totalDistricts: "ಒಟ್ಟು ಜಿಲ್ಲೆಗಳು",
    totalMandals: "ಒಟ್ಟು ಮಂಡಲಗಳು (ತಾಲ್ಲೂಕು)",
    totalVillages: "ಒಟ್ಟು ಗ್ರಾಮಗಳು",
    viewDetails: "ಮಾಹಿತಿ ನೋಡು",
    connectedCases: "ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳು",
    expandAll: "ಎಲ್ಲವನ್ನೂ ವಿಸ್ತರಿಸು",
    collapseAll: "ಎಲ್ಲವನ್ನೂ ಕುಗ್ಗಿಸು",
    noVillagesFound: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಪ್ರದೇಶ ಅಥವಾ ಹಳ್ಳಿಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    karnatakaAdministrativeDirectory: "ಕರ್ನಾಟಕ ಆಡಳಿತಾತ್ಮಕ ಡೈರೆಕ್ಟರಿ",
    villageWiseList: "ಗ್ರಾಮವಾರು ವಿವರವಾದ ಪಟ್ಟಿ",
    googleDataSourced: "ಗೂಗಲ್ ಮೂಲದ ಆಡಳಿತಾತ್ಮಕ ಉಲ್ಲೇಖ ಮಾಹಿತಿ",
    closeDetails: "ಮಾಹಿತಿ ಮುಚ್ಚು",
    districtLabel: "ಜಿಲ್ಲೆ",
    mandalLabel: "ಮಂಡಲ / ತಾಲ್ಲೂಕು",
    villageLabel: "ಗ್ರಾಮ",
    selectDistrictToExplore: "ಮಂಡಲಗಳು ಮತ್ತು ಗ್ರಾಮಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಜಿಲ್ಲೆಯನ್ನು ಆರಿಸಿ",
    detailsForVillage: "ಆಡಳಿತಾತ್ಮಕ ಡೋಸಿಯರ್",
    demographics: "ಜನಸಂಖ್ಯಾ ವಿವರಗಳು / ಜನಸಂಖ್ಯೆ:",
    elevation: "ಎತ್ತರ / ಹವಾಮಾನ:",
    primaryCrop: "ಮುಖ್ಯ ಬೆಳೆ:",
    policingStation: "ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆ:"
  },
  HI: {
    tacticalConsole: "सामरिक कंसोल",
    hypothesisSuite: "परिकल्पना सूट",
    relationshipGraph: "संबंध ग्राफ़",
    lawLibrary: "संविधान और कानून",
    jurisdictionDirectory: "अधिकार क्षेत्र और गाँव",
    investigativeChat: "खोजी चैट",
    searchPlaceholder: "प्रश्न टाइप करें (जैसे बेंगलुरु में बार-बार अपराध करने वाले)...",
    activeQuery: "सक्रिय प्रश्न",
    systemSync: "सिस्टम सिंक: 100%",
    languageLabel: "भाषा",
    auditLog: "ऑडिट लॉग",
    exportBrief: "ब्रीफ एक्सपोर्ट करें",
    welcome: "दृष्टि को-पायलट v2.5 में आपका स्वागत है। मैं आपका विशेषज्ञ अपराध विज्ञानी सहायक हूँ। मुझसे प्राथमिकी (FIR) खोजने, क्षेत्रीय अपराध पैटर्न का विश्लेषण करने, या शैक्षिक सिद्धांतों के आधार पर परिकल्पना तैयार करने के लिए कहें।",
    themeLabel: "थीम",
    brightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    latencyText: "विलंबता: 14ms // पुनर्निर्माण डेल्टा सटीक है",
    databaseSecured: "केएसपी ग्रिड सिक्योरिटीज द्वारा सामरिक डेटाबेस सुरक्षित है",
    userRoleLabel: "भूमिका:",
    investigator: "जांचकर्ता",
    analyst: "विश्लेषक",
    supervisor: "पर्यवेक्षक",
    policymaker: "नीति निर्माता",

    // Dashboard
    firRegistry: "प्राथमिकी (FIR) रजिस्ट्री",
    activeStatus: "सक्रिय स्थिति",
    inSurveillance: "निगरानी में",
    investigations: "जांच प्रक्रियाएं",
    loggedCases: "दर्ज की गई कुल केस फाइलें",
    openTrials: "सक्रिय / लंबित मुकदमे",
    accusedNodes: "विशिष्ट आरोपी व्यक्ति",
    activeFieldCases: "सक्रिय मैदानी मामले",
    heatBreakdown: "अपराध प्रकार हीट विश्लेषण",
    liveDatabaseFeed: "लाइव डेटाबेस फ़ीड",
    socioEconomicIndicators: "सामाजिक-आर्थिक सूचकांक संकेतक",
    districtMacroMetrics: "जिला मैक्रो संकेतक",
    selectDistrictPrompt: "क्षेत्रीय सामाजिक-आर्थिक सूचकांक मानों को लोड करने के लिए सामरिक मानचित्र पर एक जिले का चयन करें। सिद्धांतों के सत्यापन के लिए अपराध घनत्व को इन पारिस्थितिक तनावों के साथ सह-संबंधित करना आवश्यक है।",
    unemploymentIndex: "बेरोजगारी दर:",
    populationDensity: "जनसंख्या घनत्व (प्रति वर्ग किमी):",
    incomeIndex: "आय सूचकांक:",
    stateTacticalGrid: "केएसपी राज्य सामरिक ग्रिड",
    interconnectedLayoutText: "जिलों का प्रतिनिधित्व करने वाला परस्पर जुड़े लेआउट। क्लिक करने से प्राथमिकी और आरोपी लॉग गतिशील रूप से अलग हो जाते हैं।",
    clearMapFilter: "मानचित्र फ़िल्टर साफ़ करें",
    tacticalGridActiveAll: "सामरिक ग्रिड सक्रिय - सभी क्षेत्र प्रदर्शित हैं",
    activeMapFilter: "फ़िल्टर",
    firsShort: "प्राथमिकी",
    sourceCensusData: "स्रोत: कर्नाटक योजना आयोग जनगणना डेटा",

    // Jurisdiction Directory
    jurisdictionTitle: "कर्नाटक प्रशासनिक निर्देशिका",
    jurisdictionDesc: "कर्नाटक के आधिकारिक जिलों, मंडलों (तालुकों) और गांवों का अन्वेषण करें। Google संदर्भ डेटा के आधार पर ग्राम-वार सूची प्रारूपों में पूरी तरह से विभाजित।",
    searchJurisdictionPlaceholder: "जिले, मंडल या गांवों को खोजें...",
    totalDistricts: "कुल जिले",
    totalMandals: "कुल मंडल (तालुक)",
    totalVillages: "कुल गाँव",
    viewDetails: "जानकारी देखें",
    connectedCases: "संबद्ध घटनाएं",
    expandAll: "सभी विस्तृत करें",
    collapseAll: "सभी संकुचित करें",
    noVillagesFound: "आपकी खोज से मेल खाने वाला कोई अधिकार क्षेत्र या गाँव नहीं मिला।",
    karnatakaAdministrativeDirectory: "कर्नाटक प्रशासनिक निर्देशिका",
    villageWiseList: "ग्राम-वार विस्तृत सूची",
    googleDataSourced: "Google द्वारा प्रदान किया गया प्रशासनिक संदर्भ डेटा",
    closeDetails: "जानकारी बंद करें",
    districtLabel: "ज़िला",
    mandalLabel: "मंडल / तालुक",
    villageLabel: "गाँव",
    selectDistrictToExplore: "मंडलों और गांवों को देखने के लिए एक जिला चुनें",
    detailsForVillage: "प्रशासनिक डॉसियर",
    demographics: "जनसांख्यिकी / जनसंख्या:",
    elevation: "ऊंचाई / जलवायु:",
    primaryCrop: "प्राथमिक फसल:",
    policingStation: "निकटतम पुलिस स्टेशन:"
  },
  TE: {
    tacticalConsole: "వ్యూహాత్మక కన్సోల్",
    hypothesisSuite: "హైపోథెసిస్ సూట్",
    relationshipGraph: "సంబంధాల గ్రాఫ్",
    lawLibrary: "రాజ్యాంగం & చట్టం",
    jurisdictionDirectory: "అధికార పరిధి & గ్రామాలు",
    investigativeChat: "పరిశోధన చాట్",
    searchPlaceholder: "ప్రశ్నను ఇక్కడ టైప్ చేయండి (ఉదా: బెంగళూరులో పదేపదే నేరాలు చేసేవారు)...",
    activeQuery: "క్రియాశీల ప్రశ్న",
    systemSync: "సిస్టమ్ సింక్: 100%",
    languageLabel: "భాష",
    auditLog: "ఆడిట్ లాగ్",
    exportBrief: "నివేదిక ఎగుమతి",
    welcome: "దృష్టి కో-పైలట్ v2.5 కి స్వాగతం. నేను మీ నిపుణులైన క్రిమినాలజిస్ట్ అసిస్టెంట్‌ని. ఎఫ్‌ఐఆర్‌లను శోధించడానికి, ప్రాంతీయ నేరాల నమూనాలను విశ్లేషించడానికి లేదా సిద్ధాంతాల ఆధారంగా కల్పనలను రూపొందించడానికి నన్ను అడగండి.",
    themeLabel: "థీమ్",
    brightMode: "లైట్ మోడ్",
    darkMode: "డార్క్ మోడ్",
    latencyText: "జాప్యం: 14ms // రీకన్‌స్ట్రక్షన్ డెల్టా ఖచ్చితమైనది",
    databaseSecured: "KSP గ్రిడ్ సెక్యూరిటీస్ ద్వారా వ్యూహాత్మక డేటాబేస్ సురక్షితం",
    userRoleLabel: "పాత్ర:",
    investigator: "పరిశోధకుడు",
    analyst: "విశ్లేషకుడు",
    supervisor: "పర్యవేక్షకుడు",
    policymaker: "విధాన నిర్ణేత",

    // Dashboard
    firRegistry: "FIR రిజిస్ట్రీ",
    activeStatus: "క్రియాశీల స్థితి",
    inSurveillance: "నిఘాలో ఉంది",
    investigations: "పరిశోధనలు",
    loggedCases: "నమోదైన మొత్తం కేసులు",
    openTrials: "విచారణలో ఉన్న కేసులు",
    accusedNodes: "ప్రత్యేక నిందితులు",
    activeFieldCases: "యాక్టివ్ ఫీల్డ్ కేసులు",
    heatBreakdown: "నేర రకం హీట్ విశ్లేషణ",
    liveDatabaseFeed: "లైవ్ డేటాబేస్ ఫీడ్",
    socioEconomicIndicators: "సామాజిక-ఆర్థిక సూచికలు",
    districtMacroMetrics: "జిల్లా స్థూల సూచికలు",
    selectDistrictPrompt: "ప్రాంతీయ సామాజిక-ఆర్థిక సూచీ విలువలను లోడ్ చేయడానికి వ్యూహాత్మక మ్యాప్‌లో జిల్లాను ఎంచుకోండి. నేరాల సాంద్రతను ఈ పర్యావరణ ఒత్తిళ్లతో పరస్పర అనుసంధానం చేయడంపై సిద్ధాంతాల విశ్లేషణ ఆధారపడి ఉంటుంది.",
    unemploymentIndex: "నిరుద్యోగిత రేటు:",
    populationDensity: "జనసాంద్రత (చ.కిమీకి):",
    incomeIndex: "ఆదాయ సూచిక:",
    stateTacticalGrid: "KSP రాష్ట్ర వ్యూహాత్మక గ్రిడ్",
    interconnectedLayoutText: "జిల్లాలను సూచించే పరస్పర అనుసంధాన లేఅవుట్. క్లిక్ చేయడం వల్ల ఎఫ్ఐఆర్ మరియు నిందితుల లాగ్‌లు డైనమిక్‌గా వేరు చేయబడతాయి.",
    clearMapFilter: "మ్యాప్ ఫిల్టర్ తొలగించు",
    tacticalGridActiveAll: "వ్యూహాత్మక గ్రిడ్ సక్రియం - అన్ని ప్రాంతాలు",
    activeMapFilter: "ఫిల్టర్",
    firsShort: "ఎఫ్ఐఆర్లు",
    sourceCensusData: "మూలం: కర్ణాటక ప్రణాళికా సంఘం జనగణన సమాచారం",

    // Jurisdiction Directory
    jurisdictionTitle: "కర్ణాటక పరిపాలనా డైరెక్టరీ",
    jurisdictionDesc: "కర్ణాటక అధికారిక జిల్లాలు, మండలాలు (తాలూకాలు) మరియు గ్రామాలను అన్వేషించండి. గూగుల్ సూచన సమాచారం ఆధారంగా గ్రామ వారీగా జాబితా ఆకృతిలో పూర్తిగా వేరు చేయబడింది.",
    searchJurisdictionPlaceholder: "జిల్లాలు, మండలాలు లేదా గ్రామాలను వెతకండి...",
    totalDistricts: "మొత్తం జిల్లాలు",
    totalMandals: "మొత్తం మండలాలు (తాలూకా)",
    totalVillages: "మొత్తం గ్రామాలు",
    viewDetails: "సమాచారం చూడు",
    connectedCases: "అనుబంధ సంఘటనలు",
    expandAll: "అన్నీ విస్తరించు",
    collapseAll: "అన్నీ కుదించు",
    noVillagesFound: "మీ శోధనకు సరిపోలే అధికార పరిధి లేదా గ్రామం ఏదీ కనుగొనబడలేదు.",
    karnatakaAdministrativeDirectory: "కర్ణాటక పరిపాలనా డైరెక్టరీ",
    villageWiseList: "గ్రామ వారీ వివరణాత్మక జాబితా",
    googleDataSourced: "Google ద్వారా అందించబడిన పరిపాలనా సూచన డేటా",
    closeDetails: "సమాచారం మూసివేయి",
    districtLabel: "జిల్లా",
    mandalLabel: "మండలం / తాలూకా",
    villageLabel: "గ్రామం",
    selectDistrictToExplore: "మండలాలు మరియు గ్రామాలను చూడటానికి ఒక జిల్లాను ఎంచుకోండి",
    detailsForVillage: "పరిపాలనా పత్రాలు",
    demographics: "జనాభా వివరాలు / జనాభా:",
    elevation: "ఎత్తు / వాతావరణం:",
    primaryCrop: "ప్రధాన పంట:",
    policingStation: "సమీప పోలీస్ స్టేషన్:"
  },
  TA: {
    tacticalConsole: "தந்திரோபாய கன்சோல்",
    hypothesisSuite: "கருதுகோள் தொகுப்பு",
    relationshipGraph: "உறவு வரைபடம்",
    lawLibrary: "அரசியலமைப்பு & சட்டம்",
    jurisdictionDirectory: "அதிகார வரம்பு & கிராமங்கள்",
    investigativeChat: "புலனாய்வு அரட்டை",
    searchPlaceholder: "கேள்வியைத் தட்டச்சு செய்க (எ.கா. பெங்களூரில் தொடர் குற்றவாளிகள்)...",
    activeQuery: "செயலில் உள்ள வினவல்",
    systemSync: "கணினி ஒத்திசைவு: 100%",
    languageLabel: "மொழி",
    auditLog: "தணிக்கை பதிவு",
    exportBrief: "சுருக்கத்தை ஏற்றுமதி செய்",
    welcome: "திருஷ்டி கோ-பைலட் v2.5 க்கு உங்களை வரவேற்கிறோம். நான் உங்கள் குற்றவியல் நிபுணர் உதவியாளர். FIR-களைத் தேட, பிராந்திய குற்ற முறைகளை பகுப்பாய்வு செய்ய அல்லது கோட்பாடுகளின் அடிப்படையில் கருத்துக்களை உருவாக்க என்னிடம் கேளுங்கள்.",
    themeLabel: "தீம்",
    brightMode: "ஒளிரும் முறை",
    darkMode: "இருண்ட முறை",
    latencyText: "தாமதம்: 14ms // மறுவடிவமைப்பு துல்லியமானது",
    databaseSecured: "KSP கிரிட் செக்யூரிட்டிஸ் மூலம் தந்திரோபாய தரவுத்தளம் பாதுகாக்கப்பட்டுள்ளது",
    userRoleLabel: "பதவி:",
    investigator: "புலனாய்வாளர்",
    analyst: "பகுப்பாய்வாளர்",
    supervisor: "மேற்பார்வையாளர்",
    policymaker: "கொள்கை வகுப்பாளர்",

    // Dashboard
    firRegistry: "FIR பதிவேடு",
    activeStatus: "செயலில் உள்ள நிலை",
    inSurveillance: "கண்காணிப்பில்",
    investigations: "விசாரணைகள்",
    loggedCases: "பதிவு செய்யப்பட்ட மொத்த வழக்குகள்",
    openTrials: "விசாரணையில் உள்ள வழக்குகள்",
    accusedNodes: "தனித்துவமான குற்றவாளிகள்",
    activeFieldCases: "செயலில் உள்ள கள வழக்குகள்",
    heatBreakdown: "குற்ற வகை வெப்ப பகுப்பாய்வு",
    liveDatabaseFeed: "நேரடி தரவுத்தள ஊட்டம்",
    socioEconomicIndicators: "சமூக-பொருளாதார குறிகாட்டிகள்",
    districtMacroMetrics: "மாவட்ட மேக்ரோ குறிகாட்டிகள்",
    selectDistrictPrompt: "பிராந்திய சமூக-பொருளாதாரக் குறியீட்டு மதிப்புகளை ஏற்ற தந்திரோபாய வரைபடத்தில் ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும். கோட்பாடுகளின் பகுப்பாய்வு குற்ற அடர்த்தியை இந்த சுற்றுச்சூழல் அழுத்தங்களுடன் தொடர்புபடுத்துவதை நம்பியுள்ளது.",
    unemploymentIndex: "வேலையின்மை விகிதம்:",
    populationDensity: "மக்கள் தொகை அடர்த்தி (சதுர கிமீக்கு):",
    incomeIndex: "வருமானக் குறியீடு:",
    stateTacticalGrid: "KSP மாநில தந்திரோபாய கிரிட்",
    interconnectedLayoutText: "மாவட்டங்களை குறிக்கும் ஒன்றோடொன்று இணைக்கப்பட்ட தளவமைப்பு. கிளிக் செய்வதன் மூலம் எஃப்ஐஆர் மற்றும் குற்றவாளிகளின் பதிவுகள் மாறும் வகையில் பிரிக்கப்படும்.",
    clearMapFilter: "வரைபட வடிகட்டியை அகற்று",
    tacticalGridActiveAll: "தந்திரோபாய கிரிட் செயலில் உள்ளது - அனைத்து பிராந்தியங்களும்",
    activeMapFilter: "வடிகட்டி",
    firsShort: "FIR-கள்",
    sourceCensusData: "ஆதாரம்: கர்நாடக திட்டக் குழு மக்கள் தொகை கணக்கெடுப்பு தரவு",

    // Jurisdiction Directory
    jurisdictionTitle: "கர்நாடக நிர்வாக அடைவு",
    jurisdictionDesc: "கர்நாடகாவின் அதிகாரப்பூர்வ மாவட்டங்கள், மண்டலங்கள் (தாலுகாக்கள்) மற்றும் கிராமங்களை ஆராயுங்கள். கூகிள் குறிப்புத் தரவைப் பயன்படுத்தி கிராம வாரியான பட்டியல் வடிவங்களில் முழுமையாக பிரிக்கப்பட்டுள்ளது.",
    searchJurisdictionPlaceholder: "மாவட்டங்கள், மண்டலங்கள் அல்லது கிராமங்களைத் தேடுங்கள்...",
    totalDistricts: "மொத்த மாவட்டங்கள்",
    totalMandals: "மொத்த மண்டலங்கள் (தாலுகா)",
    totalVillages: "மொத்த கிராமங்கள்",
    viewDetails: "தகவலைப் பார்",
    connectedCases: "தொடர்புடைய சம்பவங்கள்",
    expandAll: "அனைத்தையும் விரிவுபடுத்து",
    collapseAll: "அனைத்தையும் சுருக்கு",
    noVillagesFound: "உங்கள் தேடலுக்கு எந்த அதிகார வரம்பும் அல்லது கிராமமும் பொருந்தவில்லை.",
    karnatakaAdministrativeDirectory: "கர்நாடக நிர்வாக அடைவு",
    villageWiseList: "கிராம வாரியான விரிவான பட்டியல்",
    googleDataSourced: "கூகிள் மூலம் பெறப்பட்ட நிர்வாக குறிப்பு தரவு",
    closeDetails: "தகவலை மூடு",
    districtLabel: "மாவட்டம்",
    mandalLabel: "மண்டலம் / தாலுகா",
    villageLabel: "கிராமம்",
    selectDistrictToExplore: "மண்டலங்கள் மற்றும் கிராமங்களைக் காண ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    detailsForVillage: "நிர்வாக ஆவணம்",
    demographics: "மக்கள் தொகை விவரங்கள் / மக்கள் தொகை:",
    elevation: "உயரம் / காலநிலை:",
    primaryCrop: "முதன்மையான பயிர்:",
    policingStation: "அருகிலுள்ள காவல் நிலையம்:"
  }
};
