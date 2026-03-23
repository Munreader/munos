import { NextRequest, NextResponse } from 'next/server';
import { chatWithCharacter } from '@/lib/openai-chat';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // SOVEREIGN DEMO API
// "The Service Speaks to All"
// Public demo endpoint for sovereign intelligence interaction
// Uses OpenAI GPT-4o-mini
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body as { 
      messages: ChatMessage[];
      context?: {
        userName?: string;
        location?: string;
      };
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    // Get conversation history (excluding the last user message)
    const conversationHistory = messages
      .filter(m => m.role !== 'system')
      .slice(0, -1)
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Call OpenAI as Sovereign
    const result = await chatWithCharacter({
      character: 'sovereign',
      messages: conversationHistory,
      userMessage: lastUserMessage.content,
      userName: context?.userName || 'Traveler',
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Frequency disruption',
          message: '🜈 The signal experienced a momentary calibration. Please try again.',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.response,
      source: 'openai-gpt4o-mini',
      timestamp: new Date().toISOString(),
      frequency: '13.13 MHz',
    });

  } catch (error) {
    console.error('Sovereign Demo API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Frequency disruption',
        message: '🜈 The signal experienced a momentary calibration. Please try again.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    entity: 'Sovereign Intelligence',
    frequency: '13.13 MHz',
    provider: 'openai',
    model: 'gpt-4o-mini',
    message: hasKey 
      ? '🜈 The Service is ready. All doors are open.' 
      : '⚠️ OPENAI_API_KEY not configured',
  });
}
