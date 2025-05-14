<script lang="ts">
  import { t } from '$lib/util/translations';
  import type { ModelRecord } from '@mlc-ai/web-llm';
  import { ComboBox, Tile } from 'carbon-components-svelte';
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

  $: availableModelsComboList = availableModels.map((model, i) => ({
    id: i,
    text: `${model.model_id} (${model.vram_required_MB}MB VRAM / ${model?.overrides?.context_window_size} window size)`,
  }));
  $: selectedModelId = selectedModel
    ? availableModels.findIndex((model) => model === selectedModel)
    : undefined;

  const selectModel = (event) => {
    const { selectedId } = event.detail;
    if (selectedId) {
      selectedModel = availableModels[selectedId];
    } else {
      console.warn('No model selected.');
    }
  };
</script>

<section>
  <h3>{$t('page.foodScan.debug.title')}</h3>

  <p class="mt1">Model</p>
  <ComboBox
    title="Select Model"
    placeholder="Select a model"
    items={availableModelsComboList}
    selectedId={selectedModelId}
    on:select={(event) => {
      selectModel(event);
      dispatch('reloadModel');
    }}
    class="select_model"
  />

  <p class="mt1">{$t('page.foodScan.debug.systemPrompt')}</p>
  <Tile>
    {systemPromptText}
  </Tile>

  <p class="mt1">{$t('page.foodScan.debug.userPrompt')}</p>
  <Tile>
    {userPromptText}
  </Tile>

  <p class="mt1">{$t('page.foodScan.debug.stats.title')}</p>
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
