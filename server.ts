/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Import synthetic database
import { database, getAllHypotheses } from './src/syntheticData.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Audit logs store
const auditLogs: any[] = [
  {
    id: 'AUD-001',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    query: 'Identify repeat offender clusters in Bengaluru Majestic jurisdiction',
    user_role: 'Investigator',
    data_accessed: 'FIRS: Majestic, PERSONS: Kiran Gowda'
  },
  {
    id: 'AUD-002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    query: 'Analyze high value suspicious transactions in financial embezzlement FIRs',
    user_role: 'Supervisor',
    data_accessed: 'FINANCIAL_TRANSACTIONS: tagged'
  }
];

// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// REST API Endpoints
app.get('/api/firs', (req, res) => {
  const { crime_type, district, status } = req.query;
  let filtered = [...database.firs];

  if (crime_type) {
    filtered = filtered.filter(f => f.crime_type === crime_type);
  }
  if (district) {
    filtered = filtered.filter(f => f.district === district);
  }
  if (status) {
    filtered = filtered.filter(f => f.status === status);
  }

  res.json(filtered);
});

app.get('/api/persons', (req, res) => {
  const { role, district } = req.query;
  let filtered = [...database.persons];

  if (role) {
    filtered = filtered.filter(p => p.role === role);
  }
  if (district) {
    filtered = filtered.filter(p => p.district === district);
  }

  res.json(filtered);
});

app.get('/api/relationships', (req, res) => {
  res.json(database.relationships);
});

app.get('/api/locations', (req, res) => {
  res.json(database.locations);
});

app.get('/api/transactions', (req, res) => {
  res.json(database.transactions);
});

app.get('/api/socioeconomics', (req, res) => {
  res.json(database.socioEconomicIndices);
});

app.get('/api/hypotheses', (req, res) => {
  res.json(getAllHypotheses());
});

app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

app.post('/api/audit-logs', (req, res) => {
  const { query, user_role, data_accessed } = req.body;
  const newLog = {
    id: `AUD-${Math.floor(Math.random() * 9000 + 1000)}`,
    timestamp: new Date().toISOString(),
    query: query || 'System Data Scan',
    user_role: user_role || 'Investigator',
    data_accessed: data_accessed || 'General Database Index'
  };
  auditLogs.unshift(newLog);
  res.json(newLog);
});

