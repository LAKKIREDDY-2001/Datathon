/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Network,
  Database,
  Search,
  Mic,
  MicOff,
  UserCheck,
  RefreshCw,
  FolderPlus,
  Compass,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Share2,
  BookOpen,
  Sun,
  Moon,
  Layers
} from 'lucide-react';

import { database, getAllHypotheses } from './syntheticData';
import { FIR, Person, Relationship, Location, FinancialTransaction, AuditLogEntry, Hypothesis } from './types';
import { TRANSLATIONS } from './translations';

// Sub-components
import OverviewDashboard from './components/OverviewDashboard';
import HypothesisEngine from './components/HypothesisEngine';
import NetworkGraph from './components/NetworkGraph';
import AuditLogDrawer from './components/AuditLogDrawer';
import CaseSummaryModal from './components/CaseSummaryModal';
import DigitalLibrary from './components/DigitalLibrary';
import JurisdictionDirectory from './components/JurisdictionDirectory';
import RoleAccessDecks from './components/RoleAccessDecks';


interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  citations?: string[];
  entityLinks?: { id: string; type: 'person' | 'fir' }[];
}

// Multi-language translation dictionary for the main UI
const LOCAL_TRANSLATIONS = {
  EN: {
    tacticalConsole: "Tactical Console",
    hypothesisSuite: "Hypothesis Suite",
    relationshipGraph: "Relationship Graph",
    lawLibrary: "Law & Constitution",
    investigativeChat: "Investigative Chat",
    searchPlaceholder: "Type query (e.g. repeat offenders in Bengaluru Majestic)...",
    activeQuery: "Active Query",
    systemSync: "System Sync: 100%",
    languageLabel: "Language",
    auditLog: "Audit Log",
    exportBrief: "Export Brief",
    welcome: "Welcome to Drishti Copilot v2.0. I am your expert criminologist assistant. Ask me to lookup FIRs, analyze regional crime patterns, or generate hypotheses grounded in academic criminological theory."
  },
  KN: {
    tacticalConsole: "ಯುದ್ಧತಂತ್ರದ ಕನ್ಸೋಲ್",
    hypothesisSuite: "ಹೈಪೋಥೆಸಿಸ್ ಸೂಟ್",
    relationshipGraph: "ಸಂಬಂಧಗಳ ಗ್ರಾಫ್",
    lawLibrary: "ಸಂವಿಧಾನ ಮತ್ತು ಕಾನೂನು",
    investigativeChat: "ತನಿಖಾ ಚಾಟ್",
    searchPlaceholder: "ಬೆಂಗಳೂರು ಮೆಜೆಸ್ಟಿಕ್‌ನಲ್ಲಿ ಅಪರಾಧಿಗಳ ಪತ್ತೆ ಮಾಡು...",
    activeQuery: "ಸಕ್ರಿಯ ಪ್ರಶ್ನೆ",
    systemSync: "ಸಿಸ್ಟಮ್ ಸಿಂಕ್: 100%",
    languageLabel: "ಭಾಷೆ",
    auditLog: "ಆಡಿಟ್ ಲಾಗ್",
    exportBrief: "ಬ್ರೀಫ್ ರಫ್ತು ಮಾಡು",
    welcome: "ದೃಷ್ಟಿ ಕೊ-ಪೈಲಟ್ v2.0 ಗೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮ್ಮ ತಜ್ಞ ಕ್ರಿಮಿನಾಲಜಿಸ್ಟ್ ಸಹಾಯಕ. ಎಫ್‌ಐಆರ್‌ಗಳನ್ನು ಹುಡುಕಲು, ಪ್ರಾದೇಶಿಕ ಅಪರಾಧ ಮಾದರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು ಅಥವಾ ಸಿದ್ಧಾಂತಗಳ ಆಧಾರದ ಮೇಲೆ ಕಲ್ಪನೆಗಳನ್ನು ರಚಿಸಲು ನನ್ನನ್ನು ಕೇಳಿ."
  },
  HI: {
    tacticalConsole: "सामरिक कंसोल",
    hypothesisSuite: "परिकल्पना सूट",
    relationshipGraph: "संबंध ग्राफ़",
    lawLibrary: "संविधान और कानून",
    investigativeChat: "खोजी चैट",
    searchPlaceholder: "बेंगलुरु मैजेस्टिक में अपराधी खोजें...",
    activeQuery: "सक्रिय प्रश्न",
    systemSync: "सिस्टम सिंक: 100%",
    languageLabel: "भाषा",
    auditLog: "ऑडिट लॉग",
    exportBrief: "ब्रीफ एक्सपोर्ट करें",
    welcome: "दृष्टि को-पायलट v2.0 में आपका स्वागत है। मैं आपका विशेषज्ञ अपराध विज्ञानी सहायक हूँ। मुझसे प्राथमिकी (FIR) खोजने, क्षेत्रीय अपराध पैटर्न का विश्लेषण करने, या शैक्षिक सिद्धांतों के आधार पर परिकल्पना तैयार करने के लिए कहें।"
  },
  TE: {
    tacticalConsole: "వ్యూహాత్మక కన్సోల్",
    hypothesisSuite: "హైపోథెసిస్ సూట్",
    relationshipGraph: "సంబంధాల గ్రాఫ్",
    lawLibrary: "రాజ్యాంగం & చట్టం",
    investigativeChat: "పరిశోధన చాట్",
    searchPlaceholder: "ప్రశ్నను ఇక్కడ టైప్ చేయండి...",
    activeQuery: "క్రియాశీల ప్రశ్న",
    systemSync: "సిస్టమ్ సింక్: 100%",
    languageLabel: "భాష",
    auditLog: "ఆడిట్ లాగ్",
    exportBrief: "నివేదిక ఎగుమతి",
    welcome: "ದೃಷ್ಟಿ ಕೊ-ಪೈಲಟ್ v2.0 కి స్వాగతం. నేను మీ నిపుణులైన క్రిమినాలజిస్ట్ అసిస్టెంట్‌ని. ఎఫ్‌ಐఆర్‌లను శోధించడానికి, ప్రాంతీయ నేరాల నమూనాలను విశ్లేషించడానికి లేదా సిద్ధాంతాల ఆధారంగా కల్పనలను రూపొందించడానికి నన్ను అడగండి."
  },
  TA: {
    tacticalConsole: "தந்திரோபாய கன்சோல்",
    hypothesisSuite: "கருதுகோள் தொகுப்பு",
    relationshipGraph: "உறவு வரைபடம்",
    lawLibrary: "அரசியலமைப்பு & சட்டம்",
    investigativeChat: "புலனாய்வு அரட்டை",
    searchPlaceholder: "கேள்வியைத் தட்டச்சு செய்க...",
    activeQuery: "செயலில் உள்ள வினவல்",
    systemSync: "கணினி ஒத்திசைவு: 100%",
    languageLabel: "மொழி",
    auditLog: "தணிக்கை பதிவு",
    exportBrief: "சுருக்கத்தை ஏற்றுமதி செய்",
    welcome: "திருஷ்டி கோ-பைலட் v2.0 க்கு உங்களை வரவேற்கிறோம். நான் உங்கள் குற்றவியல் நிபுணர் உதவியாளர். FIR-களைத் தேட, பிராந்திய குற்ற முறைகளை பகுப்பாய்வு செய்ய அல்லது கோட்பாடுகளின் அடிப்படையில் கருத்துக்களை உருவாக்க என்னிடம் கேளுங்கள்."
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hypothesis' | 'graph' | 'library' | 'jurisdiction'>('dashboard');
  const [userRole, setUserRole] = useState<'Investigator' | 'Analyst' | 'Supervisor' | 'Policymaker'>('Investigator');
  const [language, setLanguage] = useState<'EN' | 'KN' | 'HI' | 'TE' | 'TA'>('EN');
  const [displayTheme, setDisplayTheme] = useState<'obsidian' | 'polaris'>('obsidian');
  const [copilotWidth, setCopilotWidth] = useState<number>(450);
  
  // Resizing mouse tracking
  const isResizingRef = useRef(false);

  const handleMouseDownSplitter = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMoveSplitter);
    document.addEventListener('mouseup', handleMouseUpSplitter);
  };

  const handleMouseMoveSplitter = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = window.innerWidth - e.clientX;
    // Limit width bounds
    if (newWidth > 320 && newWidth < 800) {
      setCopilotWidth(newWidth);
    }
  };

  const handleMouseUpSplitter = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMoveSplitter);
    document.removeEventListener('mouseup', handleMouseUpSplitter);
  };

  // Conversational state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'assistant',
      content: TRANSLATIONS[language].welcome,
      entityLinks: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [conversationsList, setConversationsList] = useState<string[]>(['Active KSP Investigation', 'Gokulam Burglary Ring Analysis']);
  const [selectedConv, setSelectedConv] = useState('Active KSP Investigation');
  
  // Voice simulation
  const [isListening, setIsListening] = useState(false);
  const [voiceWave, setVoiceWave] = useState<number[]>([]);

  // Modals & Drawers state
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [inspectedEntity, setInspectedEntity] = useState<{ id: string; type: 'person' | 'fir' } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic full-stack states
  const [firs, setFirs] = useState<FIR[]>(database.firs);
  const [persons, setPersons] = useState<Person[]>(database.persons);
  const [relationships, setRelationships] = useState<Relationship[]>(database.relationships);
  const [locations, setLocations] = useState<Location[]>(database.locations);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(database.transactions);
  const [socioEconomics, setSocioEconomics] = useState<any[]>(database.socioEconomicIndices);

  const fetchDatabaseFromBackend = () => {
    fetch('/api/firs')
      .then(res => res.json())
      .then(data => setFirs(data))
      .catch(err => console.error('Error fetching FIRs:', err));

    fetch('/api/persons')
      .then(res => res.json())
      .then(data => setPersons(data))
      .catch(err => console.error('Error fetching persons:', err));

    fetch('/api/relationships')
      .then(res => res.json())
      .then(data => setRelationships(data))
      .catch(err => console.error('Error fetching relationships:', err));

    fetch('/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error('Error fetching locations:', err));

    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error('Error fetching transactions:', err));

    fetch('/api/socioeconomics')
      .then(res => res.json())
      .then(data => setSocioEconomics(data))
      .catch(err => console.error('Error fetching socioeconomics:', err));
  };

  useEffect(() => {
    fetchDatabaseFromBackend();
  }, []);

  // Active data filters
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [highlightNodeId, setHighlightNodeId] = useState<string | undefined>(undefined);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Suggested chips
  const suggestedQueries = [
    'Show repeat offenders in Bengaluru Majestic',
    'Why is there a burglary spike in Gokulam?',
    'Explain the Kalaburagi smuggling trend'
  ];

  // Load audit logs initially
  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(err => console.error(err));
  }, []);

  // Scroll chat window to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  // Handle Toast popup Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Log system access helper
  const logSystemAccess = (query: string, dataAccessed: string) => {
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        user_role: userRole,
        data_accessed: dataAccessed
      })
    })
      .then(res => res.json())
      .then(newLog => {
        setAuditLogs(prev => [newLog, ...prev]);
      })
      .catch(err => console.error(err));
  };

  // Submit query to chat server
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setChatLoading(true);

    // Formulate database access tags based on query keywords for the audit ledger
    let dataAccessed = 'FIR Index';
    if (textToSend.toLowerCase().includes('majestic') || textToSend.toLowerCase().includes('kiran')) {
      dataAccessed = 'FIRS: Majestic, PERSONS: Kiran Gowda (PII Masked: ' + (userRole === 'Supervisor' || userRole === 'Policymaker' ? 'YES' : 'NO') + ')';
    } else if (textToSend.toLowerCase().includes('gokulam') || textToSend.toLowerCase().includes('burglary')) {
      dataAccessed = 'FIRS: Devaraja PS, PERSONS: Basavaraj Patil';
    } else if (textToSend.toLowerCase().includes('embezzlement') || textToSend.toLowerCase().includes('deepak')) {
      dataAccessed = 'FINANCIAL_TRANSACTIONS, PERSONS: Deepak Joshi';
    }

    logSystemAccess(textToSend, dataAccessed);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, content: m.content })),
          user_role: userRole,
          language
        })
      });
      const data = await response.json();
      
      // Auto extract entities for citation highlights (regex matching)
      const entityLinks: { id: string; type: 'person' | 'fir' }[] = [];
      if (data.text.includes('FIR-RAT-01')) entityLinks.push({ id: 'FIR-RAT-01', type: 'fir' });
      if (data.text.includes('FIR-RAT-02')) entityLinks.push({ id: 'FIR-RAT-02', type: 'fir' });
      if (data.text.includes('FIR-RCS-01')) entityLinks.push({ id: 'FIR-RCS-01', type: 'fir' });
      if (data.text.includes('FIR-RCS-02')) entityLinks.push({ id: 'FIR-RCS-02', type: 'fir' });
      if (data.text.includes('PER-SERIAL-01') || data.text.includes('Kiran Gowda')) entityLinks.push({ id: 'PER-SERIAL-01', type: 'person' });
      if (data.text.includes('PER-SERIAL-02') || data.text.includes('Basavaraj Patil')) entityLinks.push({ id: 'PER-SERIAL-02', type: 'person' });
      if (data.text.includes('PER-SERIAL-03') || data.text.includes('Deepak Joshi')) entityLinks.push({ id: 'PER-SERIAL-03', type: 'person' });

      setMessages(prev => [...prev, {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        content: data.text,
        entityLinks
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        content: 'I encountered an error connecting to the criminological AI routing server. Please verify your connection.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Launch Simulated Voice Control
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceWave([]);
    } else {
      setIsListening(true);
      // Simulate real wave physics
      const interval = setInterval(() => {
        setVoiceWave(Array.from({ length: 15 }, () => Math.floor(Math.random() * 32 + 4)));
      }, 100);
      
      // Auto-input high-value prompt after 3 seconds for seamless demoing
      setTimeout(() => {
        clearInterval(interval);
        setIsListening(false);
        setVoiceWave([]);
        setInputMessage('Why is there a chain-snatching spike near Majestic bus stand?');
        showToast('Voice transcription synced successfully.');
      }, 3000);
    }
  };

  // Print Report Template helper
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const chatHtml = messages.map(m => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
        <strong style="color: ${m.sender === 'user' ? '#1e3a8a' : '#047857'}">${m.sender.toUpperCase()}:</strong>
        <p style="white-space: pre-line; font-family: sans-serif; font-size: 13px; line-height: 1.5; color: #333;">${m.content}</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Drishti Copilot - Case File Export</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #111; }
            .header { text-align: center; border-bottom: 3px double #111; padding-bottom: 20px; margin-bottom: 30px; }
            .meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>KARNATAKA STATE POLICE</h2>
            <h3>DRISHTI COPILOT - CASE INVESTIGATION FILE</h3>
          </div>
          <div class="meta">
            <span>Date: ${new Date().toLocaleDateString()}</span>
            <span>Clearance Level: ${userRole.toUpperCase()}</span>
            <span>Source: GROUNDED AI CRT DATABASE</span>
          </div>
          <div>${chatHtml}</div>
          <div style="margin-top: 50px; text-align: center; font-size: 10px; border-top: 1px solid #ccc; padding-top: 10px;">
            CONFIDENTIAL - FOR AUTHORIZED LAW ENFORCEMENT REPRESENTATIVES ONLY
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Filtered lists based on district selected
  const filteredFirs = selectedDistrict
    ? firs.filter(f => f.district === selectedDistrict)
    : firs;

  const filteredPersons = selectedDistrict
    ? persons.filter(p => p.district === selectedDistrict)
    : persons;

  const isPolaris = displayTheme === 'polaris';
  const t = TRANSLATIONS[language];

  // Theme styling overrides
  const bgApp = isPolaris ? 'bg-[#f1f5f9] text-slate-800' : 'bg-[#020617] text-slate-200';
  const bgMain = isPolaris ? 'bg-[#f8fafc]' : 'bg-[#020617]';
  const bgHeader = isPolaris ? 'bg-white border-b border-slate-200 text-slate-800 shadow-sm' : 'h-16 border-b border-slate-800 bg-[#0a0f1d]/50 text-slate-200';
  const bgWorkspaceCard = isPolaris ? 'bg-white border border-slate-200 shadow-lg rounded-2xl' : 'bg-slate-900/40 border border-slate-800/80 rounded-2xl';
  const bgCopilot = isPolaris ? 'bg-white text-slate-800 shadow-2xl' : 'bg-[#0a0f1d] text-slate-200';
  const textTitle = isPolaris ? 'text-slate-900 font-bold' : 'text-slate-100 font-bold';
  const textMuted = isPolaris ? 'text-slate-500' : 'text-slate-400';

  return (
    <div id="drishti_master_app" className={`flex h-screen w-screen overflow-hidden font-sans select-none relative ${bgApp}`}>
      
      {/* A. Professional Left Sidebar (Keep Dark Navy for Elite Look) */}
      <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col shrink-0 text-slate-200">
        
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]">D</div>
          <h1 className="text-md font-bold tracking-tight text-white uppercase font-sans">
            Drishti<span className="text-sky-400 font-mono font-extrabold">.Copilot</span>
          </h1>
        </div>

        {/* Primary Navigation Hub */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          
          {/* Main Controls Section */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-2">Primary Hub</p>
            
            {/* Tab 1: Tactical Overview Console */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-inner'
                  : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.tacticalConsole}</span>
            </button>

            {/* Tab 2: Hypothesis Reasoning Suite */}
            <button
              onClick={() => {
                setActiveTab('hypothesis');
                logSystemAccess('Inspect Hypothesis Suite', 'All theory models scanned');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                activeTab === 'hypothesis'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-inner'
                  : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.hypothesisSuite}</span>
            </button>

            {/* Tab 3: 3D Relationship Graph */}
            <button
              onClick={() => {
                setActiveTab('graph');
                logSystemAccess('Inspect 3D Relationship Graph', 'Force-directed relational links');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                activeTab === 'graph'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-inner'
                  : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Network className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.relationshipGraph}</span>
            </button>

            {/* Tab 4: Digital Law & Constitution Library */}
            <button
              onClick={() => {
                setActiveTab('library');
                logSystemAccess('Access Law Library', 'Constitution & Penal Code Search');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-inner'
                  : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.lawLibrary}</span>
            </button>

            {/* Tab 5: Jurisdiction & Villages Directory */}
            <button
              onClick={() => {
                setActiveTab('jurisdiction');
                logSystemAccess('Access Jurisdiction Directory', 'Karnataka administrative directory of villages');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                activeTab === 'jurisdiction'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-inner'
                  : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.jurisdictionDirectory}</span>
            </button>
          </div>

          {/* Active Case Sessions list */}
          <div className="space-y-1.5 pt-4 border-t border-slate-900">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-2">Active Sessions</p>
            {conversationsList.map((conv, idx) => {
              const isSelected = selectedConv === conv;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedConv(conv);
                    showToast(`Switched active thread to: ${conv}`);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors block truncate font-sans ${
                    isSelected ? 'bg-slate-900 border border-slate-800 text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  📁 {conv}
                </button>
              );
            })}
          </div>

        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40 shrink-0">
          
          {/* Display Theme switcher */}
          <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-md border border-slate-800 text-xs text-slate-400">
            <span className="font-sans font-semibold text-[10px] text-slate-500">THEME</span>
            <button
              onClick={() => {
                const nextTheme = displayTheme === 'obsidian' ? 'polaris' : 'obsidian';
                setDisplayTheme(nextTheme);
                showToast(`Theme changed to ${nextTheme === 'polaris' ? 'Polaris Clear Light' : 'Obsidian Cyber Dark'}`);
              }}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-sky-400 px-2 py-1 rounded text-[10px] font-mono border border-slate-700 cursor-pointer transition-colors"
            >
              {isPolaris ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>DARK MODE</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>BRIGHT MODE</span>
                </>
              )}
            </button>
          </div>

          {/* Integrated Multi-Language switcher */}
          <div className="flex flex-col gap-1 p-2 bg-slate-900/60 rounded-md border border-slate-800 text-xs text-slate-400">
            <div className="flex justify-between items-center mb-1">
              <span className="font-sans font-semibold text-[10px] text-slate-500 uppercase">{t.languageLabel}</span>
              <span className="text-[10px] font-mono font-bold text-sky-400">{language}</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
              {(['EN', 'KN', 'HI', 'TE', 'TA'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    showToast(`Language synced: ${lang}`);
                  }}
                  className={`py-0.5 text-center rounded font-bold transition-all cursor-pointer ${
                    language === lang 
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 border border-transparent'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* System sync status */}
          <div className="flex items-center gap-2 p-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-mono">{t.systemSync}</span>
          </div>

        </div>

      </aside>

      {/* B. Main Application Workspace container */}
      <main className={`flex-1 flex flex-col min-h-0 ${bgMain}`}>
        
        {/* Dynamic Header Command Console */}
        <header className={`h-16 flex items-center justify-between px-8 shrink-0 ${bgHeader}`}>
          
          {/* Active location tag & message briefing context */}
          <div className="flex gap-4 items-center">
            <div className="px-3 py-1 bg-slate-800 text-slate-200 rounded text-[10px] font-bold tracking-wider uppercase font-mono">
              {selectedDistrict ? `${selectedDistrict} DISTRICT` : "ALL DISTRICTS"}
            </div>
            <div className="w-px h-4 bg-slate-300/30" />
            <h2 className="text-xs font-sans truncate max-w-lg">
              {t.activeQuery}: <span className="font-semibold italic">"{messages[messages.length - 1]?.content || 'Awaiting tactical query...'}"</span>
            </h2>
          </div>

          {/* Tactical action buttons and role badge */}
          <div className="flex gap-4 items-center">
            
            {/* Audit Logs */}
            <button
              onClick={() => setShowAuditLogs(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded text-xs cursor-pointer transition-all font-mono font-bold"
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {t.auditLog} ({auditLogs.length})
            </button>

            {/* Print Export */}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded text-xs cursor-pointer transition-all font-mono font-bold"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              {t.exportBrief}
            </button>

            {/* User credentials + Role dropdown */}
            <div className="flex items-center gap-3 px-3 py-1 bg-sky-950/30 border border-sky-500/20 rounded-full">
              
              {/* Select role */}
              <select
                value={userRole}
                onChange={(e) => {
                  const newRole = e.target.value as any;
                  setUserRole(newRole);
                  showToast(`Officer clearance shifted to ${newRole}`);
                  logSystemAccess('Security Clearance Level Altered', `Shifted to level: ${newRole}`);
                }}
                className="bg-transparent text-sky-400 font-mono font-black text-[10px] tracking-wider focus:outline-none cursor-pointer pr-1 uppercase border-none"
              >
                <option value="Investigator" className="bg-slate-950 text-slate-200">Investigator</option>
                <option value="Analyst" className="bg-slate-950 text-slate-200">Analyst</option>
                <option value="Supervisor" className="bg-slate-950 text-slate-200">Supervisor</option>
                <option value="Policymaker" className="bg-slate-950 text-slate-200">Policymaker</option>
              </select>

              {/* Initials circle */}
              <div className="w-6 h-6 rounded-full bg-slate-700 border border-sky-400/50 flex items-center justify-center font-bold text-[9px] text-sky-300 font-mono select-none">
                {userRole === 'Investigator' ? 'VK' : userRole === 'Analyst' ? 'AN' : userRole === 'Supervisor' ? 'SV' : 'PM'}
              </div>

            </div>

          </div>

        </header>

        {/* C. Split Workspace body layout */}
        <div className="flex-1 flex p-4 overflow-hidden min-h-0 relative gap-0">
          
          {/* Left Side Workspace */}
          <section 
            id="workspace_pane" 
            style={{ width: `calc(100% - ${copilotWidth}px - 12px)` }} 
            className="flex flex-col min-h-0 shrink-0 pr-2 transition-all duration-75"
          >
            <div className={`flex-1 overflow-y-auto p-5 shadow-2xl min-h-0 ${bgWorkspaceCard}`}>
              
              {/* Conditional viewport render */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <OverviewDashboard
                    firs={filteredFirs}
                    persons={filteredPersons}
                    socioEconomics={socioEconomics}
                    onSelectDistrict={setSelectedDistrict}
                    selectedDistrict={selectedDistrict}
                    userRole={userRole}
                    t={t}
                  />
                  <RoleAccessDecks
                    userRole={userRole}
                    firs={firs}
                    persons={persons}
                    socioEconomics={socioEconomics}
                    onRefreshData={fetchDatabaseFromBackend}
                    displayTheme={displayTheme}
                  />
                </div>
              )}

              {activeTab === 'hypothesis' && (
                <HypothesisEngine
                  hypotheses={getAllHypotheses()}
                  onSelectFir={(id) => setInspectedEntity({ id, type: 'fir' })}
                  onSelectPerson={(id) => setInspectedEntity({ id, type: 'person' })}
                />
              )}

              {activeTab === 'graph' && (
                <NetworkGraph
                  firs={firs}
                  persons={persons}
                  relationships={relationships}
                  locations={locations}
                  transactions={transactions}
                  onSelectEntity={(id, type) => setInspectedEntity({ id, type })}
                  selectedEntityId={highlightNodeId}
                  displayTheme={displayTheme}
                />
              )}

              {activeTab === 'library' && (
                <DigitalLibrary
                  firs={firs}
                  displayTheme={displayTheme}
                  onSelectCase={(id, type) => setInspectedEntity({ id, type })}
                />
              )}

              {activeTab === 'jurisdiction' && (
                <JurisdictionDirectory
                  t={t}
                  language={language}
                  firs={firs}
                  onSelectDistrictOnMap={setSelectedDistrict}
                  selectedDistrict={selectedDistrict}
                />
              )}

            </div>
          </section>

          {/* Draggable vertical splitter */}
          <div
            onMouseDown={handleMouseDownSplitter}
            className="w-2 hover:w-3 cursor-col-resize shrink-0 h-full flex items-center justify-center relative group transition-all duration-75 select-none"
            title="Drag left/right to adjust chat layout width"
          >
            <div className="absolute top-0 bottom-0 w-[2px] bg-slate-300/30 group-hover:bg-sky-500/80 transition-colors" />
            <div className="w-4 h-8 rounded bg-slate-800 group-hover:bg-sky-500 flex flex-col gap-0.5 items-center justify-center border border-slate-700 shadow z-10 transition-colors">
              <div className="w-[1.5px] h-3 bg-slate-400 group-hover:bg-slate-950 rounded-full" />
              <div className="w-[1.5px] h-3 bg-slate-400 group-hover:bg-slate-950 rounded-full" />
            </div>
          </div>

          {/* Right Side Chat Copilot */}
          <section 
            id="copilot_pane" 
            style={{ width: `${copilotWidth}px` }} 
            className={`shrink-0 rounded-2xl flex flex-col justify-between overflow-hidden h-full min-h-0 transition-all duration-75 border ${bgCopilot}`}
          >
            
            {/* Chat header banner */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${isPolaris ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800/80'}`}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isPolaris ? 'text-slate-800' : 'text-slate-300'}`}>{t.investigativeChat}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">v2.5 Enhanced</span>
            </div>

            {/* Conversation Messages history block */}
            <div className={`flex-1 p-5 overflow-y-auto space-y-6 min-h-0 ${isPolaris ? 'bg-slate-50/40' : 'bg-[#020617]/20'}`}>
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                const avatarInitials = isUser 
                  ? (userRole === 'Investigator' ? 'VK' : userRole === 'Analyst' ? 'AN' : userRole === 'Supervisor' ? 'SV' : 'PM')
                  : 'AI';

                return (
                  <div key={m.id} className="flex gap-3">
                    
                    {/* Floating initials bubble */}
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold font-mono border ${
                      isUser 
                        ? 'bg-slate-800 text-slate-200 border-slate-700/80' 
                        : 'bg-sky-500 text-white border-transparent shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                    }`}>
                      {avatarInitials}
                    </div>

                    {/* Chat Text Bubble and buttons */}
                    <div className="space-y-3 max-w-[85%] text-left">
                      
                      <div className={`px-4 py-3 rounded-2xl rounded-tl-none text-xs leading-relaxed font-sans ${
                        isUser 
                          ? 'bg-slate-800 text-slate-100 border border-slate-700/30 shadow-sm shadow-slate-900/10' 
                          : 'bg-sky-500/10 border border-sky-500/20 text-sky-900 dark:text-sky-100 shadow-[0_0_15px_rgba(14,165,233,0.03)]'
                      }`}>
                        <p className="white-space-pre-wrap">{m.content}</p>
                      </div>

                      {/* Cite button triggers if entity links exist */}
                      {m.entityLinks && m.entityLinks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {m.entityLinks.map((link) => (
                            <div key={link.id} className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-[10px] font-mono text-slate-200">
                              <span className="text-slate-400 mr-2 uppercase font-bold">{link.id}</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    setActiveTab('graph');
                                    setHighlightNodeId(link.id);
                                    showToast(`Node ${link.id} highlighted in 3D graph.`);
                                  }}
                                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700/80 rounded font-bold uppercase transition-all cursor-pointer text-[9px]"
                                >
                                  Loc Graph
                                </button>
                                <button
                                  onClick={() => setInspectedEntity({ id: link.id, type: link.type })}
                                  className="px-2 py-0.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded font-bold uppercase transition-all cursor-pointer text-[9px]"
                                >
                                  Briefing
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

              {/* Chat Loading skeleton status */}
              {chatLoading && (
                <div className="flex gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-sky-500/40 animate-pulse flex items-center justify-center text-[10px] font-bold text-white font-mono">
                    AI
                  </div>
                  <div className={`p-4 rounded-xl flex items-center gap-3 max-w-sm border ${isPolaris ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] font-mono text-slate-500">Retrieving FIR files...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Tags and Quick Prompts */}
            <div className={`p-4 border-t shrink-0 ${isPolaris ? 'bg-slate-50/60 border-slate-100' : 'bg-slate-950/40 border-slate-800/80'}`}>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1.5 bg-slate-900/85 border border-slate-800 hover:border-slate-700 rounded-full text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer font-sans"
                  >
                    💡 {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar Section with voice wave capability */}
            <div className={`p-4 border-t shrink-0 ${isPolaris ? 'bg-white border-slate-100' : 'bg-slate-950 border-slate-800'}`}>
              
              {/* Dynamic waveform visualizer bar */}
              {isListening && (
                <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-3 flex items-center justify-between gap-3 animate-fade-in mb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-sky-400 animate-pulse shrink-0" />
                    <span className="text-[10px] font-mono text-sky-400 animate-pulse uppercase font-bold">Listening for commander...</span>
                  </div>
                  <div className="flex gap-0.5 items-end h-6 shrink-0">
                    {voiceWave.map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-sky-400 transition-all duration-100"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="relative flex items-center">
                
                {/* Voice toggle trigger */}
                <button
                  onClick={toggleVoiceInput}
                  className={`absolute left-4 p-1 rounded hover:bg-slate-850 transition-all cursor-pointer ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-500 hover:text-white'}`}
                  title="Voice Command input"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={isListening ? 'Listening...' : t.searchPlaceholder}
                  disabled={isListening}
                  className={`w-full border rounded-xl py-3.5 pl-12 pr-16 text-xs focus:outline-none focus:border-sky-500 transition-colors shadow-inner ${
                    isPolaris 
                      ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' 
                      : 'bg-slate-950 border-slate-700/80 text-slate-200 placeholder-slate-500'
                  }`}
                />

                <div className="absolute right-3 flex gap-2">
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isListening}
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-shadow shadow-lg disabled:opacity-40"
                  >
                    ↗
                  </button>
                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

      {/* Floating global footer status banner */}
      <footer className="absolute bottom-0 right-0 left-64 bg-slate-950/80 border-t border-slate-900/80 px-6 py-1.5 flex justify-between items-center text-[9px] font-mono text-slate-600 select-none z-10">
        <span>TACTICAL DATABASE SECURED BY KSP GRID SECURITIES</span>
        <span>LATENCY: 14ms // RECONSTRUCTION DELTA ACCURATE</span>
      </footer>

      {/* Sliding Audit logs Drawer */}
      <AuditLogDrawer
        logs={auditLogs}
        isOpen={showAuditLogs}
        onClose={() => setShowAuditLogs(false)}
      />

      {/* Case summary / Decision inspector modal */}
      {inspectedEntity && (
        <CaseSummaryModal
          entityId={inspectedEntity.id}
          entityType={inspectedEntity.type}
          userRole={userRole}
          isOpen={true}
          onClose={() => setInspectedEntity(null)}
          onRefreshData={fetchDatabaseFromBackend}
        />
      )}

      {/* Glowing Floating Alert Banner for Dossier Saves */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-sky-500/40 text-slate-200 text-xs font-mono px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-fade-in backdrop-blur">
          <div className="bg-sky-500/10 p-1 rounded">
            <Compass className="w-4 h-4 text-sky-400 animate-spin" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
