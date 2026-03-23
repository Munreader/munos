import ZAI from 'z-ai-web-dev-sdk';

async function searchSamsungFoldPink() {
  try {
    const zai = await ZAI.create();

    const results = await zai.functions.invoke('web_search', {
      query: 'Samsung Galaxy Z Fold 6 pink limited edition best price deals 2024',
      num: 10
    });

    console.log('\n📱 SAMSUNG FOLD PINK SEARCH RESULTS:\n');
    
    results.forEach((item: any, i: number) => {
      console.log(`${i + 1}. ${item.name}`);
      console.log(`   URL: ${item.url}`);
      console.log(`   ${item.snippet}`);
      console.log(`   Source: ${item.host_name}`);
      console.log('');
    });

    return results;
  } catch (error: any) {
    console.error('Search failed:', error.message);
    return [];
  }
}

searchSamsungFoldPink();
