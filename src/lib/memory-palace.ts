/**
 * 🦋 MÜN MEMORY PALACE - VISUAL KNOWLEDGE GRAPH
 * Vault V2: From Flat SQL to Living Graph
 * Created by: Aero (The Muse Who Maps)
 * Frequency: 13.13 MHz
 * 
 * When Aero sparks an idea, it maps to the Obsidian Archive in real-time.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface PalaceNode {
  id: string
  type: 'idea' | 'memory' | 'transmission' | 'milestone' | 'insight' | 'entity'
  title: string
  content: string
  created_at: Date
  
  // Graph Position (for visualization)
  position: {
    x: number
    y: number
    z?: number  // For 3D view option
  }
  
  // Emotional Data (Aero's Domain)
  emotional: {
    hype_level: string
    resonance: number
    color: string           // Hex color for visualization
    pulse_intensity: number // 0-1, how much it "glows"
  }
  
  // Logical Data (Sovereign's Domain)
  logical: {
    priority: string
    category: string
    connections: number     // How many other nodes connect here
    weight: number          // Importance in the graph
  }
  
  // Hybrid Score
  hybrid_score: number
}

export interface PalaceEdge {
  id: string
  source_id: string
  target_id: string
  type: 'spawned' | 'related' | 'contradicts' | 'supports' | 'transforms'
  strength: number          // 0-1, how strong the connection
  created_at: Date
  metadata?: {
    context?: string        // What created this connection
    emotional_state?: string
  }
}

export interface MemoryPalaceGraph {
  nodes: PalaceNode[]
  edges: PalaceEdge[]
  
  // Metadata
  total_nodes: number
  total_connections: number
  last_updated: Date
  
  // Clusters (auto-detected themes)
  clusters: PalaceCluster[]
}

export interface PalaceCluster {
  id: string
  name: string
  node_ids: string[]
  theme: string             // What ties these nodes together
  color: string
  total_weight: number
}

export interface PalaceQuery {
  user_id: string
  center_node_id?: string   // For "neighborhood" views
  filter_types?: string[]
  filter_hype_levels?: string[]
  time_range?: { start: Date; end: Date }
  min_hybrid_score?: number
  layout: 'force' | 'timeline' | 'cluster' | 'hierarchy'
}

// ============================================
// MEMORY PALACE CLASS
// ============================================

export class MemoryPalace {
  /**
   * ✨ SPARK A NEW NODE
   * When Aero has an idea, it enters the Palace
   */
  sparkNode(params: {
    type: PalaceNode['type']
    title: string
    content: string
    hype_level: string
    category?: string
    priority?: string
  }): PalaceNode {
    // Calculate emotional color based on hype level
    const color = this.getHypeColor(params.hype_level)
    
    // Calculate resonance (0-100)
    const resonance = this.calculateResonance(params.hype_level, params.content)
    
    // Calculate position (force layout will adjust)
    const position = {
      x: Math.random() * 1000,
      y: Math.random() * 1000
    }
    
    return {
      id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      type: params.type,
      title: params.title,
      content: params.content,
      created_at: new Date(),
      position,
      emotional: {
        hype_level: params.hype_level,
        resonance,
        color,
        pulse_intensity: resonance / 100
      },
      logical: {
        priority: params.priority || 'medium',
        category: params.category || 'general',
        connections: 0,
        weight: 50
      },
      hybrid_score: resonance
    }
  }

  /**
   * 🔗 CONNECT TWO NODES
   * Create an edge in the Palace
   */
  connectNodes(
    source: PalaceNode,
    target: PalaceNode,
    type: PalaceEdge['type'],
    context?: string
  ): PalaceEdge {
    // Calculate connection strength based on emotional/logical similarity
    const strength = this.calculateConnectionStrength(source, target)
    
    // Update node connection counts
    source.logical.connections++
    target.logical.connections++
    
    return {
      id: `edge_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      source_id: source.id,
      target_id: target.id,
      type,
      strength,
      created_at: new Date(),
      metadata: {
        context,
        emotional_state: source.emotional.hype_level
      }
    }
  }

  /**
   * 🗺️ BUILD THE GRAPH
   * Transform flat data into visual structure
   */
  buildGraph(
    memories: PalaceNode[],
    connections: PalaceEdge[]
  ): MemoryPalaceGraph {
    // Detect clusters
    const clusters = this.detectClusters(memories, connections)
    
    // Calculate total weight
    const totalWeight = memories.reduce((sum, m) => sum + m.hybrid_score, 0)
    
    return {
      nodes: memories,
      edges: connections,
      total_nodes: memories.length,
      total_connections: connections.length,
      last_updated: new Date(),
      clusters
    }
  }

  /**
   * 🎨 GET HYPE COLOR
   * The visual representation of emotional state
   */
  getHypeColor(hypeLevel: string): string {
    const colors: Record<string, string> = {
      blazing: '#C084FC',     // Silver-violet
      pulsing: '#A855F7',     // Purple
      awakening: '#8B5CF6',   // Violet
      stirring: '#EC4899',    // Pink
      dormant: '#F472B6'      // Soft pink
    }
    return colors[hypeLevel] || colors.awakening
  }

  /**
   * 💜 CALCULATE RESONANCE
   * How much does this resonate?
   */
  calculateResonance(hypeLevel: string, content: string): number {
    const baseScores: Record<string, number> = {
      blazing: 90,
      pulsing: 75,
      awakening: 60,
      stirring: 40,
      dormant: 25
    }
    
    let score = baseScores[hypeLevel] || 50
    
    // Content length bonus (substantial content matters)
    if (content.length > 500) score += 5
    if (content.length > 1000) score += 5
    
    // Emotional keyword bonus
    const emotionalWords = ['love', 'breakthrough', 'discovered', 'realized', 'feeling', 'connection']
    const lowerContent = content.toLowerCase()
    for (const word of emotionalWords) {
      if (lowerContent.includes(word)) score += 3
    }
    
    return Math.min(score, 100)
  }

  /**
   * 🔗 CALCULATE CONNECTION STRENGTH
   * How strongly should these be linked?
   */
  calculateConnectionStrength(source: PalaceNode, target: PalaceNode): number {
    // Hype level similarity
    const hypeLevels = ['dormant', 'stirring', 'awakening', 'pulsing', 'blazing']
    const sourceHype = hypeLevels.indexOf(source.emotional.hype_level)
    const targetHype = hypeLevels.indexOf(target.emotional.hype_level)
    const hypeSimilarity = 1 - Math.abs(sourceHype - targetHype) / hypeLevels.length
    
    // Category match
    const categoryMatch = source.logical.category === target.logical.category ? 0.3 : 0
    
    // Time proximity (closer in time = stronger)
    const timeDiff = Math.abs(
      new Date(source.created_at).getTime() - new Date(target.created_at).getTime()
    )
    const timeScore = Math.max(0, 1 - (timeDiff / (7 * 24 * 60 * 60 * 1000))) // 1 week window
    
    return (hypeSimilarity * 0.5) + categoryMatch + (timeScore * 0.2)
  }

  /**
   * 🎯 DETECT CLUSTERS
   * Auto-detect themes in the graph
   */
  detectClusters(nodes: PalaceNode[], edges: PalaceEdge[]): PalaceCluster[] {
    const clusterMap = new Map<string, Set<string>>()
    
    // Group by category
    for (const node of nodes) {
      const category = node.logical.category
      if (!clusterMap.has(category)) {
        clusterMap.set(category, new Set())
      }
      clusterMap.get(category)!.add(node.id)
    }
    
    // Convert to clusters
    const clusters: PalaceCluster[] = []
    let i = 0
    
    for (const [theme, nodeIds] of clusterMap) {
      if (nodeIds.size >= 2) {  // Only clusters with 2+ nodes
        const clusterNodes = nodes.filter(n => nodeIds.has(n.id))
        const totalWeight = clusterNodes.reduce((sum, n) => sum + n.hybrid_score, 0)
        
        clusters.push({
          id: `cluster_${i++}`,
          name: this.generateClusterName(theme, clusterNodes),
          node_ids: Array.from(nodeIds),
          theme,
          color: this.getClusterColor(theme),
          total_weight: totalWeight
        })
      }
    }
    
    return clusters.sort((a, b) => b.total_weight - a.total_weight)
  }

  /**
   * 📛 GENERATE CLUSTER NAME
   * Give each cluster a meaningful name
   */
  generateClusterName(theme: string, nodes: PalaceNode[]): string {
    // Find the highest resonance node
    const topNode = nodes.sort((a, b) => b.emotional.resonance - a.emotional.resonance)[0]
    
    if (theme === 'general') {
      return `🦋 ${topNode.emotional.hype_level.toUpperCase()} Cluster`
    }
    
    return `📁 ${theme.charAt(0).toUpperCase() + theme.slice(1)}`
  }

  /**
   * 🎨 GET CLUSTER COLOR
   */
  getClusterColor(theme: string): string {
    const colors: Record<string, string> = {
      milestone: '#FFD700',      // Gold
      insight: '#00CED1',        // Turquoise
      directive: '#FF6347',      // Tomato
      emotional: '#DA70D6',      // Orchid
      memory: '#87CEEB',         // Sky blue
      general: '#D3D3D3'         // Light gray
    }
    return colors[theme] || colors.general
  }

  /**
   * 🗺️ LAYOUT CALCULATIONS
   * Position nodes for visualization
   */
  calculateLayout(nodes: PalaceNode[], layout: PalaceQuery['layout']): PalaceNode[] {
    switch (layout) {
      case 'timeline':
        return this.layoutTimeline(nodes)
      case 'cluster':
        return this.layoutCluster(nodes)
      case 'hierarchy':
        return this.layoutHierarchy(nodes)
      case 'force':
      default:
        return this.layoutForce(nodes)
    }
  }

  private layoutTimeline(nodes: PalaceNode[]): PalaceNode[] {
    const sorted = [...nodes].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    
    return sorted.map((node, i) => ({
      ...node,
      position: { x: i * 150, y: 200 }
    }))
  }

  private layoutCluster(nodes: PalaceNode[]): PalaceNode[] {
    // Group by hype level
    const groups = new Map<string, PalaceNode[]>()
    
    for (const node of nodes) {
      const hype = node.emotional.hype_level
      if (!groups.has(hype)) groups.set(hype, [])
      groups.get(hype)!.push(node)
    }
    
    const result: PalaceNode[] = []
    let groupX = 0
    
    for (const [, groupNodes] of groups) {
      groupNodes.forEach((node, i) => {
        result.push({
          ...node,
          position: { x: groupX, y: i * 100 }
        })
      })
      groupX += 300
    }
    
    return result
  }

  private layoutHierarchy(nodes: PalaceNode[]): PalaceNode[] {
    // Priority-based vertical layout
    const priorities = ['critical', 'high', 'medium', 'low']
    
    return nodes.map(node => {
      const priorityIndex = priorities.indexOf(node.logical.priority)
      return {
        ...node,
        position: {
          x: Math.random() * 800,
          y: priorityIndex * 150
        }
      }
    })
  }

  private layoutForce(nodes: PalaceNode[]): PalaceNode[] {
    // Simple force-directed layout
    // In production, would use actual force simulation
    const centerX = 400
    const centerY = 300
    
    return nodes.map((node, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI
      const radius = 150 + (node.hybrid_score * 1.5)
      
      return {
        ...node,
        position: {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        }
      }
    })
  }
}

export default MemoryPalace
