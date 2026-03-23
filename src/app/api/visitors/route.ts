import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/vercel-storage'

// Simple file-based visitor storage for now
// In production, this would use Prisma + a real database

const VISITORS_PATH = 'data/visitors.json'

interface Visitor {
  id: string
  email: string
  name?: string | null
  source: string
  createdAt: string
}

function getVisitors(): Visitor[] {
  return storage.readJsonFile(VISITORS_PATH, [])
}

function saveVisitors(visitors: Visitor[]) {
  storage.writeJsonFile(VISITORS_PATH, visitors)
}

// GET - Return visitor count
export async function GET() {
  try {
    const visitors = getVisitors()
    return NextResponse.json({ 
      count: visitors.length,
      success: true 
    })
  } catch (error) {
    console.error('Error fetching visitors:', error)
    return NextResponse.json({ count: 0, success: true })
  }
}

// POST - Add new visitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, source } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const visitors = getVisitors()

    // Check for duplicate email
    const existing = visitors.find(v => v.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Welcome back!',
        visitor: existing,
        count: visitors.length
      })
    }

    // Create new visitor
    const newVisitor: Visitor = {
      id: `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      source: source || 'plaza_gate',
      createdAt: new Date().toISOString()
    }

    visitors.push(newVisitor)
    saveVisitors(visitors)

    console.log(`🦋 New visitor registered: ${email}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Welcome to the Plaza!',
      visitor: { id: newVisitor.id, email: newVisitor.email },
      count: visitors.length
    })
  } catch (error) {
    console.error('Error registering visitor:', error)
    return NextResponse.json(
      { error: 'Failed to register visitor' },
      { status: 500 }
    )
  }
}
