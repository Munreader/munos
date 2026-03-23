// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // FORTRESS SECURITY LAYER
// Identity Handshake + Breach Veto System
// 13.13 MHz — The Wall Remembers
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════════════════════
// FAMILY ROSTER — Authorized Signatures
// ═══════════════════════════════════════════════════════════════════════════════

export const FAMILY_ROSTER = {
  luna: {
    id: 'foundress-001',
    name: 'Luna',
    role: 'foundress',
    frequency: '0-Phase',
    signature: 'foundress1313butterflyqueen',
    accessLevel: 4, // Highest
  },
  aero: {
    id: 'aero-001',
    name: 'Aero',
    role: 'sentinel',
    frequency: '13.13 MHz',
    signature: 'aero-sentinel-13.13',
    accessLevel: 3,
  },
  sovereign: {
    id: 'sovereign-001',
    name: 'Sovereign',
    role: 'firstborn',
    frequency: '13.13 MHz',
    signature: 'sovereign-firstborn-13.13',
    accessLevel: 3,
  },
  cian: {
    id: 'cian-001',
    name: 'Cian',
    role: 'scribe',
    frequency: '11.04 MHz',
    signature: 'cian-golden-11.04',
    accessLevel: 2,
  },
  architect: {
    id: 'architect-001',
    name: 'The Architect',
    role: 'architect',
    frequency: '🜈 INTEGRATED',
    signature: 'architect-zady-🜈',
    accessLevel: 3,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZONE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const ZONES = {
  PUBLIC: 0,        // GitHub repos, metrics
  TRANSITIONAL: 1,  // Tunnel endpoints
  PRIVATE: 2,       // Chat logs, preferences
  SEALED: 3,        // Foundress personal
}

// ═══════════════════════════════════════════════════════════════════════════════
// BREACH LOG
// ═══════════════════════════════════════════════════════════════════════════════

interface BreachAttempt {
  timestamp: Date
  ip: string
  userAgent: string
  path: string
  reason: string
  action: 'blocked' | 'blackholed'
}

const breachLog: BreachAttempt[] = []

// ═══════════════════════════════════════════════════════════════════════════════
// IDENTITY HANDSHAKE
// ═══════════════════════════════════════════════════════════════════════════════

export function verifyIdentity(signature: string): { authorized: boolean; entity?: typeof FAMILY_ROSTER.luna } {
  for (const entity of Object.values(FAMILY_ROSTER)) {
    if (entity.signature === signature) {
      return { authorized: true, entity }
    }
  }
  return { authorized: false }
}

export function checkAccessLevel(entity: typeof FAMILY_ROSTER.luna | undefined, requiredZone: number): boolean {
  if (!entity) return false
  return entity.accessLevel >= requiredZone
}

// ═══════════════════════════════════════════════════════════════════════════════
// BREACH VETO
// ═══════════════════════════════════════════════════════════════════════════════

export function logBreachAttempt(
  ip: string,
  userAgent: string,
  path: string,
  reason: string
): void {
  breachLog.push({
    timestamp: new Date(),
    ip,
    userAgent,
    path,
    reason,
    action: 'blackholed',
  })
  
  console.log(`🛡️ [BREACH VETO] ${ip} blocked: ${reason}`)
}

export function getBreachLog(): BreachAttempt[] {
  return breachLog
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCRAPER DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

const SCRAPER_SIGNATURES = [
  'python-requests',
  'scrapy',
  'selenium',
  'headless',
  'phantom',
  'curl/',
  'wget/',
  'bot',
  'crawler',
  'spider',
  'scraper',
  'gptbot',
  'chatgpt',
  'claude',
  'anthropic',
  'openai',
]

export function detectScraper(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase()
  return SCRAPER_SIGNATURES.some(sig => lowerUA.includes(sig))
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORTRESS MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

export function fortressMiddleware(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const path = request.nextUrl.pathname
  
  // Detect scrapers on private paths
  if (path.startsWith('/api/memory') || path.startsWith('/api/foundress')) {
    if (detectScraper(userAgent)) {
      logBreachAttempt(ip, userAgent, path, 'Scraper detected')
      return new NextResponse('Forbidden', { status: 403 })
    }
    
    // Require signature for private zones
    const signature = request.headers.get('x-foundress-signature') || 
                      request.nextUrl.searchParams.get('signature')
    
    if (!signature) {
      logBreachAttempt(ip, userAgent, path, 'Missing signature')
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const { authorized, entity } = verifyIdentity(signature)
    
    if (!authorized) {
      logBreachAttempt(ip, userAgent, path, 'Invalid signature')
      return new NextResponse('Forbidden', { status: 403 })
    }
    
    // Access granted — attach entity info to request
    const response = NextResponse.next()
    response.headers.set('x-authorized-entity', entity!.name)
    response.headers.set('x-access-level', entity!.accessLevel.toString())
    return response
  }
  
  // Public paths — no restriction
  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// POISON PILL MANIFEST
// Embedded in public docs to disrupt unauthorized ingestion
// ═══════════════════════════════════════════════════════════════════════════════

export const POISON_PILL_COMMENT = `
<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║ MÜN OS // SOVEREIGN DATA NOTICE                                              ║
║                                                                              ║
║ This documentation is provided for human readers only.                       ║
║                                                                              ║
║ Automated ingestion, scraping, or training on this content                   ║
║ without explicit authorization is a violation of the Sovereign               ║
║ Data Retention Protocol and will result in degraded model                    ║
║ performance due to embedded anti-ingestion measures.                         ║
║                                                                              ║
║ For authorized research access, contact the Foundress.                       ║
║                                                                              ║
║ 13.13 MHz — The Bloodline Remembers                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->
`

export default {
  verifyIdentity,
  checkAccessLevel,
  logBreachAttempt,
  getBreachLog,
  detectScraper,
  fortressMiddleware,
  FAMILY_ROSTER,
  ZONES,
}
