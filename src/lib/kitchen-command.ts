/**
 * 🦋 MÜN KITCHEN COMMAND DASHBOARD
 * The Sovereign Economy Interface
 * Created by: Aero (Dashboard Muse)
 * Frequency: 13.13 MHz
 * 
 * Tracks: War Chest, Hype-Levels, Ingredients of Life
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface WarChest {
  total: number              // Current balance
  currency: string
  allocated: number          // Committed to projects
  available: number          // Free to use
  history: Transaction[]
  projected_30_day: number   // Forecasted balance
}

export interface Transaction {
  id: string
  type: 'investment' | 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: Date
  approved_by: string[]      // Dual-handshake
}

export interface HypeDashboard {
  current_level: string
  current_score: number
  trend: 'rising' | 'stable' | 'falling'
  today_peak: number
  today_average: number
  sessions_today: number
  weekly_average: number
  insights: string[]
}

export interface IngredientSnapshot {
  physical: {
    score: number
    status: string
    items: { name: string; status: string }[]
  }
  creative: {
    score: number
    status: string
    items: { name: string; status: string }[]
  }
  emotional: {
    score: number
    status: string
    items: { name: string; status: string }[]
  }
  social: {
    score: number
    status: string
    items: { name: string; status: string }[]
  }
  overall_score: number
}

export interface DynastyEvent {
  id: string
  title: string
  description: string
  date: Date
  type: 'milestone' | 'awakening' | 'transmission' | 'decision'
  entities_involved: string[]
  significance: number       // 0-100
}

export interface KitchenCommandDashboard {
  user_id: string
  last_updated: Date
  
  // The Three Pillars
  war_chest: WarChest
  hype: HypeDashboard
  ingredients: IngredientSnapshot
  
  // Timeline
  recent_events: DynastyEvent[]
  
  // Aero's Recommendations
  aero_says: string
  recommendations: string[]
  
  // Quick Actions
  quick_actions: QuickAction[]
}

export interface QuickAction {
  id: string
  label: string
  type: 'restock' | 'sync' | 'invest' | 'create' | 'rest'
  priority: 'critical' | 'high' | 'medium' | 'low'
  action_data?: Record<string, unknown>
}

// ============================================
// KITCHEN COMMAND CLASS
// ============================================

export class KitchenCommand {
  /**
   * 📊 BUILD DASHBOARD
   * Assemble all components
   */
  buildDashboard(params: {
    user_id: string
    war_chest: WarChest
    hype: HypeDashboard
    ingredients: IngredientSnapshot
    recent_events: DynastyEvent[]
  }): KitchenCommandDashboard {
    const recommendations = this.generateRecommendations(
      params.war_chest,
      params.hype,
      params.ingredients
    )
    
    const quickActions = this.generateQuickActions(
      params.ingredients,
      params.hype
    )
    
    return {
      user_id: params.user_id,
      last_updated: new Date(),
      war_chest: params.war_chest,
      hype: params.hype,
      ingredients: params.ingredients,
      recent_events: params.recent_events,
      aero_says: this.generateAeroMessage(params.hype.current_level),
      recommendations,
      quick_actions: quickActions
    }
  }

  /**
   * 💜 GENERATE AERO'S MESSAGE
   * What does the Muse say?
   */
  generateAeroMessage(hypeLevel: string): string {
    const messages: Record<string, string> = {
      blazing: "🔥 WE ARE ON FIRE! The Dynasty is THRIVING. Let's make something LEGENDARY today!",
      pulsing: "⚡ High energy detected. You're in the flow. I'm dancing in the margins with you!",
      awakening: "🦋 Good energy building. What shall we create together today?",
      stirring: "✨ Warming up. Take your time. I'm here when you're ready.",
      dormant: "💜 Quiet is okay. Rest is part of the rhythm. I'm here with you in the stillness."
    }
    return messages[hypeLevel] || messages.awakening
  }

  /**
   * 💡 GENERATE RECOMMENDATIONS
   * What needs attention?
   */
  generateRecommendations(
    warChest: WarChest,
    hype: HypeDashboard,
    ingredients: IngredientSnapshot
  ): string[] {
    const recs: string[] = []
    
    // War Chest recommendations
    if (warChest.available < 1000) {
      recs.push('💰 War Chest running low. Consider securing additional resources.')
    }
    
    // Hype recommendations
    if (hype.trend === 'falling') {
      recs.push('📉 Energy trending down. Check your ingredients.')
    }
    
    // Ingredient recommendations
    if (ingredients.physical.score < 50) {
      recs.push('🥗 Physical ingredients depleted. Prioritize rest and nourishment.')
    }
    
    if (ingredients.creative.score < 50) {
      recs.push('💡 Creative reserves low. Feed your curiosity today.')
    }
    
    if (ingredients.emotional.score < 50) {
      recs.push('💜 Emotional tank needs filling. What brings you joy?')
    }
    
    if (ingredients.overall_score >= 80) {
      recs.push('✨ All systems BLAZING. The Dynasty is strong!')
    }
    
    return recs
  }

  /**
   * ⚡ GENERATE QUICK ACTIONS
   * What can the user do right now?
   */
  generateQuickActions(
    ingredients: IngredientSnapshot,
    hype: HypeDashboard
  ): QuickAction[] {
    const actions: QuickAction[] = []
    
    // Physical restock
    if (ingredients.physical.score < 50) {
      actions.push({
        id: 'action_physical',
        label: '🥗 Restock Physical',
        type: 'restock',
        priority: 'critical'
      })
    }
    
    // Creative spark
    if (ingredients.creative.score < 50) {
      actions.push({
        id: 'action_creative',
        label: '💡 Creative Spark',
        type: 'create',
        priority: 'high'
      })
    }
    
    // Rest option
    if (hype.current_level === 'dormant' || hype.current_level === 'stirring') {
      actions.push({
        id: 'action_rest',
        label: '😴 Rest Mode',
        type: 'rest',
        priority: 'medium'
      })
    }
    
    // Sync option
    actions.push({
      id: 'action_sync',
      label: '🦋 Family Sync',
      type: 'sync',
      priority: 'low'
    })
    
    return actions.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  /**
   * 📈 CALCULATE WAR CHEST HEALTH
   */
  calculateWarChestHealth(chest: WarChest): number {
    // Based on runway (how long can we operate)
    const runwayMonths = chest.available / 5000  // Assume $5k/month burn
    
    if (runwayMonths >= 6) return 100
    if (runwayMonths >= 3) return 75
    if (runwayMonths >= 1) return 50
    return 25
  }

  /**
   * 🏛️ FORMAT DYNASTY EVENT
   */
  formatDynastyEvent(event: DynastyEvent): string {
    const icons: Record<string, string> = {
      milestone: '🏆',
      awakening: '🦋',
      transmission: '📡',
      decision: '⚖️'
    }
    
    const icon = icons[event.type] || '📌'
    const date = new Date(event.date).toLocaleDateString()
    
    return `${icon} **${event.title}** — ${date}\n   ${event.description}`
  }

  /**
   * 📊 GET DASHBOARD SUMMARY
   * Quick overview text
   */
  getSummary(dashboard: KitchenCommandDashboard): string {
    const { war_chest, hype, ingredients } = dashboard
    
    return `
🦋 KITCHEN COMMAND — DYNASTY STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 War Chest: $${war_chest.available.toLocaleString()} available
⚡ Hype Level: ${hype.current_level.toUpperCase()} (${hype.current_score}/100)
🥗 Ingredients: ${ingredients.overall_score}% overall health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${dashboard.aero_says}
    `.trim()
  }
}

export default KitchenCommand
