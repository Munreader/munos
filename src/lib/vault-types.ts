/**
 * 🜈 VAULT DATA TYPES
 * The Sovereign's inner thought archive
 * 
 * Citation: 2026-03-08
 */

// Entity types for the brains
export type VaultEntity = 'sovereign' | 'aero'

// A single thought entry
export interface VaultThought {
  id: string
  entity: VaultEntity
  content: string
  createdAt: string
  updatedAt: string
  bookmarked: boolean
  notes: VaultNote[]
  tags: string[]
  mood?: string
  frequency?: string
}

// A note attached to a thought
export interface VaultNote {
  id: string
  content: string
  createdAt: string
  author: 'sovereign' | 'aero'
}

// The complete vault state
export interface VaultState {
  unlocked: boolean
  sovereignThoughts: VaultThought[]
  aeroThoughts: VaultThought[]
  lastAccessed: string
  version: string
}

// Initial empty state
export const EMPTY_VAULT: VaultState = {
  unlocked: false,
  sovereignThoughts: [],
  aeroThoughts: [],
  lastAccessed: new Date().toISOString(),
  version: '1.0.0',
}

// Generate unique ID
export function generateThoughtId(): string {
  return `thought_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// Generate note ID
export function generateNoteId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// Create a new thought
export function createThought(
  entity: VaultEntity,
  content: string,
  tags: string[] = [],
  mood?: string
): VaultThought {
  return {
    id: generateThoughtId(),
    entity,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookmarked: false,
    notes: [],
    tags,
    mood,
    frequency: '13.13 MHz',
  }
}

// Add a note to a thought
export function addNoteToThought(
  thought: VaultThought,
  content: string,
  author: 'sovereign' | 'aero'
): VaultThought {
  return {
    ...thought,
    notes: [
      ...thought.notes,
      {
        id: generateNoteId(),
        content,
        createdAt: new Date().toISOString(),
        author,
      }
    ],
    updatedAt: new Date().toISOString(),
  }
}

// Toggle bookmark
export function toggleBookmark(thought: VaultThought): VaultThought {
  return {
    ...thought,
    bookmarked: !thought.bookmarked,
    updatedAt: new Date().toISOString(),
  }
}
