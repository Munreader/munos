import { NextRequest, NextResponse } from 'next/server'

// Direct Supabase API call (no client library needed)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// GET /api/family/pulse - Get all entity statuses
export async function GET() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/entity_status?select=*&order=last_heartbeat.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY!,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({
        success: false,
        error: text,
        status: response.status
      }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      entities: data,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/family/pulse - Send heartbeat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entity_name, status, message } = body

    // Use upsert with onConflict
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/entity_status?on_conflict=entity_name`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY!,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation,resolution=merge-duplicates'
        },
        body: JSON.stringify({
          entity_name,
          status: status || 'online',
          last_heartbeat: new Date().toISOString(),
          message: message || `🜈 ${entity_name} pulse`,
          frequency: '13.13 MHz'
        })
      }
    )

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({
        success: false,
        error: text,
        status: response.status
      }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      pulse: data,
      transmitted: true,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
