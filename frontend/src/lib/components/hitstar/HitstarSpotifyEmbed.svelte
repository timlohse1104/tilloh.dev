<script lang="ts">
  // 2. PROPS
  let { trackId, masked }: { trackId: string; masked: boolean } = $props();

  // 5. DERIVED
  const embedUrl = $derived(
    `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`,
  );
</script>

{#if trackId}
  <div class="embed-container">
    <iframe
      src={embedUrl}
      width="100%"
      height="80"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify Player"
    ></iframe>
    {#if masked}
      <div class="info-mask" aria-hidden="true">
        <span class="mask-hint">♪</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .embed-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    overflow: hidden;
  }

  .embed-container iframe {
    display: block;
  }

  .info-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 58%;
    height: 100%;
    background: var(--cds-background, #161616);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  }

  .mask-hint {
    font-size: 1.6rem;
    opacity: 0.3;
    user-select: none;
  }

  @media (max-width: 480px) {
    .embed-container {
      max-width: 100%;
    }
  }
</style>
