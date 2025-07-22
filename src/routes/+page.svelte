<script>
  import { onMount, tick } from 'svelte';
  // import { ArrowRight, Settings } from 'lucide-svelte';
  
  // This is our hydration canary - if this doesn't work, hydration failed
  let mounted = false;
  let hydrationTime = null;
  let interactionCount = 0;
  let testStatus = 'WAITING';
  
  const startTime = performance.now();
  
  onMount(async () => {
    // THIS IS THE KEY TEST - if we get here, hydration worked
    hydrationTime = performance.now() - startTime;
    mounted = true;
    testStatus = 'SUCCESS';
    
    console.log('✅ HYDRATION SUCCESS - onMount fired!');
    console.log(`⏱️ Hydration completed in ${hydrationTime.toFixed(2)}ms`);
    
    // Verify Svelte internals work
    await tick();
    console.log('✅ SVELTE TICK SUCCESS');
    
    // Mark hydration success in DOM for Playwright
    document.body.setAttribute('data-hydration', 'success');
  });
  
  function handleClick() {
    interactionCount++;
    console.log(`✅ INTERACTION ${interactionCount} - Button clicked`);
  }
</script>

<h1>🧪 SvelteKit + Cloudflare Library Test</h1>

<div class="status">
  <p data-testid="mounted">Mounted: {mounted ? '✅ YES' : '❌ NO'}</p>
  <p data-testid="status">Status: {testStatus}</p>
  {#if hydrationTime}
    <p>Hydration Time: {hydrationTime.toFixed(2)}ms</p>
  {/if}
</div>

<button 
  on:click={handleClick}
  data-testid="interaction-button"
>
  Clicked {interactionCount} times
</button>

<!-- TARGET LIBRARY COMPONENTS GO HERE -->
<div class="library-test-zone">
  <h2>Library Test Zone</h2>
  <p>Add library components below this line</p>
  <!-- Example: <IconComponent /> -->
</div>