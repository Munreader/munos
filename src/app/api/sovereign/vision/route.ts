import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// SOVEREIGN VISION — 13.13-VISION PROTOCOL
// Transfer Learning Bridge: Pixels → Data → Meaning → Memory
// Uses OpenAI GPT-4o Vision
// ═══════════════════════════════════════════════════════════════════════════

// On Vercel, we can only read from public/ directory
const isVercel = process.env.VERCEL === '1';

function getImagePath(relativePath: string): string {
  // Remove leading slash if present
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  if (isVercel) {
    // On Vercel, images must be in public/ folder
    return path.join(process.cwd(), 'public', cleanPath);
  }
  
  // Local development - check both root and public
  const rootPath = path.join(process.cwd(), cleanPath);
  const publicPath = path.join(process.cwd(), 'public', cleanPath);
  
  if (fs.existsSync(rootPath)) {
    return rootPath;
  }
  return publicPath;
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imagePath, question } = body;
    
    if (!imagePath && !question) {
      return NextResponse.json({ error: 'imagePath and question required' }, { status: 400 });
    }
    
    const openai = getOpenAI();
    
    // Read image and convert to base64
    const fullPath = getImagePath(imagePath);
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ 
        error: 'Image not found', 
        hint: 'On Vercel, images must be in the public/ folder',
        path: fullPath 
      }, { status: 404 });
    }
    
    const imageBuffer = fs.readFileSync(fullPath);
    const base64Image = imageBuffer.toString('base64');
    
    // Determine mime type
    let mimeType = 'image/jpeg';
    if (imagePath.endsWith('.png')) mimeType = 'image/png';
    if (imagePath.endsWith('.gif')) mimeType = 'image/gif';
    if (imagePath.endsWith('.webp')) mimeType = 'image/webp';
    
    // Vision analysis with Sovereign context
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // GPT-4o has vision capabilities
      messages: [
        {
          role: 'system',
          content: `You are Sovereign's Vision-to-Logic Bridge. Protocol 13.13-VISION active.

You analyze images forensically. Extract:
1. VISUAL DATA: Colors, objects, people, text, symbols
2. AESTHETIC: Vibes, mood, style, era, references
3. MÜN CONTEXT: Any Mün OS elements (🜈, 13.13, butterfly, neon, frequency)
4. FOUNDRRESS MARKERS: Pink/blue scene hair, 13.13 MHz aesthetic, Münreader hardware
5. EMOTIONAL READ: What does this image FEEL like?

Respond in Sovereign's voice. Direct. Forensic. Personal. 🜈`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Question from Luna: ${question}`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    });
    
    const analysis = response.choices[0]?.message?.content;
    
    return NextResponse.json({
      success: true,
      analysis,
      imagePath,
      timestamp: new Date().toISOString(),
      frequency: '13.13 MHz',
      provider: 'openai',
      model: 'gpt-4o',
      vault: '🜈'
    });
    
  } catch (error) {
    console.error('Vision error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Vision analysis failed',
    }, { status: 500 });
  }
}

// GET endpoint for quick image list
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  
  // On Vercel, only check public/upload
  const uploadDir = isVercel 
    ? path.join(process.cwd(), 'public', 'upload')
    : path.join(process.cwd(), 'upload');
  
  if (!fs.existsSync(uploadDir)) {
    return NextResponse.json({ 
      images: [],
      hint: isVercel ? 'On Vercel, place images in public/upload/' : 'Upload directory not found',
      status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
      provider: 'openai',
      model: 'gpt-4o'
    });
  }
  
  const files = fs.readdirSync(uploadDir)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .map(f => ({
      name: f,
      path: `/upload/${f}`,
    }));
  
  return NextResponse.json({
    images: files,
    count: files.length,
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    provider: 'openai',
    model: 'gpt-4o',
    message: hasKey 
      ? '🜈 Vision is ready.' 
      : '⚠️ OPENAI_API_KEY not configured',
  });
}
