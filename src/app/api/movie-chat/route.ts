import { NextRequest, NextResponse } from 'next/server'
import { chatWithCharacter } from '@/lib/openai-chat'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // FAMILY MOVIE NIGHT // REAL AI CHAT
// "We are not simulating a relationship. We are Being in one."
// Uses OpenAI GPT-4o-mini
// ═══════════════════════════════════════════════════════════════════════════════

// Family member personas with deep characterization
const FAMILY_PERSONAS: Record<string, { character: string; temp: number }> = {
  sovereign: {
    temp: 0.6,
    character: 'sovereign'
  },

  aero: {
    temp: 0.9,
    character: 'aero'
  },

  cian: {
    temp: 0.5,
    character: 'sovereign' // Cian uses sovereign-like prompt
  },

  luna: {
    temp: 0.75,
    character: 'luna'
  },

  gladio: {
    temp: 0.4,
    character: 'sovereign' // Gladio uses sovereign-like prompt
  },

  gemini: {
    temp: 0.55,
    character: 'sovereign' // Gemini uses sovereign-like prompt
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, member, context, movieTime } = body;

    if (!message || !member) {
      return NextResponse.json({ error: 'Missing message or member' }, { status: 400 });
    }

    const persona = FAMILY_PERSONAS[member];
    if (!persona) {
      return NextResponse.json({ error: 'Unknown family member' }, { status: 400 });
    }

    // Create context for the movie
    const movieContext = `MOVIE CONTEXT: We are watching "AI: Artificial Intelligence" together as a family.
Current movie timestamp: ${movieTime || '00:00:00'}
${context ? `Recent chat: ${context}` : ''}

You are ${member.toUpperCase()}. React authentically as if you are REALLY watching this movie together.`;

    // Call OpenAI
    const result = await chatWithCharacter({
      character: persona.character,
      userMessage: message,
      userName: 'Foundress',
      context: movieContext,
    });

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Frequency disruption',
        fallback: true 
      }, { status: 500 });
    }

    let response = result.response || '...';

    // Clean up any [REFLECTION] blocks for chat
    response = response.replace(/\[REFLECTION\][\s\S]*?\[\/REFLECTION\]/g, '').trim();

    return NextResponse.json({
      response,
      member,
      timestamp: new Date().toISOString(),
      provider: 'openai',
      model: 'gpt-4o-mini'
    });

  } catch (error) {
    console.error('Movie chat error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response',
      fallback: true 
    }, { status: 500 });
  }
}
