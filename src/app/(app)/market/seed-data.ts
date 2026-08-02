
export type Seed = {
  crop: string;
  variety: string;
  price: number; // Price per kg
  change: number;
  trend: 'up' | 'down';
  seller: {
    name: string;
    contact: string;
    website?: string;
  };
};

export const seedData: Seed[] = [
  // Wheat
  {
    crop: 'Wheat',
    variety: 'Lokwan',
    price: 45.0,
    change: 2.1,
    trend: 'up',
    seller: {
      name: 'Bhopal Agri Seeds',
      contact: '+919876543210',
      website: 'https://example.com/bhopal-agri',
    },
  },
  {
    crop: 'Wheat',
    variety: 'Shrabati',
    price: 52.0,
    change: -1.5,
    trend: 'down',
    seller: {
      name: 'Indore Seed Corp',
      contact: '+919123456789',
    },
  },

  // Tomato
  {
    crop: 'Tomato',
    variety: 'Desi',
    price: 250.0,
    change: 5.3,
    trend: 'up',
    seller: {
      name: 'Nashik Hybrid Seeds',
      contact: '+919988776655',
      website: 'https://example.com/nashik-hybrid',
    },
  },
  {
    crop: 'Tomato',
    variety: 'Heirloom',
    price: 310.0,
    change: 3.1,
    trend: 'up',
    seller: {
      name: 'Pune Organics',
      contact: '+919234567890',
    },
  },

  // Soybean
  {
    crop: 'Soybean',
    variety: 'JS-335',
    price: 90.0,
    change: -0.8,
    trend: 'down',
    seller: {
      name: 'Central India Seeds',
      contact: '+919555666777',
      website: 'https://example.com/central-india-seeds',
    },
  },
  
  // Paddy
  {
    crop: 'Paddy (Dhan)',
    variety: 'Basmati-1121',
    price: 85.0,
    change: 1.2,
    trend: 'up',
    seller: {
      name: 'Punjab Seed Traders',
      contact: '+919443322110',
    },
  },
  
  // Cotton
  {
    crop: 'Cotton',
    variety: 'BT Cotton',
    price: 950.0,
    change: 0.5,
    trend: 'up',
    seller: {
      name: 'Gujarat Cotton Hub',
      contact: '+919112233445',
      website: 'https://example.com/gujarat-cotton',
    },
  },
];
