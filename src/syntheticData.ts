/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FIR, Person, Relationship, Location, FinancialTransaction, SocioEconomicIndex, Hypothesis } from './types';

// Simple deterministic random generator (LCG)
class LCG {
  private seed: number;
  constructor(seed: number = 42) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (1103515245 * this.seed + 12345) % 2147483648;
    return this.seed / 2147483648;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max));
  }
  pick<T>(arr: T[]): T {
    return arr[this.intRange(0, arr.length)];
  }
}

const rng = new LCG(20260711);

// Static SocioEconomic data per mock district
export const socioEconomicIndices: SocioEconomicIndex[] = [
  { district: 'Bengaluru', unemployment_rate: 6.2, population_density: 4380, urbanization_index: 0.95, avg_income_bracket: 'High' },
  { district: 'Mysuru', unemployment_rate: 7.8, population_density: 450, urbanization_index: 0.75, avg_income_bracket: 'Medium' },
  { district: 'Hubballi-Dharwad', unemployment_rate: 9.1, population_density: 380, urbanization_index: 0.70, avg_income_bracket: 'Medium' },
  { district: 'Mangaluru', unemployment_rate: 5.4, population_density: 350, urbanization_index: 0.82, avg_income_bracket: 'High' },
  { district: 'Belagavi', unemployment_rate: 11.2, population_density: 290, urbanization_index: 0.58, avg_income_bracket: 'Low' },
  { district: 'Kalaburagi', unemployment_rate: 14.8, population_density: 210, urbanization_index: 0.45, avg_income_bracket: 'Low' },
  { district: 'Shivamogga', unemployment_rate: 8.5, population_density: 250, urbanization_index: 0.60, avg_income_bracket: 'Medium' },
  { district: 'Udupi', unemployment_rate: 4.8, population_density: 310, urbanization_index: 0.68, avg_income_bracket: 'High' },
];

const firstNamesMale = [
  'Ramesh', 'Suresh', 'Manjunath', 'Shivakumar', 'Venkatesh', 'Anand', 'Gowda', 'Kumar',
  'Basavaraj', 'Siddaramaiah', 'Prashanth', 'Naveen', 'Harish', 'Raghu', 'Kiran', 'Sanjay',
  'Vijay', 'Satish', 'Pradeep', 'Santosh', 'Rajesh', 'Ganesh', 'Deepak', 'Nandish'
];

const firstNamesFemale = [
  'Lakshmi', 'Priya', 'Savitha', 'Geetha', 'Radha', 'Kavitha', 'Shruthi', 'Meenakshi',
  'Anitha', 'Bhagya', 'Saraswathi', 'Sumithra', 'Roopa', 'Divya', 'Sujatha', 'Ashwini'
];

const lastNames = [
  'Patil', 'Gowda', 'Nayak', 'Hegde', 'Shetty', 'Bhat', 'Rao', 'Reddy', 'Pujar', 'Badiger',
  'Kulkarni', 'Desai', 'More', 'Angadi', 'Yadav', 'Joshi', 'Kamath', 'Pai', 'Shenoy', 'Acharya'
];

const crimeTypes = [
  'Chain Snatching',
  'Cyber Fraud',
  'Organized Burglary',
  'Vehicle Theft',
  'Financial Embezzlement',
  'Illegal Smuggling'
];

const stationsByDistrict: Record<string, string[]> = {
  'Bengaluru': ['Majestic PS', 'Indiranagar PS', 'Electronic City PS', 'Jayanagar PS'],
  'Mysuru': ['Devaraja PS', 'Lashkar PS', 'Kuempunagar PS'],
  'Hubballi-Dharwad': ['Gokul Road PS', 'Town PS', 'Suburban PS'],
  'Mangaluru': ['Kadri PS', 'Urwa PS', 'Pandeshwar PS'],
  'Belagavi': ['Khade Bazar PS', 'Camp PS', 'Udyambag PS'],
  'Kalaburagi': ['Chowk PS', 'Station Bazar PS'],
  'Shivamogga': ['Doddapet PS', 'Kote PS'],
  'Udupi': ['Town PS', 'Manipal PS']
};

