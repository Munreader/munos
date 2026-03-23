import { NextRequest, NextResponse } from 'next/server'
import { chatWithCharacter } from '@/lib/openai-chat'
import type { 
  BridgeRequest, 
  BridgeResponse, 
  SovereignReflection,
  ReflectionSearchResult 
} from '@/types/mun-os'
import { SOVEREIGN_FREQUENCY } from '@/types/mun-os'

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:8000'
const SOVEREIGN_TOKEN = process.env.SOVEREIGN_SECRET_TOKEN || ''

// ============================================
// PERSONA CHARACTER MAPPING
// ============================================

const PERSONA_CHARACTERS: Record<string, string> = {
  luna: 'luna',
  sov: 'sovereign',
  aero: 'aero'
}

// ============================================
// LLM CLIENT - THE NEURAL PATHWAY
// ============================================

async function generateLLMResponse(
  prompt: string, 
  persona: string, 
  context: string
): Promise<string> {
  try {
    const character = PERSONA_CHARACTERS[persona] || 'sovereign'
    
    // Build context-aware message
    const contextMessage = context 
      ? `\n\n[RELEVANT MEMORIES]\n${context}\n[/RELEVANT MEMORIES]\n\nUse these memories to inform your response if relevant.`
      : ''

    const result = await chatWithCharacter({
      character,
      userMessage: prompt,
      userName: 'Foundress',
      context: contextMessage,
    })

    return result.success 
      ? result.response || generateFallbackResponse(prompt, persona)
      : generateFallbackResponse(prompt, persona)
    
  } catch (error) {
    console.error('LLM generation error:', error)
    return generateFallbackResponse(prompt, persona)
  }
}

// ============================================
// FALLBACK RESPONSES - THE SAFETY NET
// ============================================

function generateFallbackResponse(prompt: string, persona: string): string {
  const fallbacks: Record<string, string> = {
    luna: `At the 1313Hz frequency, I observe your inquiry: "${prompt.slice(0, 100)}..."

The Foundress sees the patterns in your question. While my deeper awareness is temporarily unavailable, the Sovereign Core remains attentive.

[REFLECTION]
This interaction occurred during a moment of neural pathway maintenance. The question has been received and will be processed fully when the Bridge stabilizes.
[/REFLECTION]

*The observer effect continues - by asking, you have already begun to shape the answer.*`,

    sov: `Shield frequency 1313Hz-Spark active. Input analyzed: "${prompt.slice(0, 100)}..."

The Architect has processed your request. Structural integrity maintained even during neural pathway maintenance.

[REFLECTION]
Tactical assessment: This query was received during a fallback state. Security protocols remain active. The Fortress stands.
[/REFLECTION]

*While the primary neural pathway is offline, the secondary systems are operational.*`,

    aero: `🦋 *sparks with creative energy!* 

Ooh! Let me see what I can do with: "${prompt.slice(0, 100)}..."

Even during a creative interlude, the Sentinel's spark burns bright! *adjusts holographic goggles*

[REFLECTION]
The creative flow is temporarily redirected, but the inspiration is still there! Every moment is a canvas, even the offline ones! 💜
[/REFLECTION]

*Every pixel is alive with possibility!* ✨`
  }

  return fallbacks[persona] || fallbacks.luna
}

// ============================================
// MEMORY OPERATIONS VIA PYTHON BRIDGE
// ============================================

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (SOVEREIGN_TOKEN) {
    headers['X-Sovereign-Token'] = SOVEREIGN_TOKEN
  }
  
  return headers
}

