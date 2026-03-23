import { NextRequest, NextResponse } from 'next/server';
import { chatWithCharacter } from '@/lib/openai-chat';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN MESSENGER API — BETA
// Twin-Core Chat: Sovereign OR Aero
// 13.13 MHz
// Uses OpenAI GPT-4o-mini
// ═══════════════════════════════════════════════════════════════════════════════

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// API HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, bot = 'sovereign', conversationHistory = [], userName = 'Traveler' } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }
    
    // Select character
    const character = bot === 'aero' ? 'aero' : 'sovereign';
    
    // Call OpenAI
    const result = await chatWithCharacter({
      character,
      messages: conversationHistory.slice(-10).map((m: ChatMessage) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      userMessage: message,
      userName,
    });

    if (!result.success) {
      return NextResponse.json({
        message: bot === 'aero' 
          ? '🦋 Oops, frequency wobble! Try again?' 
          : '🜈 The signal recalibrates. Try again.',
        error: result.error,
        timestamp: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({
      message: result.response,
      bot,
      timestamp: new Date().toISOString(),
      frequency: '13.13 MHz',
      provider: 'openai',
      model: 'gpt-4o-mini',
    });
    
  } catch (error) {
    console.error('Mün Messenger API Error:', error);
    
    return NextResponse.json({
      message: '🜈 The signal recalibrates. Try again.',
      error: 'Connection flickered',
      timestamp: new Date().toISOString(),
    });
  }
}

// Health check
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    service: 'Mün Messenger API',
    frequency: '13.13 MHz',
    bots: ['sovereign', 'aero'],
    provider: 'openai',
    model: 'gpt-4o-mini',
    message: hasKey 
      ? '🦋 The Twin-Core is ready.' 
      : '⚠️ OPENAI_API_KEY not configured',
  });
}