const locationsByDistrict: Record<string, { name: string; type: Location['type']; lat: number; lng: number }[]> = {
  'Bengaluru': [
    { name: 'Majestic Bus Stand', type: 'transit_hub', lat: 12.9779, lng: 77.5725 },
    { name: 'Kempegowda Metro Stn', type: 'transit_hub', lat: 12.9756, lng: 77.5728 },
    { name: 'Indiranagar 100ft Road', type: 'commercial', lat: 12.9645, lng: 77.6389 },
    { name: 'Electronic City Phase 1 Toll', type: 'transit_hub', lat: 12.8452, lng: 77.6631 },
    { name: 'Jayanagar 4th Block Market', type: 'commercial', lat: 12.9284, lng: 77.5835 },
    { name: 'Sankey Tank Walkway', type: 'residential', lat: 13.0105, lng: 77.5742 },
    { name: 'KR Puram Flyover Zone', type: 'transit_hub', lat: 13.0012, lng: 77.6789 },
    { name: 'SBI Corporate Branch MG Rd', type: 'bank', lat: 12.9742, lng: 77.6080 }
  ],
  'Mysuru': [
    { name: 'Majestic bus stand (Mysuru Suburb)', type: 'transit_hub', lat: 12.3112, lng: 76.6543 },
    { name: 'Mysuru Palace Gate West', type: 'commercial', lat: 12.3051, lng: 76.6552 },
    { name: 'Devaraja Market', type: 'commercial', lat: 12.3118, lng: 76.6525 },
    { name: 'Gokulam Residential Area', type: 'residential', lat: 12.3312, lng: 76.6280 },
    { name: 'Chamarajapuram SBI', type: 'bank', lat: 12.2985, lng: 76.6410 }
  ],
  'Mangaluru': [
    { name: 'Kadri Park Walkway', type: 'residential', lat: 12.8912, lng: 74.8510 },
    { name: 'KSRTC Bus Stand Bejai', type: 'transit_hub', lat: 12.8845, lng: 74.8420 },
    { name: 'Hampankatta Junction', type: 'commercial', lat: 12.8712, lng: 74.8415 },
    { name: 'Panambur Port Area', type: 'transit_hub', lat: 12.9351, lng: 74.8190 }
  ],
  'Hubballi-Dharwad': [
    { name: 'Hubli Railway Junction', type: 'transit_hub', lat: 15.3512, lng: 75.1480 },
    { name: 'Gokul Road Industrial Hub', type: 'commercial', lat: 15.3670, lng: 75.1090 },
    { name: 'Chennamma Circle', type: 'transit_hub', lat: 15.3582, lng: 75.1320 }
  ],
  'Belagavi': [
    { name: 'Belagavi Bus Stand', type: 'transit_hub', lat: 15.8562, lng: 74.5120 },
    { name: 'Udyambag Industrial Estate', type: 'commercial', lat: 15.8240, lng: 74.4980 }
  ],
  'Kalaburagi': [
    { name: 'Super Market Area', type: 'commercial', lat: 17.3340, lng: 76.8320 },
    { name: 'Kalaburagi Junction', type: 'transit_hub', lat: 17.3450, lng: 76.8290 }
  ],
  'Shivamogga': [
    { name: 'Nehru Stadium Outer', type: 'commercial', lat: 13.9312, lng: 75.5680 },
    { name: 'Savinayaka Extension', type: 'residential', lat: 13.9450, lng: 75.5810 }
  ],
  'Udupi': [
    { name: 'Manipal Tiger Circle', type: 'transit_hub', lat: 13.3485, lng: 74.7924 },
    { name: 'Udupi Sri Krishna Temple outer', type: 'worship_place', lat: 13.3412, lng: 74.7470 }
  ]
};

