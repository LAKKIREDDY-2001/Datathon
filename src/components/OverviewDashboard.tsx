/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, MapPin, Database, Users, TrendingUp, AlertTriangle, Filter, EyeOff } from 'lucide-react';
import { FIR, Person, SocioEconomicIndex } from '../types';
import { TranslationSet } from '../translations';

interface OverviewDashboardProps {
  firs: FIR[];
  persons: Person[];
  socioEconomics: SocioEconomicIndex[];
  onSelectDistrict: (district: string | null) => void;
  selectedDistrict: string | null;
  userRole: string;
  t: TranslationSet;
}

export default function OverviewDashboard({
  firs,
  persons,
  socioEconomics,
  onSelectDistrict,
  selectedDistrict,
  userRole,
  t
}: OverviewDashboardProps) {
  const [selectedCrimeFilter, setSelectedCrimeFilter] = useState<string | null>(null);


  // Quick stats calculations
  const totalFirs = firs.length;
  const openFirs = firs.filter(f => f.status === 'open').length;
  const investigationFirs = firs.filter(f => f.status === 'under investigation').length;
  const activeSuspects = persons.filter(p => p.role === 'accused').length;

  // Aggregate crimes by type
  const crimeCounts: Record<string, number> = {};
  firs.forEach(f => {
    crimeCounts[f.crime_type] = (crimeCounts[f.crime_type] || 0) + 1;
  });

  const sortedCrimes = Object.entries(crimeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Hardcoded SVG coordinate positions for Karnataka districts in a futuristic layout
  const districtPaths = [
    { name: 'Belagavi', x: 80, y: 110, w: 70, h: 60, color: 'fill-sky-500/10 hover:fill-sky-500/20' },
    { name: 'Hubballi-Dharwad', x: 120, y: 170, w: 60, h: 50, color: 'fill-emerald-500/10 hover:fill-emerald-500/20' },
    { name: 'Kalaburagi', x: 230, y: 60, w: 80, h: 70, color: 'fill-indigo-500/10 hover:fill-indigo-500/20' },
    { name: 'Shivamogga', x: 110, y: 240, w: 55, h: 45, color: 'fill-amber-500/10 hover:fill-amber-500/20' },
    { name: 'Udupi', x: 75, y: 280, w: 40, h: 50, color: 'fill-teal-500/10 hover:fill-teal-500/20' },
    { name: 'Mangaluru', x: 90, y: 340, w: 45, h: 55, color: 'fill-cyan-500/10 hover:fill-cyan-500/20' },
    { name: 'Mysuru', x: 180, y: 390, w: 65, h: 55, color: 'fill-rose-500/10 hover:fill-rose-500/20' },
    { name: 'Bengaluru', x: 230, y: 330, w: 80, h: 60, color: 'fill-blue-500/15 hover:fill-blue-500/30' },
  ];

  return (
    <div id="overview_dashboard_root" className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      
      {/* 1. Key Metrics panel (Bento style) */}
      <div id="metrics_col" className="xl:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase">
            <span>{t.firRegistry}</span>
            <Database className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono text-slate-100">{totalFirs}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{t.loggedCases}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase">
            <span>{t.activeStatus}</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono text-rose-400">{openFirs}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{t.openTrials}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase">
            <span>{t.inSurveillance}</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono text-slate-100">
              {userRole === 'Supervisor' || userRole === 'Policymaker' ? 'REDACTED' : activeSuspects}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">{t.accusedNodes}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase">
            <span>{t.investigations}</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-bold font-mono text-slate-100">{investigationFirs}</span>
            <span className="text-[10px] text-slate-500 block font-mono">{t.activeFieldCases}</span>
          </div>
        </div>

        {/* Top Crimes Breakdown Widgets */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-sky-400" /> {t.heatBreakdown}
            </h4>
            <span className="text-[9px] font-mono text-slate-500">{t.liveDatabaseFeed}</span>
          </div>

          <div className="space-y-2.5">
            {sortedCrimes.map(([type, count]) => {
              const pct = Math.round((count / totalFirs) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-300">{type}</span>
                    <span className="text-sky-400 font-bold">{count} {t.firsShort} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        type === 'Chain Snatching' ? 'bg-rose-500' :
                        type === 'Cyber Fraud' ? 'bg-sky-500' :
                        type === 'Organized Burglary' ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Socio Economic Index Panel */}
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> {t.socioEconomicIndicators}
              </h4>
              <span className="text-[9px] font-mono text-slate-500">{t.districtMacroMetrics}</span>
            </div>

            {/* List the currently selected district or average */}
            <div className="mt-3.5 space-y-2 text-xs font-mono">
              {selectedDistrict ? (
                (() => {
                  const s = socioEconomics.find(idx => idx.district === selectedDistrict);
                  if (!s) return null;
                  return (
                    <div className="space-y-2 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-emerald-400 font-bold uppercase">{s.district} Metrics</span>
                        <span className="text-slate-500">Active Filter</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>{t.unemploymentIndex}</span>
                        <span className="text-white font-bold">{s.unemployment_rate}%</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>{t.populationDensity}</span>
                        <span className="text-white font-bold">{s.population_density}/sq km</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>{t.incomeIndex}</span>
                        <span className="text-white font-bold">{s.avg_income_bracket} Bracket</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-[10.5px] text-slate-400 leading-relaxed font-sans bg-slate-950/50 p-4 rounded-lg border border-slate-800/40">
                  {t.selectDistrictPrompt}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/60 text-[10px] text-slate-500 font-mono text-center">
            {t.sourceCensusData}
          </div>
        </div>

      </div>

      {/* 2. Tactical Interactive SVG Grid Map */}
      <div id="tactical_map_card" className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-400" /> {t.stateTacticalGrid}
            </h4>
            {selectedDistrict && (
              <button
                onClick={() => onSelectDistrict(null)}
                className="text-[9px] font-mono font-bold text-rose-400 underline uppercase cursor-pointer"
              >
                {t.clearMapFilter}
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-sans leading-relaxed">
            {t.interconnectedLayoutText}
          </p>

          {/* Interactive SVG Canvas */}
          <div className="mt-4 bg-slate-950 rounded-lg border border-slate-800/50 relative p-4 flex items-center justify-center overflow-hidden">
            
            {/* Background scanner line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-500/0 via-sky-500/5 to-sky-500/0 h-1/2 w-full top-0 animate-bounce select-none pointer-events-none" />

            <svg viewBox="0 0 380 480" className="w-full max-w-[280px] h-[340px] select-none">
              {/* SVG Map of Karnataka (Futuristic schematic polygons) */}
              <g id="ksp_districts_group">
                {districtPaths.map((d) => {
                  const isSelected = selectedDistrict === d.name;
                  return (
                    <g key={d.name} className="cursor-pointer group" onClick={() => onSelectDistrict(isSelected ? null : d.name)}>
                      {/* District outline box */}
                      <rect
                        x={d.x}
                        y={d.y}
                        width={d.w}
                        height={d.h}
                        rx={8}
                        className={`transition-all duration-300 stroke-slate-800/60 stroke-1 ${d.color} ${isSelected ? 'fill-sky-500/25 stroke-sky-400/80 stroke-2 shadow-lg' : ''}`}
                      />
                      
                      {/* District Text */}
                      <text
                        x={d.x + d.w / 2}
                        y={d.y + d.h / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`font-mono text-[8px] font-semibold tracking-wider transition-colors ${isSelected ? 'fill-white font-bold' : 'fill-slate-400 group-hover:fill-sky-300'}`}
                      >
                        {d.name.split('-')[0]}
                      </text>

                      {/* Hotspot Pulse sonar */}
                      {d.name === 'Bengaluru' && (
                        <g className="pointer-events-none">
                          <circle cx={d.x + 20} cy={d.y + 20} r={4} className="fill-rose-500" />
                          <circle cx={d.x + 20} cy={d.y + 20} r={12} className="fill-none stroke-rose-500 stroke-1 opacity-50 animate-ping" />
                        </g>
                      )}
                      {d.name === 'Mysuru' && (
                        <g className="pointer-events-none">
                          <circle cx={d.x + 15} cy={d.y + 35} r={3} className="fill-rose-500" />
                          <circle cx={d.x + 15} cy={d.y + 35} r={10} className="fill-none stroke-rose-500 stroke-1 opacity-45 animate-ping" />
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* Selected Area Metrics display footer */}
        <div className="mt-4 bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[10.5px]">
          {selectedDistrict ? (
            <div className="flex justify-between items-center">
              <span className="text-sky-400 font-bold uppercase">{t.activeMapFilter}: {selectedDistrict}</span>
              <span className="text-slate-500">
                {t.firsShort}: {firs.filter(f => f.district === selectedDistrict).length}
              </span>
            </div>
          ) : (
            <div className="text-slate-500 text-center">
              {t.tacticalGridActiveAll}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
