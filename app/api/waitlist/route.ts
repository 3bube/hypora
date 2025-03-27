import { NextResponse } from 'next/server';
import dbConnect, { addToWaitlist } from '@/lib/db';

export const maxDuration = 10; // Set max duration to 10 seconds for this route

export async function POST(request: Request) {
  try {
    // Ensure database connection is established
    await dbConnect();
    
    const { email, username } = await request.json();
    
    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }
    
    // Add to waitlist using Mongoose model
    await addToWaitlist(email, username);
    
    return NextResponse.json(
      { success: true, message: 'Successfully added to waitlist' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist submission error:', error);
    
    // Check for specific error messages
    if (error instanceof Error) {
      if (error.message === 'This email is already on the waitlist') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 } // Conflict status code
        );
      }
      
      if (error.message === 'The server is experiencing high load. Please try again later.') {
        return NextResponse.json(
          { error: error.message },
          { status: 503 } // Service Unavailable
        );
      }
      
      if (error.message === 'Failed to connect to database') {
        return NextResponse.json(
          { error: 'Unable to connect to the database. Please try again later.' },
          { status: 503 } // Service Unavailable
        );
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}
