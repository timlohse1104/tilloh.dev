<script lang="ts">
  import { t } from '$lib/util/translations';

  export let imagePreviewSrc: string = '';
  export let loading: boolean = false;
  export let inputFiles = [];
  export let llmResult = '';
  export let diet = '';

  $: llmResults = llmResult.split(';');
</script>

<section>
  <div class="initial_scan_output">
    <img class="image_preview" src={imagePreviewSrc || ''} alt="Preview" />

    <div class="prompt_output">
      {#if loading && inputFiles.length != 0}
        <p>{$t('page.foodScan.loading')}</p>
      {:else if !loading && llmResult}
        {#each llmResults as line, i}
          {#if i === 0}
            <h2>{llmResult.split(';')[0]}</h2>
          {:else if i === 1}
            <p id="generate-label">
              {#if diet === 'vegan'}
                {$t('page.foodScan.vegan')}
              {:else}
                {$t('page.foodScan.notVegan')}
              {/if}
            </p>
          {:else}
            <p id="generate-label">
              {line}
            </p>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    text-align: left;
  }

  .initial_scan_output {
    display: flex;
    flex-direction: row;
    gap: 1rem;

    @media #{$phone} {
      flex-direction: column;
    }
  }

  .prompt_output {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.25rem 0.25rem 0 0;
    max-width: min(600px, 50vw);
  }

  p {
    text-align: left;
    margin: 0;
    font-size: 0.8rem;
  }

  p:first-of-type {
    font-size: 1.25rem;
  }

  .image_preview {
    max-width: min(500px, 33vw);
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
