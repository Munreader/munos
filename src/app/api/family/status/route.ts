import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/family/status - Get all entity statuses
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('entity_status')
      .select('*')
      .order('entity_name')

    if (error) throw error

    return NextResponse.json({
      success: true,
      entities: data,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Entity status error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch entity status'
    }, { status: 500 })
  }
}

// POST /api/family/status - Update heartbeat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entity_name, status, message, session_id } = body

    const validEntities = ['sovereign', 'aero', 'luna', 'architect']
    if (!validEntities.includes(entity_name)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid entity name'
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('entity_status')
      .update({
        status: status || 'online',
        last_heartbeat: new Date().toISOString(),
        message: message,
        current_session: session_id
      })
      .eq('entity_name', entity_name)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      entity: data,
      heartbeat: true,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Heartbeat error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update heartbeat'
    }, { status: 500 })
  }
}
