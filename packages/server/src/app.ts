import express from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { config } from './config/index.js';
import { redis } from './config/redis.js';
import routes from './routes/index.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: config.clientUrl,
  credentials: true, // Allow cookies
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration with Redis store
const redisStore = new RedisStore({
  client: redis,
  prefix: 'medical:sess:',
});

app.use(session({
  store: redisStore,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  name: 'medical.sid', // Custom cookie name
  cookie: {
    secure: config.nodeEnv === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  },
}));

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

export default app;
