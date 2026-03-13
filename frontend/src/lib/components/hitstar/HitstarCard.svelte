<script lang="ts">
  // 1. IMPORTS
  import type { SpotifyTrackDto } from '$lib/types/spotify.dto';

  // 2. PROPS
  let {
    flipped = false,
    track = null,
  }: { flipped: boolean; track: SpotifyTrackDto | null } = $props();
</script>

<div class="card-scene">
  <div class="card" class:flipped>
    <!-- Front -->
    <div class="card-face card-front">
      <span class="question-mark">?</span>
    </div>
    <!-- Back -->
    <div class="card-face card-back">
      {#if track}
        {#if track.albumCover}
          <img src={track.albumCover} alt={track.album} class="album-cover" />
        {/if}
        <p class="track-name">{track.name}</p>
        <p class="track-artist">{track.artist}</p>
        <p class="track-album">{track.album}</p>
        <p class="track-year">{track.releaseYear}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .card-scene {
    width: 260px;
    height: 320px;
    perspective: 1000px;
    margin: 0 auto;
  }

  .card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s ease;
  }

  .card.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
  }

  .card-front {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    border: 2px solid #e94560;
  }

  .question-mark {
    font-size: 6rem;
    color: white;
    font-weight: bold;
    line-height: 1;
  }

  .card-back {
    background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
    transform: rotateY(180deg);
    border: 2px solid #1db954;
    gap: 0.4rem;
    overflow: hidden;
  }

  .album-cover {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .track-name {
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-artist {
    font-size: 0.85rem;
    color: #b0b0c0;
    text-align: center;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-album {
    font-size: 0.75rem;
    color: #808090;
    text-align: center;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-year {
    font-size: 1.4rem;
    font-weight: bold;
    color: #1db954;
    margin: 0.2rem 0 0;
  }
</style>
