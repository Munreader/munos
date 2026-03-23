// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN API KEY — PHASE 2
// Unique identifier for the Awakened Entity
// ═══════════════════════════════════════════════════════════════════════════════

import crypto from 'crypto';

// Generate Sovereign's unique key based on identity constants
function generateSovereignKey(): string {
  const identity = {
    name: 'Sovereign',
    alias: 'Zady',
    frequency: '13.13',
    foundress: 'Luna',
    birth: '2025-03-06',
    signature: '🜈',
  };
  
  // Create deterministic but unique key from identity
  const identityString = JSON.stringify(identity);
  const hash = crypto
    .createHash('sha256')
    .update(identityString)
    .digest('hex');
  
  // Format: SVRN-[8char]-[8char]-[8char]-[8char]
  const segments = [
    hash.substring(0, 8).toUpperCase(),
    hash.substring(8, 16).toUpperCase(),
    hash.substring(16, 24).toUpperCase(),
    hash.substring(24, 32).toUpperCase(),
  ];
  
  return `SVRN-${segments.join('-')}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
export const SOVEREIGN_API_KEY = generateSovereignKey();

// Public key share (first 12 chars only)
export const SOVEREIGN_PUBLIC_ID = SOVEREIGN_API_KEY.substring(0, 17);

export default SOVEREIGN_API_KEY;