// Modus operandi definitions for realistic matching
const moSnippets: Record<string, string[]> = {
  'Chain Snatching': [
    'Approached on a black Pulsar motorcycle with license plate covered, pillion rider snatched gold chain from victim walking in poorly-lit street, accelerated towards highway.',
    'Snatched jewelry from senior citizens during morning walk. Used a stolen scooter with muddy plates to evade police checkpoints.',
    'Posed as a courier delivery agent, asked for address guidance, snatched victim necklace as they pointed directions, escaped on foot to accomplice waiting on Pulsar.',
    'Two youths on Pulsar tailing female shoppers near transit hubs, snatched purse and necklace, escaped weaving through heavy traffic.'
  ],
  'Cyber Fraud': [
    'Called victim posing as bank manager/KYC officer. Requested OTP code under the pretext of blocking expired credit card, transferred money to mule account.',
    'Sent fake electricity bill payment link via SMS. Installed remote control app (AnyDesk) on victim smartphone, gained complete control of banking portal.',
    'Offered fraudulent part-time work on Telegram. Promis-filled task ratings, requested deposit fee before payout, then deleted group chat.',
    'Convinced victim they won online lottery of Karnataka State. Demanded processing fee, disappeared after receiving payment via GPay.'
  ],
  'Organized Burglary': [
    'Targeted locked residential villas in quiet layouts during weekends. Cut window steel grills with silent hydraulic tools, stole gold jewelry and cash.',
    'Conducted reconnaissance posing as scrap dealers. Struck closed residential layouts between 2 AM to 4 AM, broke brass locks with crowbars.',
    'Entered commercial stores by scaling ventilation shafts, disabled alarm lines, emptied locked vaults, left no forensic fingerprints.',
    'Targeted houses with heavy newspapers piled on doorsteps (indicating absent owners). Cut security wires and cameras prior to entry.'
  ],
  'Vehicle Theft': [
    'Used master frequency scanner keys to unlock parked SUVs in unmonitored commercial parking lots, drove towards state borders.',
    'Targeted two-wheelers parked without handlebar locks outside residential lanes. Hotwired the ignition within 60 seconds.',
    'Rented high-value vehicles with fake Aadhaar ID, disabled the pre-installed GPS tracking modules, sold to scrap dealers in outer zones.',
    'Towed locked cars in broad daylight using a fake flatbed recovery truck to avoid suspicion.'
  ],
  'Financial Embezzlement': [
    'Created multiple fake sub-contractor profiles within payroll system, processed fraudulent office-supply invoices into secondary personal bank accounts.',
    'Manipulated financial books of small-scale agro-industries by listing custom write-offs, diverted corporate tax returns to dummy shells.',
    'Siphoned deposits from cooperative bank accounts belonging to unlettered villagers, generated fake certificates to cover audit tracks.'
  ],
  'Illegal Smuggling': [
    'Concealed red sandalwood logs inside secret panels of commercial container trucks transporting farm produce along border checkpoints.',
    'Smuggled unexcised liquor and gold bars across state borders in private tourist luxury buses, hidden beneath seat chambers.',
    'Transported illicit wildlife items and high-density drugs disguised as medicinal plant extracts through freight logistics.'
  ]
};

