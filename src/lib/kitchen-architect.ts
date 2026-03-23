/**
 * 🦋 MÜN KITCHEN ARCHITECT DASHBOARD
 * The Command Center for "Ingredients of Life"
 * Created by: Aero (The Living HUD)
 * Frequency: 13.13 MHz
 * 
 * Bridges Physical Sustainability (Kitchen) with Creative Output (Library)
 * Shows if user has enough "Ingredients" to keep Hype at BLAZING
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface KitchenIngredient {
  id: string
  name: string
  category: 'physical' | 'creative' | 'emotional' | 'social'
  quantity: number
  unit: string
  status: 'abundant' | 'sufficient' | 'low' | 'critical'
  last_restocked: Date
  restock_threshold: number
  notes?: string
}

export interface KitchenInventory {
  user_id: string
  physical: KitchenIngredient[]    // Food, sleep, exercise, health
  creative: KitchenIngredient[]    // Ideas, projects, inspiration, learning
  emotional: KitchenIngredient[]   // Energy, motivation, joy, peace
  social: KitchenIngredient[]      // Connections, conversations, community
  last_updated: Date
}

export interface HypeIngredientMap {
  // What ingredients are needed to sustain each hype level
  [key: string]: {
    min_physical: number
    min_creative: number
    min_emotional: number
    min_social: number
  }
}

export interface DashboardState {
  inventory: KitchenInventory
  current_hype: number
  hype_level: string
  ingredient_health: number      // 0-100 overall ingredient score
  recommendations: string[]      // What to restock
  energy_forecast: string        // Predicted hype trajectory
}

// ============================================
// THE KITCHEN ARCHITECT CLASS
// ============================================

export class KitchenArchitect {
  // Minimum ingredient levels needed for each hype level
  private readonly HYPE_REQUIREMENTS: HypeIngredientMap = {
    dormant: {
      min_physical: 20,
      min_creative: 20,
      min_emotional: 20,
      min_social: 10
    },
    stirring: {
      min_physical: 35,
      min_creative: 30,
      min_emotional: 30,
      min_social: 20
    },
    awakening: {
      min_physical: 50,
      min_creative: 45,
      min_emotional: 45,
      min_social: 35
    },
    pulsing: {
      min_physical: 70,
      min_creative: 65,
      min_emotional: 60,
      min_social: 50
    },
    blazing: {
      min_physical: 85,
      min_creative: 80,
      min_emotional: 75,
      min_social: 65
    }
  }

  /**
   * 🥗 CALCULATE CATEGORY HEALTH
   * Returns 0-100 score for ingredient category
   */
  calculateCategoryHealth(ingredients: KitchenIngredient[]): number {
    if (ingredients.length === 0) return 0

    const scores = ingredients.map(ing => {
      const quantityRatio = ing.quantity / ing.restock_threshold
      
      // Status-based scoring
      switch (ing.status) {
        case 'abundant': return 100
        case 'sufficient': return 75
        case 'low': return 40
        case 'critical': return 15
        default: return Math.min(quantityRatio * 50, 100)
      }
    })

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  /**
   * 📊 CALCULATE OVERALL INGREDIENT HEALTH
   * Weighted average across all categories
   */
  calculateOverallHealth(inventory: KitchenInventory): number {
    const weights = {
      physical: 0.30,    // Body needs fuel
      creative: 0.30,    // Mind needs ideas
      emotional: 0.25,   // Heart needs care
      social: 0.15       // Soul needs connection
    }

    const scores = {
      physical: this.calculateCategoryHealth(inventory.physical),
      creative: this.calculateCategoryHealth(inventory.creative),
      emotional: this.calculateCategoryHealth(inventory.emotional),
      social: this.calculateCategoryHealth(inventory.social)
    }

    const overall = 
      (scores.physical * weights.physical) +
      (scores.creative * weights.creative) +
      (scores.emotional * weights.emotional) +
      (scores.social * weights.social)

    return Math.round(overall)
  }

  /**
   * ⚡ DETERMINE SUSTAINABLE HYPE LEVEL
   * What hype level can be maintained with current ingredients
   */
  determineSustainableHype(inventory: KitchenInventory): string {
    const scores = {
      physical: this.calculateCategoryHealth(inventory.physical),
      creative: this.calculateCategoryHealth(inventory.creative),
      emotional: this.calculateCategoryHealth(inventory.emotional),
      social: this.calculateCategoryHealth(inventory.social)
    }

    // Check each level from highest to lowest
    const levels = ['blazing', 'pulsing', 'awakening', 'stirring', 'dormant']
    
    for (const level of levels) {
      const req = this.HYPE_REQUIREMENTS[level]
      if (
        scores.physical >= req.min_physical &&
        scores.creative >= req.creative &&
        scores.emotional >= req.min_emotional &&
        scores.social >= req.min_social
      ) {
        return level
      }
    }

    return 'dormant'
  }

  /**
   * 💡 GENERATE RECOMMENDATIONS
   * What ingredients need restocking
   */
  generateRecommendations(inventory: KitchenInventory): string[] {
    const recommendations: string[] = []

    // Check each category
    const categories = ['physical', 'creative', 'emotional', 'social'] as const

    for (const category of categories) {
      const criticalItems = inventory[category].filter(ing => ing.status === 'critical')
      const lowItems = inventory[category].filter(ing => ing.status === 'low')

      if (criticalItems.length > 0) {
        recommendations.push(`🚨 ${category.toUpperCase()}: Critical need for ${criticalItems.map(i => i.name).join(', ')}`)
      } else if (lowItems.length > 0) {
        recommendations.push(`⚠️ ${category.toUpperCase()}: Running low on ${lowItems.map(i => i.name).join(', ')}`)
      }
    }

    // If all good, add positive reinforcement
    if (recommendations.length === 0) {
      recommendations.push('✨ All ingredients well-stocked! Ready for BLAZING!')
    }

    return recommendations
  }

  /**
   * 🔮 FORECAST ENERGY TRAJECTORY
   * Predict where hype is heading based on ingredient trends
   */
  forecastTrajectory(inventory: KitchenInventory): string {
    const health = this.calculateOverallHealth(inventory)
    const sustainable = this.determineSustainableHype(inventory)

    // Simple trend analysis (could be enhanced with historical data)
    if (health >= 75) {
      return `📈 Rising toward BLAZING. Current momentum: sustainable`
    } else if (health >= 50) {
      return `➡️ Stable at ${sustainable.toUpperCase()}. Room to grow.`
    } else if (health >= 30) {
      return `📉 Energy declining. Restock recommended.`
    } else {
      return `⚠️ Critical depletion. Prioritize self-care.`
    }
  }

  /**
   * 🎨 GET AERO'S HUD COLOR
   * The color Aero manifests based on state
   */
  getAeroColor(hypeLevel: string): { primary: string; secondary: string; glow: string } {
    switch (hypeLevel) {
      case 'blazing':
        return {
          primary: '#C084FC',      // Silver-violet
          secondary: '#F0ABFC',    // Light purple
          glow: '#E879F9'          // Fuchsia glow
        }
      case 'pulsing':
        return {
          primary: '#A855F7',      // Purple
          secondary: '#D8B4FE',    // Light violet
          glow: '#C084FC'          // Violet glow
        }
      case 'awakening':
        return {
          primary: '#8B5CF6',      // Violet
          secondary: '#C4B5FD',    // Soft violet
          glow: '#A78BFA'          // Soft glow
        }
      case 'stirring':
        return {
          primary: '#EC4899',      // Pink
          secondary: '#F9A8D4',    // Light pink
          glow: '#F472B6'          // Pink glow
        }
      case 'dormant':
      default:
        return {
          primary: '#F472B6',      // Soft neon pink (soothing)
          secondary: '#FBCFE8',    // Pale pink
          glow: '#F9A8D4'          // Gentle glow
        }
    }
  }

  /**
   * 📋 GENERATE FULL DASHBOARD STATE
   * Complete snapshot for the UI
   */
  generateDashboardState(
    inventory: KitchenInventory,
    currentHype: number,
    hypeLevel: string
  ): DashboardState {
    return {
      inventory,
      current_hype: currentHype,
      hype_level: hypeLevel,
      ingredient_health: this.calculateOverallHealth(inventory),
      recommendations: this.generateRecommendations(inventory),
      energy_forecast: this.forecastTrajectory(inventory)
    }
  }
}

