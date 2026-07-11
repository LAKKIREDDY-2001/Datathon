/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Shield, Award, Scale, CheckCircle, FileText, ExternalLink } from 'lucide-react';
import { database } from '../syntheticData';
import { FIR } from '../types';

interface DigitalLibraryProps {
  firs: FIR[];
  displayTheme: 'obsidian' | 'polaris';
  onSelectCase: (id: string, type: 'person' | 'fir') => void;
}

interface LawArticle {
  id: string;
  title: string;
  category: 'Constitution' | 'IPC' | 'BNS' | 'Karnataka Police Act';
  sectionCode: string;
  description: string;
  keyProvision: string;
  penalty?: string;
}

export default function DigitalLibrary({ firs, displayTheme, onSelectCase }: DigitalLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLaw, setSelectedLaw] = useState<LawArticle | null>(null);

  // Core Legal Database
  const lawDatabase: LawArticle[] = [
    {
      id: 'CONST-14',
      title: 'Equality before Law',
      category: 'Constitution',
      sectionCode: 'Article 14',
      description: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
      keyProvision: 'Prevents discrimination in the registration of cases and guarantees equal investigation standards for all citizens regardless of status.'
    },
    {
      id: 'CONST-19',
      title: 'Protection of Certain Rights regarding Freedom of Speech',
      category: 'Constitution',
      sectionCode: 'Article 19',
      description: 'Guarantees citizens freedom of speech, peaceful assembly, association, and movement throughout India.',
      keyProvision: 'Protects the right of citizens to report misconduct, assemble peacefully, and cooperate with law enforcement without fear.'
    },
    {
      id: 'CONST-21',
      title: 'Protection of Life and Personal Liberty',
      category: 'Constitution',
      sectionCode: 'Article 21',
      description: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
      keyProvision: 'The absolute foundation of fair trial, humane interrogation, and prompt presentation before the judiciary.'
    },
    {
      id: 'CONST-22',
      title: 'Protection against Arrest and Detention',
      category: 'Constitution',
      sectionCode: 'Article 22',
      description: 'No person who is arrested shall be detained in custody without being informed of the grounds for arrest, nor shall he be denied the right to consult a legal practitioner of his choice.',
      keyProvision: 'Requires that every arrested person must be produced before the nearest magistrate within 24 hours of arrest.'
    },
    {
      id: 'IPC-379-BNS-303',
      title: 'Theft / Snatching Offences',
      category: 'IPC',
      sectionCode: 'IPC Sec 379 / Sec 303 BNS',
      description: 'Deals with the punishment for committing theft or snatching in public places, transit zones, or residential quarters.',
      keyProvision: 'Applicable to chain-snatching and vehicle theft cases across the state.',
      penalty: 'Imprisonment of either description for a term which may extend to 3 years, or with fine, or with both.'
    },
    {
      id: 'IPC-420-BNS-318',
      title: 'Cheating and Dishonestly Inducing Delivery of Property',
      category: 'IPC',
      sectionCode: 'IPC Sec 420 / Sec 318 BNS',
      description: 'Criminalizes cheating, fraudulent misrepresentation, and dishonestly inducing any person to deliver property.',
      keyProvision: 'The primary penal provision applied to digital banking scams, SIM swap fraud, and lottery scams.',
      penalty: 'Imprisonment for a term which may extend to 7 years, and shall also be liable to fine.'
    },
    {
      id: 'IPC-457-BNS-331',
      title: 'Lurking House-Trespass or House-Breaking',
      category: 'IPC',
      sectionCode: 'IPC Sec 457 / Sec 331 BNS',
      description: 'Deals with house-breaking by night or lurking house-trespass to commit offences punishable with imprisonment.',
      keyProvision: 'Applied to organized house burglary syndicates operating in residential layouts.',
      penalty: 'Imprisonment of either description for a term which may extend to 5 years, and also liable to fine.'
    },
    {
      id: 'IPC-409-BNS-316',
      title: 'Criminal Breach of Trust by Public Servant, Banker, or Agent',
      category: 'IPC',
      sectionCode: 'IPC Sec 409 / Sec 316 BNS',
      description: 'Deals with misappropriation of funds or criminal breach of trust by persons entrusted with valuable assets in corporate, banking, or government bodies.',
      keyProvision: 'Applied to financial embezzlement schemes, payroll fraud, and accounts siphoning.',
      penalty: 'Imprisonment for life, or with imprisonment of either description for a term which may extend to 10 years, and fine.'
    },
    {
      id: 'IT-66D',
      title: 'Cheating by Impersonation using Computer Resources',
      category: 'BNS',
      sectionCode: 'IT Act Sec 66D',
      description: 'Punishes anyone who, by means of any communication device or computer resource, cheats by impersonation.',
      keyProvision: 'Applied in cyber-crime cases where fraudsters pose as bank officers or authorities on Telegram/AnyDesk.',
      penalty: 'Imprisonment of either description for a term which may extend to 3 years and fine up to 1 Lakh INR.'
    },
    {
      id: 'KSP-ACT-4',
      title: 'Duties of Police Officers to Prevent Crime',
      category: 'Karnataka Police Act',
      sectionCode: 'Section 4 KSP Act',
      description: 'Defines the legal powers and duties of police officers in Karnataka to prevent crimes, maintain public order, and protect property.',
      keyProvision: 'Empowers active police patrols, checking suspicious vehicle numbers, and tracking repeat-offender coordinates.'
    }
  ];

  // Helper to map search keywords to cases that match this law
  const getAssociatedCases = (article: LawArticle) => {
    // Return FIRs where IPC section code or crime matches this law
    return firs.filter(f => {
      if (article.id === 'IPC-379-BNS-303') {
        return f.crime_type === 'Chain Snatching' || f.crime_type === 'Vehicle Theft' || f.ipc_sections.some(sec => sec.includes('379'));
      }
      if (article.id === 'IPC-420-BNS-318') {
        return f.crime_type === 'Cyber Fraud' || f.ipc_sections.some(sec => sec.includes('420'));
      }
      if (article.id === 'IPC-457-BNS-331') {
        return f.crime_type === 'Organized Burglary' || f.ipc_sections.some(sec => sec.includes('457'));
      }
      if (article.id === 'IPC-409-BNS-316') {
        return f.crime_type === 'Financial Embezzlement' || f.ipc_sections.some(sec => sec.includes('409'));
      }
      if (article.id === 'IT-66D') {
        return f.crime_type === 'Cyber Fraud' || f.ipc_sections.some(sec => sec.includes('66D'));
      }
      return false; // For General Constitution articles, no specific simple map but let's connect general district cases
    });
  };

  // Filter law articles
  const filteredLaws = lawDatabase.filter(law => {
    const matchesSearch = 
      law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.sectionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.keyProvision.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const isPolaris = displayTheme === 'polaris';

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header Info */}
      <div className={`p-6 rounded-2xl border ${
        isPolaris 
          ? 'bg-sky-50 border-sky-100' 
          : 'bg-gradient-to-r from-sky-950/20 to-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-sky-400" />
          <div>
            <h2 className={`text-md font-bold tracking-wide uppercase font-mono ${isPolaris ? 'text-sky-900' : 'text-slate-100'}`}>
              Digital Law & Constitution Library
            </h2>
            <p className={`text-xs mt-0.5 ${isPolaris ? 'text-sky-700' : 'text-slate-400'}`}>
              Reference repository integrating the Constitution of India, Bharatiya Nyaya Sanhita (BNS), and IPC Sections.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left column - Library list (7 columns) */}
        <div className="xl:col-span-7 space-y-4">
          {/* Search bar & filter tabs */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-3 ${
            isPolaris ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles, legal sections, penalties..."
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 border ${
                  isPolaris 
                    ? 'bg-slate-50 border-slate-200 text-slate-800' 
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}
              />
            </div>

            {/* Category selection dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 border cursor-pointer font-semibold ${
                isPolaris 
                  ? 'bg-slate-50 border-slate-200 text-slate-700' 
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <option value="all">All Reference Codes</option>
              <option value="Constitution">Constitution of India</option>
              <option value="IPC">IPC Codebook</option>
              <option value="BNS">BNS / IT Act</option>
              <option value="Karnataka Police Act">KSP Act</option>
            </select>
          </div>

          {/* List of articles */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredLaws.length === 0 ? (
              <div className={`p-8 text-center text-xs font-mono rounded-xl border ${
                isPolaris ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}>
                No matching legal provisions found. Try another query.
              </div>
            ) : (
              filteredLaws.map((law) => {
                const isSelected = selectedLaw?.id === law.id;
                const associatedCases = getAssociatedCases(law);
                
                return (
                  <div
                    key={law.id}
                    onClick={() => setSelectedLaw(law)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:-translate-y-[1px] ${
                      isSelected
                        ? (isPolaris ? 'bg-sky-50/50 border-sky-400 shadow-md' : 'bg-sky-500/10 border-sky-500/50 shadow-lg')
                        : (isPolaris ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700')
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                        law.category === 'Constitution'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : (law.category === 'IPC' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-sky-500/10 text-sky-500 border-sky-500/20')
                      }`}>
                        {law.sectionCode}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                        {law.category}
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold mt-2 font-sans ${isPolaris ? 'text-slate-800' : 'text-slate-100'}`}>
                      {law.title}
                    </h3>
                    <p className={`text-xs mt-1.5 line-clamp-2 ${isPolaris ? 'text-slate-600' : 'text-slate-400'}`}>
                      {law.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Provisions analyzed</span>
                      {associatedCases.length > 0 && (
                        <span className="text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded">
                          {associatedCases.length} Associated Cases
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column - Deep Details & Associated Cases (5 columns) */}
        <div className="xl:col-span-5">
          {selectedLaw ? (
            <div className={`p-6 rounded-2xl border space-y-5 text-left shadow-2xl h-full flex flex-col justify-between ${
              isPolaris ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0a0f1d] border-slate-800 text-slate-200'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-sky-400" />
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isPolaris ? 'text-sky-800' : 'text-sky-400'}`}>
                    Active Law Docket
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">Legal Designation</span>
                  <h3 className={`text-md font-bold mt-0.5 ${isPolaris ? 'text-slate-900' : 'text-white'}`}>
                    {selectedLaw.sectionCode}: {selectedLaw.title}
                  </h3>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isPolaris ? 'bg-slate-50 border-slate-100' : 'bg-slate-950 border-slate-900'
                }`}>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block mb-1">Official Legal Text</span>
                  <p className="text-xs leading-relaxed font-sans text-slate-300">
                    {selectedLaw.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">Investigative Context</span>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {selectedLaw.keyProvision}
                  </p>
                </div>

                {selectedLaw.penalty && (
                  <div className="bg-rose-500/5 border border-rose-500/20 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-rose-500 font-bold uppercase block">Maximum Statutory Penalty</span>
                    <p className="text-xs text-rose-400 font-semibold font-sans leading-relaxed">
                      {selectedLaw.penalty}
                    </p>
                  </div>
                )}

                {/* Associated Active Case Numbers List */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
                    Associated Case Numbers ({getAssociatedCases(selectedLaw).length})
                  </span>
                  
                  {getAssociatedCases(selectedLaw).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No current active cases logged under this specific section code.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {getAssociatedCases(selectedLaw).map((f) => (
                        <div
                          key={f.id}
                          onClick={() => onSelectCase(f.id, 'fir')}
                          className={`p-2.5 rounded border flex items-center justify-between text-xs font-mono cursor-pointer transition-colors ${
                            isPolaris
                              ? 'bg-slate-50 border-slate-200 hover:bg-sky-50 text-slate-800'
                              : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                          }`}
                          title="Click to inspect this case details"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-sky-400" />
                            <span className="font-bold text-sky-400">{f.id}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-sans">{f.station} // {f.district}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/10 flex justify-between text-[10px] font-mono text-slate-500">
                <span>POLICE REFERENCE SYSTEM ACTIVE</span>
                <span>VERIFY WITH MAGISTRATE</span>
              </div>
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border text-center flex flex-col items-center justify-center h-full min-h-[300px] ${
              isPolaris ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-900/20 border-slate-850 text-slate-500'
            }`}>
              <BookOpen className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
              <p className="text-xs font-mono uppercase tracking-wider font-bold">Select any legal code or article</p>
              <p className="text-[11px] mt-1 font-sans max-w-xs leading-relaxed">
                Review its comprehensive text, maximum penal provisions, and list all active case numbers linked to it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
