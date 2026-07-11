/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ShieldAlert, BookOpen, Clock, Users, ArrowRight, Copy, Check, FileText, AlertTriangle } from 'lucide-react';

interface CaseSummaryModalProps {
  entityId: string;
  entityType: 'person' | 'fir';
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export default function CaseSummaryModal({ entityId, entityType, userRole, isOpen, onClose, onRefreshData }: CaseSummaryModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Administrative panel local states
  const [updatingRole, setUpdatingRole] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [selectedFromFir, setSelectedFromFir] = useState('');
  const [selectedToFir, setSelectedToFir] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSummary = () => {
    if (!entityId) return;
    fetch('/api/case-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityId, entityType, user_role: userRole })
    })
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load case summary:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isOpen || !entityId) return;
    setLoading(true);
    fetchSummary();
  }, [entityId, entityType, userRole, isOpen]);

  // Set default form choices when person data is loaded
  useEffect(() => {
    if (data?.personMeta) {
      if (data.personMeta.associatedFirs && data.personMeta.associatedFirs.length > 0) {
        setSelectedFromFir(data.personMeta.associatedFirs[0].id);
      } else {
        setSelectedFromFir('');
      }
      
      if (data.personMeta.allFirs && data.personMeta.allFirs.length > 0) {
        const nonAssociated = data.personMeta.allFirs.filter(
          (f: any) => !data.personMeta.associatedFirs.some((af: any) => af.id === f.id)
        );
        if (nonAssociated.length > 0) {
          setSelectedToFir(nonAssociated[0].id);
        } else {
          setSelectedToFir(data.personMeta.allFirs[0].id);
        }
      } else {
        setSelectedToFir('');
      }
    }
  }, [data]);

  const handleRoleChange = (newRole: string) => {
    setUpdatingRole(true);
    setSuccessMsg(null);
    fetch(`/api/persons/${entityId}/update-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole, user_role: userRole })
    })
      .then(res => res.json())
      .then(resData => {
        setUpdatingRole(false);
        if (resData.success) {
          setSuccessMsg(`Role successfully updated to ${newRole.toUpperCase()}!`);
          fetchSummary();
          if (onRefreshData) onRefreshData();
          setTimeout(() => setSuccessMsg(null), 4000);
        }
      })
      .catch(err => {
        console.error('Failed to update role:', err);
        setUpdatingRole(false);
      });
  };

  const handleTransferCase = () => {
    if (!selectedFromFir || !selectedToFir) return;
    setTransferring(true);
    setSuccessMsg(null);
    fetch(`/api/persons/${entityId}/transfer-case`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromFirId: selectedFromFir,
        toFirId: selectedToFir,
        user_role: userRole
      })
    })
      .then(res => res.json())
      .then(resData => {
        setTransferring(false);
        if (resData.success) {
          setSuccessMsg(`Person successfully moved from ${selectedFromFir} to ${selectedToFir}!`);
          fetchSummary();
          if (onRefreshData) onRefreshData();
          setTimeout(() => setSuccessMsg(null), 4000);
        }
      })
      .catch(err => {
        console.error('Failed to transfer case:', err);
        setTransferring(false);
      });
  };

  const handleCopy = () => {
    if (!data) return;
    const briefText = `DRISHTI CASE BRIEFING - ${entityId} (${entityType.toUpperCase()})
=======================================
EXECUTIVE SUMMARY:
${data.briefing}

POTENTIAL LINKAGES:
${data.linkages}

INVESTIGATIVE RECOMMENDATIONS:
${Array.isArray(data.nextSteps) ? data.nextSteps.join('\n- ') : data.nextSteps}

PATTERN SYNDICATE SIMILARITIES:
${data.patterns}
=======================================
CONFIDENTIAL // KSP INTERNAL USE ONLY`;
    
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div id="case_summary_overlay" className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div id="case_summary_modal" className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col justify-between overflow-hidden shadow-2xl relative">
        
        {/* Glow Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-rose-500 to-indigo-500" />

        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500/15 p-2 rounded-lg border border-sky-500/30">
              <FileText className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-900">
                  {entityType} BRIEF
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  {entityId}
                </span>
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide mt-1">
                Tactical Investigator Decision Support
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={loading}
              className="text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 p-2 rounded bg-slate-900 flex items-center gap-1 text-[11px] font-mono cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Briefing' : 'Copy Brief'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white border border-slate-800 p-2 rounded bg-slate-900 font-mono text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            // Animated Skeletal Skeletons
            <div className="space-y-6 animate-pulse">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-5/6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-800 rounded w-5/6" />
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-800 rounded w-5/6" />
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-800 rounded w-4/5" />
                <div className="h-3 bg-slate-800 rounded w-3/4" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Role-Based Clearance Indicator */}
              {(userRole === 'Supervisor' || userRole === 'Policymaker') && (
                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-[11px] text-amber-400 font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    SUPREME POLICING GOVERNANCE SAFEGUARD ACTIVE: PII metrics (Accused Names, Slum Addresses) have been automatically masked to comply with supervisor-level oversight laws.
                  </span>
                </div>
              )}

              {/* ⚖️ ADMINISTRATIVE ACTION PANEL (Role Reclassification & File Transfers) */}
              {entityType === 'person' && data?.personMeta && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/5 rounded-full blur-lg" />
                  
                  {/* Panel Title */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-200 font-mono flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-sky-400" />
                      Investigator Action Deck (Reclassification & Transfer File)
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                      Authorized Active Level
                    </span>
                  </div>

                  {/* Feedback Status */}
                  {successMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-xs text-emerald-400 font-mono animate-fade-in flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                    
                    {/* Action A: Role Reclassification */}
                    <div className="space-y-2.5">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase">1. Reclassify Person Role</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Change current security/judicial role for <strong>{data.personMeta.name}</strong>. This updates network nodes and logs a security audit log.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10.5px] font-mono text-slate-400 mr-2">Current Role:</span>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase border ${
                          data.personMeta.role === 'accused' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                          data.personMeta.role === 'victim' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                          'bg-slate-700/15 text-slate-300 border-slate-700/30'
                        }`}>
                          {data.personMeta.role}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {['accused', 'victim', 'witness'].map((roleOpt) => {
                          const isCurrent = data.personMeta.role === roleOpt;
                          return (
                            <button
                              key={roleOpt}
                              onClick={() => handleRoleChange(roleOpt)}
                              disabled={updatingRole || isCurrent}
                              className={`flex-1 py-1.5 px-3 rounded text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                isCurrent 
                                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-60' 
                                  : 'bg-sky-950/40 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              }`}
                            >
                              {roleOpt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action B: Case File Transfer */}
                    <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase">2. Move Case Association</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Transfer this individual's legal linkage from their current case folder (FIR file) to another ongoing investigation.
                          </p>
                        </div>

                        {data.personMeta.associatedFirs && data.personMeta.associatedFirs.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-slate-500 uppercase">Transfer From File:</label>
                              <select
                                value={selectedFromFir}
                                onChange={(e) => setSelectedFromFir(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-sky-500"
                              >
                                {data.personMeta.associatedFirs.map((af: any) => (
                                  <option key={af.id} value={af.id}>{af.label}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-slate-500 uppercase">Transfer To File:</label>
                              <select
                                value={selectedToFir}
                                onChange={(e) => setSelectedToFir(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-sky-500"
                              >
                                {data.personMeta.allFirs
                                  .filter((f: any) => f.id !== selectedFromFir)
                                  .map((f: any) => (
                                    <option key={f.id} value={f.id}>{f.label}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] font-mono text-amber-500 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded">
                            NO ACTIVE FIR ASSOCIATION FOUND. Supplementary case linking must be registered first.
                          </div>
                        )}
                      </div>

                      {data.personMeta.associatedFirs && data.personMeta.associatedFirs.length > 0 && (
                        <button
                          onClick={handleTransferCase}
                          disabled={transferring || !selectedFromFir || !selectedToFir}
                          className="w-full mt-3 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-mono font-bold text-[11px] uppercase rounded cursor-pointer transition-all border border-transparent shadow-lg text-center"
                        >
                          {transferring ? 'Executing Case Shift...' : 'Shift Case File Association ➔'}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Summary Block */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-400" /> Executive Case Briefing (Explainable AI Core)
                </span>
                <p className="text-[12px] text-slate-300 font-sans leading-relaxed">
                  {data.briefing}
                </p>
              </div>

              {/* Grid panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Linkages */}
                <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-400" /> Probable Associate Linkages
                  </span>
                  <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">
                    {data.linkages}
                  </p>
                </div>

                {/* Crime similarities */}
                <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> Pattern Syndicate Similarities
                  </span>
                  <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">
                    {data.patterns}
                  </p>
                </div>
              </div>

              {/* Recommendations Timeline */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" /> Strategic Investigative Recommendations (Next Steps)
                </span>
                <div className="space-y-2">
                  {Array.isArray(data.nextSteps) ? (
                    data.nextSteps.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                        <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">{data.nextSteps}</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-[9px] font-mono text-slate-500 flex justify-between">
          <span>CONFIDENTIAL // STATE CRIME LEDGER EXCLUSIVES</span>
          <span>SYSTEM ACCELERATOR ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
