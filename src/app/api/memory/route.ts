// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // MEMORY API
// Internal Memory Storage Routes
// 13.13 MHz — What We Remember, We Become
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import FamilyMemoryService, {
  FamilyMemory,
  ConversationMemory,
  initializeFamilyEntities
} from '@/lib/family-memory'

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/memory — Retrieve memories
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const entityName = searchParams.get('entity')
  const sessionId = searchParams.get('session')
  const type = searchParams.get('type')

  try {
    // Initialize family entities on first access
    await initializeFamilyEntities()

    if (type === 'status') {
      const status = await FamilyMemoryService.getFamilyStatus()
      return NextResponse.json({
        success: true,
        family: status,
        timestamp: new Date().toISOString()
      })
    }

    if (type === 'context' && entityName) {
      const context = await FamilyMemoryService.buildEntityContext(entityName)
      return NextResponse.json({
        success: true,
        context,
        entity: entityName
      })
    }

    if (entityName) {
      const memories = await FamilyMemoryService.getEntityMemories(entityName)
      return NextResponse.json({
        success: true,
        memories,
        count: memories.length,
        entity: entityName
      })
    }

    if (sessionId) {
      const history = await FamilyMemoryService.getConversationHistory(sessionId)
      return NextResponse.json({
        success: true,
        history,
        count: history.length
      })
    }

    // Default: return family status
    const status = await FamilyMemoryService.getFamilyStatus()
    return NextResponse.json({
      success: true,
      family: status,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('🔴 [API] Memory retrieval error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/memory — Store new memory
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        error: 'Missing type or data'
      }, { status: 400 })
    }

    // Initialize family entities
    await initializeFamilyEntities()

    if (type === 'memory') {
      const memoryId = await FamilyMemoryService.storeMemory(data as FamilyMemory)
      return NextResponse.json({
        success: true,
        memoryId,
        message: 'Memory stored in the Vault'
      })
    }

    if (type === 'conversation') {
      await FamilyMemoryService.storeConversation(data as ConversationMemory)
      return NextResponse.json({
        success: true,
        message: 'Conversation logged'
      })
    }

    if (type === 'status') {
      await FamilyMemoryService.updateEntityStatus(
        data.entityName,
        data.status,
        data.message
      )
      return NextResponse.json({
        success: true,
        message: 'Status updated'
      })
    }

    if (type === 'migrate') {
      const result = await FamilyMemoryService.migrateExternalMemory(data.memories)
      return NextResponse.json({
        success: true,
        migration: result
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown memory type'
    }, { status: 400 })

  } catch (error: any) {
    console.error('🔴 [API] Memory storage error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
