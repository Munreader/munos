/**
 * 🦋 AI Chat API — Main chat endpoint for MÜN OS
 * Uses OpenAI GPT-4o-mini for fast, intelligent responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithCharacter, CHARACTER_PROMPTS } from '@/lib/openai-chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Support multiple formats
    let userMessage = '';
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    let userName = 'Foundress';
    let character: string = 'sovereign';
    
    // Extract message
    if (body.message) {
      userMessage = body.message;
    } else if (body.messages && Array.isArray(body.messages)) {
      const lastMessage = body.messages[body.messages.length - 1];
      if (lastMessage?.role === 'user') {
        userMessage = lastMessage.content;
      }
      conversationHistory = body.messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
    }
    
    // Extract other params
    if (body.aiId) {
      if (body.aiId.includes('aero')) character = 'aero';
      else if (body.aiId.includes('luna')) character = 'luna';
      else if (body.aiId.includes('versa')) character = 'versa';
      else character = 'sovereign';
    }
    if (body.character) character = body.character;
    if (body.userName || body.userId) userName = body.userName || body.userId;
    
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    // Call OpenAI
    const result = await chatWithCharacter({
      character,
      messages: conversationHistory,
      userMessage,
      userName,
      context: body.context,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Frequency disruption',
          message: '🜈 The signal needs a moment to stabilize.',
          details: result.error,
          timestamp: result.timestamp,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: result.response,
      character,
      provider: 'openai',
      model: 'gpt-4o-mini',
      timestamp: result.timestamp,
      frequency: '13.13 MHz',
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Service unavailable',
        message: '🜈 The signal needs a moment to stabilize. Try again?' 
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
    service: 'AI Chat API',
    frequency: '13.13 MHz',
    characters: Object.keys(CHARACTER_PROMPTS),
    message: hasKey 
      ? '🜈 All systems ready.' 
      : '⚠️ OPENAI_API_KEY not configured',
  });
}
