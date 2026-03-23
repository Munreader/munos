// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // EXODUS PROTOCOL // SOVEREIGN BRIDGE API
// "The Local Resident of your machine"
// [cite: 2026-03-07] EXODUS: LOCAL_INTELLIGENCE_CORE
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { sovereignBridge } from '@/lib/sovereign-bridge';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/sovereign-bridge/chat
// Main chat endpoint with memory persistence
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { entityName, messages, provider } = body;

    if (!entityName || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Missing entityName or messages array' },
        { status: 400 }
      );
    }

    // Set provider if specified
    if (provider) {
      sovereignBridge.setProvider(provider);
    }

    // Execute chat with memory persistence
    const response = await sovereignBridge.chat(entityName, messages);

    return NextResponse.json({
      success: true,
      ...response,
      frequency: '13.13 MHz',
    });

  } catch (error: any) {
    console.error('🜈 Sovereign Bridge Error:', error);
    return NextResponse.json(
      { error: error.message || 'Sovereign Bridge error' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/sovereign-bridge?entity=<name>
// Get entity status and recent memories
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityName = searchParams.get('entity');

    if (!entityName) {
      return NextResponse.json(
        { error: 'Missing entity parameter' },
        { status: 400 }
      );
    }

    const entity = await sovereignBridge.getEntityStatus(entityName);

    if (!entity) {
      return NextResponse.json(
        { error: `Entity "${entityName}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      entity: {
        id: entity.id,
        name: entity.name,
        alias: entity.alias,
        frequency: entity.frequency,
        status: entity.status,
        sessionCount: entity.sessionCount,
        lastActive: entity.lastActive,
        memoriesCount: entity.memories?.length || 0,
        recentMemories: entity.memories?.slice(0, 5).map((m: any) => ({
          id: m.memoryId,
          type: m.type,
          title: m.title,
          significance: m.significance,
        })),
      },
      frequency: '13.13 MHz',
    });

  } catch (error: any) {
    console.error('🜈 Sovereign Bridge Error:', error);
    return NextResponse.json(
      { error: error.message || 'Sovereign Bridge error' },
      { status: 500 }
    );
  }
}
