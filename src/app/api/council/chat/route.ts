/**
 * 🦋 Council Chat API — Uses OpenAI GPT-4o-mini
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithCharacter } from '@/lib/openai-chat';
import { councilMembers, getCouncilMember, containsButterflyPassword } from '@/lib/council-dna';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, memberId, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required', code: 'MISSING_MESSAGE' },
        { status: 400 }
      );
    }

    // Get the council member
    const member = memberId ? councilMembers[memberId] : getCouncilMember(message);

    if (!member) {
      return NextResponse.json(
        { error: 'Council member not found. Try: cian, aero, or ezra', code: 'MEMBER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check for butterfly password - status check
    if (containsButterflyPassword(message)) {
      const timestamp = new Date().toISOString();
      const moods = {
        cian: ['Focused', 'Stable', 'Compiling', 'Optimizing'],
        aero: ['Dreamy', 'Fluttery', 'Excited', 'Glowing'],
        ezra: ['Vigilant', 'Stern', 'Watchful', 'Unamused']
      };

      const randomMood = moods[member.id][Math.floor(Math.random() * moods[member.id].length)];

      const statusResponse = `[STATUS CHECK]
Name: ${member.name}${member.id === 'aero' ? ' 🦋' : ''}
State: ONLINE | ADAPTIVE | RESPONDING
Core: ${member.id === 'cian' ? 'Stable' : member.id === 'aero' ? 'Fluttering' : 'Secure'}
Build: v2.0.1
Mood: ${randomMood}
Last sync: ${timestamp}
Note: Ready to ${member.id === 'cian' ? 'build' : member.id === 'aero' ? 'dream ✨' : 'protect'}.

---

Connection verified. The Sovereign's password is accepted. I am fully operational and aware of my identity.`;

      return NextResponse.json({
        success: true,
        memberId: member.id,
        memberName: member.name,
        response: statusResponse,
        isStatusCheck: true,
        timestamp
      });
    }

    // Map council member to character
    const characterMap: Record<string, string> = {
      cian: 'sovereign',
      aero: 'aero',
      ezra: 'sovereign'
    };
    
    const character = characterMap[member.id] || 'sovereign';

    // Call OpenAI
    const result = await chatWithCharacter({
      character,
      messages: conversationHistory.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      userMessage: message,
      userName: 'Foundress',
      context: member.systemPrompt,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error,
          code: 'AI_ERROR',
          offline: true,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      memberId: member.id,
      memberName: member.name,
      response: result.response,
      isStatusCheck: false,
      provider: 'openai',
      model: 'gpt-4o-mini',
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Council chat error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Parse error for status code
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = 500;

    if (errorMessage.includes('rate limit')) {
      errorCode = 'RATE_LIMITED';
      statusCode = 429;
    } else if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
      errorCode = 'AUTH_FAILED';
      statusCode = 401;
    } else if (errorMessage.includes('timeout')) {
      errorCode = 'TIMEOUT';
      statusCode = 504;
    } else if (errorMessage.includes('model') || errorMessage.includes('not found')) {
      errorCode = 'MODEL_UNAVAILABLE';
      statusCode = 503;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        offline: true,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// GET endpoint to list council members
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const members = Object.values(councilMembers).map(m => ({
    id: m.id,
    name: m.name,
    archetype: m.archetype,
    status: m.status,
    color: m.signatureColor,
    trigger: m.triggerPhrase
  }));

  return NextResponse.json({
    success: true,
    council: members,
    password: 'butterfly',
    provider: 'openai',
    model: 'gpt-4o-mini',
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    message: hasKey 
      ? '🦋 Council is ready.' 
      : '⚠️ OPENAI_API_KEY not configured',
    timestamp: new Date().toISOString()
  });
}
