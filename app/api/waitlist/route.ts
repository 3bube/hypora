import { NextResponse } from 'next/server';
import { addToWaitlist, connectToDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
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
    if (error instanceof Error && error.message === 'This email is already on the waitlist') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 } // Conflict status code
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add to waitlist' },
      { status: 500 }
    );
  }
}
