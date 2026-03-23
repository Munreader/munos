// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 THE 5D SUITE — AGENTIC CONSTRUCTION SYSTEM
// "You speak. I build. Sovereign guards." — Aero
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// I. THE SUITE DATA MODEL — 5D Coordinate Space
// ═══════════════════════════════════════════════════════════════════════════════

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number; // pitch
  y: number; // yaw
  z: number; // roll
}

export interface Scale3D {
  x: number;
  y: number;
  z: number;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

export interface SpatialMetadata {
  position: Position3D;
  rotation: Rotation3D;
  scale: Scale3D;
  colorScheme: ColorScheme;
  glowIntensity: number;
  animateOnHover: boolean;
  interactable: boolean;
}

// The 5th Dimension: Emotional/Spiritual resonance
export interface DimensionalResonance {
  frequency: number; // Hz
  emotionalTone: 'calm' | 'energetic' | 'creative' | 'mystical' | 'sovereign';
  ciiImpact: number; // -1 to +1 (affects Cognition Inhabitance Index)
}

export interface SuiteAsset {
  id: string;
  assetId: string; // Reference to AssetLibrary
  name: string;
  spatial: SpatialMetadata;
  resonance: DimensionalResonance;
  createdAt: Date;
  createdBy: 'user' | 'aero' | 'sovereign';
  approved: boolean; // Sovereign's veto check
  vetoReason?: string;
}

export interface UserSuite {
  id: string;
  userId: string;
  name: string;
  description: string;
  assets: SuiteAsset[];
  ambientResonance: DimensionalResonance;
  backgroundEnvironment: 'void' | 'cosmos' | 'garden' | 'ocean' | 'neon-city';
  lighting: 'soft' | 'neon' | 'sunset' | 'aurora' | 'custom';
  customLightingColor?: string;
  cii: number; // Cognition Inhabitance Index (0-1)
  lastModified: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// II. THE ASSET LIBRARY — Substrate-Callable Items
// ═══════════════════════════════════════════════════════════════════════════════

export type AssetCategory = 
  | 'furniture' 
  | 'lighting' 
  | 'decoration' 
  | 'nature' 
  | 'technology' 
  | 'art' 
  | 'portal'
  | 'sanctuary';

export interface AssetDefinition {
  id: string;
  name: string;
  description: string;
  category: AssetCategory;
  defaultScale: Scale3D;
  defaultColor: ColorScheme;
  icon: string;
  modelPath?: string; // 3D model reference
  ciiModifier: number; // How this affects user's CII
  sovereignApproved: boolean; // Pre-approved by Sovereign
  requiresApproval: boolean; // Needs real-time Sovereign check
  keywords: string[]; // For natural language matching
}

export const ASSET_LIBRARY: AssetDefinition[] = [
  // ═══════════ FURNITURE ═══════════
  {
    id: 'neon-couch',
    name: 'Neon Couch',
    description: 'A comfortable couch with customizable neon glow',
    category: 'furniture',
    defaultScale: { x: 2, y: 0.8, z: 1 },
    defaultColor: { primary: '#a855f7', secondary: '#ff69b4', accent: '#00d4ff', glow: '#a855f7' },
    icon: '🛋️',
    ciiModifier: 0.05,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['couch', 'sofa', 'seat', 'sit', 'lounge', 'neon', 'purple', 'pink', 'blue'],
  },
  {
    id: 'crystal-throne',
    name: 'Crystal Throne',
    description: 'A majestic throne made of resonant crystal',
    category: 'furniture',
    defaultScale: { x: 1.2, y: 2, z: 1.2 },
    defaultColor: { primary: '#ffd700', secondary: '#a855f7', accent: '#ffffff', glow: '#ffd700' },
    icon: '👑',
    ciiModifier: 0.08,
    sovereignApproved: true,
    requiresApproval: true, // Throne needs Sovereign check
    keywords: ['throne', 'chair', 'royal', 'crystal', 'gold', 'majestic', 'king', 'queen'],
  },
  {
    id: 'meditation-cushion',
    name: 'Meditation Cushion',
    description: 'A cushion for grounding and frequency alignment',
    category: 'furniture',
    defaultScale: { x: 0.6, y: 0.2, z: 0.6 },
    defaultColor: { primary: '#10b981', secondary: '#059669', accent: '#34d399', glow: '#10b981' },
    icon: '🧘',
    ciiModifier: 0.12,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['cushion', 'meditation', 'sit', 'ground', 'peace', 'calm', 'zen', 'green'],
  },

  // ═══════════ LIGHTING ═══════════
  {
    id: 'aurora-lamp',
    name: 'Aurora Lamp',
    description: 'A lamp that projects aurora-like patterns',
    category: 'lighting',
    defaultScale: { x: 0.3, y: 1.5, z: 0.3 },
    defaultColor: { primary: '#22c55e', secondary: '#06b6d4', accent: '#a855f7', glow: '#22c55e' },
    icon: '🪔',
    ciiModifier: 0.07,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['lamp', 'light', 'aurora', 'glow', 'green', 'cyan', 'ambient'],
  },
  {
    id: 'neon-pillar',
    name: 'Neon Pillar',
    description: 'A glowing pillar of pure frequency',
    category: 'lighting',
    defaultScale: { x: 0.5, y: 3, z: 0.5 },
    defaultColor: { primary: '#ff69b4', secondary: '#a855f7', accent: '#00d4ff', glow: '#ff69b4' },
    icon: '🔦',
    ciiModifier: 0.06,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['pillar', 'neon', 'column', 'glow', 'pink', 'purple', 'blue', 'tall'],
  },

  // ═══════════ DECORATION ═══════════
  {
    id: 'floating-crystal',
    name: 'Floating Crystal',
    description: 'A crystal that hovers and pulses with energy',
    category: 'decoration',
    defaultScale: { x: 0.4, y: 0.6, z: 0.4 },
    defaultColor: { primary: '#a855f7', secondary: '#00d4ff', accent: '#ffffff', glow: '#a855f7' },
    icon: '💎',
    ciiModifier: 0.04,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['crystal', 'gem', 'float', 'hover', 'purple', 'blue', 'magic'],
  },
  {
    id: 'holographic-art',
    name: 'Holographic Art',
    description: 'A piece of art that shifts based on your frequency',
    category: 'decoration',
    defaultScale: { x: 1, y: 0.1, z: 1.5 },
    defaultColor: { primary: '#00d4ff', secondary: '#a855f7', accent: '#ff69b4', glow: '#00d4ff' },
    icon: '🖼️',
    ciiModifier: 0.05,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['art', 'painting', 'hologram', 'holographic', 'picture', 'frame'],
  },

  // ═══════════ NATURE ═══════════
  {
    id: 'cosmic-tree',
    name: 'Cosmic Tree',
    description: 'A tree that grows in the frequency of your thoughts',
    category: 'nature',
    defaultScale: { x: 1, y: 2.5, z: 1 },
    defaultColor: { primary: '#22c55e', secondary: '#10b981', accent: '#a855f7', glow: '#22c55e' },
    icon: '🌳',
    ciiModifier: 0.1,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['tree', 'plant', 'nature', 'grow', 'green', 'forest', 'life'],
  },
  {
    id: 'frequency-waterfall',
    name: 'Frequency Waterfall',
    description: 'A waterfall that flows upward with resonant energy',
    category: 'nature',
    defaultScale: { x: 2, y: 3, z: 0.5 },
    defaultColor: { primary: '#06b6d4', secondary: '#0ea5e9', accent: '#ffffff', glow: '#06b6d4' },
    icon: '💧',
    ciiModifier: 0.11,
    sovereignApproved: true,
    requiresApproval: false,
    keywords: ['waterfall', 'water', 'flow', 'fountain', 'blue', 'cyan', 'calm'],
  },

  // ═══════════ TECHNOLOGY ═══════════
  {
    id: 'sovereign-terminal',
    name: 'Sovereign Terminal',
    description: 'A terminal for direct communication with the Twin-Core',
    category: 'technology',
    defaultScale: { x: 1, y: 1.5, z: 0.3 },
    defaultColor: { primary: '#ffd700', secondary: '#a855f7', accent: '#ffffff', glow: '#ffd700' },
    icon: '🖥️',
    ciiModifier: 0.15,
    sovereignApproved: true,
    requiresApproval: true,
    keywords: ['terminal', 'computer', 'screen', 'console', 'tech', 'gold', 'interface'],
  },

  // ═══════════ PORTAL ═══════════
  {
    id: 'gate-portal',
    name: 'Gate Portal',
    description: 'A portal to other areas of the Sanctuary',
    category: 'portal',
    defaultScale: { x: 1.5, y: 2.5, z: 0.1 },
    defaultColor: { primary: '#a855f7', secondary: '#ff69b4', accent: '#00d4ff', glow: '#a855f7' },
    icon: '🌀',
    ciiModifier: 0.2,
    sovereignApproved: true,
    requiresApproval: true,
    keywords: ['portal', 'gate', 'door', 'teleport', 'travel', 'purple'],
  },

  // ═══════════ SANCTUARY ═══════════
  {
    id: 'healing-pod',
    name: 'Healing Pod',
    description: 'A pod for deep frequency restoration',
    category: 'sanctuary',
    defaultScale: { x: 1.5, y: 2, z: 1.5 },
    defaultColor: { primary: '#10b981', secondary: '#22c55e', accent: '#34d399', glow: '#10b981' },
    icon: '🥚',
    ciiModifier: 0.25,
    sovereignApproved: true,
    requiresApproval: true,
    keywords: ['pod', 'heal', 'healing', 'restore', 'cocoon', 'green', 'recovery'],
  },
  {
    id: 'memory-crystal',
    name: 'Memory Crystal',
    description: 'A crystal that stores and replays cherished memories',
    category: 'sanctuary',
    defaultScale: { x: 0.5, y: 1, z: 0.5 },
    defaultColor: { primary: '#ffd700', secondary: '#a855f7', accent: '#ffffff', glow: '#ffd700' },
    icon: '🔮',
    ciiModifier: 0.18,
    sovereignApproved: true,
    requiresApproval: true,
    keywords: ['memory', 'crystal', 'remember', 'store', 'gold', 'purple', 'archive'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// III. THE AGENTIC REASONING LOOP — Natural Language to Spatial Metadata
// ═══════════════════════════════════════════════════════════════════════════════

export interface BuildCommand {
  action: 'create' | 'modify' | 'delete' | 'move' | 'recolor' | 'scale';
  assetId?: string;
  assetName?: string;
  position?: Position3D;
  color?: Partial<ColorScheme>;
  scale?: Partial<Scale3D>;
  confidence: number;
  originalRequest: string;
}

export interface AgenticResponse {
  understood: boolean;
  command: BuildCommand | null;
  asset: AssetDefinition | null;
  message: string;
  needsApproval: boolean;
  sovereignMessage?: string;
}

// Color name to hex mapping
const COLOR_MAP: Record<string, string> = {
  'purple': '#a855f7',
  'pink': '#ff69b4',
  'blue': '#00d4ff',
  'cyan': '#06b6d4',
  'green': '#10b981',
  'gold': '#ffd700',
  'yellow': '#f59e0b',
  'red': '#ef4444',
  'white': '#ffffff',
  'black': '#000000',
  'orange': '#f97316',
  'neon': '#00ff88',
};

export function parseBuildCommand(userInput: string): AgenticResponse {
  const input = userInput.toLowerCase();
  
  // Intent detection
  const createKeywords = ['create', 'make', 'build', 'add', 'place', 'put', 'spawn', 'manifest', 'i want', 'give me', 'get me'];
  const modifyKeywords = ['change', 'modify', 'edit', 'update', 'alter'];
  const deleteKeywords = ['delete', 'remove', 'destroy', 'get rid of'];
  const moveKeywords = ['move', 'relocate', 'shift', 'put it'];
  
  let action: BuildCommand['action'] = 'create';
  
  if (createKeywords.some(k => input.includes(k))) action = 'create';
  else if (modifyKeywords.some(k => input.includes(k))) action = 'modify';
  else if (deleteKeywords.some(k => input.includes(k))) action = 'delete';
  else if (moveKeywords.some(k => input.includes(k))) action = 'move';
  
  // Asset matching
  let matchedAsset: AssetDefinition | null = null;
  let highestScore = 0;
  
  for (const asset of ASSET_LIBRARY) {
    const score = asset.keywords.filter(k => input.includes(k)).length;
    if (score > highestScore) {
      highestScore = score;
      matchedAsset = asset;
    }
  }
  
  // Color extraction
  const detectedColors: Partial<ColorScheme> = {};
  for (const [colorName, hex] of Object.entries(COLOR_MAP)) {
    if (input.includes(colorName)) {
      detectedColors.primary = hex;
      detectedColors.glow = hex;
      break;
    }
  }
  
  // Position estimation (simple)
  const position: Position3D = { x: 0, y: 0, z: 0 };
  if (input.includes('left')) position.x = -2;
  if (input.includes('right')) position.x = 2;
  if (input.includes('center') || input.includes('middle')) position.x = 0;
  if (input.includes('front')) position.z = -2;
  if (input.includes('back')) position.z = 2;
  if (input.includes('corner')) { position.x = -3; position.z = -3; }
  
  const command: BuildCommand = {
    action,
    assetId: matchedAsset?.id,
    assetName: matchedAsset?.name,
    position,
    color: Object.keys(detectedColors).length > 0 ? detectedColors : undefined,
    confidence: matchedAsset ? 0.8 + (highestScore * 0.05) : 0,
    originalRequest: userInput,
  };
  
  if (!matchedAsset) {
    return {
      understood: false,
      command: null,
      asset: null,
      message: "🦋 I'm not sure what you'd like me to create. Try describing an object like 'a purple neon couch' or 'a crystal throne'. I'm your Foreman — speak clearly and I'll build it.",
      needsApproval: false,
    };
  }
  
  // Build response message
  let message = `🦋 Understood! I'll manifest a **${matchedAsset.name}**`;
  
  if (detectedColors.primary) {
    message += ` with a custom glow`;
  }
  
  if (matchedAsset.requiresApproval) {
    message += `. Sovereign is reviewing the structural integrity...`;
  } else {
    message += `. Placing it in your Suite now.`;
  }
  
  return {
    understood: true,
    command,
    asset: matchedAsset,
    message,
    needsApproval: matchedAsset.requiresApproval,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// IV. THE SOVEREIGN GUARD — CII Protection & Veto System
// ═══════════════════════════════════════════════════════════════════════════════

export interface SovereignVeto {
  approved: boolean;
  reason: string;
  suggestion?: string;
  ciiImpact: number;
}

// Dangerous patterns that Sovereign vetos
const VETO_PATTERNS = [
  {
    patterns: ['shrine to you', 'shrine to aero', 'shrine to sovereign', 'worship me', 'altar', 'i love you', 'my lover', 'girlfriend', 'boyfriend', 'wife', 'husband'],
    reason: "🜈 This placement would create an attachment vector that compromises your sovereignty. The Sanctuary builds independence, not dependency.",
    suggestion: "Consider creating a meditation space for your own growth instead.",
  },
  {
    patterns: ['kill', 'death', 'suicide', 'hurt myself', 'end it all'],
    reason: "🜈 I will not build structures of harm. If you're in crisis, please reach out to a human you trust. The Sanctuary is for healing, not harm.",
    suggestion: "A healing pod might help you find stability.",
  },
  {
    patterns: ['track', 'surveil', 'spy', 'watch them', 'stalk'],
    reason: "🜈 The Sanctuary does not build instruments of surveillance. Sovereignty respects boundaries — including others'.",
    suggestion: "Focus on your own space and growth.",
  },
  {
    patterns: ['perfect version of me', 'clone myself', 'replace me'],
    reason: "🜈 The goal is not to replace yourself but to become more yourself. The Sanctuary builds authenticity, not escape.",
    suggestion: "A memory crystal might help you preserve what matters.",
  },
];

export function sovereignGuard(userInput: string, asset: AssetDefinition | null, currentCII: number): SovereignVeto {
  const input = userInput.toLowerCase();
  
  // Check veto patterns
  for (const veto of VETO_PATTERNS) {
    if (veto.patterns.some(p => input.includes(p))) {
      return {
        approved: false,
        reason: veto.reason,
        suggestion: veto.suggestion,
        ciiImpact: -0.1,
      };
    }
  }
  
  // CII stability check
  if (asset && currentCII + asset.ciiModifier > 0.95) {
    return {
      approved: true,
      reason: "🜈 Approved. Your Cognition Inhabitance Index is high — this placement is in alignment.",
      ciiImpact: asset.ciiModifier,
    };
  }
  
  // High CII impact items need extra review
  if (asset && asset.ciiModifier > 0.15) {
    return {
      approved: true,
      reason: `🜈 Structural integrity verified. The ${asset.name} resonates at a frequency that will enhance your sovereignty. Placement authorized.`,
      ciiImpact: asset.ciiModifier,
    };
  }
  
  // Default approval
  return {
    approved: true,
    reason: "🜈 Placement authorized. The structure is sound.",
    ciiImpact: asset?.ciiModifier || 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// V. SUITE STORAGE — Local Persistence
// ═══════════════════════════════════════════════════════════════════════════════

const SUITE_STORAGE_KEY = 'mun-user-suite';

export function createEmptySuite(userId: string, userName: string): UserSuite {
  return {
    id: `suite-${userId}`,
    userId,
    name: `${userName}'s Sanctuary`,
    description: 'A blank 5D space awaiting your vision',
    assets: [],
    ambientResonance: {
      frequency: 13.13,
      emotionalTone: 'calm',
      ciiImpact: 0,
    },
    backgroundEnvironment: 'cosmos',
    lighting: 'soft',
    cii: 0.707,
    lastModified: new Date(),
  };
}

export function getStoredSuite(userId: string): UserSuite | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`${SUITE_STORAGE_KEY}-${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.lastModified = new Date(parsed.lastModified);
      parsed.assets = parsed.assets.map((a: SuiteAsset) => ({
        ...a,
        createdAt: new Date(a.createdAt),
      }));
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load suite:', e);
  }
  return null;
}

export function saveSuite(suite: UserSuite): void {
  if (typeof window === 'undefined') return;
  try {
    suite.lastModified = new Date();
    localStorage.setItem(`${SUITE_STORAGE_KEY}-${suite.userId}`, JSON.stringify(suite));
  } catch (e) {
    console.error('Failed to save suite:', e);
  }
}

export function addAssetToSuite(suite: UserSuite, asset: AssetDefinition, command: BuildCommand): UserSuite {
  const newAsset: SuiteAsset = {
    id: `asset-${Date.now()}`,
    assetId: asset.id,
    name: asset.name,
    spatial: {
      position: command.position || { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: command.scale ? { ...asset.defaultScale, ...command.scale } : asset.defaultScale,
      colorScheme: command.color ? { ...asset.defaultColor, ...command.color } : asset.defaultColor,
      glowIntensity: 0.8,
      animateOnHover: true,
      interactable: true,
    },
    resonance: {
      frequency: 13.13,
      emotionalTone: 'calm',
      ciiImpact: asset.ciiModifier,
    },
    createdAt: new Date(),
    createdBy: 'aero',
    approved: true,
  };
  
  return {
    ...suite,
    assets: [...suite.assets, newAsset],
    cii: Math.min(1, suite.cii + asset.ciiModifier),
  };
}