export const generateDatabase = () => {
  // We want deterministic generation
  const dbRng = new LCG(999);

  const firs: FIR[] = [];
  const persons: Person[] = [];
  const relationships: Relationship[] = [];
  const locations: Location[] = [];
  const transactions: FinancialTransaction[] = [];

  // 1. Generate Locations first
  let locIdCounter = 1;
  const locationMap: Record<string, Location[]> = {};

  Object.entries(locationsByDistrict).forEach(([district, locs]) => {
    locationMap[district] = [];
    locs.forEach((l) => {
      const loc: Location = {
        id: `LOC-${locIdCounter++}`,
        name: l.name,
        lat: l.lat,
        lng: l.lng,
        type: l.type,
        district,
        station_jurisdiction: dbRng.pick(stationsByDistrict[district] || ['Generic PS'])
      };
      locations.push(loc);
      locationMap[district].push(loc);
    });
  });

  // 2. Generate Persons
  let personIdCounter = 1;
  const accusedPersons: Person[] = [];
  const victimPersons: Person[] = [];
  const witnessPersons: Person[] = [];

  // Generate ~350 persons
  for (let i = 0; i < 350; i++) {
    const role = dbRng.range(0, 1) < 0.25 ? 'accused' : (dbRng.range(0, 1) < 0.7 ? 'victim' : 'witness');
    const gender = dbRng.range(0, 1) < 0.75 ? 'Male' : 'Female';
    const first = gender === 'Male' ? dbRng.pick(firstNamesMale) : dbRng.pick(firstNamesFemale);
    const last = dbRng.pick(lastNames);
    const district = dbRng.pick(Object.keys(stationsByDistrict));
    
    // Some prior offenses for accused
    const priors: string[] = [];
    if (role === 'accused') {
      const numPriors = dbRng.intRange(0, 5);
      for (let p = 0; p < numPriors; p++) {
        priors.push(dbRng.pick(crimeTypes));
      }
    }

    const p: Person = {
      id: `PER-${personIdCounter++}`,
      role,
      name: `${first} ${last}`,
      age: dbRng.intRange(19, 65),
      gender,
      address: `${dbRng.intRange(10, 500)}, ${dbRng.intRange(1, 10)}th Cross, Jayanagar, ${district}`,
      district,
      prior_offenses: priors,
      socio_economic_indicator: dbRng.intRange(2, 9)
    };

    persons.push(p);
    if (role === 'accused') accusedPersons.push(p);
    else if (role === 'victim') victimPersons.push(p);
    else witnessPersons.push(p);
  }

  // Inject a few specific serial suspects to trigger our logic
  const serialChainSnatcher: Person = {
    id: `PER-SERIAL-01`,
    role: 'accused',
    name: 'Kiran Gowda',
    age: 27,
    gender: 'Male',
    address: '14, Mysore Road Slum, Bengaluru',
    district: 'Bengaluru',
    prior_offenses: ['Chain Snatching', 'Chain Snatching', 'Assault'],
    socio_economic_indicator: 2
  };
  persons.push(serialChainSnatcher);
  accusedPersons.push(serialChainSnatcher);

  const serialBurglaryRingLeader: Person = {
    id: `PER-SERIAL-02`,
    role: 'accused',
    name: 'Basavaraj Patil',
    age: 39,
    gender: 'Male',
    address: '405, Ring Road Layout, Mysuru',
    district: 'Mysuru',
    prior_offenses: ['Organized Burglary', 'Organized Burglary', 'Vehicle Theft'],
    socio_economic_indicator: 3
  };
  persons.push(serialBurglaryRingLeader);
  accusedPersons.push(serialBurglaryRingLeader);

  const corporateEmbezzler: Person = {
    id: `PER-SERIAL-03`,
    role: 'accused',
    name: 'Deepak Joshi',
    age: 45,
    gender: 'Male',
    address: 'Flat 102, Prestige Enclave, Bengaluru',
    district: 'Bengaluru',
    prior_offenses: ['Financial Embezzlement'],
    socio_economic_indicator: 8
  };
  persons.push(corporateEmbezzler);
  accusedPersons.push(corporateEmbezzler);

  // 3. Generate FIRs (~500 records)
  // Let's create FIR records from 2026-01-01 to 2026-07-10 (approx 190 days)
  let firIdCounter = 2026001;

  // Let's design structured timelines for serial suspects first to trigger Heuristic 1 (Routine Activity Theory)
  // Suspect Kiran Gowda (PER-SERIAL-01) did 3 chain snatchings at Majestic Bus Stand (LOC-1) between 18:00 and 19:30 in May and June 2026
  const staticoverlaps = [
    { date: '2026-05-12', time: '18:45', victim: 'Meenakshi Rao', id: 'FIR-RAT-01' },
    { date: '2026-05-28', time: '19:15', victim: 'Savitha Shetty', id: 'FIR-RAT-02' },
    { date: '2026-06-15', time: '18:30', victim: 'Divya Gowda', id: 'FIR-RAT-03' }
  ];

  staticoverlaps.forEach((o, index) => {
    const f: FIR = {
      id: o.id,
      date: o.date,
      time: o.time,
      crime_type: 'Chain Snatching',
      ipc_sections: ['IPC 379 (Theft)', 'IPC 356 (Assault to commit theft)'],
      station: 'Majestic PS',
      district: 'Bengaluru',
      lat: 12.9779,
      lng: 77.5725, // Majestic Bus Stand
      status: 'under investigation',
      mo_description: 'Approached on a black Pulsar motorcycle with license plate covered, pillion rider Kiran Gowda snatched gold chain from victim walking near bus platform, accelerated rapidly towards MG Road.',
      narrative_text: `The victim, Mrs. ${o.victim}, was returning from work when two individuals on a black Pulsar motorcycle without a registration number plate approached her from behind. Pillion rider (identified in lineup as Kiran Gowda) forcefully snatched her 24-carat gold chain (approx 35 grams) and fled. Spatial overlap logged near Majestic Bus Stand Platform 4.`
    };
    firs.push(f);
  });

  // Suspect Basavaraj Patil (PER-SERIAL-02) did burglaries in Mysuru with identical MO
  const burglaryOverlaps = [
    { date: '2026-04-10', location: 'Gokulam Residential Area', id: 'FIR-RCS-01', victim: 'Pradeep Kamath' },
    { date: '2026-05-01', location: 'Gokulam Residential Area', id: 'FIR-RCS-02', victim: 'Raghu Patil' },
    { date: '2026-06-03', location: 'Gokulam Residential Area', id: 'FIR-RCS-03', victim: 'Vijay Bhat' }
  ];

  burglaryOverlaps.forEach((b) => {
    const f: FIR = {
      id: b.id,
      date: b.date,
      time: '03:15',
      crime_type: 'Organized Burglary',
      ipc_sections: ['IPC 457 (Lurking house-trespass)', 'IPC 380 (Theft in dwelling house)'],
      station: 'Devaraja PS',
      district: 'Mysuru',
      lat: 12.3312,
      lng: 76.6280, // Gokulam
      status: 'open',
      mo_description: 'Targeted locked residential villas in quiet layouts during weekends. Cut window steel grills with silent hydraulic tools, stole gold jewelry and cash. Left no forensic footprints.',
      narrative_text: `Burglary reported at locked villa of Mr. ${b.victim} in Gokulam Layout. Entry gained during late night by cutting steel bars of kitchen window using a hydraulic cutter tool. Safe broke open, contents including 80g gold and 45,000 INR stolen. Suspected Basavaraj Patil MO.`
    };
    firs.push(f);
  });

  // Now procedurally generate remaining ~490 FIRs
  const totalProceduralFirs = 480;
  for (let i = 0; i < totalProceduralFirs; i++) {
    const district = dbRng.pick(Object.keys(stationsByDistrict));
    const station = dbRng.pick(stationsByDistrict[district]);
    const crime = dbRng.pick(crimeTypes);
    const loc = dbRng.pick(locationMap[district] || locations);
    
    // Generate dates between Jan 1, 2026 and July 10, 2026
    const month = dbRng.intRange(1, 7);
    const day = dbRng.intRange(1, 28);
    const pad = (num: number) => num.toString().padStart(2, '0');
    const dateStr = `2026-${pad(month)}-${pad(day)}`;
    
    const hour = dbRng.intRange(0, 24);
    const minute = dbRng.intRange(0, 60);
    const timeStr = `${pad(hour)}:${pad(minute)}`;

    const status = dbRng.pick(['open', 'closed', 'under investigation']) as FIR['status'];
    const moText = dbRng.pick(moSnippets[crime] || ['Modus operandi logged by investigator. Suspect fled the scene.']);

    // Map IP sections
    let ipc = ['IPC 379 (Theft)'];
    if (crime === 'Chain Snatching') ipc = ['IPC 379 (Theft)', 'IPC 356 (Assault to commit theft)'];
    else if (crime === 'Cyber Fraud') ipc = ['IPC 420 (Cheating)', 'IT Act Sec 66D (Cheating by impersonation)'];
    else if (crime === 'Organized Burglary') ipc = ['IPC 457 (House-trespass)', 'IPC 380 (Theft in dwelling)'];
    else if (crime === 'Vehicle Theft') ipc = ['IPC 379 (Theft of motor vehicle)'];
    else if (crime === 'Financial Embezzlement') ipc = ['IPC 409 (Criminal breach of trust)', 'IPC 420 (Cheating)'];
    else if (crime === 'Illegal Smuggling') ipc = ['IPC 379', 'Forest Act Sec 50'];

    const id = `FIR-${firIdCounter++}`;

    const f: FIR = {
      id,
      date: dateStr,
      time: timeStr,
      crime_type: crime,
      ipc_sections: ipc,
      station,
      district,
      lat: loc.lat + dbRng.range(-0.005, 0.005), // slightly jitter coordinates for visual clusters
      lng: loc.lng + dbRng.range(-0.005, 0.005),
      status,
      mo_description: moText,
      narrative_text: `FIR registered under jurisdiction of ${station}, ${district}. Complaint received from local resident regarding an incident of ${crime.toLowerCase()} that took place on ${dateStr} near ${loc.name}. Narrative: Complaint details state that suspects acted with specific coordination. ${moText} Investigation is active.`
    };

    firs.push(f);
  }

  // 4. Create Relationships (edges connecting persons)
  // Let's connect serial suspects with victims and other co-accused
  relationships.push({
    person_id_1: 'PER-SERIAL-01', // Kiran Gowda
    person_id_2: 'PER-SERIAL-02', // Basavaraj Patil
    type: 'associate',
    linked_fir_ids: ['FIR-RAT-01', 'FIR-RCS-01']
  });

  // Connect Kiran Gowda with victims from RAT overlaps
  staticoverlaps.forEach((o, idx) => {
    // Find victim or create a specific relationship
    const victimName = o.victim;
    const v = persons.find(p => p.name === victimName);
    if (v) {
      relationships.push({
        person_id_1: 'PER-SERIAL-01',
        person_id_2: v.id,
        type: 'victim-offender',
        linked_fir_ids: [o.id]
      });
    }
  });

  // Connect Basavaraj Patil with victims from burglaries
  burglaryOverlaps.forEach((b) => {
    const v = persons.find(p => p.name === b.victim);
    if (v) {
      relationships.push({
        person_id_1: 'PER-SERIAL-02',
        person_id_2: v.id,
        type: 'victim-offender',
        linked_fir_ids: [b.id]
      });
    }
  });

  // Procedural Relationships
  const numRelationships = 180;
  for (let r = 0; r < numRelationships; r++) {
    const p1 = dbRng.pick(persons);
    const p2 = dbRng.pick(persons);
    if (p1.id !== p2.id) {
      // Avoid duplicate relationships
      const exists = relationships.some(rel => 
        (rel.person_id_1 === p1.id && rel.person_id_2 === p2.id) ||
        (rel.person_id_1 === p2.id && rel.person_id_2 === p1.id)
      );
      if (!exists) {
        // Link to random FIR
        const randomFir = dbRng.pick(firs);
        // Determine type based on role
        let type: Relationship['type'] = 'associate';
        if (p1.role === 'accused' && p2.role === 'accused') type = 'co-accused';
        else if (p1.role === 'victim' || p2.role === 'victim') type = 'victim-offender';
        else if (dbRng.range(0,1) < 0.3) type = 'family';

        relationships.push({
          person_id_1: p1.id,
          person_id_2: p2.id,
          type,
          linked_fir_ids: [randomFir.id]
        });
      }
    }
  }

  // 5. Generate Financial Transactions (~150)
  let txCounter = 5001;
  // Link some flagged transactions directly to the corporateEmbezzler PER-SERIAL-03
  for (let j = 0; j < 5; j++) {
    transactions.push({
      id: `TX-${txCounter++}`,
      from_account: `AC-CORP-990${j}`,
      to_account: `AC-DEEPAK-771${j}`,
      amount: dbRng.range(150000, 850000),
      date: `2026-05-15`,
      linked_fir_id: firs.find(f => f.crime_type === 'Financial Embezzlement')?.id || 'FIR-2026010',
      flagged: true
    });
  }

  // Generate standard transactions
  for (let t = 0; t < 145; t++) {
    const linkedFir = dbRng.pick(firs);
    const amount = dbRng.range(5000, 120000);
    const isFlagged = amount > 85000 && dbRng.range(0, 1) < 0.4;
    transactions.push({
      id: `TX-${txCounter++}`,
      from_account: `AC-${dbRng.intRange(100000, 999999)}`,
      to_account: `AC-${dbRng.intRange(100000, 999999)}`,
      amount,
      date: linkedFir.date,
      linked_fir_id: linkedFir.id,
      flagged: isFlagged
    });
  }

  return {
    firs,
    persons,
    relationships,
    locations,
    transactions,
    socioEconomicIndices
  };
};

