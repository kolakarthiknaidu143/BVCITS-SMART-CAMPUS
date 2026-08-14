import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { seedDatabase } from '../seed';

let connectionPromise: Promise<boolean> | null = null;
let lastAttemptTime = 0;
const RETRY_COOLDOWN_MS = 5000;

export const connectDB = async (): Promise<boolean> => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const now = Date.now();
  if (now - lastAttemptTime < RETRY_COOLDOWN_MS) {
    return false;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.trim() === '') {
    console.error('❌ MONGODB_URI environment variable is not set. Database is disconnected.');
    return false;
  }

  lastAttemptTime = now;
  connectionPromise = (async () => {
    try {
      console.log('🔌 Connecting to MongoDB Atlas cluster...');
      mongoose.set('bufferCommands', false);

      await mongoose.connect(mongoUri, {
        dbName: 'bvcits-smart-campus',
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB Atlas successfully.');

      // Auto-seed initial demo data if database collections are empty
      try {
        await seedDatabase();
      } catch (seedErr: any) {
        console.warn('⚠️ Database seed warning on Atlas:', seedErr.message || seedErr);
      }

      return true;
    } catch (error: any) {
      const errorMsg = error.message || String(error);
      console.error('❌ MongoDB Atlas Connection Failed:', errorMsg);

      if (
        errorMsg.includes('whitelisted') ||
        errorMsg.includes('connect ECONNREFUSED') ||
        errorMsg.includes('selection timed out') ||
        errorMsg.includes('ETIMEDOUT')
      ) {
        console.info('💡 Note: Make sure your Cloud Run or server IP is on the Atlas Network Access IP Whitelist (0.0.0.0/0 for public access).');
      }

      try {
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
      } catch (_) {}

      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
};

// Express middleware to ensure database connection before processing database-dependent requests
export const dbCheckMiddleware = async (_req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  const connected = await connectDB();
  if (connected) {
    return next();
  }

  res.status(503).json({
    success: false,
    message: '❌ MongoDB Atlas Connection Failed: Database service is currently unavailable. Please check your Atlas cluster IP Whitelist (0.0.0.0/0).',
    error: 'Database service unavailable.',
  });
};



