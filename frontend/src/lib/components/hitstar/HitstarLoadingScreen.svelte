<script lang="ts">
  // 1. IMPORTS
  import ProgressBar from 'carbon-components-svelte/src/ProgressBar/ProgressBar.svelte';

  // 2. PROPS
  let { headline }: { headline: string } = $props();
</script>

<div class="loading-screen">
  <p>{headline}</p>
  <ProgressBar helperText="" />
</div>

<style>
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }
</style>
