import mongoose from 'mongoose';

// Connection URI - ensure it's a string
const MONGODB_URI = process.env.MONGODB_URI as string;

// Validate MongoDB URI
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define interface for cached connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global mongoose type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedConnection | undefined;
}

// Define the Waitlist schema
const WaitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create the Waitlist model
export const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', WaitlistSchema);

/** 
 * Cached connection for MongoDB.
 */
const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB database
 */
async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 10000, // Close sockets after 10 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Add a new waitlist entry with timeout handling
export async function addToWaitlist(email: string, username: string) {
  try {
    // Set a timeout for the entire operation
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database operation timed out'));
      }, 8000); // 8 second timeout
    });

    // Connect to database with timeout
    await Promise.race([
      dbConnect(),
      timeoutPromise
    ]);
    
    // Create and save waitlist entry with timeout
    const waitlistEntry = new Waitlist({
      email,
      username,
    });
    
    const savePromise = waitlistEntry.save();
    return await Promise.race([savePromise, timeoutPromise]);
    
  } catch (error: unknown) {
    // Handle duplicate key error (email already exists)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      throw new Error('This email is already on the waitlist');
    }
    
    // Handle timeout errors with a user-friendly message
    if (error instanceof Error && error.message === 'Database operation timed out') {
      console.error('Database operation timeout:', error);
      throw new Error('The server is experiencing high load. Please try again later.');
    }
    
    console.error('Database error:', error);
    throw error;
  }
}

export default dbConnect;
