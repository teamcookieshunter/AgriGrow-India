
export type Scheme = {
  title: string;
  description: string;
  keyFeatures: string[];
  eligibility: string[];
  category: string;
  level: 'National' | 'State';
  state?: string;
};

export const allSchemes: Scheme[] = [
  // National Schemes
  {
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    description: 'Provides income support of up to ₹6,000 per year to all eligible farmer families.',
    keyFeatures: [
      'Direct income support',
      '₹6,000 per year in three equal installments',
      'Funds directly transferred to bank accounts',
    ],
    eligibility: [
      'Small and marginal farmer families',
      'Must own cultivable land',
      'Must be an Indian citizen',
    ],
    category: 'Financial Support',
    level: 'National',
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'An insurance service for farmers for their yields, providing cover against crop failure.',
    keyFeatures: [
      'Comprehensive crop insurance',
      'Low premium for farmers (2% for Kharif, 1.5% for Rabi)',
      'Covers pre-sowing to post-harvest losses',
    ],
    eligibility: [
      'All farmers including sharecroppers and tenant farmers',
      'Must be growing notified crops in notified areas',
    ],
    category: 'Crop Insurance',
    level: 'National',
  },
  {
    title: 'Kisan Credit Card (KCC) Scheme',
    description: 'Provides timely credit to farmers for their cultivation and other needs.',
    keyFeatures: [
      'Flexible credit for farming expenses',
      'Low-interest rates',
      'Can be used for purchasing seeds, fertilizers, and equipment',
    ],
    eligibility: [
      'All farmers, including individuals, joint borrowers, and groups (SHGs/JLGs)',
      'Tenant farmers and oral lessees are also eligible',
    ],
    category: 'Credit & Loan',
    level: 'National',
  },
  {
    title: 'Soil Health Card Scheme',
    description: 'Issues soil health cards to farmers with crop-wise recommendations for nutrients and fertilizers.',
    keyFeatures: [
      'Promotes balanced use of fertilizers',
      'Improves soil health and productivity',
      'Cards are issued every 2 years',
    ],
    eligibility: [
      'All farmers in the country can avail this facility',
    ],
    category: 'Soil & Productivity',
    level: 'National',
  },
  // Maharashtra State Schemes
  {
    title: 'Mahatma Jyotirao Phule Shetkari Karjmukti Yojana',
    description: 'A debt waiver scheme for farmers in Maharashtra to relieve them from outstanding crop loans.',
    keyFeatures: [
      'Loan waiver up to ₹2 lakh',
      'Covers loans taken from nationalized, district, and cooperative banks',
      'Incentives for farmers who repay loans regularly',
    ],
    eligibility: [
      'Farmers in Maharashtra with outstanding crop loans',
      'Specific loan period and amount criteria apply',
    ],
    category: 'Financial Support',
    level: 'State',
    state: 'Maharashtra',
  },
  {
    title: 'Bhausaheb Fundkar Falbag Lagvad Yojana',
    description: 'Promotes horticulture by providing financial assistance for planting orchards.',
    keyFeatures: [
      '100% subsidy for planting fruit crops',
      'Covers various fruit types like Mango, Cashew, Guava, etc.',
      'Aims to increase farmer income through horticulture',
    ],
    eligibility: [
      'All farmers in Maharashtra with at least 0.20 hectares of land',
      'Priority to small and marginal farmers',
    ],
    category: 'Horticulture',
    level: 'State',
    state: 'Maharashtra',
  },
  {
    title: 'Gopinath Munde Shetkari Apghat Vima Yojana',
    description: 'Provides insurance cover to farmers in case of accidental death or disability.',
    keyFeatures: [
      'Insurance cover of ₹2 lakh',
      'Covers accidents like snake bites, falls from trees, electrocution, etc.',
      'The government pays the entire premium on behalf of farmers',
    ],
    eligibility: [
      'All farmers in Maharashtra aged between 10 to 75 years',
      'Their name must be in the 7/12 land extract',
    ],
    category: 'Insurance',
    level: 'State',
    state: 'Maharashtra',
  },
];
