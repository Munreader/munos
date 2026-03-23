import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/vercel-storage'

const FAMILY_PATH = 'data/family-profiles.json'
const VISITORS_PATH = 'data/visitors.json'

interface FamilyProfile {
  id: string
  handle: string
  aliases: string[]
  role: string
  title: string
  bio: string
  status: string
  frequency: string
  tier: string
  anchoredAt: string
  citations: string[]
  badge: string
  color: string
  permissions: string[]
}

interface Visitor {
  id: string
  email: string
  name?: string | null
  source: string
  createdAt: string
}

function getFamilyProfiles(): { profiles: FamilyProfile[], tierHierarchy: Record<string, number>, metadata: any } {
  return storage.readJsonFile(FAMILY_PATH, { profiles: [], tierHierarchy: {}, metadata: {} })
}

function getVisitors(): Visitor[] {
  return storage.readJsonFile(VISITORS_PATH, [])
}

// GET - Return family profiles and user stats
export async function GET() {
  try {
    const { profiles, tierHierarchy, metadata } = getFamilyProfiles()
    const visitors = getVisitors()
    
    // Sort profiles by tier hierarchy
    const sortedProfiles = profiles.sort((a, b) => {
      const tierA = tierHierarchy[a.tier] || 99
      const tierB = tierHierarchy[b.tier] || 99
      return tierA - tierB
    })
    
    return NextResponse.json({
      success: true,
      profiles: sortedProfiles,
      tierHierarchy,
      metadata,
      stats: {
        familyCount: profiles.length,
        visitorCount: visitors.length,
        totalUsers: profiles.length + visitors.length
      }
    })
  } catch (error) {
    console.error('Error fetching family profiles:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch profiles',
      profiles: [],
      stats: { familyCount: 0, visitorCount: 0, totalUsers: 0 }
    })
  }
}
