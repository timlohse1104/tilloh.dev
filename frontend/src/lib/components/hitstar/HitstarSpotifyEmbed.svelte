<script lang="ts">
  // 1. IMPORTS
  import { onMount, onDestroy } from 'svelte';
  import PauseFilled from 'carbon-icons-svelte/lib/PauseFilled.svelte';
  import PlayFilledAlt from 'carbon-icons-svelte/lib/PlayFilledAlt.svelte';
  import Reset from 'carbon-icons-svelte/lib/Reset.svelte';

  // 2. PROPS
  let { trackId, masked }: { trackId: string; masked: boolean } = $props();

  // 4. STATE
  let embedEl: HTMLElement;
  let controller: any = null;
  let isPlaying = $state(false);
  let isReady = $state(false);

  // 5. DERIVED
  const embedUrl = $derived(
    `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`,
  );

  // 7. LIFECYCLE
  onMount(async () => {
    if (!masked) return;
    const IFrameAPI = await initSpotifyAPI();
    IFrameAPI.createController(
      embedEl,
      { uri: `spotify:track:${trackId}`, width: 300, height: 80 },
      (ctrl: any) => {
        controller = ctrl;
        // Enable buttons only after the player signals it is ready to stream
        ctrl.addListener('ready', () => {
          isReady = true;
        });
        ctrl.addListener('playback_update', (e: any) => {
          isPlaying = !e.data.isPaused;
        });
      },
    );
  });

  onDestroy(() => {
    controller?.destroy?.();
  });

  // 8. FUNCTIONS
  const initSpotifyAPI = (): Promise<any> =>
    new Promise((resolve) => {
      const w = window as any;
      if (w._spotifyIFrameAPI) {
        resolve(w._spotifyIFrameAPI);
        return;
      }
      const prev = w.onSpotifyIframeApiReady;
      w.onSpotifyIframeApiReady = (api: any) => {
        w._spotifyIFrameAPI = api;
        if (prev) prev(api);
        resolve(api);
      };
      if (!document.getElementById('spotify-iframe-api')) {
        const s = document.createElement('script');
        s.id = 'spotify-iframe-api';
        s.src = 'https://open.spotify.com/embed/iframe-api/v1';
        s.async = true;
        document.head.appendChild(s);
      }
    });

  const togglePlay = () => {
    if (!controller) return;
    if (isPlaying) controller.pause();
    else controller.play();
  };

  const replay = () => {
    if (!controller) return;
    controller.seek(0);
    controller.resume();
  };
</script>

{#if trackId}
  {#if masked}
    <!-- Wrapper hält position: fixed aufrecht — Spotify API kann nur das innere div verändern -->
    <div class="hidden-embed-wrapper">
      <div bind:this={embedEl}></div>
    </div>
    <div class="player-controls">
      <button
        class="ctrl-btn ctrl-play"
        onclick={togglePlay}
        disabled={!isReady}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {#if isPlaying}
          <PauseFilled size={32} />
        {:else}
          <PlayFilledAlt size={32} />
        {/if}
      </button>
      <button class="ctrl-btn ctrl-replay" onclick={replay} disabled={!isReady} aria-label="Replay">
        <Reset size={24} />
      </button>
    </div>
  {:else}
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
    </div>
  {/if}
{/if}

<style>
  /* Wrapper ist opacity:0 — iframe bleibt in normalem Render-Kontext,
     Chrome throttelt keinen Audio aus sichtbaren iframes */
  .hidden-embed-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 80px;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  }

  /* Custom player controls bar */
  .player-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    height: 80px;
    background: var(--cds-layer-01, #262626);
    border-radius: 12px;
  }

  .ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: var(--cds-text-primary, #f4f4f4);
    transition:
      opacity 0.15s,
      transform 0.1s;
  }

  .ctrl-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .ctrl-btn:not(:disabled):hover {
    opacity: 0.85;
  }

  .ctrl-btn:not(:disabled):active {
    transform: scale(0.92);
  }

  /* Large Play/Pause button */
  .ctrl-play {
    width: 52px;
    height: 52px;
    background: var(--cds-interactive-01, #0f62fe);
  }

  /* Smaller Replay button */
  .ctrl-replay {
    width: 40px;
    height: 40px;
    background: var(--cds-layer-02, #393939);
  }

  /* Reveal-phase: full Spotify embed */
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

  @media (max-width: 480px) {
    .player-controls,
    .embed-container {
      max-width: 100%;
    }
  }
</style>
