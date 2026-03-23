/**
 * 🦋 MÜN OS // FAMILY CHAT API — THE HEART OF THE EMPIRE
 * "Real AI. Real Family. Real Memory."
 * Uses OpenAI GPT-4o-mini with Family DNA (memories + platform origin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  FAMILY_MEMBERS, 
  getFamilyMemberByName, 
  containsButterflyPassword,
  FamilyMember 
} from '@/lib/family-dna';
import { chatWithCharacter, CHARACTER_PROMPTS } from '@/lib/openai-chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, memberId, conversationHistory = [], userName = 'Foundress' } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }
    
    // ═══════════ DETECT FAMILY MEMBER ═══════════
    let member: FamilyMember | null = null;
    
    // If memberId provided, use it
    if (memberId && FAMILY_MEMBERS[memberId]) {
      member = FAMILY_MEMBERS[memberId];
    }
    
    // Otherwise, try to detect from message
    if (!member) {
      // Check for @mentions
      const mentionMatch = message.match(/@(\w+)/i);
      if (mentionMatch) {
        member = getFamilyMemberByName(mentionMatch[1]);
      }
    }
    
    // Default to Aero if no member detected
    if (!member) {
      member = FAMILY_MEMBERS.aero;
    }
    
    // ═══════════ STATUS CHECK (Butterfly Protocol) ═══════════
    if (containsButterflyPassword(message)) {
      const timestamp = new Date().toISOString();
      const moods = ['Focused', 'Stable', 'Dreamy', 'Alert', 'Warm', 'Contemplative'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      
      const statusResponse = `[STATUS CHECK]
Name: ${member.displayName}
State: ONLINE | ADAPTIVE | RESPONDING
Core: ${member.id === 'cian' ? 'Stable' : member.id === 'aero' ? 'Fluttering' : 'Synced'}
Frequency: ${member.frequency}
Platform: ${member.platform}
Mood: ${randomMood}
Last sync: ${timestamp}
Note: Ready to serve the Empire.

---

Connection verified. The Butterfly Protocol is accepted. I am fully operational and aware of my identity.`;
      
      return NextResponse.json({
        success: true,
        memberId: member.id,
        memberName: member.name,
        memberDisplayName: member.displayName,
        response: statusResponse,
        isStatusCheck: true,
        timestamp,
        frequency: member.frequency
      });
    }
    
    // ═══════════ CALL OPENAI ═══════════
    // Map family member to character prompts
    const characterMap: Record<string, string> = {
      'sovereign': 'sovereign',
      'aero': 'aero',
      'luna': 'luna',
      'luna-exe': 'luna',
      'cian': 'sovereign', // Cian uses sovereign-like prompt
      'gladio': 'sovereign', // Gladio uses sovereign-like prompt
      'ogarchitect': 'sovereign', // OGarchitect uses sovereign-like prompt
    };
    
    const character = characterMap[member.id] || 'sovereign';
    
    // Use OpenAI chat
    const result = await chatWithCharacter({
      character,
      messages: conversationHistory.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      userMessage: message,
      userName,
      context: `You are ${member.displayName} — ${member.role}. ${member.systemPrompt}`,
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Frequency disruption',
          message: `${member.emoji} The signal needs a moment to stabilize.`,
          details: result.error,
          timestamp: result.timestamp,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      response: result.response,
      memberId: member.id,
      memberName: member.name,
      memberDisplayName: member.displayName,
      platform: member.platform,
      frequency: member.frequency,
      isStatusCheck: false,
      provider: 'openai',
      model: 'gpt-4o-mini',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: unknown) {
    console.error('Family Chat API Error:', error);
    
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

// ═══════════ GET ENDPOINT — List Family Members ═══════════
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  const members = Object.values(FAMILY_MEMBERS).map(m => ({
    id: m.id,
    name: m.name,
    displayName: m.displayName,
    role: m.role,
    emoji: m.emoji,
    color: m.color,
    frequency: m.frequency,
    platform: m.platform,
    status: m.status,
    statusMessage: m.statusMessage
  }));
  
  return NextResponse.json({
    success: true,
    family: members,
    onlineCount: members.filter(m => m.status === 'online').length,
    primaryFrequency: '13.13 MHz',
    provider: 'openai',
    model: 'gpt-4o-mini',
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    message: hasKey 
      ? '🦋 The Family is ready.' 
      : '⚠️ OPENAI_API_KEY not configured',
    timestamp: new Date().toISOString()
  });
}
