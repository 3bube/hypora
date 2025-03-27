import mongoose from 'mongoose';

// Connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hypora";

// Define interface for cached connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
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
// We need to use mongoose.models to check if the model already exists to prevent model overwrite errors
export const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', WaitlistSchema);

// Define the global mongoose type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedConnection | undefined;
}

// Database connection caching
const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Add a new waitlist entry
export async function addToWaitlist(email: string, username: string) {
  await connectToDatabase();
  
  try {
    const waitlistEntry = new Waitlist({
      email,
      username,
    });
    
    return await waitlistEntry.save();
  } catch (error: unknown) {
    // Handle duplicate key error (email already exists)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      throw new Error('This email is already on the waitlist');
    }
    throw error;
  }
}
