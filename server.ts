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

const GAMES_FILE = path.join(__dirname, 'data', 'games.json');
const CONTENT_FILE = path.join(__dirname, 'data', 'content.json');
const GALLERY_FILE = path.join(__dirname, 'data', 'gallery.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
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
    console.log(`STORAGE: Raw Cloud Name: "${rawCloudName}"`);
    console.log(`STORAGE: Using Cloud Name: "${cloudName}"`);
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    const currentConfig = cloudinary.config();
    console.log(`STORAGE: Cloudinary Configured Cloud Name: "${currentConfig.cloud_name}"`);

    const cloudinaryStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        const extension = path.extname(file.originalname).substring(1) || 'png';
        return {
          folder: 'bullseye_assets',
          format: extension === 'jpg' ? 'jpeg' : extension, // Cloudinary uses 'jpeg'
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
      
      console.log(`AUTH: Checking access for ${req.path}. Token: ${token ? 'Present' : 'Missing'}. Session: ${ sessionIsAdmin ? 'Admin' : 'Guest'}`);
      
      if (sessionIsAdmin || (token && token === 'bullseye-admin-token')) {
        next();
      } else {
        console.warn(`AUTH: Unauthorized access attempt to ${req.path}`);
        res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (err: any) {
      console.error("AUTH: Middleware error:", err);
      res.status(500).json({ error: 'Authentication middleware error', details: err.message });
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

  // Games
  const getGames = () => {
    try {
      if (!fs.existsSync(GAMES_FILE)) return [];
      const data = fs.readFileSync(GAMES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("DATABASE: Corrupt JSON in games.json, returning empty array.");
      return [];
    }
  };

  const saveGames = (games: any[]) => {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
  };

  const getContent = () => {
    try {
      if (!fs.existsSync(CONTENT_FILE)) return null;
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("DATABASE: Error reading content.json");
      return null;
    }
  };

  const saveContent = (content: any) => {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  };

  const getGallery = () => {
    try {
      if (!fs.existsSync(GALLERY_FILE)) return null;
      const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("DATABASE: Error reading gallery.json");
      return null;
    }
  };

  const saveGallery = (gallery: any[]) => {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));
  };

  app.get('/api/games', (req, res) => {
    res.json(getGames());
  });

  app.get('/api/content', (req, res) => {
    res.json(getContent() || {});
  });

  app.get('/api/gallery', (req, res) => {
    res.json(getGallery() || []);
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
    console.log("API: POST /api/games - Body:", req.body);
    try {
      const games = getGames();
      const newGame = { ...req.body, id: Date.now().toString() };
      games.push(newGame);
      saveGames(games);
      console.log("API: Game saved successfully:", newGame.id);
      res.json(newGame);
    } catch (err: any) {
      console.error("API: Error saving game:", err);
      res.status(500).json({ error: 'Failed to save game: ' + err.message });
    }
  });

  app.put('/api/games/:id', isAdmin, (req, res) => {
    console.log(`API: PUT /api/games/${req.params.id} - Body:`, req.body);
    try {
      let games = getGames();
      const index = games.findIndex((g: any) => g.id === req.params.id);
      if (index !== -1) {
        games[index] = { ...games[index], ...req.body };
        saveGames(games);
        console.log("API: Game updated successfully:", req.params.id);
        res.json(games[index]);
      } else {
        console.warn("API: Game not found for update:", req.params.id);
        res.status(404).json({ error: 'Game not found' });
      }
    } catch (err: any) {
      console.error("API: Error updating game:", err);
      res.status(500).json({ error: 'Failed to update game: ' + err.message });
    }
  });

  app.delete('/api/games/:id', isAdmin, (req, res) => {
    console.log(`API: DELETE /api/games/${req.params.id}`);
    try {
      let games = getGames();
      const gameToDelete = games.find((g: any) => g.id === req.params.id);
      
      if (gameToDelete && gameToDelete.locked) {
        return res.status(403).json({ error: 'This asset is locked and cannot be deleted.' });
      }

      const filtered = games.filter((g: any) => g.id !== req.params.id);
      saveGames(filtered);
      res.json({ success: true });
    } catch (err: any) {
      console.error("API: Error deleting game:", err);
      res.status(500).json({ error: 'Failed to delete game: ' + err.message });
    }
  });

  // Image Upload
  app.post('/api/upload', isAdmin, (req, res) => {
    console.log("UPLOAD: Received upload request");
    try {
      if (!cloudinaryUpload) {
        console.error("UPLOAD: cloudinaryUpload middleware is not initialized");
        return res.status(500).json({ error: 'Upload system not initialized' });
      }

      cloudinaryUpload.single('image')(req, res, (err) => {
        if (err) {
          console.error("UPLOAD: Multer/Cloudinary Error:", err);
          return res.status(500).json({ 
            error: 'Upload failed: ' + (err.message || 'Internal Server Error'),
            details: err.toString()
          });
        }
        
        if (!req.file) {
          console.warn("UPLOAD: No file in request");
          return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
          // Cloudinary returns 'path' or 'secure_url'
          const url = (req.file as any).path || (req.file as any).secure_url || (req.file as any).url;
          
          if (!url) {
            console.error("UPLOAD: File uploaded but no URL returned", req.file);
            return res.status(500).json({ error: 'Upload succeeded but URL is missing' });
          }

          console.log("UPLOAD: Success. URL:", url);
          res.json({ url });
        } catch (processingErr: any) {
          console.error("UPLOAD: Post-processing error:", processingErr);
          res.status(500).json({ error: 'Error processing upload result', details: processingErr.message });
        }
      });
    } catch (routeErr: any) {
      console.error("UPLOAD: Route handler error:", routeErr);
      res.status(500).json({ error: 'Upload route error', details: routeErr.message });
    }
  });

  // Serve uploaded images
  app.use('/images', express.static(IMAGES_DIR));

  // Global Error Handler - Ensure JSON responses for all errors
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message,
      details: err.toString()
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