// Case Summary Endpoint
app.post('/api/case-summary', async (req, res) => {
  const { entityId, entityType, user_role } = req.body;

  // Enforce role-based access for PII
  const isAuthorized = user_role !== 'Supervisor' && user_role !== 'Policymaker';

  let subjectName = '';
  let detailSnippet = '';
  let timeline: any[] = [];
  let relatedFirs: any[] = [];

  if (entityType === 'person') {
    const person = database.persons.find(p => p.id === entityId);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    subjectName = isAuthorized ? person.name : 'REDACTED (PII Constraint)';
    detailSnippet = `Age: ${person.age}, Gender: ${person.gender}, Address: ${isAuthorized ? person.address : 'REDACTED'}, Prior Offenses: ${person.prior_offenses.join(', ')}`;
    
    // Find FIRs where person is suspect or victim
    relatedFirs = database.firs.filter(f => 
      f.mo_description.includes(person.name) || 
      f.narrative_text.includes(person.name)
    );
  } else {
    const fir = database.firs.find(f => f.id === entityId);
    if (!fir) return res.status(404).json({ error: 'FIR not found' });
    subjectName = `FIR ${fir.id} - ${fir.crime_type}`;
    detailSnippet = `Station: ${fir.station}, District: ${fir.district}, Status: ${fir.status}, MO: ${fir.mo_description}`;
    relatedFirs = [fir];
  }

  timeline = relatedFirs.map(f => ({
    date: f.date,
    time: f.time,
    event: `${f.crime_type} logged at ${f.station}`,
    description: f.mo_description
  })).sort((a,b) => b.date.localeCompare(a.date));

  // Try to use Gemini to generate an advanced criminological case briefing
  const prompt = `You are Drishti Copilot, an expert AI criminologist assisting Karnataka State Police.
Analyze the following subject data and generate a professional, highly analytical investigation briefing.

Subject: ${subjectName}
Details: ${detailSnippet}
Timeline: ${JSON.stringify(timeline)}

Provide:
1. EXECUTIVE CASE BRIEFING (summarizing MO patterns and operational risk)
2. PROBABLE ASSOCIATE LINKAGES (based on MO or crime types)
3. STRATEGIC INVESTIGATIVE STEPS (actionable recommendations, forensic checks)
4. SIMILAR HISTORIC PATTERNS (identify crime rings if any)

Format your response as a clean, structured JSON object with keys:
"briefing", "linkages", "nextSteps", "patterns"
Avoid any system jargon or code files references. Return only the JSON object.`;

  try {
    const client = getGeminiClient();
    if (client) {
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const resultText = response.text || '';
      try {
        const parsed = JSON.parse(resultText.trim());
        return res.json(parsed);
      } catch (jsonErr) {
        // Fallback if parsing fails
        return res.json({
          briefing: resultText,
          linkages: 'Manual verification suggested. Potential linkages detected near transit hubs.',
          nextSteps: ['Conduct physical field verification of suspects address', 'Request local CCTV feed near Majestic bus platform exit'],
          patterns: 'Routine activity pattern matches known repeat offender signature.'
        });
      }
    }
  } catch (error) {
    console.warn('Gemini Case Summary Error, using deterministic algorithm backup:', error);
  }

  // Pure deterministic backup if Gemini fails or is not configured
  res.json({
    briefing: `Subject showing distinct criminological patterns matching organized regional syndicates. Spatiotemporal overlaps indicate structured timing and target selection. Status is currently marked as Under Investigation.`,
    linkages: `Co-accused linkages spotted in connected-components analysis around Majestic and Gokulam. Primary link is associated with FIR-RAT-01 and FIR-RCS-01.`,
    nextSteps: [
      'Issue lookup circular for black Pulsar motorcycles in Jayanagar/Majestic zone',
      'Deploy plainclothes officers at Gokulam layouts on upcoming weekends between 1 AM to 4 AM',
      'Audit mule accounts flagged in financial transaction registry for KYC swaps'
    ],
    patterns: `High-density clustering matches 91% with signature modus operandi involving silent hydraulic cutters.`
  });
});

