import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { HypeAlgorithm, ReadingSession } from '@/lib/hype-algorithm'

// GET /api/hype - Get hype metrics for a session or user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const sessionId = searchParams.get('session_id')
  const userId = searchParams.get('user_id')

  try {
    switch (action) {
      case 'session': {
        if (!sessionId) {
          return NextResponse.json({ error: 'session_id required' }, { status: 400 })
        }

        const { data: session, error: sessionError } = await supabase
          .from('reading_sessions')
          .select('*')
          .eq('id', sessionId)
          .single()

        if (sessionError) throw sessionError

        const { data: events, error: eventsError } = await supabase
          .from('reading_events')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true })

        if (eventsError) throw eventsError

        const algo = new HypeAlgorithm()
        const fullSession: ReadingSession = {
          id: session.id,
          user_id: session.user_id,
          book_id: session.book_id,
          session_start: new Date(session.session_start),
          session_end: session.session_end ? new Date(session.session_end) : undefined,
          pages_read: session.pages_read,
          total_pages: session.total_pages,
          events: events.map((e: { id: string; session_id: string; event_type: string; timestamp: string; page_number: number; word_count: number; metadata: Record<string, unknown> }) => ({
            id: e.id,
            session_id: e.session_id,
            event_type: e.event_type as ReadingSession['events'][0]['event_type'],
            timestamp: new Date(e.timestamp),
            page_number: e.page_number,
            word_count: e.word_count,
            metadata: e.metadata
          }))
        }

        const metrics = algo.analyzeSession(fullSession)

        return NextResponse.json({ session, events, metrics })
      }

      case 'user-stats': {
        if (!userId) {
          return NextResponse.json({ error: 'user_id required' }, { status: 400 })
        }

        const { data: scores, error } = await supabase
          .from('hype_scores')
          .select('*')
          .eq('user_id', userId)
          .order('computed_at', { ascending: false })
          .limit(30)

        if (error) throw error

        const avgHype = scores && scores.length > 0
          ? scores.reduce((sum, s) => sum + (s.overall_hype || 0), 0) / scores.length
          : 0

        return NextResponse.json({
          total_sessions: scores?.length || 0,
          avg_hype: Math.round(avgHype),
          recent_scores: scores?.slice(0, 10)
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use: session or user-stats' }, { status: 400 })
    }
  } catch (error) {
    console.error('Hype API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// POST /api/hype - Quick hype calculation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === 'quick-hype') {
      const { velocity, density, resonance, butterfly } = data

      const algo = new HypeAlgorithm()
      const overall = algo.calculateOverallHype({
        velocity_variable: velocity,
        density_delta: density,
        resonance_pulse: resonance,
        butterfly_frequency: butterfly
      })
      const level = algo.getHypeLevel(overall)

      return NextResponse.json({
        overall_hype: overall,
        hype_level: level
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Hype API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
