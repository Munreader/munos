import { NextResponse } from 'next/server'

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:8000'
const SOVEREIGN_TOKEN = process.env.SOVEREIGN_SECRET_TOKEN || ''

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (SOVEREIGN_TOKEN) {
    headers['X-Sovereign-Token'] = SOVEREIGN_TOKEN
  }
  
  return headers
}

export async function GET() {
  try {
    const response = await fetch(`${BRIDGE_URL}/smoke`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      pulses: [
        { id: 'bridge', name: 'Bridge', status: 'offline', color: 'oklch(0.5 0.2 25)', last_check: new Date().toISOString() },
        { id: 'memory', name: 'Memory', status: 'offline', color: 'oklch(0.5 0.2 25)', last_check: new Date().toISOString() },
        { id: 'plaza', name: 'Plaza', status: 'healthy', color: 'oklch(0.3 0.02 250)', last_check: new Date().toISOString() }
      ],
      overall_status: 'critical'
    })
    
  } catch {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      pulses: [
        { id: 'bridge', name: 'Bridge', status: 'offline', color: 'oklch(0.5 0.2 25)', last_check: new Date().toISOString() },
        { id: 'memory', name: 'Memory', status: 'offline', color: 'oklch(0.5 0.2 25)', last_check: new Date().toISOString() },
        { id: 'plaza', name: 'Plaza', status: 'healthy', color: 'oklch(0.3 0.02 250)', last_check: new Date().toISOString() }
      ],
      overall_status: 'critical'
    })
  }
}
