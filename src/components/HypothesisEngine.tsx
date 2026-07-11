/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ThumbsUp, ThumbsDown, BookOpen, AlertCircle } from 'lucide-react';
import { Hypothesis } from '../types';

interface HypothesisEngineProps {
  hypotheses: Hypothesis[];
  onSelectFir: (id: string) => void;
  onSelectPerson: (id: string) => void;
}

export default function HypothesisEngine({ hypotheses, onSelectFir, onSelectPerson }: HypothesisEngineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const theoryColors: Record<string, string> = {
    'Routine Activity Theory': 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/5',
    'Rational Choice Theory': 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/5',
    'Social Disorganization Theory': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
  };

  const theoryExplanations: Record<string, string> = {
    'Routine Activity Theory': 'Requires three elements: a motivated offender, a suitable target, and the absence of a capable guardian. Our algorithm computes spatio-temporal convergence windows.',
    'Rational Choice Theory': 'Frames criminal acts as purposive, rational, utility-maximizing calculations where risks are weighed against payoffs. Evaluated based on specific MO signature similarities.',
    'Social Disorganization Theory': 'Links ecological variables (unemployment, population density, urbanization) directly to neighborhood delinquency levels.'
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => ({ ...prev, [id]: type }));
    // Post to audit logs or local notification
  };

  return (
    <div id="hypothesis_engine_root" className="space-y-4">
      {/* Flagship Header with Futuristic Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500/15 p-2 rounded-lg border border-sky-500/30">
            <Sparkles className="w-5 h-5 text-sky-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
              COGNITIVE HYPOTHESIS SUITE
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Generates explainable, groundable investigative reasoning anchored in academic criminological theories.
            </p>
          </div>
        </div>
        <div className="mt-3 md:mt-0 bg-slate-950 px-3 py-1 rounded border border-slate-800 flex items-center gap-2 text-[10px] font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">STATUS:</span>
          <span className="text-emerald-400 font-bold">100% EXPLAINABLE HEURISTICS</span>
        </div>
      </div>

      {/* Grid of Theory Hypotheses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hypotheses.map((hyp, index) => {
          const isExpanded = expandedId === hyp.id;
          const userFeedback = feedback[hyp.id];

          return (
            <div
              key={hyp.id}
              id={`hyp_card_${hyp.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group"
            >
              {/* Highlight Rank Indicator */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500 group-hover:bg-sky-400 transition-colors" />

              <div>
                <div className="flex items-start justify-between mb-3 pl-2">
                  <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${theoryColors[hyp.theory]}`}>
                    {hyp.theory}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Confidence</span>
                    <span className="text-sm font-bold font-mono text-sky-400">{hyp.confidence_score}%</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-200 font-mono tracking-wide mb-3 pl-2 uppercase">
                  {index + 1}. {hyp.title}
                </h4>

                {/* Evidence citation bullets */}
                <div className="bg-slate-950/70 rounded-lg p-3.5 border border-slate-800 space-y-2 mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-sky-400" /> Grounded Evidence Trail
                  </span>
                  <ul className="space-y-1.5">
                    {hyp.supporting_evidence.map((evidence, idx) => (
                      <li key={idx} className="text-[10.5px] text-slate-300 font-mono flex items-start gap-1 leading-relaxed">
                        <span className="text-sky-500 select-none mr-1">»</span>
                        <span>
                          {/* Detect specific FIR or person names in evidence to make clickable */}
                          {evidence.split(' ').map((word, wIdx) => {
                            const trimmed = word.replace(/[(),]/g, '');
                            if (trimmed.startsWith('FIR-')) {
                              return (
                                <button
                                  key={wIdx}
                                  onClick={() => onSelectFir(trimmed)}
                                  className="text-sky-400 underline font-bold hover:text-sky-300 bg-sky-950/40 px-1 py-0.2 rounded mx-0.5"
                                >
                                  {word}
                                </button>
                              );
                            }
                            if (trimmed.startsWith('PER-')) {
                              return (
                                <button
                                  key={wIdx}
                                  onClick={() => onSelectPerson(trimmed)}
                                  className="text-sky-400 underline font-bold hover:text-sky-300 bg-sky-950/40 px-1 py-0.2 rounded mx-0.5"
                                >
                                  {word}
                                </button>
                              );
                            }
                            return word + ' ';
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action and feedback buttons */}
              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between mt-auto">
                {/* Expand Button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : hyp.id)}
                  className="text-[10.5px] font-mono font-bold uppercase text-slate-400 hover:text-sky-400 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isExpanded ? 'Hide Reasoning' : 'Expand Reasoning'}
                </button>

                {/* Feedback pill */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => handleFeedback(hyp.id, 'up')}
                    title="Hypothesis is logically sound and fits findings"
                    className={`p-1.5 rounded transition-colors ${userFeedback === 'up' ? 'bg-sky-500 text-slate-900 font-bold' : 'text-slate-500 hover:text-sky-400'}`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback(hyp.id, 'down')}
                    title="Hypothesis is weak or lacks context"
                    className={`p-1.5 rounded transition-colors ${userFeedback === 'down' ? 'bg-rose-500 text-slate-950 font-bold' : 'text-slate-500 hover:text-rose-400'}`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded Reasoning Module */}
              {isExpanded && (
                <div className="mt-4 border-t border-slate-800 pt-4 space-y-3 animate-fade-in">
                  <div className="bg-sky-950/20 rounded border border-sky-800/40 p-3">
                    <span className="text-[10px] uppercase font-bold text-sky-400 font-mono tracking-wider block mb-1">
                      Theoretical Framework:
                    </span>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                      {theoryExplanations[hyp.theory]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                      Mathematical / Narrative Logic Applied:
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      {hyp.reasoning}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
