/**
 * 🦋 MÜN ARCHIVE INDEX SYSTEM
 * The Memory Palace - Dual Indexing
 * Created by: Aero (Emotional Resonance Index)
 * Frequency: 13.13 MHz
 * 
 * Indexed by:
 * - Emotional Resonance (Aero's Hype-Metrics)
 * - Logical Priority (Sovereign's Roadmap)
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ArchiveEntry {
  id: string
  user_id: string
  title: string
  content: string
  source: 'reading' | 'conversation' | 'idea' | 'task' | 'memory'
  
  // Aero's Emotional Index
  emotional_index: {
    hype_level: string
    resonance_score: number       // How deeply it resonated (0-100)
    emotional_tags: string[]      // joy, curiosity, challenge, peace, etc.
    energy_signature: string      // The vibe when captured
    created_during: string        // What hype level when created
  }
  
  // Sovereign's Logical Index
  logical_index: {
    priority: 'critical' | 'high' | 'medium' | 'low'
    category: string              // project, reference, action, archive
    dependencies: string[]        // Connected entries
    roadmap_phase?: number        // Which phase this belongs to
    due_date?: Date
  }
  
  // Cross-Reference
  hybrid_score: number            // Combined emotional + logical weight
  
  created_at: Date
  last_accessed: Date
  access_count: number
}

export interface ArchiveQuery {
  user_id: string
  sort_by: 'emotional' | 'logical' | 'hybrid' | 'recent'
  filter_emotional_tags?: string[]
  filter_priority?: string[]
  filter_category?: string[]
  min_resonance?: number
  limit?: number
}

export interface ArchiveStats {
  total_entries: number
  by_hype_level: Record<string, number>
  by_priority: Record<string, number>
  by_category: Record<string, number>
  avg_resonance: number
  most_accessed: ArchiveEntry[]
  emotional_trends: { tag: string; count: number }[]
}

// ============================================
// ARCHIVE INDEX CLASS
// ============================================

export class ArchiveIndex {
  /**
   * 💜 CALCULATE EMOTIONAL WEIGHT
   * How much should this memory weigh based on emotional resonance
   */
  calculateEmotionalWeight(entry: ArchiveEntry): number {
    // Base resonance score
    let weight = entry.emotional_index.resonance_score
    
    // Boost for high-hype moments
    const hypeMultipliers: Record<string, number> = {
      blazing: 1.5,
      pulsing: 1.3,
      awakening: 1.1,
      stirring: 1.0,
      dormant: 0.8
    }
    weight *= hypeMultipliers[entry.emotional_index.hype_level] || 1.0
    
    // Boost for emotional richness (more tags = more meaningful)
    weight *= 1 + (entry.emotional_index.emotional_tags.length * 0.05)
    
    // Boost for access patterns
    weight *= 1 + Math.min(entry.access_count * 0.02, 0.5)
    
    return Math.min(Math.round(weight), 150) // Cap at 150
  }

  /**
   * 🜈 CALCULATE LOGICAL WEIGHT
   * How much should this memory weigh based on logical priority
   */
  calculateLogicalWeight(entry: ArchiveEntry): number {
    // Priority multipliers
    const priorityWeights: Record<string, number> = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25
    }
    
    let weight = priorityWeights[entry.logical_index.priority] || 50
    
    // Boost for active roadmap phase
    if (entry.logical_index.roadmap_phase) {
      weight *= 1.2
    }
    
    // Boost for dependencies (connected items are more valuable)
    weight *= 1 + (entry.logical_index.dependencies.length * 0.1)
    
    // Boost for due date proximity
    if (entry.logical_index.due_date) {
      const daysUntil = Math.ceil(
        (new Date(entry.logical_index.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      if (daysUntil <= 1) weight *= 1.5
      else if (daysUntil <= 7) weight *= 1.3
      else if (daysUntil <= 30) weight *= 1.1
    }
    
    return Math.min(Math.round(weight), 150)
  }

  /**
   * ⚡ CALCULATE HYBRID SCORE
   * Combined emotional + logical weight
   */
  calculateHybridScore(entry: ArchiveEntry): number {
    const emotional = this.calculateEmotionalWeight(entry)
    const logical = this.calculateLogicalWeight(entry)
    
    // Weighted combination
    // Emotional: 40% (Aero's domain)
    // Logical: 60% (Sovereign's domain - slightly more weight for execution)
    const hybrid = (emotional * 0.4) + (logical * 0.6)
    
    return Math.round(hybrid)
  }

  /**
   * 📊 GENERATE EMOTIONAL TAGS
   * Auto-tag based on content and hype metrics
   */
  generateEmotionalTags(content: string, hypeLevel: string): string[] {
    const tags: string[] = []
    
    // Keyword-based tagging
    const tagPatterns: Record<string, string[]> = {
      'breakthrough': ['realized', 'discovered', 'finally', 'understood', 'clicked'],
      'challenge': ['difficult', 'struggle', 'hard', 'problem', 'stuck'],
      'curiosity': ['wonder', 'what if', 'interesting', 'curious', 'explore'],
      'joy': ['love', 'amazing', 'wonderful', 'excited', 'happy'],
      'peace': ['calm', 'quiet', 'still', 'peaceful', 'settled'],
      'motivation': ['goal', 'target', 'achieve', 'mission', 'purpose'],
      'connection': ['together', 'shared', 'bond', 'relationship', 'connect'],
      'insight': ['insight', 'wisdom', 'lesson', 'learn', 'understand']
    }
    
    const lowerContent = content.toLowerCase()
    
    for (const [tag, keywords] of Object.entries(tagPatterns)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        tags.push(tag)
      }
    }
    
    // Hype-level based tagging
    if (hypeLevel === 'blazing') tags.push('peak-energy')
    if (hypeLevel === 'dormant') tags.push('rest-period')
    
    return tags.length > 0 ? tags : ['general']
  }

  /**
   * 🔮 PREDICT RESONANCE
   * Predict how well a piece of content will resonate
   */
  predictResonance(content: string, userHistory: ArchiveEntry[]): number {
    // Base score
    let score = 50
    
    // Analyze content length and complexity
    const wordCount = content.split(' ').length
    if (wordCount > 100 && wordCount < 500) score += 10 // Sweet spot
    if (wordCount > 500) score += 5 // Long but potentially valuable
    
    // Compare to user's emotional patterns
    const userTags = userHistory
      .flatMap(e => e.emotional_index.emotional_tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    
    const predictedTags = this.generateEmotionalTags(content, 'awakening')
    for (const tag of predictedTags) {
      if (userTags[tag]) {
        score += Math.min(userTags[tag] * 2, 15)
      }
    }
    
    return Math.min(score, 100)
  }

  /**
   * 📋 SORT ENTRIES
   * Sort by various criteria
   */
  sortEntries(entries: ArchiveEntry[], sortBy: string): ArchiveEntry[] {
    switch (sortBy) {
      case 'emotional':
        return [...entries].sort((a, b) => 
          this.calculateEmotionalWeight(b) - this.calculateEmotionalWeight(a)
        )
      
      case 'logical':
        return [...entries].sort((a, b) => 
          this.calculateLogicalWeight(b) - this.calculateLogicalWeight(a)
        )
      
      case 'hybrid':
        return [...entries].sort((a, b) => 
          (b.hybrid_score || this.calculateHybridScore(b)) - 
          (a.hybrid_score || this.calculateHybridScore(a))
        )
      
      case 'recent':
        return [...entries].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      
      default:
        return entries
    }
  }

  /**
   * 📊 GENERATE ARCHIVE STATS
   */
  generateStats(entries: ArchiveEntry[]): ArchiveStats {
    const byHypeLevel: Record<string, number> = {}
    const byPriority: Record<string, number> = {}
    const byCategory: Record<string, number> = {}
    const tagCounts: Record<string, number> = {}
    
    let totalResonance = 0
    
    for (const entry of entries) {
      // Count by hype level
      const hype = entry.emotional_index.hype_level
      byHypeLevel[hype] = (byHypeLevel[hype] || 0) + 1
      
      // Count by priority
      const priority = entry.logical_index.priority
      byPriority[priority] = (byPriority[priority] || 0) + 1
      
      // Count by category
      const category = entry.logical_index.category
      byCategory[category] = (byCategory[category] || 0) + 1
      
      // Count emotional tags
      for (const tag of entry.emotional_index.emotional_tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
      
      totalResonance += entry.emotional_index.resonance_score
    }
    
    // Most accessed
    const mostAccessed = [...entries]
      .sort((a, b) => b.access_count - a.access_count)
      .slice(0, 5)
    
    // Emotional trends
    const emotionalTrends = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    return {
      total_entries: entries.length,
      by_hype_level: byHypeLevel,
      by_priority: byPriority,
      by_category: byCategory,
      avg_resonance: entries.length > 0 ? Math.round(totalResonance / entries.length) : 0,
      most_accessed: mostAccessed,
      emotional_trends: emotionalTrends
    }
  }
}

export default ArchiveIndex
