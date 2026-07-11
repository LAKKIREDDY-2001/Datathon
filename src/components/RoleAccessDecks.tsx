/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  UserPlus, 
  FilePlus, 
  Activity, 
  MapPin, 
  Coins, 
  UserCheck, 
  AlertOctagon, 
  Sparkles, 
  TrendingDown, 
  FileText, 
  CheckCircle2, 
  Users, 
  Zap,
  ChevronRight,
  Printer
} from 'lucide-react';
import { FIR, Person, SocioEconomicIndex } from '../types';

interface RoleAccessDecksProps {
  userRole: 'Investigator' | 'Analyst' | 'Supervisor' | 'Policymaker';
  firs: FIR[];
  persons: Person[];
  socioEconomics: SocioEconomicIndex[];
  onRefreshData?: () => void;
  displayTheme?: 'obsidian' | 'polaris';
}

export default function RoleAccessDecks({
  userRole,
  firs,
  persons,
  socioEconomics,
  onRefreshData,
  displayTheme = 'obsidian'
}: RoleAccessDecksProps) {
  const isPolaris = displayTheme === 'polaris';

  // State-wide feedback toast / message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Common dropdown list
  const districts = ['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Shivamogga', 'Udupi'];

  // Form States: Investigator Add Person
  const [pName, setPName] = useState('');
  const [pRole, setPRole] = useState<'accused' | 'victim' | 'witness'>('accused');
  const [pAge, setPAge] = useState('28');
  const [pGender, setPGender] = useState('Male');
  const [pAddress, setPAddress] = useState('');
  const [pDistrict, setPDistrict] = useState('Bengaluru');
  const [pPriors, setPPriors] = useState('');

  // Form States: Investigator Add FIR
  const [fCrimeType, setFCrimeType] = useState('Organized Burglary');
  const [fStation, setFStation] = useState('');
  const [fDistrict, setFDistrict] = useState('Bengaluru');
  const [fMoDesc, setFMoDesc] = useState('');
  const [fNarrative, setFNarrative] = useState('');
  const [fIpc, setFIpc] = useState('IPC 380, IPC 457');

  // Form States: Analyst Patrol Strategy
  const [aDistrict, setADistrict] = useState('Bengaluru');
  const [aStrategy, setAStrategy] = useState('Saturation Patrol (High Visibility)');

  // Form States: Supervisor Delegate I.O.
  const [sFirId, setSFirId] = useState('');
  const [sIoName, setSIoName] = useState('Insp. K. Kumar');

  // Form States: Supervisor Set Priority
  const [sPriorityFirId, setSPriorityFirId] = useState('');
  const [sPriorityLevel, setSPriorityLevel] = useState<'low' | 'medium' | 'high' | 'escalated'>('high');

  // Form States: Supervisor Issue Warrant
  const [sPersonId, setSPersonId] = useState('');
  const [sWarrantStatus, setSWarrantStatus] = useState<'None' | 'Pending' | 'Approved' | 'Executed'>('Approved');

  // Form States: Policymaker Budget
  const [pBudgetDistrict, setPBudgetDistrict] = useState('Bengaluru');
  const [pBudgetAmount, setPBudgetAmount] = useState('150');
  const [pInfrastructure, setPInfrastructure] = useState('AI-Powered CCTV Array');

  // Load defaults
  useEffect(() => {
    if (firs.length > 0) {
      if (!sFirId) setSFirId(firs[0].id);
      if (!sPriorityFirId) setSPriorityFirId(firs[0].id);
    }
    if (persons.length > 0) {
      const accusedOnly = persons.filter(p => p.role === 'accused');
      if (accusedOnly.length > 0 && !sPersonId) {
        setSPersonId(accusedOnly[0].id);
      } else if (!sPersonId) {
        setSPersonId(persons[0].id);
      }
    }
  }, [firs, persons]);

  // Handle auto-clearing alerts
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  // Investigator action: Add Person
  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName) {
      showError('Please specify name');
      return;
    }
    setLoading(true);
    fetch('/api/investigator/add-person', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: pName,
        role: pRole,
        age: pAge,
        gender: pGender,
        address: pAddress,
        district: pDistrict,
        prior_offenses: pPriors,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showSuccess(`Successfully registered criminal record card for ${data.person.name} (${data.person.id})!`);
          setPName('');
          setPAddress('');
          setPPriors('');
          if (onRefreshData) onRefreshData();
        }
      })
      .catch(err => {
        setLoading(false);
        showError('Failed to register suspect profile.');
        console.error(err);
      });
  };

  // Investigator action: Add FIR
  const handleAddFir = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fStation || !fMoDesc) {
      showError('Station jurisdiction and MO description are required.');
      return;
    }
    setLoading(true);
    fetch('/api/investigator/add-fir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crime_type: fCrimeType,
        station: fStation,
        district: fDistrict,
        mo_description: fMoDesc,
        narrative_text: fNarrative || fMoDesc,
        ipc_sections: fIpc,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showSuccess(`Successfully registered new FIR entry ${data.fir.id}!`);
          setFStation('');
          setFMoDesc('');
          setFNarrative('');
          if (onRefreshData) onRefreshData();
        }
      })
      .catch(err => {
        setLoading(false);
        showError('Failed to file FIR entry.');
        console.error(err);
      });
  };

  // Analyst action: Patrol Strategy
  const handlePatrolStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetch('/api/analyst/patrol-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        district: aDistrict,
        strategy: aStrategy,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showSuccess(`Applied patrol deployment strategy to ${aDistrict}! Socio-economic indicators updated.`);
          if (onRefreshData) onRefreshData();
        }
      })
      .catch(err => {
        setLoading(false);
        showError('Failed to adjust patrol strategy.');
        console.error(err);
      });
  };

  // Supervisor action: Delegate I.O.
  const handleAssignIo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sFirId) {
      showError('Please select a valid FIR ID');
      return;
    }
    setLoading(true);
    fetch('/api/supervisor/assign-io', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firId: sFirId,
        assignedIo: sIoName,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showSuccess(`Case officer updated: ${data.fir.assigned_io} assigned to ${data.fir.id}!`);
          if (onRefreshData) onRefreshData();
        }
      })
      .catch(err => {
        setLoading(false);
        showError('Failed to delegate case officer.');
        console.error(err);
      });
  };

  // Supervisor action: Set priority
  const handleSetPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sPriorityFirId) return;
    setLoading(true);
    fetch('/api/supervisor/priority', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firId: sPriorityFirId,
        priority: sPriorityLevel,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showSuccess(`FIR ${data.fir.id} priority adjusted to ${data.fir.priority.toUpperCase()}!`);
          if (onRefreshData) onRefreshData();
        }
      })
      .catch(err => {
        setLoading(false);
        showError('Failed to alter case priority level.');
        console.error(err);
      });
  };

  // Supervisor action: Warrant Status
  const handleIssueWarrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sPersonId) return;
    setLoading(true);
    fetch('/api/supervisor/warrant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personId: sPersonId,
        warrantStatus: sWarrantStatus,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showSuccess(`Suspect ${data.person.name} judicial warrant status set to: ${data.person.warrant_status.toUpperCase()}!`);
          if (onRefreshData) onRefreshData();
        }
      })
      .catch(err => {
        setLoading(false);
        showError('Failed to issue judicial warrant.');
        console.error(err);
      });
  };

  // Policymaker action: Safety Budget
  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(pBudgetAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showError('Please enter a valid budget amount (in Lakhs).');
      return;
    }
    setLoading(true);
    fetch('/api/policymaker/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        district: pBudgetDistrict,
        budgetAmount: pBudgetAmount,
        infrastructure: pInfrastructure,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showSuccess(`Legislative bill approved! Allocated ₹${parsedAmount} Lakhs Rupees to ${pBudgetDistrict} for ${pInfrastructure}.`);
          if (onRefreshData) onRefreshData();
        }
      })
      .catch(err => {
        setLoading(false);
        showError('Failed to pass state policy budget.');
        console.error(err);
      });
  };

  const handlePrintExecutiveBrief = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const budgetSum = socioEconomics.reduce((acc, curr) => acc + (curr.budget_allocated || 0), 0);
    const activeInfra = socioEconomics.filter(s => s.safety_infrastructure && s.safety_infrastructure.length > 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Drishti Criminology Policy Brief</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { border-bottom: 2px solid #0f172a; padding-bottom: 10px; font-size: 24px; text-transform: uppercase; margin-bottom: 5px; }
            .subtitle { font-size: 11px; font-family: monospace; color: #64748b; margin-bottom: 30px; letter-spacing: 1px; }
            .section { margin-bottom: 25px; }
            h2 { font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; color: #0284c7; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 12px; }
            th { bg-color: #f8fafc; font-weight: bold; }
            .badge { font-family: monospace; font-size: 10px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 3px 6px; border-radius: 4px; }
            .summary-card { background: #f1f5f9; border-left: 4px solid #0f172a; padding: 15px; margin-bottom: 20px; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>DRISHTI EXECUTIVE POLICY BRIEF</h1>
          <div class="subtitle">STATE SECURITY COUNCIL DIRECTIVE / GENERATED: ${new Date().toLocaleString()}</div>
          
          <div class="summary-card">
            <strong>Active Security Budget Pool:</strong> ₹${budgetSum} Lakhs Rupees allocated across key security hubs.<br/>
            <strong>Monitored Districts:</strong> ${socioEconomics.length} Administrative divisions under tactical surveillance.<br/>
            <strong>Active Cases Logged:</strong> ${firs.length} First Information Reports filed.
          </div>

          <div class="section">
            <h2>1. Regional Macro Indicators & Tactical Allocations</h2>
            <table>
              <thead>
                <tr>
                  <th>District</th>
                  <th>Unemployment</th>
                  <th>Density / sq km</th>
                  <th>Budget Allocated</th>
                  <th>Deployed Safety Systems</th>
                  <th>Patrol Mode</th>
                </tr>
              </thead>
              <tbody>
                ${socioEconomics.map(s => `
                  <tr>
                    <td><strong>${s.district}</strong></td>
                    <td>${s.unemployment_rate}%</td>
                    <td>${s.population_density}</td>
                    <td>₹${s.budget_allocated || 0} Lakhs</td>
                    <td>${s.safety_infrastructure?.join(', ') || 'Standard Patrol'}</td>
                    <td><span class="badge">${s.patrol_strategy || 'Default Guard'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section" style="margin-top: 40px; border-top: 1px dashed #94a3b8; padding-top: 20px; font-size: 10px; text-align: center; color: #94a3b8;">
            THIS DOCUMENT IS CONFIDENTIAL FOR KARNATAKA STATE OFFICERS ONLY. DRISHTI DECISION SUITE.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`mt-6 border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
      isPolaris 
        ? 'bg-slate-50 border-slate-200 shadow-lg' 
        : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800/80 shadow-2xl'
    }`}>
      {/* Decorative neon corner glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl select-none pointer-events-none opacity-20 ${
        userRole === 'Investigator' ? 'bg-emerald-400' :
        userRole === 'Analyst' ? 'bg-purple-400' :
        userRole === 'Supervisor' ? 'bg-amber-400' : 'bg-sky-400'
      }`} />

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/60 pb-4 mb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black uppercase tracking-widest border ${
              userRole === 'Investigator' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50' :
              userRole === 'Analyst' ? 'bg-purple-950/40 text-purple-400 border-purple-900/50' :
              userRole === 'Supervisor' ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' :
              'bg-sky-950/40 text-sky-400 border-sky-900/50'
            }`}>
              {userRole} Mode Activated
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h3 className="text-sm font-sans font-extrabold text-slate-100 uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className={`w-4 h-4 ${
              userRole === 'Investigator' ? 'text-emerald-400' :
              userRole === 'Analyst' ? 'text-purple-400' :
              userRole === 'Supervisor' ? 'text-amber-400' : 'text-sky-400'
            }`} />
            {userRole === 'Investigator' && 'Criminal Registry & Interactive Crime Entry Desk'}
            {userRole === 'Analyst' && 'Spatiotemporal Predictive Analysis & Patrol Modeler'}
            {userRole === 'Supervisor' && 'Strategic Case Delegation & Judicial Warrant Station'}
            {userRole === 'Policymaker' && 'State Security Legislative Budget & Policy Council'}
          </h3>
          <p className="text-[11px] text-slate-500 max-w-2xl font-sans">
            {userRole === 'Investigator' && 'Authorized to write suspect cards and register first information reports into the state database. Any entry triggers immediate linkage graphs.'}
            {userRole === 'Analyst' && 'Configure crime pattern mitigation protocols. Adjusting patrols simulates deterrence factors on local crime and unemployment indices.'}
            {userRole === 'Supervisor' && 'Executive delegation center. Change assigned case officers, raise incident priority, and issue judicial warrants on high-risk individuals.'}
            {userRole === 'Policymaker' && 'Establish state funding bills, deploy surveillance networks, and issue certified legislative policy briefings to the state security cabinet.'}
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          {userRole === 'Policymaker' && (
            <button
              onClick={handlePrintExecutiveBrief}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-mono font-bold uppercase transition-all shadow-lg hover:shadow-sky-500/10 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Executive Brief
            </button>
          )}
          {loading && (
            <span className="text-[10px] font-mono text-slate-400 animate-pulse bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Writing State...
            </span>
          )}
        </div>
      </div>

      {/* Global Toast Alert */}
      {successMsg && (
        <div className="mb-6 bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-lg text-xs text-emerald-400 font-mono animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 bg-rose-950/60 border border-rose-500/40 p-3 rounded-lg text-xs text-rose-400 font-mono animate-fade-in flex items-center gap-2">
          <AlertOctagon className="w-4.5 h-4.5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          INVESTIGATOR COMPONENT DECK
      ───────────────────────────────────────────────────────────────── */}
      {userRole === 'Investigator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Form A: Register Suspect */}
          <form onSubmit={handleAddPerson} className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase font-mono text-slate-300">1. Register Suspect Profile Card</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Suspect/Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Kumar"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Judicial Core Role</label>
                <select
                  value={pRole}
                  onChange={(e: any) => setPRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="accused">Accused / Suspect</option>
                  <option value="witness">Witness / Informant</option>
                  <option value="victim">Victim / Petitioner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Age</label>
                <input
                  type="number"
                  value={pAge}
                  onChange={(e) => setPAge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Gender</label>
                <select
                  value={pGender}
                  onChange={(e) => setPGender(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">District & Jurisdiction</label>
              <select
                value={pDistrict}
                onChange={(e) => setPDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
              >
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Local Address / Residence</label>
              <input
                type="text"
                placeholder="e.g. 14th Cross, Majestic Slum Block B"
                value={pAddress}
                onChange={(e) => setPAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Prior Offenses (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Theft, IPC 379, Chain Snatching"
                value={pPriors}
                onChange={(e) => setPPriors(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors shadow-lg"
            >
              Add Criminal Subject Node ➔
            </button>
          </form>

          {/* Form B: File New FIR */}
          <form onSubmit={handleAddFir} className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <FilePlus className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase font-mono text-slate-300">2. Register First Information Report (FIR)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Crime Category</label>
                <select
                  value={fCrimeType}
                  onChange={(e) => setFCrimeType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                >
                  <option value="Organized Burglary">Organized Burglary</option>
                  <option value="Chain Snatching">Chain Snatching</option>
                  <option value="Cyber Fraud">Cyber Fraud</option>
                  <option value="Smuggling">Smuggling</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">District Region</label>
                <select
                  value={fDistrict}
                  onChange={(e) => setFDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                >
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Police Station / Circle Jurisdiction</label>
              <input
                type="text"
                placeholder="e.g. Majestic Police Circle, Bengaluru"
                value={fStation}
                onChange={(e) => setFStation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Indian Penal Code (IPC / BNS) Sections</label>
              <input
                type="text"
                placeholder="e.g. IPC 379, IPC 34"
                value={fIpc}
                onChange={(e) => setFIpc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Modus Operandi Brief Description</label>
              <textarea
                rows={2}
                placeholder="Details of entry, timing, getaway, signatures..."
                value={fMoDesc}
                onChange={(e) => setFMoDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors shadow-lg"
            >
              Log Live FIR Case Entry ➔
            </button>
          </form>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          ANALYST COMPONENT DECK
      ───────────────────────────────────────────────────────────────── */}
      {userRole === 'Analyst' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Form A: Adjust Patrol Allocation */}
          <form onSubmit={handlePatrolStrategy} className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase font-mono text-slate-300">Predictive Patrol Deployment</span>
            </div>

            <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
              Model preventive policing measures by shifting regional patrol patterns. Deploying advanced surveillance or high-frequency beats acts as a crime deterrent factor.
            </p>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Target District</label>
                <select
                  value={aDistrict}
                  onChange={(e) => setADistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                >
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Patrol Strategy Profile</label>
                <select
                  value={aStrategy}
                  onChange={(e) => setAStrategy(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                >
                  <option>Saturation Patrol (High Visibility)</option>
                  <option>CCTV Augmented Surveillance Grid</option>
                  <option>Undercover Decoy Bait Operations</option>
                  <option>Community Trust Policing Beat</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors shadow-lg"
            >
              Enact Patrol Strategy ➔
            </button>
          </form>

          {/* Display B: Co-offender Cluster Detector */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase font-mono text-slate-300">Co-Offender Network Clusters</span>
            </div>

            <p className="text-[10.5px] text-slate-400 font-sans">
              Algorithmic grouping of suspects exhibiting near-identical signatures or shared networks.
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {/* Pre-generated groups based on data */}
              <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-purple-400 font-bold uppercase">Gokulam Burglar Ring</span>
                  <span className="text-slate-500">Confidence: 94%</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Key node <strong>Basavaraj Patil</strong> associated with 3 burglary reports utilizing hydraulic metal cutters during full-moon weekends.
                </p>
                <div className="flex gap-1.5">
                  <span className="text-[8.5px] bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">PER-SERIAL-02</span>
                  <span className="text-[8.5px] bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">FIR-RCS-01</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-purple-400 font-bold uppercase">Majestic Theft Syndicate</span>
                  <span className="text-slate-500">Confidence: 89%</span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Key node <strong>Kiran Gowda</strong> linked via evening spatiotemporal clusters near majestic platform exits. Targets gold chains.
                </p>
                <div className="flex gap-1.5">
                  <span className="text-[8.5px] bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">PER-SERIAL-01</span>
                  <span className="text-[8.5px] bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">FIR-RAT-02</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          SUPERVISOR COMPONENT DECK
      ───────────────────────────────────────────────────────────────── */}
      {userRole === 'Supervisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form A: Assign Case Officer */}
          <form onSubmit={handleAssignIo} className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase font-mono text-slate-300">1. Assign Case Officer (I.O.)</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Delegate an active investigator to lead inquiries for registered FIR files.
              </p>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Case Reference ID</label>
                  <select
                    value={sFirId}
                    onChange={(e) => setSFirId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                  >
                    {firs.map(f => (
                      <option key={f.id} value={f.id}>{f.id} - {f.crime_type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Investigating Officer Name</label>
                  <input
                    type="text"
                    value={sIoName}
                    onChange={(e) => setSIoName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors shadow-lg"
            >
              Delegate Case Officer ➔
            </button>
          </form>

          {/* Form B: Incident priority escalation */}
          <form onSubmit={handleSetPriority} className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase font-mono text-slate-300">2. Incident Severity Priority</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Escalate critical incident priorities to divert municipal safety forces.
              </p>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Target FIR Reference</label>
                  <select
                    value={sPriorityFirId}
                    onChange={(e) => setSPriorityFirId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                  >
                    {firs.map(f => (
                      <option key={f.id} value={f.id}>{f.id} - {f.crime_type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Escalation Threshold</label>
                  <select
                    value={sPriorityLevel}
                    onChange={(e: any) => setSPriorityLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Standard</option>
                    <option value="high">High Strategic Beat</option>
                    <option value="escalated">Escalated Crisis</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors shadow-lg"
            >
              Modify Case Priority ➔
            </button>
          </form>

          {/* Form C: Warrant Issuance */}
          <form onSubmit={handleIssueWarrant} className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase font-mono text-slate-300">3. Issue Arrest / Search Warrant</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Grant formal judicial authorization for searches or arrests of accused suspects.
              </p>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Accused Suspect</label>
                  <select
                    value={sPersonId}
                    onChange={(e) => setSPersonId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                  >
                    {persons.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.id}) - {p.role}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Warrant Judicial Status</label>
                  <select
                    value={sWarrantStatus}
                    onChange={(e: any) => setSWarrantStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs font-mono text-slate-200"
                  >
                    <option value="None">None</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approved / Issued</option>
                    <option value="Executed">Executed</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors shadow-lg"
            >
              Sign Judicial Warrant ➔
            </button>
          </form>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────
          POLICYMAKER COMPONENT DECK
      ───────────────────────────────────────────────────────────────── */}
      {userRole === 'Policymaker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column A: Fiscal Allocation Form */}
          <form onSubmit={handleBudgetSubmit} className="lg:col-span-1 bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Coins className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase font-mono text-slate-300 font-black">Fiscal Allocation Form</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Target District Region</label>
                <select
                  value={pBudgetDistrict}
                  onChange={(e) => setPBudgetDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200"
                >
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Safety Budget Fund (Lakhs ₹)</label>
                <input
                  type="number"
                  value={pBudgetAmount}
                  onChange={(e) => setPBudgetAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Deployed Infrastructure Program</label>
                <select
                  value={pInfrastructure}
                  onChange={(e) => setPInfrastructure(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200"
                >
                  <option>AI-Powered CCTV Array</option>
                  <option>Youth Employment Support Centre</option>
                  <option>Fast-Track Forensic Laboratory</option>
                  <option>Safe Transit Bus Terminals</option>
                  <option>Anti-Fraud Awareness Campaign</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-bold uppercase rounded cursor-pointer transition-colors shadow-lg font-black"
            >
              Approve State Allocation Bill ➔
            </button>
          </form>

          {/* Column B & C: Legislative Briefing Scorecard */}
          <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase font-mono text-slate-300">Karnataka State Security Funding Sheet</span>
            </div>

            <p className="text-[10.5px] text-slate-400 font-sans">
              Review current approved legislative safety allocations, infrastructure deployments, and their projected macro-economic impact on local crime rates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[220px] overflow-y-auto pr-1">
              {socioEconomics.map((s) => {
                const totalAlloc = s.budget_allocated || 0;
                return (
                  <div key={s.district} className="p-3 bg-slate-900 border border-slate-850 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-[10.5px] font-mono">
                      <span className="text-slate-200 font-bold uppercase">{s.district}</span>
                      <span className="text-emerald-400 font-bold">Unemp: {s.unemployment_rate}%</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Fund Pool:</span>
                      <span className="text-sky-300 font-bold">₹{totalAlloc} Lakhs</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8.5px] font-mono text-slate-500 uppercase block">Active Programs:</span>
                      <div className="flex flex-wrap gap-1">
                        {s.safety_infrastructure && s.safety_infrastructure.length > 0 ? (
                          s.safety_infrastructure.map((inf, i) => (
                            <span key={i} className="text-[8.5px] font-mono bg-slate-950 border border-slate-800 text-sky-400 px-1.5 py-0.5 rounded">
                              {inf}
                            </span>
                          ))
                        ) : (
                          <span className="text-[8.5px] font-mono text-slate-600">Standard Safety Patrol</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
