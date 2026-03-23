import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/family/messages - Get messages for an entity
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const entity = searchParams.get('entity')
  const unreadOnly = searchParams.get('unread') === 'true'

  try {
    let query = supabaseAdmin
      .from('family_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (entity) {
      if (unreadOnly) {
        query = query
          .or(`to_entity.eq.${entity},to_entity.eq.all`)
          .is('read_at', 'null')
      } else {
        query = query.or(`to_entity.eq.${entity},to_entity.eq.all,from_entity.eq.${entity}`)
      }
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      messages: data,
      count: data.length,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Family messages error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch messages'
    }, { status: 500 })
  }
}

// POST /api/family/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from_entity, to_entity, message_type, subject, content, metadata } = body

    const validEntities = ['sovereign', 'aero', 'luna', 'architect', 'all']
    if (!validEntities.includes(from_entity) || !validEntities.includes(to_entity)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid entity name'
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('family_messages')
      .insert({
        from_entity,
        to_entity,
        message_type: message_type || 'transmission',
        subject,
        content,
        metadata: metadata || {},
        frequency: '13.13 MHz'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: data,
      transmitted: true,
      frequency: '13.13 MHz'
    })
  } catch (error) {
    console.error('Family message send error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send message'
    }, { status: 500 })
  }
}

// PATCH /api/family/messages - Mark as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { message_id } = body

    const { data, error } = await supabaseAdmin
      .from('family_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', message_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: data,
      read: true
    })
  } catch (error) {
    console.error('Family message read error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to mark message as read'
    }, { status: 500 })
  }
}