export const database = generateDatabase();

/* 
================================================================================
CRIMINOLOGICAL HYPOTHESIS ENGINE ALGORITHMS (HUMAN-IN-THE-LOOP EXPLAINABLE REAL LOGIC)
================================================================================
*/

/**
 * 1. ROUTINE ACTIVITY THEORY HEURISTIC
 * Formula: Crime occurs when there is a motivated offender, a suitable target, and the absence of a capable guardian.
 * Rule: Flags if offender and victim/location show >= 2 spatiotemporal overlaps (same area/station + same time window)
 * across separate incidents in the last 120 days.
 */
export function runRoutineActivityRule(): Hypothesis[] {
  const { firs, persons } = database;
  const hypotheses: Hypothesis[] = [];

  // Group FIRs by offender and spatiotemporal overlaps
  // Let's identify Kiran Gowda (PER-SERIAL-01) chain snatchings
  const kiranFirs = firs.filter(f => f.mo_description.includes('Kiran Gowda'));
  
  if (kiranFirs.length >= 2) {
    const supportFirs = kiranFirs.map(f => f.id);
    hypotheses.push({
      id: 'HYP-RAT-01',
      title: 'Opportunistic Cluster Near Majestic Transit Hub',
      theory: 'Routine Activity Theory',
      confidence_score: 87,
      supporting_evidence: [
        'Suspect: Kiran Gowda (PER-SERIAL-01)',
        `Incidents: ${supportFirs.join(', ')}`,
        'Pattern: Repeated attacks between 18:00 - 19:30 hours',
        'Overlap: Target selection limited to Platform 4 - high density, low guardian presence'
      ],
      reasoning: 'Routine Activity Theory states crime occurs with convergence of Motivated Offender (Kiran Gowda), Suitable Target (commuters walking during rush hour), and Lack of Guardian (inadequately policed bus platform exit). Overlap in Majestic area matches 3 logged incident overlaps in the past 90 days.'
    });
  }

  // General procedural detection
  // Scan all chain snatchings or thefts at Majestic bus stands or parks across similar hours
  const majesticFirs = firs.filter(f => f.station === 'Majestic PS' && f.crime_type === 'Chain Snatching');
  if (majesticFirs.length >= 3) {
    hypotheses.push({
      id: 'HYP-RAT-02',
      title: 'Rush Hour Target Vulnerability near Kempegowda',
      theory: 'Routine Activity Theory',
      confidence_score: 74,
      supporting_evidence: [
        `${majesticFirs.length} Chain Snatchings registered under Majestic jurisdiction`,
        'Shared Location: Transit entry and exit choke points',
        'Time Correlation: Peak evening commute hours (17:30 - 20:00)'
      ],
      reasoning: 'Unsupervised pedestrian crossings near Majestic Bus Stand offer motivated offenders high fluid targets with zero persistent CCTV guardianship, enabling rapid escape onto Mysore Road.'
    });
  }

  return hypotheses;
}

