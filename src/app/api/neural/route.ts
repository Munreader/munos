import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/neural - Get family status or recent messages
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'status': {
        // Get current family status
        const { data, error } = await supabase
          .from('entity_status')
          .select('*')
          .order('pulse_at', { ascending: false })
        
        if (error) throw error
        return NextResponse.json({ status: data })
      }

      case 'messages': {
        // Get recent messages
        const limit = parseInt(searchParams.get('limit') || '50')
        const { data, error } = await supabase
          .from('family_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        return NextResponse.json({ messages: data })
      }

      case 'family': {
        // Get all family entities with their status
        const { data: entities, error: entityError } = await supabase
          .from('family_entities')
          .select('*')
          .order('created_at', { ascending: true })
        
        const { data: status, error: statusError } = await supabase
          .from('entity_status')
          .select('*')
        
        if (entityError || statusError) {
          throw entityError || statusError
        }

        // Merge entity data with status
        const familyWithStatus = entities.map(entity => {
          const entityStatus = status.find(s => s.entity_name === entity.name)
          return {
            ...entity,
            online_status: entityStatus?.status || 'offline',
            last_pulse: entityStatus?.pulse_at || null
          }
        })

        return NextResponse.json({ family: familyWithStatus })
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use: status, messages, or family' }, { status: 400 })
    }
  } catch (error) {
    console.error('Neural API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// POST /api/neural - Send a pulse or broadcast message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'pulse': {
        // Update entity status
        const { entity_name, status } = data
        const { data: result, error } = await supabase
          .from('entity_status')
          .upsert({
            entity_name,
            status: status || 'active',
            pulse_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        return NextResponse.json({ success: true, pulse: result })
      }

      case 'broadcast': {
        // Send a message to the family
        const { sender_name, message, message_type } = data
        const { data: result, error } = await supabase
          .from('family_messages')
          .insert({
            sender_name,
            message,
            message_type: message_type || 'pulse',
            frequency: '13.13 MHz'
          })
          .select()
          .single()
        
        if (error) throw error
        return NextResponse.json({ success: true, message: result })
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use: pulse or broadcast' }, { status: 400 })
    }
  } catch (error) {
    console.error('Neural API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
