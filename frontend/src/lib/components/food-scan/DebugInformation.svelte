<script lang="ts">
  // 1. IMPORTS
  import { t } from '$lib/util/translations';
  import type { ModelRecord } from '@mlc-ai/web-llm';
  import ComboBox from 'carbon-components-svelte/src/ComboBox/ComboBox.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import { createEventDispatcher } from 'svelte';

  // 2. CONST (non-reactive constants)
  const dispatch = createEventDispatcher();

  // 3. PROPS
  let {
    selectedModel,
    availableModels,
    systemPromptText,
    userPromptText,
    ocrResponseTimeText,
    llmResponseTimeText,
    completionTokens,
    promptTokens,
    totalTokens,
    prefillTokensPerS,
    decodeTokensPerS,
  } = $props<{
    selectedModel: ModelRecord | undefined;
    availableModels: ModelRecord[];
    systemPromptText: string;
    userPromptText: string;
    ocrResponseTimeText: string;
    llmResponseTimeText: string;
    completionTokens: string;
    promptTokens: string;
    totalTokens: string;
    prefillTokensPerS: string;
    decodeTokensPerS: string;
  }>();

  // 5. DERIVED
  const availableModelsComboList = $derived(availableModels.map((model, i) => ({
    id: i,
    text: `${model.model_id} (${model.vram_required_MB}MB VRAM / ${model?.overrides?.context_window_size} window size)`,
  })));
  const selectedModelId = $derived(selectedModel
    ? availableModels.findIndex((model) => model === selectedModel)
    : undefined);

  // 8. FUNCTIONS
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
    <thead>
      <tr>
        <th>{$t('page.foodScan.debug.stats.ocr')}</th>
        <th>{$t('page.foodScan.debug.stats.llm')}</th>
        <th>{$t('page.foodScan.debug.stats.completion')}</th>
        <th>{$t('page.foodScan.debug.stats.prompt')}</th>
        <th>{$t('page.foodScan.debug.stats.total')}</th>
        <th>{$t('page.foodScan.debug.stats.prefill')}</th>
        <th>{$t('page.foodScan.debug.stats.decode')}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{ocrResponseTimeText}</td>
        <td>{llmResponseTimeText}</td>
        <td>{completionTokens}</td>
        <td>{promptTokens}</td>
        <td>{totalTokens}</td>
        <td>{prefillTokensPerS}</td>
        <td>{decodeTokensPerS}</td>
      </tr>
    </tbody>
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
