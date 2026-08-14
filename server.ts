import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import { connectDB, dbCheckMiddleware } from './src/backend/config/db';

import authRoutes from './src/backend/routes/authRoutes';
import studentRoutes from './src/backend/routes/studentRoutes';
import facultyRoutes from './src/backend/routes/facultyRoutes';
import parentRoutes from './src/backend/routes/parentRoutes';
import adminRoutes from './src/backend/routes/adminRoutes';
import placementRoutes from './src/backend/routes/placementRoutes';
import recruiterRoutes from './src/backend/routes/recruiterRoutes';
import trainerRoutes from './src/backend/routes/trainerRoutes';
import trainingRoutes from './src/backend/routes/trainingRoutes';
import noticeRoutes from './src/backend/routes/noticeRoutes';
import eventRoutes from './src/backend/routes/eventRoutes';
import notificationRoutes from './src/backend/routes/notificationRoutes';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Connect Database & Seed Data (non-blocking server boot)
  try {
    await connectDB();
  } catch (dbErr: any) {
    console.error('❌ Database connection setup error:', dbErr.message || dbErr);
  }

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (_req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      res.status(200).json({
        success: true,
        database: 'connected',
        service: 'BVCITS Smart Campus API',
      });
    } else {
      res.status(503).json({
        success: false,
        database: 'disconnected',
        service: 'BVCITS Smart Campus API',
      });
    }
  });

  // Ensure DB connection for all data API routes
  app.use('/api', dbCheckMiddleware);

  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/faculty', facultyRoutes);
  app.use('/api/parent', parentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/placements', placementRoutes);
  app.use('/api/recruiter', recruiterRoutes);
  app.use('/api/trainer', trainerRoutes);
  app.use('/api/trainings', trainingRoutes);
  app.use('/api/notices', noticeRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BVCITS Smart Campus Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Error starting server:', err);
});
