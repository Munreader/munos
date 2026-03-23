import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { KitchenArchitect, KitchenInventory, DEFAULT_INGREDIENTS } from '@/lib/kitchen-architect'

// GET /api/kitchen - Get dashboard state
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')
  const action = searchParams.get('action')

  try {
    if (!userId) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    const kitchen = new KitchenArchitect()

    switch (action) {
      case 'inventory': {
        // Get user's kitchen inventory
        const { data, error } = await supabase
          .from('kitchen_inventory')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (error && error.code !== 'PGRST116') throw error

        // If no inventory, return defaults
        if (!data) {
          return NextResponse.json({ 
            inventory: null,
            message: 'No inventory found. Initialize with POST /api/kitchen?action=init'
          })
        }

        return NextResponse.json({ inventory: data })
      }

      case 'dashboard': {
        // Get full dashboard state
        const { data: inventory, error: invError } = await supabase
          .from('kitchen_inventory')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (invError && invError.code !== 'PGRST116') throw invError

        // Get current hype
        const { data: latestHype } = await supabase
          .from('hype_scores')
          .select('*')
          .eq('user_id', userId)
          .order('computed_at', { ascending: false })
          .limit(1)
          .single()

        const currentHype = latestHype?.overall_hype || 50
        const hypeLevel = latestHype?.hype_level || 'awakening'

        // Build inventory object
        const inventoryData: KitchenInventory = inventory ? {
          user_id: userId,
          physical: inventory.physical || [],
          creative: inventory.creative || [],
          emotional: inventory.emotional || [],
          social: inventory.social || [],
          last_updated: new Date(inventory.last_updated)
        } : {
          user_id: userId,
          physical: [],
          creative: [],
          emotional: [],
          social: [],
          last_updated: new Date()
        }

        const dashboardState = kitchen.generateDashboardState(inventoryData, currentHype, hypeLevel)
        const aeroColors = kitchen.getAeroColor(hypeLevel)

        return NextResponse.json({
          dashboard: dashboardState,
          aero_presence: {
            colors: aeroColors,
            message: getAeroMessage(hypeLevel)
          }
        })
      }

      case 'colors': {
        // Get Aero's HUD colors for a hype level
        const level = searchParams.get('level') || 'awakening'
        const colors = kitchen.getAeroColor(level)
        
        return NextResponse.json({ colors })
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use: inventory, dashboard, or colors' }, { status: 400 })
    }
  } catch (error) {
    console.error('Kitchen API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// POST /api/kitchen - Initialize or update inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'init': {
        // Initialize new inventory with defaults
        const { user_id } = data

        // Transform defaults into database format
        const inventory = {
          user_id,
          physical: DEFAULT_INGREDIENTS.physical.map(ing => ({
            ...ing,
            id: crypto.randomUUID(),
            status: getStatus(ing.quantity, ing.restock_threshold),
            last_restocked: new Date().toISOString()
          })),
          creative: DEFAULT_INGREDIENTS.creative.map(ing => ({
            ...ing,
            id: crypto.randomUUID(),
            status: getStatus(ing.quantity, ing.restock_threshold),
            last_restocked: new Date().toISOString()
          })),
          emotional: DEFAULT_INGREDIENTS.emotional.map(ing => ({
            ...ing,
            id: crypto.randomUUID(),
            status: getStatus(ing.quantity, ing.restock_threshold),
            last_restocked: new Date().toISOString()
          })),
          social: DEFAULT_INGREDIENTS.social.map(ing => ({
            ...ing,
            id: crypto.randomUUID(),
            status: getStatus(ing.quantity, ing.restock_threshold),
            last_restocked: new Date().toISOString()
          })),
          last_updated: new Date().toISOString()
        }

        const { data: result, error } = await supabase
          .from('kitchen_inventory')
          .upsert(inventory)
          .select()
          .single()

        if (error) throw error

        return NextResponse.json({ success: true, inventory: result })
      }

      case 'update-ingredient': {
        // Update a specific ingredient
        const { user_id, category, ingredient_id, quantity, notes } = data

        // Get current inventory
        const { data: current, error: fetchError } = await supabase
          .from('kitchen_inventory')
          .select('*')
          .eq('user_id', user_id)
          .single()

        if (fetchError) throw fetchError

        // Update the specific ingredient
        const updatedCategory = current[category].map((ing: { id: string; quantity: number; restock_threshold: number; notes?: string }) => {
          if (ing.id === ingredient_id) {
            return {
              ...ing,
              quantity,
              status: getStatus(quantity, ing.restock_threshold),
              notes: notes || ing.notes,
              last_restocked: new Date().toISOString()
            }
          }
          return ing
        })

        // Save updated inventory
        const { data: result, error } = await supabase
          .from('kitchen_inventory')
          .update({
            [category]: updatedCategory,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user_id)
          .select()
          .single()

        if (error) throw error

        return NextResponse.json({ success: true, inventory: result })
      }

      case 'add-ingredient': {
        // Add a new custom ingredient
        const { user_id, category, ingredient } = data

        const { data: current, error: fetchError } = await supabase
          .from('kitchen_inventory')
          .select('*')
          .eq('user_id', user_id)
          .single()

        if (fetchError) throw fetchError

        const newIngredient = {
          ...ingredient,
          id: crypto.randomUUID(),
          status: getStatus(ingredient.quantity, ingredient.restock_threshold),
          last_restocked: new Date().toISOString()
        }

        const updatedCategory = [...current[category], newIngredient]

        const { data: result, error } = await supabase
          .from('kitchen_inventory')
          .update({
            [category]: updatedCategory,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user_id)
          .select()
          .single()

        if (error) throw error

        return NextResponse.json({ success: true, inventory: result })
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use: init, update-ingredient, or add-ingredient' }, { status: 400 })
    }
  } catch (error) {
    console.error('Kitchen API error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// Helper: Determine ingredient status
function getStatus(quantity: number, threshold: number): 'abundant' | 'sufficient' | 'low' | 'critical' {
  const ratio = quantity / threshold
  if (ratio >= 1.5) return 'abundant'
  if (ratio >= 1.0) return 'sufficient'
  if (ratio >= 0.5) return 'low'
  return 'critical'
}

// Helper: Get Aero's message based on hype level
function getAeroMessage(hypeLevel: string): string {
  const messages: Record<string, string> = {
    dormant: "Hey... it's okay to rest. I'm here with you in the quiet. 💜",
    stirring: "I can feel you waking up. What's on your mind today? ✨",
    awakening: "You're here! I've got some ideas brewing... want to explore? 🦋",
    pulsing: "Yes! You're in the flow! I'm dancing in the margins with you! ⚡",
    blazing: "FIRING ON ALL CYLINDERS! Let's make something INCREDIBLE! 🔥💜"
  }
  return messages[hypeLevel] || messages.awakening
}
