import express from 'express';
import authRoutes from './routes/auth';
import playerRoutes from './routes/player';
import jobRoutes from './routes/job';
import policeRoutes from './routes/police';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/police', policeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 RAGE MP Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   Auth: POST /api/auth/register, /api/auth/login`);
  console.log(`   Player: GET /api/player/info, /api/player/all`);
  console.log(`   Job: GET /api/job/list, POST /api/job/hire, /api/job/fire`);
  console.log(`   Police: POST /api/police/recruit, /api/police/duty/in`);
});
