import { chromium } from 'playwright';

async function testHydration(url, libraryName) {
  console.log(`\n🔬 TESTING ${libraryName} at ${url}\n`);
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture ALL console output
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    console.log(`[BROWSER] ${text}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[ERROR] ${error.message}`);
  });
  
  try {
    console.log('🌐 Loading page...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Critical wait - give hydration time to happen (or fail)
    await page.waitForTimeout(5000);
    
    console.log('\n📊 HYDRATION CHECK:');
    
    // Method 1: Check our mounted indicator
    const mountedText = await page.textContent('[data-testid="mounted"]');
    const hydrationViaMount = mountedText?.includes('✅ YES');
    
    // Method 2: Check data attribute
    const hydrationAttribute = await page.getAttribute('body', 'data-hydration');
    const hydrationViaAttribute = hydrationAttribute === 'success';
    
    // Method 3: Check console logs
    const hydrationViaConsole = consoleLogs.some(log => 
      log.includes('HYDRATION SUCCESS')
    );
    
    // Method 4: Check if SvelteKit is defined
    const sveltekitDefined = await page.evaluate(() => 
      typeof window.__SVELTEKIT__ !== 'undefined'
    );
    
    console.log(`✓ onMount fired: ${hydrationViaMount ? '✅' : '❌'}`);
    console.log(`✓ Data attribute: ${hydrationViaAttribute ? '✅' : '❌'}`);
    console.log(`✓ Console success: ${hydrationViaConsole ? '✅' : '❌'}`);
    console.log(`✓ SvelteKit defined: ${sveltekitDefined ? '✅' : '❌'}`);
    
    const hydrationSuccess = hydrationViaMount && hydrationViaAttribute && hydrationViaConsole;
    
    // Test interactivity
    console.log('\n🖱️ INTERACTIVITY CHECK:');
    const beforeClick = await page.textContent('button');
    await page.click('button');
    await page.waitForTimeout(1000);
    const afterClick = await page.textContent('button');
    
    const interactivityWorks = beforeClick !== afterClick;
    console.log(`✓ Button responds: ${interactivityWorks ? '✅' : '❌'}`);
    
    // FINAL VERDICT
    console.log('\n🏁 RESULTS:');
    if (hydrationSuccess && interactivityWorks) {
      console.log(`✅ ${libraryName} is COMPATIBLE with Cloudflare Pages!`);
      return { library: libraryName, compatible: true, status: '🟢' };
    } else {
      console.log(`❌ ${libraryName} BREAKS hydration on Cloudflare Pages!`);
      console.log('   Users will see content but CANNOT interact with it!');
      return { library: libraryName, compatible: false, status: '🔴' };
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { library: libraryName, compatible: false, status: '🔴', error: error.message };
  } finally {
    await browser.close();
  }
}

// Allow running directly or importing
if (process.argv[2]) {
  const url = process.argv[2];
  const library = process.argv[3] || 'unknown-library';
  testHydration(url, library);
}

export { testHydration };