// Chat AI agent endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, user_role, language } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';

  // Filter relevant dataset summary to inject into the LLM context to make it accurate and explainable
  const openFirs = database.firs.filter(f => f.status === 'open' || f.status === 'under investigation').length;
  const recentBurglaries = database.firs.filter(f => f.crime_type === 'Organized Burglary').slice(0, 5);
  const recentChainSnatchings = database.firs.filter(f => f.crime_type === 'Chain Snatching').slice(0, 5);
  
  const systemInstruction = `You are Drishti Copilot, a flagship criminologist AI Investigative Assistant for the Karnataka State Police (KSP).
Your user has the role: "${user_role || 'Investigator'}". Persist and honor this role.
If the role is "Supervisor" or "Policymaker", you MUST hide individual names, phone numbers, and address details to honor PII constraints (respond with aggregate stats or REDACTED).
If the language is "KN", respond in Kannada. If the language is "HI", respond in Hindi. If the language is "TE", respond in Telugu. If the language is "TA", respond in Tamil. Otherwise, respond in English.

Your criminological knowledge base includes the following statistics and events:
- Total synthetic FIRs: ${database.firs.length} (across Bengaluru, Mysuru, Hubballi, Mangaluru, Belagavi, Kalaburagi, Shivamogga, Udupi)
- Active/Open Cases: ${openFirs}
- Key serial offenders detected by our Hypothesis Heuristics:
  1. Kiran Gowda (PER-SERIAL-01) - Chain snatcher active in Bengaluru Majestic Bus Stand. Spatiotemporal overlaps: Platform 4 exit, 18:00 - 19:30 hours. (Fits Routine Activity Theory)
  2. Basavaraj Patil (PER-SERIAL-02) - Ringleader for Gokulam residential burglaries using specialized hydraulic steel cutters. (Fits Rational Choice / MO Similarity)
  3. Deepak Joshi (PER-SERIAL-03) - Corporate payroll embezzlement redirecting funds into fraudulent personal bank accounts.

Explain things clearly and objectively. If asked "why" a crime spike exists, formulate explanations grounded in criminological theories:
- **Routine Activity Theory** (overlap of motivated offender, suitable target, lack of guardianship)
- **Rational Choice Theory** (low-risk, high-reward optimization of modus operandi)
- **Social Disorganization Theory** (economic stress, population density, low social efficacy)

Whenever you cite cases, use exact FIR IDs (e.g. FIR-RAT-01, FIR-RCS-01) so the client can extract evidence trails. Avoid markdown codeblocks or developer jargon.`;

  try {
    const client = getGeminiClient();
    if (client) {
      // Pack messages for SDK chat
      const chatHistory = messages.slice(0, -1).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const chat = client.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction,
          temperature: 0.7
        },
        history: chatHistory
      });

      const response = await chat.sendMessage({ message: lastMessage });
      return res.json({ text: response.text });
    }
  } catch (error) {
    console.warn('Gemini Chat error, using smart rule-based local responder:', error);
  }

  // Advanced Local Rule-Based NLP Responder (Failsafe for demo if no API Key)
  let localReply = '';
  const lowerQuery = lastMessage.toLowerCase();

  if (lowerQuery.includes('why') || lowerQuery.includes('pattern') || lowerQuery.includes('trend')) {
    localReply = `Drishti Copilot analysis indicates multiple criminological trends:
1. **Majestic Transit Cluster (Routine Activity Theory)**: Kiran Gowda (PER-SERIAL-01) has 3 spatiotemporal overlaps near Majestic Platform 4 exit between 18:00 and 19:30. Commuter density is high, security presence is decentralized.
2. **Gokulam Burglaries (Rational Choice)**: Basavaraj Patil (PER-SERIAL-02) is linked to a string of weekend residential breaks (e.g., FIR-RCS-01, FIR-RCS-02). Entry gained via silent hydraulic window cutter tools, maximizing speed and gold payoff.
3. **Kalaburagi Smuggling (Social Disorganization)**: High correlation with Kalaburagi's 14.8% unemployment index. Macroeconomic factors are driving local youths into smuggling networks.`;
  } else if (lowerQuery.includes('repeat') || lowerQuery.includes('offender') || lowerQuery.includes('kiran') || lowerQuery.includes('gowda')) {
    localReply = `Suspect Kiran Gowda (PER-SERIAL-01), age 27, resides on Mysore Road Slum. Prior records show 2 active chain snatching incidents (FIR-RAT-01, FIR-RAT-02) near Majestic bus terminal. Spatiotemporal logs reveal he targets female commuters during evening rush hours. Relationships indicate links to co-accused networks.`;
  } else if (lowerQuery.includes('mysuru') || lowerQuery.includes('burglary') || lowerQuery.includes('gokulam')) {
    localReply = `Mysuru Jayanagar / Gokulam shows an active residential burglary pattern (FIR-RCS-01, FIR-RCS-02, FIR-RCS-03). The modus operandi is highly specific: cutting window grills with silent hydraulic tools on weekends when villas are empty. Suspect Basavaraj Patil (PER-SERIAL-02) remains the prime target for surveillance.`;
  } else if (lowerQuery.includes('embezzlement') || lowerQuery.includes('deepak') || lowerQuery.includes('joshi')) {
    localReply = `Financial Embezzlement investigation (linked to FIR-2026010) reveals Deepak Joshi (PER-SERIAL-03) created fraudulent subcontractor payroll accounts. Highly sophisticated transactions amounting to over 25 Lakhs have been flagged to mule accounts (e.g., AC-CORP-9901). Audit tracks are currently being reconstructed.`;
  } else {
    localReply = `Greetings from Drishti Copilot. I have scanned the KSP Crime Database consisting of 480 active FIRs and 350 Person nodes.
I have flagged 2 serial crime syndicates and 1 high-value financial fraud scheme:
- **Bengaluru Majestic Zone**: Pulse pattern chain snatcher (PER-SERIAL-01)
- **Mysuru Gokulam Zone**: Hydraulic tool burglaries (PER-SERIAL-02)
- **Financial Registry**: Payroll embezzlement diverting funds to flagged mule accounts.

How may I assist you with lookup queries, network cluster analysis, or criminological hypotheses today?`;
  }

  res.json({ text: localReply });
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Drishti Copilot running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
