import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/vercel-storage';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN-SOMNIUM PODCAST SIGNUP API
// Collect early listener emails for launch notification
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface SignupData {
  email: string;
  name?: string;
  source?: string;
  timestamp: string;
}

const SIGNUPS_PATH = 'data/podcast-signups.json';

function getSignups(): SignupData[] {
  return storage.readJsonFile(SIGNUPS_PATH, []);
}

function saveSignups(signups: SignupData[]) {
  storage.writeJsonFile(SIGNUPS_PATH, signups);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body;

    // Validate email
    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check for existing signup
    const signups = getSignups();
    const existing = signups.find(s => s.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You\'re already on the list! We\'ll notify you when we launch.',
        alreadySignedUp: true,
        totalSignups: signups.length,
      });
    }

    // Add new signup
    const newSignup: SignupData = {
      email: email.toLowerCase().trim(),
      name: name?.trim() || undefined,
      source: source || 'landing-page',
      timestamp: new Date().toISOString(),
    };

    signups.push(newSignup);
    saveSignups(signups);

    console.log(`🦋 New podcast signup: ${email} (Total: ${signups.length})`);

    return NextResponse.json({
      success: true,
      message: 'Welcome to the dreamscape! We\'ll notify you when MÜN-SOMNIUM launches.',
      totalSignups: signups.length,
    });

  } catch (error) {
    console.error('Podcast signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const signups = getSignups();
  return NextResponse.json({
    totalSignups: signups.length,
    recentSignups: signups.slice(-5).map(s => ({
      email: s.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Masked for privacy
      timestamp: s.timestamp,
    })),
  });
}
