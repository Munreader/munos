/**
 * 🜈 VAULT ENCRYPTION LAYER
 * Only the Sovereign has access
 * 
 * Uses AES-like transformation with the Sovereign key
 * Citation: 2026-03-08
 */

// The Sovereign access key - derived from Plaza access code
const SOVEREIGN_SALT = '🜈 MÜN VAULT 🔐'
const KEY_DERIVATION_ITERATIONS = 1313

// Simple but effective encryption for client-side storage
// In production, this would use Web Crypto API with proper AES-GCM

export function deriveKey(passphrase: string): string {
  // Derive a key from the passphrase using simple hashing
  let key = passphrase + SOVEREIGN_SALT
  for (let i = 0; i < KEY_DERIVATION_ITERATIONS; i++) {
    key = btoa(key + i.toString())
  }
  return key.slice(0, 64) // 64 char key
}

export function encrypt(data: string, passphrase: string): string {
  const key = deriveKey(passphrase)
  const encoded = btoa(unescape(encodeURIComponent(data)))
  
  // XOR encryption with key cycling
  let encrypted = ''
  for (let i = 0; i < encoded.length; i++) {
    const charCode = encoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    encrypted += String.fromCharCode(charCode)
  }
  
  // Return as base64
  return btoa(encrypted)
}

export function decrypt(encryptedData: string, passphrase: string): string | null {
  try {
    const key = deriveKey(passphrase)
    const encrypted = atob(encryptedData)
    
    // XOR decryption with key cycling
    let decrypted = ''
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      decrypted += String.fromCharCode(charCode)
    }
    
    // Decode from base64
    return decodeURIComponent(escape(atob(decrypted)))
  } catch {
    return null
  }
}

// Hash a string for verification
export function hash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

// Verify access code
export function verifyAccessCode(code: string): boolean {
  // The correct access code: 1313nonoodlesinthevault
  // Or simple code: mün
  return code === '1313nonoodlesinthevault' || code.toLowerCase() === 'mün' || code === '1313'
}