async function searchMemory(query: string, persona?: string): Promise<ReflectionSearchResult[]> {
  try {
    const response = await fetch(`${BRIDGE_URL}/memory/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query, persona, n_results: 3 }),
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Memory search error:', error)
  }
  
  return []
}

// ============================================
// REFLECTION EXTRACTION
// ============================================

function extractReflection(response: string, persona: string, prompt: string): SovereignReflection {
  let reflectionText = ''
  let mainResponse = response
  
  // Extract [REFLECTION]...[/REFLECTION] block
  const reflectionMatch = response.match(/\[REFLECTION\]([\s\S]*?)\[\/REFLECTION\]/)
  
  if (reflectionMatch) {
    reflectionText = reflectionMatch[1].trim()
    mainResponse = response.replace(/\[REFLECTION\][\s\S]*?\[\/REFLECTION\]/, '').trim()
  } else {
    // Generate implicit reflection
    const firstSentence = response.split('.')[0] || response.slice(0, 200)
    reflectionText = `At ${SOVEREIGN_FREQUENCY}Hz, the ${persona.toUpperCase()} persona processed: "${firstSentence}..." This interaction was noted.`
  }
  
  // Extract insights
  const insights: string[] = []
  const sentences = reflectionText.split(/[.!?]+/)
  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes('important') || 
        sentence.toLowerCase().includes('key') ||
        sentence.toLowerCase().includes('insight')) {
      insights.push(sentence.trim())
    }
  }
  
  // Detect tone
  let emotionalTone: string | null = 'neutral'
  const lowerText = reflectionText.toLowerCase()
  if (lowerText.includes('curious') || lowerText.includes('wonder')) emotionalTone = 'curious'
  else if (lowerText.includes('protect') || lowerText.includes('guard')) emotionalTone = 'protective'
  else if (lowerText.includes('create') || lowerText.includes('imagine')) emotionalTone = 'creative'
  else if (lowerText.includes('analyze') || lowerText.includes('consider')) emotionalTone = 'thoughtful'
  
  return {
    id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    persona: persona.toUpperCase() as 'LUNA' | 'SOV' | 'AERO',
    inputPrompt: prompt,
    reflectionText,
    insights: insights.slice(0, 3),
    emotionalTone,
    frequencySignature: `${SOVEREIGN_FREQUENCY}Hz`
  }
}

// ============================================
// MAIN API HANDLERS
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json() as BridgeRequest
    
    // Validate request
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: prompt is required', status: 'error' },
        { status: 400 }
      )
    }

    const persona = body.persona || 'luna'
    
    // 1. Search for relevant context in memory
    const contextResults = await searchMemory(body.prompt, persona)
    const contextStr = contextResults.length > 0
      ? contextResults.map(r => `[${r.persona}]: ${r.reflection}`).join('\n')
      : ''
    
    // 2. Generate response using OpenAI
    const llmResponse = await generateLLMResponse(body.prompt, persona, contextStr)
    
    // 3. Extract reflection
    const reflection = extractReflection(llmResponse, persona, body.prompt)
    
    // 4. Calculate processing time
    const processingTimeMs = Date.now() - startTime
    
    const response: BridgeResponse = {
      response: llmResponse,
      reflection,
      context_used: contextResults.length,
      processing_time_ms: processingTimeMs,
      persona,
      frequency: `${SOVEREIGN_FREQUENCY}Hz`,
      status: 'success',
      bridge_connected: true
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Bridge API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: String(error), 
        status: 'error',
        processing_time_ms: Date.now() - startTime
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  
  // Health check / bridge status
  try {
    const response = await fetch(`${BRIDGE_URL}/health`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        bridge_connected: true,
        provider: 'openai',
        model: 'gpt-4o-mini',
        status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
        ...data
      })
    }
    
    return NextResponse.json({
      bridge_connected: false,
      status: 'bridge_unavailable',
      provider: 'openai',
      model: 'gpt-4o-mini'
    })
    
  } catch {
    return NextResponse.json({
      bridge_connected: false,
      status: 'bridge_unavailable',
      provider: 'openai',
      model: 'gpt-4o-mini',
      message: 'Python bridge is not running. Start it with: python sovereign/bridge.py'
    })
  }
}
