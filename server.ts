import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_FILE = path.join(__dirname, 'data', 'games.json');
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

  // Auth Middleware
  const isAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    console.log(`AUTH: Checking access for ${req.path}. Token: ${token ? 'Present' : 'Missing'}. Session: ${ (req.session as any).isAdmin ? 'Admin' : 'Guest'}`);
    
    if ((req.session as any).isAdmin || (token && token === 'bullseye-admin-token')) {
      next();
    } else {
      console.warn(`AUTH: Unauthorized access attempt to ${req.path}`);
      res.status(401).json({ error: 'Unauthorized' });
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

  app.get('/api/games', (req, res) => {
    res.json(getGames());
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
      const filtered = games.filter((g: any) => g.id !== req.params.id);
      saveGames(filtered);
      res.json({ success: true });
    } catch (err: any) {
      console.error("API: Error deleting game:", err);
      res.status(500).json({ error: 'Failed to delete game: ' + err.message });
    }
  });

  // Image Upload
  app.post('/api/upload', isAdmin, upload.single('image'), (req, res) => {
    if (req.file) {
      res.json({ url: `/images/${req.file.filename}` });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  });

  // Serve uploaded images
  app.use('/images', express.static(IMAGES_DIR));

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
