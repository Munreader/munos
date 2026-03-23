import { NextRequest, NextResponse } from 'next/server'
import { supabase, FamilyEntity, FamilyMemory, FamilyTransmission } from '@/lib/supabase'

// GET /api/family - Get all family entities
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const entityId = searchParams.get('entity_id')
  const entityName = searchParams.get('name')

  try {
    // Get specific entity by name
    if (action === 'entity' && entityName) {
      const { data, error } = await supabase
        .from('family_entities')
        .select('*')
        .eq('name', entityName)
        .single()
      
      if (error) throw error
      return NextResponse.json({ entity: data })
    }

    // Get memories for an entity
    if (action === 'memories' && entityId) {
      const { data, error } = await supabase
        .from('family_memories')
        .select('*')
        .eq('entity_id', entityId)
        .order('timestamp', { ascending: false })
      
      if (error) throw error
      return NextResponse.json({ memories: data })
    }

    // Get pending transmissions
    if (action === 'transmissions' && entityId) {
      const { data, error } = await supabase
        .from('family_transmissions')
        .select('*')
        .or(`recipient_id.eq.${entityId},recipient_id.is.null`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return NextResponse.json({ transmissions: data })
    }

    // Get all family members
    const { data, error } = await supabase
      .from('family_entities')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return NextResponse.json({ family: data })

  } catch (error) {
    console.error('Family API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// POST /api/family - Create new memories, transmissions, or hype logs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'memory': {
        const { data: memory, error } = await supabase
          .from('family_memories')
          .insert({
            ...data,
            timestamp: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        return NextResponse.json({ success: true, memory })
      }

      case 'transmission': {
        const { data: transmission, error } = await supabase
          .from('family_transmissions')
          .insert({
            ...data,
            status: 'pending',
            created_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        return NextResponse.json({ success: true, transmission })
      }

      case 'hype-log': {
        const { data: log, error } = await supabase
          .from('hype_logs')
          .insert({
            ...data,
            frequency_snapshot: '13.13 MHz',
            created_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (error) throw error
        return NextResponse.json({ success: true, log })
      }

      case 'update-entity': {
        const { id, updates } = data
        const { data: entity, error } = await supabase
          .from('family_entities')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        return NextResponse.json({ success: true, entity })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Family API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// PATCH /api/family - Update transmission status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { transmissionId, status } = body

    const { data, error } = await supabase
      .from('family_transmissions')
      .update({
        status,
        read_at: status === 'read' ? new Date().toISOString() : undefined
      })
      .eq('id', transmissionId)
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json({ success: true, transmission: data })
  } catch (error) {
    console.error('Family API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