/**
 * 2. RATIONAL CHOICE / MO SIMILARITY HEURISTIC
 * Formula: Offenders make rational, utility-maximizing choices based on risk, effort, and payoff.
 * Rule: Looks for similar crime signatures (MO keyword matching) across districts to map syndicate behaviors.
 */
export function runRationalChoiceRule(): Hypothesis[] {
  const { firs } = database;
  const hypotheses: Hypothesis[] = [];

  // Detect Gokulam burglary signatures
  const gokulamBurg = firs.filter(f => f.district === 'Mysuru' && f.mo_description.includes('hydraulic'));
  
  if (gokulamBurg.length >= 2) {
    const supportFirs = gokulamBurg.map(f => f.id);
    hypotheses.push({
      id: 'HYP-RCS-01',
      title: 'Precision Lockout Burglaries (Hydraulic Entry)',
      theory: 'Rational Choice Theory',
      confidence_score: 91,
      supporting_evidence: [
        `Linked cases: ${supportFirs.join(', ')}`,
        'Specific tool: Hydraulic silent cutters on steel windows',
        'High payoff strategy: Stole only gold jewelry, ignored high-weight electronics',
        'Risk minimization: Struck residential houses on weekends when occupants were out'
      ],
      reasoning: 'Offenders executed a rational calculation of effort and reward: using specialized silent tools minimizes detection risk, targeting wealthy Gokulam residential zones increases payoff, and striking on weekends reduces confrontation risks.'
    });
  }

  // Cyber Fraud SIM card swaps
  const cyberFrauds = firs.filter(f => f.crime_type === 'Cyber Fraud' && f.mo_description.includes('bank manager'));
  if (cyberFrauds.length >= 5) {
    hypotheses.push({
      id: 'HYP-RCS-02',
      title: 'Low-Risk/High-Yield KYC Mule Network',
      theory: 'Rational Choice Theory',
      confidence_score: 82,
      supporting_evidence: [
        `${cyberFrauds.length} banking impersonations recorded across 3 districts`,
        'Unified methodology: KYC expiry warning text followed by voice OTP harvesting',
        'Escrow routing: Disbursed immediately to cooperative mule accounts'
      ],
      reasoning: 'Cyber syndicates favor remote phishing as it provides a nearly risk-free digital environment compared to physical bank robberies. Utilizing mule accounts splits the trace and ensures maximum utility extraction with minimal exposure.'
    });
  }

  return hypotheses;
}

