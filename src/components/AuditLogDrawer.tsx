/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Calendar, User, Eye, Info, Clock } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditLogDrawerProps {
  logs: AuditLogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditLogDrawer({ logs, isOpen, onClose }: AuditLogDrawerProps) {
  if (!isOpen) return null;

  return (
    <div id="audit_drawer_overlay" className="fixed inset-0 bg-slate-950/80 z-50 flex justify-end backdrop-blur-sm animate-fade-in">
      <div id="audit_drawer_content" className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl justify-between animate-slide-in">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
                SYSTEM AUDIT & ACCESS LOGS
              </h4>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Full ledger of data requests & PII accesses (explainability & accountability compliance).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 font-mono text-sm border border-slate-800 px-2 py-0.5 rounded bg-slate-900 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Chronological logs lists */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[10.5px] font-sans text-slate-400 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              Every database search, entity association analysis, and criminological hypothesis generated is logged in accordance with Karnataka State Police Data Governance Standards. Access is filtered according to officer role clearance.
            </span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                id={`audit_log_item_${log.id}`}
                className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 hover:border-slate-800 space-y-2.5 transition-colors group"
              >
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded">
                      {log.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    log.user_role === 'Supervisor' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    log.user_role === 'Policymaker' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                    'bg-slate-800 text-slate-300 border-transparent'
                  }`}>
                    {log.user_role}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Query / NLP Trigger:</span>
                  <p className="text-[11.5px] text-slate-200 font-sans font-medium group-hover:text-sky-300 transition-colors">
                    "{log.query}"
                  </p>
                </div>

                <div className="bg-slate-900/60 p-2 rounded text-[10.5px] font-mono text-slate-400 border border-slate-800/40 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Data Accessed: <strong className="text-slate-300">{log.data_accessed}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>KSP DRISHTI V2.0 ENGINE</span>
          <span>RECORD COUNT: {logs.length}</span>
        </div>
      </div>
    </div>
  );
}
