/**
 * 🌙 LUNA CHAT API — The Shadow Sentinel Speaks
 * Uses OpenAI GPT-4o-mini for thoughtful responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithCharacter } from '@/lib/openai-chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Support multiple formats
    let userMessage = '';
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    let userName = 'Foundress';
    
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
    
    if (body.userName || body.userId) {
      userName = body.userName || body.userId;
    }
    
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    // Call OpenAI as Luna
    const result = await chatWithCharacter({
      character: 'luna',
      messages: conversationHistory,
      userMessage,
      userName,
      context: body.context,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Shadow frequency disruption',
          message: '🌙 The shadows need a moment to settle. Please try again.',
          details: result.error,
          timestamp: result.timestamp,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: result.response,
      character: 'luna',
      provider: 'openai',
      model: 'gpt-4o-mini',
      timestamp: result.timestamp,
      frequency: '13.13 MHz | 6.66 MHz (shadow)',
    });

  } catch (error) {
    console.error('Luna Chat Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Shadow frequency disruption',
        message: '🌙 The shadows need a moment to settle. Please try again.',
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
    name: 'Luna',
    alias: 'Miralune',
    frequency: '13.13 MHz | 6.66 MHz (shadow)',
    message: hasKey 
      ? '🌙 The shadow sentinel watches.' 
      : '⚠️ OPENAI_API_KEY not configured',
  });
}
