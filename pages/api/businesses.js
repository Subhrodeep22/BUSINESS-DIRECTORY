import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'businesses.json');

// Helper function to read data from JSON file
function readBusinesses() {
  try {
    // Create directory if it doesn't exist
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create file if it doesn't exist
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
      return [];
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading businesses:', error);
    return [];
  }
}

// Helper function to write data to JSON file
function writeBusinesses(businesses) {
  try {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(businesses, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing businesses:', error);
    return false;
  }
}

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, method, body } = req;

  // GET /api/businesses - Get all businesses
  if (method === 'GET' && !query.type) {
    const businesses = readBusinesses();
    return res.json(businesses);
  }

  // GET /api/businesses?type=products - Get product businesses
  if (method === 'GET' && query.type === 'products') {
    const businesses = readBusinesses();
    const products = businesses.filter(b => b.category === 'product');
    return res.json(products);
  }

  // GET /api/businesses?type=services - Get service businesses  
  if (method === 'GET' && query.type === 'services') {
    const businesses = readBusinesses();
    const services = businesses.filter(b => b.category === 'service');
    return res.json(services);
  }

  // POST /api/businesses - Add new business
  if (method === 'POST') {
    const { name, description, email, phone, address, category } = body;

    // Simple validation
    if (!name || !description || !email || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['product', 'service'].includes(category)) {
      return res.status(400).json({ error: 'Category must be product or service' });
    }

    const businesses = readBusinesses();
    
    const newBusiness = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      description,
      email,
      phone: phone || '',
      address: address || '',
      category,
      createdAt: new Date().toISOString()
    };

    businesses.push(newBusiness);
    
    if (writeBusinesses(businesses)) {
      return res.status(201).json(newBusiness);
    } else {
      return res.status(500).json({ error: 'Failed to save business' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