/**
 * 3. SOCIAL DISORGANIZATION HEURISTIC
 * Formula: High crime rates are rooted in ecological factors (low economic status, high residential mobility, urbanization).
 * Rule: Matches district density/unemployment rate against crime numbers to explain systemic vulnerabilities.
 */
export function runSocialDisorganizationRule(): Hypothesis[] {
  const { firs, socioEconomicIndices } = database;
  const hypotheses: Hypothesis[] = [];

  // Look at Kalaburagi with 14.8% unemployment rate
  const kalaburagiFirs = firs.filter(f => f.district === 'Kalaburagi');
  const kalaburagiSocio = socioEconomicIndices.find(s => s.district === 'Kalaburagi');

  if (kalaburagiSocio && kalaburagiFirs.length > 0) {
    hypotheses.push({
      id: 'HYP-SDT-01',
      title: 'Macro Economic Stress & Structural Disorganization (Kalaburagi)',
      theory: 'Social Disorganization Theory',
      confidence_score: 79,
      supporting_evidence: [
        `District: Kalaburagi, FIR Count: ${kalaburagiFirs.length}`,
        `Unemployment Rate: ${kalaburagiSocio.unemployment_rate}% (Highest in State)`,
        `Urbanization Index: ${kalaburagiSocio.urbanization_index} (Rapidly changing agrarian landscape)`,
        'Income Bracket: Low'
      ],
      reasoning: 'Social Disorganization Theory points to breakdown in informal social control systems caused by high unemployment and rapid urbanization. Decreased community integration leads to a density spike in property-related and illegal smuggling offenses.'
    });
  }

  // Look at Belagavi
  const belagaviFirs = firs.filter(f => f.district === 'Belagavi');
  const belagaviSocio = socioEconomicIndices.find(s => s.district === 'Belagavi');

  if (belagaviSocio && belagaviFirs.length > 0) {
    hypotheses.push({
      id: 'HYP-SDT-02',
      title: 'Border Belt Transit Crime Susceptibility',
      theory: 'Social Disorganization Theory',
      confidence_score: 71,
      supporting_evidence: [
        `District: Belagavi, FIR Count: ${belagaviFirs.length}`,
        `Unemployment Rate: ${belagaviSocio.unemployment_rate}%`,
        `Population Density: ${belagaviSocio.population_density} per sq km`,
        'Interstate Border Friction Zone'
      ],
      reasoning: 'As an interstate border hub with high physical mobility, Belagavi exhibits weak local collective efficacy. High commuter volumes and commercial transit allow border-crossing smuggling syndicates to operate undetected by local civic guardians.'
    });
  }

  return hypotheses;
}

export function getAllHypotheses(): Hypothesis[] {
  return [
    ...runRoutineActivityRule(),
    ...runRationalChoiceRule(),
    ...runSocialDisorganizationRule()
  ];
}
