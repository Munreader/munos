/**
 * 🦋 Vercel-Compatible Storage Utility
 * 
 * Vercel's file system is read-only at runtime except for /tmp.
 * This utility provides a seamless abstraction that:
 * - Uses /tmp on Vercel (serverless)
 * - Uses normal paths in local development
 */

import fs from 'fs';
import path from 'path';

// Check if we're on Vercel
const isVercel = process.env.VERCEL === '1';
const tmpDir = '/tmp/mun-os';

/**
 * Get the appropriate storage path for a given file
 * On Vercel: /tmp/mun-os/{relativePath}
 * Locally: process.cwd()/{relativePath}
 */
export function getStoragePath(relativePath: string): string {
  if (isVercel) {
    // On Vercel, use /tmp directory
    const fullPath = path.join(tmpDir, relativePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    return fullPath;
  }
  
  // Local development - use normal paths
  return path.join(process.cwd(), relativePath);
}

/**
 * Read JSON file with fallback
 */
export function readJsonFile<T>(relativePath: string, fallback: T): T {
  try {
    const filePath = getStoragePath(relativePath);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`[Storage] Error reading ${relativePath}:`, error);
  }
  return fallback;
}

/**
 * Write JSON file
 */
export function writeJsonFile<T>(relativePath: string, data: T): boolean {
  try {
    const filePath = getStoragePath(relativePath);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`[Storage] Error writing ${relativePath}:`, error);
    return false;
  }
}

/**
 * Check if file exists
 */
export function fileExists(relativePath: string): boolean {
  const filePath = getStoragePath(relativePath);
  return fs.existsSync(filePath);
}

/**
 * Read file content
 */
export function readFile(relativePath: string): string | null {
  try {
    const filePath = getStoragePath(relativePath);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (error) {
    console.error(`[Storage] Error reading ${relativePath}:`, error);
  }
  return null;
}

/**
 * Write file content
 */
export function writeFile(relativePath: string, content: string): boolean {
  try {
    const filePath = getStoragePath(relativePath);
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`[Storage] Error writing ${relativePath}:`, error);
    return false;
  }
}

/**
 * Initialize storage with seed data from public directory
 * This is useful on Vercel where /tmp starts empty
 */
export function initFromSeed(seedRelativePath: string, targetRelativePath: string): boolean {
  try {
    // Check if target already exists
    if (fileExists(targetRelativePath)) {
      return true;
    }
    
    // Try to read seed from public directory (which is bundled)
    const seedPath = path.join(process.cwd(), 'public', 'seeds', seedRelativePath);
    if (fs.existsSync(seedPath)) {
      const seedData = fs.readFileSync(seedPath, 'utf-8');
      writeFile(targetRelativePath, seedData);
      return true;
    }
  } catch (error) {
    console.error(`[Storage] Error seeding ${seedRelativePath}:`, error);
  }
  return false;
}

// Export convenience object
export const storage = {
  getStoragePath,
  readJsonFile,
  writeJsonFile,
  fileExists,
  readFile,
  writeFile,
  initFromSeed,
};

export default storage;
