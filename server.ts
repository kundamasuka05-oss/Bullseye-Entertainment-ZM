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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1); // trust first proxy
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
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Multer setup for image uploads
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
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  // Cloudinary Configuration
  const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  
  let cloudinaryUpload = upload; // Fallback to local multer

  if (useCloudinary) {
    const rawCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudName = rawCloudName?.toLowerCase();
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
    console.warn("STORAGE: Cloudinary credentials missing. Falling back to local storage (temporary).");
  }

  // Auth Middleware
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

  // --- API Routes ---

  // Auth
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

  // Data Helpers
  const getGames = () => {
    try {
      if (!fs.existsSync(GAMES_FILE)) return [];
      const data = fs.readFileSync(GAMES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("DATABASE: Error reading games.json");
      return [];
    }
  };

  const saveGames = (games: any[]) => {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
  };

  const getContent = () => {
    try {
      if (!fs.existsSync(CONTENT_FILE)) return {};
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("DATABASE: Error reading content.json");
      return {};
    }
  };

  const saveContent = (content: any) => {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  };

  const getGallery = () => {
    try {
      if (!fs.existsSync(GALLERY_FILE)) return [];
      const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("DATABASE: Error reading gallery.json");
      return [];
    }
  };

  const saveGallery = (gallery: any[]) => {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));
  };

  // Endpoints
  app.get('/api/games', (req, res) => {
    res.json(getGames());
  });

  app.get('/api/content', (req, res) => {
    res.json(getContent());
  });

  app.get('/api/gallery', (req, res) => {
    res.json(getGallery());
  });

  app.post('/api/content', isAdmin, (req, res) => {
    try {
      saveContent(req.body);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save content' });
    }
  });

  app.post('/api/gallery', isAdmin, (req, res) => {
    try {
      saveGallery(req.body);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save gallery' });
    }
  });

  app.post('/api/games', isAdmin, (req, res) => {
    try {
      const games = getGames();
      const newGame = { ...req.body, id: Date.now().toString() };
      games.push(newGame);
      saveGames(games);
      res.json(newGame);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save game' });
    }
  });

  app.put('/api/games/:id', isAdmin, (req, res) => {
    try {
      let games = getGames();
      const index = games.findIndex((g: any) => g.id === req.params.id);
      if (index !== -1) {
        games[index] = { ...games[index], ...req.body };
        saveGames(games);
        res.json(games[index]);
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update game' });
    }
  });

  app.delete('/api/games/:id', isAdmin, (req, res) => {
    try {
      let games = getGames();
      const gameToDelete = games.find((g: any) => g.id === req.params.id);
      if (gameToDelete && gameToDelete.locked) {
        return res.status(403).json({ error: 'This asset is locked and cannot be deleted.' });
      }
      games = games.filter((g: any) => g.id !== req.params.id);
      saveGames(games);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete game' });
    }
  });

  // Image Upload
  app.post('/api/upload', isAdmin, (req, res) => {
    try {
      if (!cloudinaryUpload) {
        return res.status(500).json({ error: 'Upload system not initialized' });
      }

      cloudinaryUpload.single('image')(req, res, (err) => {
        if (err) {
          return res.status(500).json({ 
            error: 'Upload failed: ' + (err.message || 'Internal Server Error')
          });
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

  // Serve uploaded images
  app.use('/images', express.static(IMAGES_DIR));

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("SERVER ERROR:", err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({ 
      error: 'Internal Server Error', 
      message: err.message || 'An unexpected error occurred'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