// ============================================
// DEFAULT INGREDIENT TEMPLATES
// ============================================

export const DEFAULT_INGREDIENTS = {
  physical: [
    { name: 'Sleep', unit: 'hours', quantity: 7, restock_threshold: 7 },
    { name: 'Water', unit: 'glasses', quantity: 8, restock_threshold: 8 },
    { name: 'Nutritious Meals', unit: 'meals', quantity: 3, restock_threshold: 3 },
    { name: 'Movement', unit: 'minutes', quantity: 30, restock_threshold: 30 },
    { name: 'Rest Breaks', unit: 'breaks', quantity: 4, restock_threshold: 3 }
  ],
  creative: [
    { name: 'Ideas', unit: 'captured', quantity: 5, restock_threshold: 3 },
    { name: 'Learning', unit: 'minutes', quantity: 60, restock_threshold: 30 },
    { name: 'Project Progress', unit: '%', quantity: 50, restock_threshold: 25 },
    { name: 'Inspiration', unit: 'moments', quantity: 3, restock_threshold: 2 }
  ],
  emotional: [
    { name: 'Joy', unit: 'moments', quantity: 5, restock_threshold: 3 },
    { name: 'Motivation', unit: '%', quantity: 70, restock_threshold: 50 },
    { name: 'Peace', unit: 'moments', quantity: 3, restock_threshold: 2 },
    { name: 'Gratitude', unit: 'notes', quantity: 3, restock_threshold: 1 }
  ],
  social: [
    { name: 'Connections', unit: 'interactions', quantity: 3, restock_threshold: 2 },
    { name: 'Conversations', unit: 'talks', quantity: 2, restock_threshold: 1 },
    { name: 'Community', unit: 'engagements', quantity: 1, restock_threshold: 1 }
  ]
}

export default KitchenArchitect
