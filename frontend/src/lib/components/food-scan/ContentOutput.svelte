<script lang="ts">
  import { t } from '$lib/util/translations';

  export let imagePreviewSrc: string = '';
  export let loading: boolean = false;
  export let inputFiles = [];
  export let llmResults = [];
</script>

<section>
  <div class="initial_scan_output">
    <img class="image_preview" src={imagePreviewSrc || ''} alt="Preview" />

    <div class="prompt_output">
      {#if loading && inputFiles.length != 0}
        <p>{$t('page.foodScan.loading')}</p>
      {:else if !loading && llmResults.length != 0}
        {#each llmResults as responseTexts, index (index)}
          <h2>{responseTexts.message.content.split(';')[0]}</h2>
          <p id="generate-label">
            {#if responseTexts.message.content
              .split(';')[1]
              .toLowerCase()
              .includes('ja')}
              {$t('page.foodScan.vegan')}
            {:else}
              {$t('page.foodScan.notVegan')}
            {/if}
          </p>
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  section {
    text-align: left;
  }

  .initial_scan_output {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    margin-top: 1rem;
  }

  .prompt_output {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.25rem 0.25rem 0 0;

    p {
      text-align: left;
    }
  }

  h3 {
    margin: 0;
  }

  .image_preview {
    max-width: 33vw;
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.2),
      0 6px 20px rgba(0, 0, 0, 0.19);
    border-radius: 10px;
    border: 3px solid var(--black30);
    transition:
      transform 0.5s ease,
      box-shadow 0.5s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
  }
</style>
