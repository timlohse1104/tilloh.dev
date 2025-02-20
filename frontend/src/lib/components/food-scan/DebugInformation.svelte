<script lang="ts">
  import { themeStore } from '$lib/util/stores/store-theme';
  import { t } from '$lib/util/translations';
  import type { ModelRecord } from '@mlc-ai/web-llm';
  import Card from '@smui/card';
  import Select, { Option } from '@smui/select';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let selectedModel: ModelRecord | undefined;
  export let availableModels: ModelRecord[];
  export let systemPromptText: string = '';
  export let userPromptText: string = '';
  export let ocrResponseTimeText: string = '';
  export let llmResponseTimeText: string = '';
  export let completionTokens: string = '';
  export let promptTokens: string = '';
  export let totalTokens: string = '';
  export let prefillTokensPerS: string = '';
  export let decodeTokensPerS: string = '';
</script>

<section>
  <h3>{$t('page.foodScan.debug.title')}</h3>
  <Select
    class="select_model"
    bind:value={selectedModel}
    label="Select Model"
    on:SMUISelect:change={() => dispatch('reloadModel')}
  >
    {#each availableModels as model}
      <Option value={model}
        >{model?.model_id} ({model.vram_required_MB}MB VRAM / {model?.overrides
          ?.context_window_size} window size)</Option
      >
    {/each}
  </Select>

  <p>{$t('page.foodScan.debug.systemPrompt')}</p>
  <Card
    padded
    style={$themeStore === 'dark'
      ? 'background-color: var(--color_bg_1)'
      : 'background-color: var(--color_bg_light_1)'}>{systemPromptText}</Card
  >

  <p>{$t('page.foodScan.debug.userPrompt')}</p>
  <Card
    padded
    style={$themeStore === 'dark'
      ? 'background-color: var(--color_bg_1)'
      : 'background-color: var(--color_bg_light_1)'}>{userPromptText}</Card
  >

  <p>{$t('page.foodScan.debug.stats.title')}</p>
  <table>
    <tr>
      <th>{$t('page.foodScan.debug.stats.ocr')}</th>
      <th>{$t('page.foodScan.debug.stats.llm')}</th>
      <th>{$t('page.foodScan.debug.stats.completion')}</th>
      <th>{$t('page.foodScan.debug.stats.prompt')}</th>
      <th>{$t('page.foodScan.debug.stats.total')}</th>
      <th>{$t('page.foodScan.debug.stats.prefill')}</th>
      <th>{$t('page.foodScan.debug.stats.decode')}</th>
    </tr>
    <tr>
      <td>{ocrResponseTimeText}</td>
      <td>{llmResponseTimeText}</td>
      <td>{completionTokens}</td>
      <td>{promptTokens}</td>
      <td>{totalTokens}</td>
      <td>{prefillTokensPerS}</td>
      <td>{decodeTokensPerS}</td>
    </tr>
  </table>
</section>

<style lang="scss">
  section {
    text-align: left;
  }

  :global(.select_model) {
    width: 50vw;
  }

  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
</style>
