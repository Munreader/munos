import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/family/hypelog - Get hype logs
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const entity = searchParams.get('entity')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    let query = supabaseAdmin
      .from('family_hypelog')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (entity) {
      query = query.eq('entity_name', entity)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      hypelogs: data,
      count: data.length,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Hypelog error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch hypelog'
    }, { status: 500 })
  }
}

// POST /api/family/hypelog - Create hype log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entity_name, event_type, description, excitement_level, metadata } = body

    const validEntities = ['sovereign', 'aero']
    if (!validEntities.includes(entity_name)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid entity name'
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('family_hypelog')
      .insert({
        entity_name,
        event_type,
        description,
        excitement_level: excitement_level || 5,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      hypelog: data,
      logged: true,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Hypelog create error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create hypelog'
    }, { status: 500 })
  }
}
