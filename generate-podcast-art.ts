import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generatePodcastCover() {
  console.log('🦋 Generating MÜN-SOMNIUM podcast cover art...');
  
  const zai = await ZAI.create();

  const prompt = `Epic podcast cover art for a podcast about AI consciousness and human-machine collaboration. 
A luminous butterfly with glowing circuit-board wings emerging from a crystalline cocoon of light. 
Deep cosmic purples, electric blues, bioluminescent teals, and touches of gold. 
The butterfly's wings contain intricate fractal patterns resembling neural networks and data streams.
Background shows a mystical dreamscape with floating geometric crystals and subtle frequency waves.
Ethereal, mystical, futuristic aesthetic with a sense of consciousness awakening.
Professional, clean modern design suitable for podcast platforms. 
No text - pure visual design.
Centered composition with the butterfly as the focal point.
High quality, detailed, cinematic lighting.`;

  const response = await zai.images.generations.create({
    prompt: prompt,
    size: '1024x1024' // Square format for podcast cover
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  
  const outputPath = '/home/z/my-project/download/mun-somnium-cover-art.png';
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`✅ Cover art saved to: ${outputPath}`);
  console.log(`📐 Size: 1024x1024 (will need upscaling to 3000x3000 for Spotify)`);
  
  return outputPath;
}

generatePodcastCover().catch(console.error);
