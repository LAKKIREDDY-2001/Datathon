/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Building2,
  ChevronDown,
  ChevronRight,
  Globe,
  Users,
  Sprout,
  ShieldAlert,
  FolderKanban,
  Maximize2,
  Minimize2,
  Wind,
  Layers
} from 'lucide-react';
import { KARNATAKA_JURISDICTIONS, DistrictData, MandalData, VillageData } from '../data/jurisdictionData';
import { TranslationSet } from '../translations';
import { FIR } from '../types';

interface JurisdictionDirectoryProps {
  t: TranslationSet;
  language: 'EN' | 'KN' | 'HI' | 'TE' | 'TA';
  firs: FIR[];
  onSelectDistrictOnMap?: (district: string | null) => void;
  selectedDistrict: string | null;
}

export default function JurisdictionDirectory({
  t,
  language,
  firs,
  onSelectDistrictOnMap,
  selectedDistrict: externalSelectedDistrict
}: JurisdictionDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(externalSelectedDistrict || 'Bengaluru');
  const [expandedMandals, setExpandedMandals] = useState<Record<string, boolean>>({
    'Anekal': true,
    'Mysuru Taluk': true,
    'Belagavi Taluk': true
  });
  const [selectedVillage, setSelectedVillage] = useState<VillageData | null>(null);

  // Synchronize externalSelectedDistrict if it changes from the map
  React.useEffect(() => {
    if (externalSelectedDistrict) {
      setSelectedDistrictName(externalSelectedDistrict);
    }
  }, [externalSelectedDistrict]);

  const toggleMandal = (mandalName: string) => {
    setExpandedMandals((prev) => ({
      ...prev,
      [mandalName]: !prev[mandalName]
    }));
  };

  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrictName(districtName);
    setSelectedVillage(null);
    if (onSelectDistrictOnMap) {
      onSelectDistrictOnMap(districtName);
    }
  };

  // Expand all mandals of currently active district
  const handleExpandAll = (mandals: MandalData[]) => {
    const next: Record<string, boolean> = { ...expandedMandals };
    mandals.forEach((m) => {
      next[m.name] = true;
    });
    setExpandedMandals(next);
  };

  // Collapse all mandals of currently active district
  const handleCollapseAll = (mandals: MandalData[]) => {
    const next: Record<string, boolean> = { ...expandedMandals };
    mandals.forEach((m) => {
      next[m.name] = false;
    });
    setExpandedMandals(next);
  };

  // Search filtering logic
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return KARNATAKA_JURISDICTIONS;

    const query = searchQuery.toLowerCase();
    return KARNATAKA_JURISDICTIONS.map((d) => {
      // Filter mandals that contain the village or mandal name, or if district matches query
      const districtMatch = d.name.toLowerCase().includes(query) || (d.name_kn && d.name_kn.includes(query));

      const filteredMandals = d.mandals.map((m) => {
        const mandalMatch = m.name.toLowerCase().includes(query) || (m.name_kn && m.name_kn.includes(query));
        const filteredVillages = m.villages.filter(
          (v) => v.name.toLowerCase().includes(query) || (v.name_kn && v.name_kn.includes(query)) || v.primary_crop.toLowerCase().includes(query) || v.nearest_ps.toLowerCase().includes(query)
        );

        if (mandalMatch || filteredVillages.length > 0) {
          return {
            ...m,
            villages: mandalMatch ? m.villages : filteredVillages
          };
        }
        return null;
      }).filter(Boolean) as MandalData[];

      if (districtMatch || filteredMandals.length > 0) {
        return {
          ...d,
          mandals: districtMatch ? d.mandals : filteredMandals
        };
      }
      return null;
    }).filter(Boolean) as DistrictData[];
  }, [searchQuery]);

  // Statistics
  const totalStats = useMemo(() => {
    let districtsCount = KARNATAKA_JURISDICTIONS.length;
    let mandalsCount = 0;
    let villagesCount = 0;

    KARNATAKA_JURISDICTIONS.forEach((d) => {
      mandalsCount += d.mandals.length;
      d.mandals.forEach((m) => {
        villagesCount += m.villages.length;
      });
    });

    return { districtsCount, mandalsCount, villagesCount };
  }, []);

  const activeDistrictData = useMemo(() => {
    return filteredData.find((d) => d.name === selectedDistrictName) || filteredData[0];
  }, [filteredData, selectedDistrictName]);

  // Calculate local incidents count from our grounded FIR database
  const getIncidentsForDistrict = (districtName: string) => {
    return firs.filter((f) => f.district.toLowerCase().includes(districtName.toLowerCase())).length;
  };

  return (
    <div id="jurisdiction_directory_root" className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-slate-200">
      
      {/* Search Header Banner (Full Span) */}
      <div className="col-span-12 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
              <Globe className="w-5 h-5 text-emerald-400" /> {t.jurisdictionTitle}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
              {t.jurisdictionDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 w-full md:w-80 shadow-inner">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchJurisdictionPlaceholder}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full font-mono"
            />
          </div>
        </div>

        {/* Quick Census Stat Badges */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/60 text-center">
          <div className="bg-slate-950/40 border border-slate-800/50 rounded-lg py-2 px-3">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">{t.totalDistricts}</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{totalStats.districtsCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/50 rounded-lg py-2 px-3">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">{t.totalMandals}</span>
            <span className="text-sm font-mono font-bold text-sky-400">{totalStats.mandalsCount}</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/50 rounded-lg py-2 px-3">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">{t.totalVillages}</span>
            <span className="text-sm font-mono font-bold text-amber-400">{totalStats.villagesCount}</span>
          </div>
        </div>
      </div>

      {/* District Selector Left Rail */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="border-b border-slate-800 pb-2 mb-3">
            <h4 className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              {t.districtLabel} {language === 'EN' ? 'DIRECTORY' : 'ಪಟ್ಟಿ'}
            </h4>
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredData.map((d) => {
              const isActive = selectedDistrictName === d.name;
              const incidents = getIncidentsForDistrict(d.name);
              return (
                <button
                  key={d.name}
                  onClick={() => handleDistrictSelect(d.name)}
                  className={`w-full text-left p-2.5 rounded-lg border font-mono text-xs flex justify-between items-center transition-all ${
                    isActive
                      ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300 font-bold shadow-md'
                      : 'bg-slate-950/60 border-slate-800/70 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div className="leading-tight">
                      <div>{d.name}</div>
                      {d.name_kn && (
                        <div className="text-[9px] text-slate-500 font-normal">{d.name_kn}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px]">
                    <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {d.mandals.length} M
                    </span>
                    {incidents > 0 && (
                      <span className="bg-rose-950/40 border border-rose-800/40 text-rose-400 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        {incidents}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500 font-mono">
                {t.noVillagesFound}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-800/60 p-2.5 rounded-lg text-[9px] font-mono text-slate-500 mt-4 leading-relaxed">
          💡 {t.selectDistrictToExplore}
        </div>
      </div>

      {/* Mandals & Village List Panel */}
      <div className="lg:col-span-8 space-y-4">
        {activeDistrictData ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Active District Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <Layers className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-mono text-slate-200">
                      {activeDistrictData.name} {activeDistrictData.name_kn ? `(${activeDistrictData.name_kn})` : ''}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      HQs: {activeDistrictData.headquarters} // {t.villageWiseList}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExpandAll(activeDistrictData.mandals)}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 px-2 py-1 rounded text-[9px] font-mono text-slate-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-2.5 h-2.5" /> {t.expandAll}
                  </button>
                  <button
                    onClick={() => handleCollapseAll(activeDistrictData.mandals)}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 px-2 py-1 rounded text-[9px] font-mono text-slate-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Minimize2 className="w-2.5 h-2.5" /> {t.collapseAll}
                  </button>
                </div>
              </div>

              {/* Mandal List & Village List */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {activeDistrictData.mandals.map((m) => {
                  const isExpanded = !!expandedMandals[m.name];
                  return (
                    <div key={m.name} className="border border-slate-800 rounded-lg bg-slate-950/40 overflow-hidden">
                      {/* Mandal Collapse Header */}
                      <button
                        onClick={() => toggleMandal(m.name)}
                        className="w-full flex items-center justify-between p-3 bg-slate-950/80 border-b border-slate-800/80 font-mono text-xs text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-sky-400" />
                          <div>
                            <span className="font-bold text-slate-300">{mandalLabel(m.name)}:</span>{' '}
                            <span className="text-sky-400 font-semibold">{m.name}</span>
                            {m.name_kn && (
                              <span className="text-[9px] text-slate-500 ml-1.5">({m.name_kn})</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500">
                          <span className="text-[10px] bg-slate-900 border border-slate-800 px-1.5 py-0.25 rounded">
                            {m.villages.length} Villages
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Villages Inside Mandal in List Format */}
                      {isExpanded && (
                        <div className="p-3 bg-slate-950/20 divide-y divide-slate-900">
                          {m.villages.map((v) => {
                            const isInspected = selectedVillage?.name === v.name;
                            return (
                              <div
                                key={v.name}
                                className={`py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors ${
                                  isInspected ? 'bg-emerald-950/10 -mx-3 px-3' : 'hover:bg-slate-950/30'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    <span className="font-mono font-bold text-slate-200">{v.name}</span>
                                    {v.name_kn && (
                                      <span className="text-[9.5px] text-slate-500">({v.name_kn})</span>
                                    )}
                                  </div>

                                  {/* Demographics / Details columns */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-[10.5px] font-mono text-slate-400">
                                    <div>
                                      <span className="text-slate-600">{t.demographics}</span>{' '}
                                      <span className="text-slate-300 font-bold">{v.population.toLocaleString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-600">{t.primaryCrop}</span>{' '}
                                      <span className="text-slate-300">{v.primary_crop}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-600">{t.elevation}</span>{' '}
                                      <span className="text-slate-300">{v.elevation}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-600">{t.policingStation}</span>{' '}
                                      <span className="text-slate-300">{v.nearest_ps}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedVillage(isInspected ? null : v)}
                                    className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                                      isInspected
                                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    {isInspected ? t.closeDetails : t.viewDetails}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3 mt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-500 gap-2">
              <span>{t.googleDataSourced}</span>
              <span className="bg-emerald-950/20 border border-emerald-900/50 px-2 py-0.5 rounded text-emerald-400">
                ACTIVE COUPLING
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl text-center text-slate-500 font-mono min-h-[460px] flex items-center justify-center">
            {t.selectDistrictToExplore}
          </div>
        )}
      </div>

      {/* Floating Detailed Drawer for Selected Village (Bento style bottom or overlay block) */}
      {selectedVillage && (
        <div className="col-span-12 bg-slate-950 border border-amber-500/30 rounded-xl p-5 shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-amber-400 tracking-widest uppercase">
                {t.detailsForVillage} // GPS GEOLOCATION
              </span>
              <h3 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" /> {selectedVillage.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedVillage(null)}
              className="text-slate-500 hover:text-slate-300 font-mono text-xs uppercase"
            >
              [X] {t.closeDetails}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 font-mono text-[11px] bg-slate-900/60 p-4 rounded-lg border border-slate-900">
            <div>
              <span className="text-slate-500 block uppercase">{t.demographics}</span>
              <span className="text-sm font-bold text-slate-100">{selectedVillage.population.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">{t.primaryCrop}</span>
              <span className="text-sm font-bold text-slate-100">{selectedVillage.primary_crop}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">{t.elevation}</span>
              <span className="text-sm font-bold text-slate-100">{selectedVillage.elevation}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase">{t.policingStation}</span>
              <span className="text-sm font-bold text-slate-100">{selectedVillage.nearest_ps}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Helper to append translations if needed
  function mandalLabel(mName: string) {
    return t.mandalLabel;
  }
}
