<script lang="ts">
  // 1. IMPORTS
  import type { SpotifyTrackDto } from '$lib/types/spotify.dto';

  // 2. PROPS
  let {
    flipped = false,
    track = null,
    correct = null,
  }: { flipped: boolean; track: SpotifyTrackDto | null; correct: boolean | null } = $props();
</script>

<div class="card-scene" class:correct={correct === true} class:wrong={correct === false}>
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
  @use '../../styles/variables.scss' as *;
  .card-scene {
    width: min(25rem, 80vw);
    aspect-ratio: 260 / 320;
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
    border: 2px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 20px rgba(80, 120, 220, 0.15);
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
    border: 2px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 0 20px rgba(80, 120, 220, 0.15);
    gap: 0.4rem;
    overflow: hidden;
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .card-scene.correct .card-back {
    border-color: #24a148;
    box-shadow: 0 0 24px rgba(36, 161, 72, 0.35);
  }

  .card-scene.wrong .card-back {
    border-color: #da1e28;
    box-shadow: 0 0 24px rgba(218, 30, 40, 0.35);
  }

  .album-cover {
    width: min(140px, 43vw);
    height: min(140px, 43vw);
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
    color: #ffffff;
    margin: 0.2rem 0 0;
  }

  .card-scene.correct .track-year {
    color: #24a148;
  }

  .card-scene.wrong .track-year {
    color: #da1e28;
  }

  @media (max-width: 480px) {
    .card-scene {
      width: min(190px, 60vw);
    }

    .question-mark {
      font-size: 4rem;
    }

    .album-cover {
      width: min(90px, 28vw);
      height: min(90px, 28vw);
      margin-bottom: 0.25rem;
    }

    .track-name {
      font-size: 0.85rem;
    }

    .track-year {
      font-size: 1.1rem;
    }
  }
</style>
