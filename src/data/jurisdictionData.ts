/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VillageData {
  name: string;
  name_kn?: string;
  population: number;
  primary_crop: string;
  elevation: string;
  nearest_ps: string;
}

export interface MandalData {
  name: string;
  name_kn?: string;
  villages: VillageData[];
}

export interface DistrictData {
  name: string;
  name_kn?: string;
  headquarters: string;
  mandals: MandalData[];
}

export const KARNATAKA_JURISDICTIONS: DistrictData[] = [
  {
    name: "Bengaluru",
    name_kn: "ಬೆಂಗಳೂರು",
    headquarters: "Bengaluru",
    mandals: [
      {
        name: "Anekal",
        name_kn: "ಆನೇಕಲ್",
        villages: [
          { name: "Attibele", population: 22450, primary_crop: "Ragi, Paddy", elevation: "904m", nearest_ps: "Attibele PS" },
          { name: "Jigani", population: 18900, primary_crop: "Ragi, Vegetables", elevation: "912m", nearest_ps: "Jigani PS" },
          { name: "Sarjapura", population: 15400, primary_crop: "Flowers, Fruits", elevation: "898m", nearest_ps: "Sarjapura PS" },
          { name: "Dommasandra", population: 9800, primary_crop: "Ragi, Maize", elevation: "895m", nearest_ps: "Sarjapura PS" },
          { name: "Yadavanahalli", population: 5320, primary_crop: "Eucalyptus, Ragi", elevation: "910m", nearest_ps: "Attibele PS" },
          { name: "Marsur", population: 6150, primary_crop: "Tomato, Maize", elevation: "902m", nearest_ps: "Anekal PS" },
          { name: "Bidaraguppe", population: 4230, primary_crop: "Ragi, Paddy", elevation: "890m", nearest_ps: "Attibele PS" }
        ]
      },
      {
        name: "Bengaluru North",
        name_kn: "ಬೆಂಗಳೂರು ಉತ್ತರ",
        villages: [
          { name: "Hesaraghatta", population: 14500, primary_crop: "Horticulture, Dairy", elevation: "920m", nearest_ps: "Hesaraghatta PS" },
          { name: "Yeshwanthapura Rural", population: 11200, primary_crop: "Vegetables, Flowers", elevation: "915m", nearest_ps: "Yeshwanthapura PS" },
          { name: "Chikkabanavara", population: 8900, primary_crop: "Ragi, Coconut", elevation: "910m", nearest_ps: "Peenya PS" },
          { name: "Byatarayanapura Rural", population: 7400, primary_crop: "Ragi, Maize", elevation: "918m", nearest_ps: "Kodigehalli PS" },
          { name: "Bagaluru", population: 12100, primary_crop: "Poultry, Vegetables", elevation: "911m", nearest_ps: "Bagaluru PS" }
        ]
      },
      {
        name: "Bengaluru South",
        name_kn: "ಬೆಂಗಳೂರು ದಕ್ಷಿಣ",
        villages: [
          { name: "Kengeri Rural", population: 15300, primary_crop: "Ragi, Coconut", elevation: "880m", nearest_ps: "Kengeri PS" },
          { name: "Uttarahalli Rural", population: 9850, primary_crop: "Vegetables", elevation: "895m", nearest_ps: "Subramanyapura PS" },
          { name: "Kaggalipura", population: 13400, primary_crop: "Ragi, Banana", elevation: "892m", nearest_ps: "Kaggalipura PS" },
          { name: "Begur Rural", population: 11050, primary_crop: "Ragi, Maize", elevation: "901m", nearest_ps: "Begur PS" },
          { name: "Kumbalgodu", population: 14200, primary_crop: "Clay ware, Ragi", elevation: "875m", nearest_ps: "Kumbalgodu PS" }
        ]
      },
      {
        name: "Bengaluru East",
        name_kn: "ಬೆಂಗಳೂರು ಪೂರ್ವ",
        villages: [
          { name: "Varthur Rural", population: 16800, primary_crop: "Flowers, Paddy", elevation: "895m", nearest_ps: "Varthur PS" },
          { name: "Bidarahalli", population: 12450, primary_crop: "Ragi, Eucalyptus", elevation: "890m", nearest_ps: "Avalahalli PS" },
          { name: "Mugalur", population: 4890, primary_crop: "Flowers, Maize", elevation: "882m", nearest_ps: "Varthur PS" },
          { name: "Whitefield Rural", population: 8120, primary_crop: "Tomato, Greens", elevation: "900m", nearest_ps: "Whitefield PS" },
          { name: "Huskur", population: 7650, primary_crop: "Ragi, Flowers", elevation: "896m", nearest_ps: "Hebbagodi PS" }
        ]
      }
    ]
  },
  {
    name: "Mysuru",
    name_kn: "ಮೈಸೂರು",
    headquarters: "Mysuru",
    mandals: [
      {
        name: "Mysuru Taluk",
        name_kn: "ಮೈಸೂರು ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Yelwal", population: 12400, primary_crop: "Ragi, Cotton", elevation: "750m", nearest_ps: "Yelwal PS" },
          { name: "Jayapura", population: 9350, primary_crop: "Tobacco, Paddy", elevation: "765m", nearest_ps: "Jayapura PS" },
          { name: "Varuna", population: 11200, primary_crop: "Sugarcane, Paddy", elevation: "740m", nearest_ps: "Varuna PS" },
          { name: "Kadakola", population: 8100, primary_crop: "Ragi, Groundnuts", elevation: "732m", nearest_ps: "Nanjangud PS" },
          { name: "Rammanahalli", population: 7600, primary_crop: "Millets, Flowers", elevation: "748m", nearest_ps: "Mysuru Rural PS" },
          { name: "Gopalapura", population: 4350, primary_crop: "Paddy, Coconut", elevation: "738m", nearest_ps: "Jayapura PS" }
        ]
      },
      {
        name: "Nanjangud",
        name_kn: "ನಂಜನಗೂಡು",
        villages: [
          { name: "Hullahalli", population: 13900, primary_crop: "Sugarcane, Paddy", elevation: "710m", nearest_ps: "Hullahalli PS" },
          { name: "Kalale", population: 8400, primary_crop: "Cotton, Ragi", elevation: "718m", nearest_ps: "Nanjangud Rural PS" },
          { name: "Debur", population: 5300, primary_crop: "Sugarcane, Paddy", elevation: "722m", nearest_ps: "Nanjangud Rural PS" },
          { name: "Sindhuvalli", population: 6800, primary_crop: "Coconut, Ragi", elevation: "725m", nearest_ps: "Nanjangud Rural PS" },
          { name: "Chinnadagudihundi", population: 3120, primary_crop: "Tobacco, Ragi", elevation: "730m", nearest_ps: "Nanjangud Rural PS" }
        ]
      },
      {
        name: "Hunsur",
        name_kn: "ಹುಣಸೂರು",
        villages: [
          { name: "Bililere", population: 6400, primary_crop: "Tobacco, Cotton", elevation: "790m", nearest_ps: "Hunsur Rural PS" },
          { name: "Dharmapura", population: 7200, primary_crop: "Tobacco, Maize", elevation: "802m", nearest_ps: "Hunsur Town PS" },
          { name: "Gavadagere", population: 9800, primary_crop: "Paddy, Tobacco", elevation: "785m", nearest_ps: "Hunsur Rural PS" },
          { name: "Kallahally", population: 5100, primary_crop: "Ginger, Ragi", elevation: "795m", nearest_ps: "Hunsur Town PS" }
        ]
      }
    ]
  },
  {
    name: "Belagavi",
    name_kn: "ಬೆಳಗಾವಿ",
    headquarters: "Belagavi",
    mandals: [
      {
        name: "Belagavi Taluk",
        name_kn: "ಬೆಳಗಾವಿ ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Kakati", population: 16200, primary_crop: "Sugarcane, Paddy", elevation: "762m", nearest_ps: "Kakati PS" },
          { name: "Hindalga", population: 14950, primary_crop: "Sugarcane, Vegetables", elevation: "755m", nearest_ps: "Belagavi Rural PS" },
          { name: "Uchagaon", population: 11300, primary_crop: "Paddy, Potato", elevation: "770m", nearest_ps: "Belagavi Rural PS" },
          { name: "Peeranwadi", population: 12500, primary_crop: "Sugarcane, Rice", elevation: "758m", nearest_ps: "Belagavi Rural PS" },
          { name: "Sambra", population: 9300, primary_crop: "Maize, Paddy", elevation: "748m", nearest_ps: "Sambra PS" },
          { name: "Mutga", population: 5400, primary_crop: "Groundnut, Wheat", elevation: "752m", nearest_ps: "Sambra PS" }
        ]
      },
      {
        name: "Gokak",
        name_kn: "ಗೋಕಾಕ್",
        villages: [
          { name: "Ankalagi", population: 11400, primary_crop: "Sugarcane, Cotton", elevation: "680m", nearest_ps: "Ankalagi PS" },
          { name: "Kalloli", population: 15600, primary_crop: "Sugarcane, Maize", elevation: "675m", nearest_ps: "Gokak PS" },
          { name: "Koujalagi", population: 18200, primary_crop: "Cotton, Groundnut", elevation: "662m", nearest_ps: "Koujalagi PS" },
          { name: "Melavanki", population: 8300, primary_crop: "Jowar, Wheat", elevation: "690m", nearest_ps: "Gokak PS" }
        ]
      },
      {
        name: "Chikkodi",
        name_kn: "ಚಿಕ್ಕೋಡಿ",
        villages: [
          { name: "Sadalga", population: 21900, primary_crop: "Sugarcane, Tobacco", elevation: "630m", nearest_ps: "Sadalga PS" },
          { name: "Nippani Rural", population: 15100, primary_crop: "Tobacco, Sugarcane", elevation: "645m", nearest_ps: "Nippani PS" },
          { name: "Bedkihal", population: 13200, primary_crop: "Sugarcane, Jowar", elevation: "638m", nearest_ps: "Chikkodi PS" },
          { name: "Kagal", population: 6450, primary_crop: "Sugarcane, Soya", elevation: "625m", nearest_ps: "Chikkodi PS" }
        ]
      }
    ]
  },
  {
    name: "Hubballi-Dharwad",
    name_kn: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ",
    headquarters: "Dharwad",
    mandals: [
      {
        name: "Dharwad Taluk",
        name_kn: "ಧಾರವಾಡ ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Amargol", population: 14200, primary_crop: "Onion, Cotton", elevation: "695m", nearest_ps: "Amargol PS" },
          { name: "Garag", population: 12500, primary_crop: "Chilli, Jowar", elevation: "710m", nearest_ps: "Garag PS" },
          { name: "Hebsur", population: 10800, primary_crop: "Wheat, Gram", elevation: "685m", nearest_ps: "Dharwad Rural PS" },
          { name: "Mugad", population: 7200, primary_crop: "Paddy, Cotton", elevation: "702m", nearest_ps: "Dharwad Rural PS" },
          { name: "Sutagatti", population: 5120, primary_crop: "Maize, Chilli", elevation: "690m", nearest_ps: "Amargol PS" }
        ]
      },
      {
        name: "Hubli Taluk",
        name_kn: "ಹುಬ್ಬಳ್ಳಿ ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Kusugal", population: 15300, primary_crop: "Onion, Wheat", elevation: "650m", nearest_ps: "Hubli Rural PS" },
          { name: "Bairidevarkoppa", population: 18100, primary_crop: "Vegetables, Flowers", elevation: "670m", nearest_ps: "APMC PS" },
          { name: "Unkal Rural", population: 11400, primary_crop: "Cotton, Maize", elevation: "662m", nearest_ps: "Vidyanagar PS" },
          { name: "Gopankoppa Rural", population: 8900, primary_crop: "Gram, Chilli", elevation: "658m", nearest_ps: "Keshwapur PS" }
        ]
      }
    ]
  },
  {
    name: "Mangaluru",
    name_kn: "ಮಂಗಳೂರು",
    headquarters: "Mangaluru",
    mandals: [
      {
        name: "Mangaluru Taluk",
        name_kn: "ಮಂಗಳೂರು ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Bajpe", population: 18200, primary_crop: "Paddy, Coconut, Arecanut", elevation: "102m", nearest_ps: "Bajpe PS" },
          { name: "Ullal Rural", population: 24300, primary_crop: "Paddy, Cashew", elevation: "5m", nearest_ps: "Ullal PS" },
          { name: "Gurupura", population: 13200, primary_crop: "Arecanut, Paddy", elevation: "45m", nearest_ps: "Mangaluru Rural PS" },
          { name: "Mulki Rural", population: 11400, primary_crop: "Paddy, Coconut", elevation: "12m", nearest_ps: "Mulki PS" },
          { name: "Kinnigoli", population: 14850, primary_crop: "Arecanut, Spices", elevation: "88m", nearest_ps: "Mulki PS" },
          { name: "Someshwara Rural", population: 10300, primary_crop: "Cashew, Coconut", elevation: "15m", nearest_ps: "Ullal PS" },
          { name: "Konaje", population: 15900, primary_crop: "Rubber, Arecanut", elevation: "92m", nearest_ps: "Konaje PS" }
        ]
      },
      {
        name: "Bantwal",
        name_kn: "ಬಂಟ್ವಾళ",
        villages: [
          { name: "Farangipete", population: 12100, primary_crop: "Vegetables, Paddy", elevation: "35m", nearest_ps: "Bantwal PS" },
          { name: "Sajipa", population: 8900, primary_crop: "Coconut, Cocoa", elevation: "52m", nearest_ps: "Bantwal PS" },
          { name: "Vittal Rural", population: 16400, primary_crop: "Arecanut, Pepper", elevation: "110m", nearest_ps: "Vittal PS" },
          { name: "Kabaka", population: 7450, primary_crop: "Rubber, Cashew", elevation: "98m", nearest_ps: "Puttur Rural PS" }
        ]
      }
    ]
  },
  {
    name: "Kalaburagi",
    name_kn: "ಕಲಬುರಗಿ",
    headquarters: "Kalaburagi",
    mandals: [
      {
        name: "Kalaburagi Taluk",
        name_kn: "ಕಲಬುರಗಿ ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Farhatabad", population: 14200, primary_crop: "Tur (Red Gram), Jowar", elevation: "410m", nearest_ps: "Farhatabad PS" },
          { name: "Mahagaon", population: 16300, primary_crop: "Tur, Sugarcane", elevation: "445m", nearest_ps: "Mahagaon PS" },
          { name: "Kalgi", population: 11800, primary_crop: "Cotton, Jowar", elevation: "422m", nearest_ps: "Kalgi PS" },
          { name: "Hunasagi Rural", population: 8150, primary_crop: "Red Gram, Sunflowers", elevation: "405m", nearest_ps: "Grameen PS" },
          { name: "Sindagi Rural", population: 9800, primary_crop: "Tur, Bajra", elevation: "415m", nearest_ps: "Sindagi PS" }
        ]
      },
      {
        name: "Aland",
        name_kn: "ಆಳಂದ್",
        villages: [
          { name: "Khajuri", population: 10400, primary_crop: "Tur, Bajra", elevation: "460m", nearest_ps: "Aland PS" },
          { name: "Nimbal", population: 8900, primary_crop: "Jowar, Cotton", elevation: "450m", nearest_ps: "Aland PS" },
          { name: "Narona", population: 12100, primary_crop: "Tur, Oilseeds", elevation: "468m", nearest_ps: "Narona PS" },
          { name: "Madan Hipparga", population: 11200, primary_crop: "Pulses, Bajra", elevation: "455m", nearest_ps: "Madan Hipparga PS" }
        ]
      }
    ]
  },
  {
    name: "Shivamogga",
    name_kn: "ಶಿವಮೊಗ್ಗ",
    headquarters: "Shivamogga",
    mandals: [
      {
        name: "Shivamogga Taluk",
        name_kn: "ಶಿವಮೊಗ್ಗ ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Gajanur", population: 10450, primary_crop: "Paddy, Arecanut", elevation: "582m", nearest_ps: "Tunga PS" },
          { name: "Haramaghatta", population: 7650, primary_crop: "Arecanut, Maize", elevation: "572m", nearest_ps: "Shivamogga Grameen PS" },
          { name: "Purle", population: 12100, primary_crop: "Paddy, Banana", elevation: "565m", nearest_ps: "Kote PS" },
          { name: "Sogane", population: 8900, primary_crop: "Arecanut, Coconut", elevation: "590m", nearest_ps: "Shivamogga Grameen PS" },
          { name: "Nidige", population: 14500, primary_crop: "Paddy, Vegetables", elevation: "568m", nearest_ps: "Shivamogga Grameen PS" }
        ]
      },
      {
        name: "Bhadravathi",
        name_kn: "ಭದ್ರಾವತಿ",
        villages: [
          { name: "Kudlige", population: 8120, primary_crop: "Sugarcane, Paddy", elevation: "550m", nearest_ps: "Bhadravathi Grameen PS" },
          { name: "Holehonnur", population: 15400, primary_crop: "Sugarcane, Arecanut", elevation: "555m", nearest_ps: "Holehonnur PS" },
          { name: "Singanamane", population: 6150, primary_crop: "Paddy, Sugarcane", elevation: "562m", nearest_ps: "Bhadravathi Paper Town PS" }
        ]
      },
      {
        name: "Sagar",
        name_kn: "ಸಾಗರ",
        villages: [
          { name: "Avinahalli", population: 9150, primary_crop: "Arecanut, Pepper, Vanilla", elevation: "612m", nearest_ps: "Sagar Grameen PS" },
          { name: "Anandapuram", population: 13400, primary_crop: "Arecanut, Paddy", elevation: "605m", nearest_ps: "Anandapuram PS" },
          { name: "Karur", population: 5320, primary_crop: "Spices, Rubber", elevation: "628m", nearest_ps: "Sagar Grameen PS" }
        ]
      }
    ]
  },
  {
    name: "Udupi",
    name_kn: "ಉಡುಪಿ",
    headquarters: "Udupi",
    mandals: [
      {
        name: "Udupi Taluk",
        name_kn: "ಉಡುಪಿ ತಾಲ್ಲೂಕು",
        villages: [
          { name: "Malpe Rural", population: 16900, primary_crop: "Coconut, Marine Fish Trading", elevation: "8m", nearest_ps: "Malpe PS" },
          { name: "Kalyanpura", population: 14500, primary_crop: "Paddy, Coconut", elevation: "12m", nearest_ps: "Malpe PS" },
          { name: "Kaup Rural", population: 18100, primary_crop: "Paddy, Coconut, Jasmine", elevation: "15m", nearest_ps: "Kaup PS" },
          { name: "Shirva", population: 15200, primary_crop: "Arecanut, Jasmine, Coconut", elevation: "42m", nearest_ps: "Shirva PS" },
          { name: "Barkur", population: 9800, primary_crop: "Paddy, Coconut", elevation: "14m", nearest_ps: "Brahmavara PS" },
          { name: "Padubidri Rural", population: 12400, primary_crop: "Coconut, Paddy", elevation: "10m", nearest_ps: "Padubidri PS" }
        ]
      },
      {
        name: "Kundapura",
        name_kn: "ಕುಂದಾಪುರ",
        villages: [
          { name: "Koteshwara", population: 15100, primary_crop: "Paddy, Coconut, Cashew", elevation: "16m", nearest_ps: "Kundapura PS" },
          { name: "Tallur", population: 11200, primary_crop: "Coconut, Paddy", elevation: "18m", nearest_ps: "Kundapura PS" },
          { name: "Gangolli", population: 16300, primary_crop: "Marine Products, Coconut", elevation: "4m", nearest_ps: "Gangolli PS" },
          { name: "Byndoor Rural", population: 14800, primary_crop: "Cashew, Paddy", elevation: "22m", nearest_ps: "Byndoor PS" }
        ]
      },
      {
        name: "Karkala",
        name_kn: "ಕಾರ್ಕಳ",
        villages: [
          { name: "Hebri Rural", population: 11950, primary_crop: "Rubber, Arecanut, Cashew", elevation: "124m", nearest_ps: "Hebri PS" },
          { name: "Mudar", population: 7600, primary_crop: "Arecanut, Cashew", elevation: "115m", nearest_ps: "Karkala Rural PS" },
          { name: "Ajekar", population: 9300, primary_crop: "Arecanut, Coconut", elevation: "108m", nearest_ps: "Ajekar PS" }
        ]
      }
    ]
  }
];
