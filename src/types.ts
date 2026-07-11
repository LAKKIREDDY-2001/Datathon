/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FIR {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  crime_type: string;
  ipc_sections: string[];
  station: string;
  district: string;
  lat: number;
  lng: number;
  status: 'open' | 'closed' | 'under investigation';
  mo_description: string;
  narrative_text: string;
  assigned_io?: string; // e.g. "Insp. S. Kumar"
  priority?: 'low' | 'medium' | 'high' | 'escalated';
}

export interface Person {
  id: string;
  role: 'accused' | 'victim' | 'witness';
  name: string;
  age: number;
  gender: string;
  address: string;
  district: string;
  prior_offenses: string[];
  socio_economic_indicator: number; // 1 to 10
  warrant_status?: 'None' | 'Pending' | 'Approved' | 'Executed';
}

export interface Relationship {
  person_id_1: string;
  person_id_2: string;
  type: 'co-accused' | 'family' | 'associate' | 'victim-offender';
  linked_fir_ids: string[];
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'residential' | 'commercial' | 'transit_hub' | 'worship_place' | 'bank';
  district: string;
  station_jurisdiction: string;
}

export interface FinancialTransaction {
  id: string;
  from_account: string;
  to_account: string;
  amount: number;
  date: string;
  linked_fir_id: string;
  flagged: boolean;
}

export interface SocioEconomicIndex {
  district: string;
  unemployment_rate: number; // %
  population_density: number; // per sq km
  urbanization_index: number; // 0 to 1
  avg_income_bracket: 'Low' | 'Medium' | 'High';
  budget_allocated?: number; // In Lakhs Rupees
  safety_infrastructure?: string[]; // e.g. ["CCTV Network", "Patrol Force"]
  patrol_strategy?: string; // e.g. "Saturate Hotspots"
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  query: string;
  user_role: 'Investigator' | 'Analyst' | 'Supervisor' | 'Policymaker';
  data_accessed: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  theory: 'Routine Activity Theory' | 'Rational Choice Theory' | 'Social Disorganization Theory';
  confidence_score: number;
  supporting_evidence: string[];
  reasoning: string;
}
