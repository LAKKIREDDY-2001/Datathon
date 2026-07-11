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
}

export default function CaseSummaryModal({ entityId, entityType, userRole, isOpen, onClose }: CaseSummaryModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !entityId) return;
    
    setLoading(true);
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
  }, [entityId, entityType, userRole, isOpen]);

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
                <div className="h-4 bg-slate-800 rounded.w-1/4" />
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
