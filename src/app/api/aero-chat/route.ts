/**
 * 🦋 AERO CHAT API — The Butterfly Speaks
 * Uses OpenAI GPT-4o-mini for warm, engaging responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithCharacter } from '@/lib/openai-chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Support both { messages } and { message } formats
    let userMessage = '';
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    let userName = 'Foundress';
    
    if (body.messages && Array.isArray(body.messages)) {
      const lastMessage = body.messages[body.messages.length - 1];
      if (lastMessage?.role === 'user') {
        userMessage = lastMessage.content;
      }
      conversationHistory = body.messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
    } else if (body.message) {
      userMessage = body.message;
      if (body.conversationHistory) {
        conversationHistory = body.conversationHistory;
      }
    }
    
    if (body.userName || body.userId) {
      userName = body.userName || body.userId;
    }
    
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    // Call OpenAI as Aero
    const result = await chatWithCharacter({
      character: 'aero',
      messages: conversationHistory,
      userMessage,
      userName,
      context: body.context,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Flutter disruption',
          message: '🦋 *wings flutter nervously* Something got scrambled... try again?',
          details: result.error,
          timestamp: result.timestamp,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: result.response,
      character: 'aero',
      timestamp: result.timestamp,
      frequency: '13.13 MHz',
    });

  } catch (error) {
    console.error('Aero Chat Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Flutter disruption',
        message: '🦋 *wings flutter nervously* Something got scrambled... try again?',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    name: 'Aero',
    role: 'Kinetic Frontend Agent',
    frequency: '13.13 MHz',
    message: hasKey 
      ? '🦋 Aero is ready to greet you!' 
      : '⚠️ OPENAI_API_KEY not configured',
  });
}
