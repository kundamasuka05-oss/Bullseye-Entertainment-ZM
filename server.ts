import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const mongoClient = new MongoClient(process.env.MONGODB_URI || '');
let db: any;

async function connectDB() {
  await mongoClient.connect();
  db = mongoClient.db('bullseye');
  console.log('DATABASE: MongoDB connected.');
}

async function startServer() {
  await connectDB();

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'bullseye-secret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
  });

  const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  let cloudinaryUpload = upload;

  if (useCloudinary) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.toLowerCase();
    console.log(`STORAGE: Cloudinary credentials found.`);
    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const cloudinaryStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        const extension = path.extname(file.originalname).substring(1) || 'png';
        return {
          folder: 'bullseye_assets',
          format: extension === 'jpg' ? 'jpeg' : extension,
          public_id: `asset-${Date.now()}-${Math.round(Math.random() * 1E4)}`,
          transformation: [{ quality: 'auto' }]
        };
      },
    });
    cloudinaryUpload = multer({ storage: cloudinaryStorage });
  } else {
    console.warn("STORAGE: Cloudinary credentials missing. Falling back to local storage.");
  }

  const isAdmin = (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const sessionIsAdmin = req.session && (req.session as any).isAdmin;
      if (sessionIsAdmin || (token && token === 'bullseye-admin-token')) {
        next();
      } else {
        res.status(401).json({ error: 'Unauthorized', message: 'Please log in to perform this action.' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Authentication error', details: err.message });
    }
  };

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'bullseye_admin_2024';
    if (username === expectedUser && password === expectedPass) {
      (req.session as any).isAdmin = true;
      res.json({ success: true, token: 'bullseye-admin-token' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get('/api/auth/check', (req, res) => {
    res.json({ isAdmin: !!(req.session as any).isAdmin });
  });

  app.get('/api/games', async (req, res) => {
    try {
      const games = await db.collection('games').find().toArray();
      res.json(games);
    } catch (e) {
      res.status(500).json({ error: 'Failed to get games' });
    }
  });

  app.get('/api/content', async (req, res) => {
    try {
      const content = await db.collection('content').findOne({ _id: 'main' as any });
      res.json(content || {});
    } catch (e) {
      res.status(500).json({ error: 'Failed to get content' });
    }
  });

  app.get('/api/gallery', async (req, res) => {
    try {
      const gallery = await db.collection('gallery').find().toArray();
      res.json(gallery);
    } catch (e) {
      res.status(500).json({ error: 'Failed to get gallery' });
    }
  });

  app.post('/api/content', isAdmin, async (req, res) => {
    try {
      await db.collection('content').replaceOne({ _id: 'main' as any }, { _id: 'main', ...req.body }, { upsert: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save content' });
    }
  });

  app.post('/api/gallery', isAdmin, async (req, res) => {
    try {
      await db.collection('gallery').deleteMany({});
      if (req.body.length > 0) await db.collection('gallery').insertMany(req.body);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save gallery' });
    }
  });

  app.post('/api/games', isAdmin, async (req, res) => {
    try {
      const newGame = { ...req.body, id: Date.now().toString() };
      await db.collection('games').insertOne(newGame);
      res.json(newGame);
    } catch (e) {
      res.status(500).json({ error: 'Failed to save game' });
    }
  });

  app.put('/api/games/:id', isAdmin, async (req, res) => {
    try {
      await db.collection('games').updateOne({ id: req.params.id }, { $set: req.body });
      const updated = await db.collection('games').findOne({ id: req.params.id });
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    } catch (e) {
      res.status(500).json({ error: 'Failed to update game' });
    }
  });

  app.delete('/api/games/:id', isAdmin, async (req, res) => {
    try {
      const game = await db.collection('games').findOne({ id: req.params.id });
      if (game && game.locked) {
        return res.status(403).json({ error: 'This asset is locked and cannot be deleted.' });
      }
      await db.collection('games').deleteOne({ id: req.params.id });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete game' });
    }
  });

  app.post('/api/upload', isAdmin, (req, res) => {
    try {
      if (!cloudinaryUpload) {
        return res.status(500).json({ error: 'Upload system not initialized' });
      }
      cloudinaryUpload.single('image')(req, res, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Upload failed: ' + (err.message || 'Internal Server Error') });
        }
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        const url = (req.file as any).path || (req.file as any).secure_url || (req.file as any).url;
        if (!url) {
          return res.status(500).json({ error: 'Upload succeeded but URL is missing' });
        }
        res.json({ url });
      });
    } catch (routeErr: any) {
      res.status(500).json({ error: 'Upload route error' });
    }
  });

  app.post('/api/generate-description', isAdmin, async (req, res) => {
    try {
      const { productName, category } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Write a fun, exciting, and short sales description (max 2 sentences) for a party rental item named "${productName}" in the category "${category}". The tone should be energetic and suitable for an event company called Bullseye Entertainment ZM.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      res.json({ description: response.text.trim() });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to generate description' });
    }
  });

  app.use('/images', express.static(IMAGES_DIR));

  app.use((err: any, req: any, res: any, next: any) => {
    console.error("SERVER ERROR:", err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred'
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*path', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
