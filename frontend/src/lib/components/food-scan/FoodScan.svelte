<script lang="ts">
  import { executeOcrProcess } from '$lib/api/ocr.api';
  import { initialized, t } from '$lib/util/translations';
  import * as webllm from '@mlc-ai/web-llm';
  import Card from '@smui/card';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import ContentOutput from './ContentOutput.svelte';
  import DebugInformation from './DebugInformation.svelte';

  const { prebuiltAppConfig } = webllm;
  const { model_list: availableModels } = prebuiltAppConfig;
  const defaultSystemPrompt = `Du erhältst einen Text der auf der Rückseite der Verpackung eines Nahrungsmittels steht. Du antwortest darauf ausschließlich mit der Bezeichnung des Lebensmittels und ob es vegan ist (ja / nein)! Trenne die beiden Informationen durch ein Semikolon.`;

  let engine: webllm.MLCEngineInterface;
  let selectedModel = availableModels[52]; // Qwen2.5-3B-Instruct-q4f32_1-MLC
  let systemPromptText = defaultSystemPrompt;
  let userPromptText = '';
  let llmResults = [];
  let promptResStats: any = {};
  let inputFiles: File[] = [];
  let imagePreviewSrc = '';
  let loadModelInfo = '';
  let debugInfoActive = false;
  let ocrResponseTime = 0;
  let llmResponseTime = 0;
  let loading = false;
  let engineReady = false;

  $: ocrResponseTimeText = ocrResponseTime ? `${ocrResponseTime} s` : '-';
  $: llmResponseTimeText = llmResponseTime ? `${llmResponseTime} s` : '-';
  $: completionTokens = promptResStats?.completion_tokens || '-';
  $: promptTokens = promptResStats?.prompt_tokens || '-';
  $: totalTokens = promptResStats?.total_tokens || '-';
  $: prefillTokensPerS = promptResStats?.extra?.prefill_tokens_per_s || '-';
  $: decodeTokensPerS = promptResStats?.extra?.decode_tokens_per_s || '-';
  $: if (inputFiles?.length > 0) {
    imagePreviewSrc = URL.createObjectURL(inputFiles[0]);
    generateUserPrompt();
  }
  $: if (userPromptText) promptLLM();

  const modelInitProgressCallback = (report: webllm.InitProgressReport) => {
    loadModelInfo = report.text;
    if (report.progress === 1) engineReady = true;
  };

  async function main() {
    try {
      engine = await webllm.CreateMLCEngine(
        selectedModel?.model_id,
        {
          initProgressCallback: modelInitProgressCallback,
          logLevel: 'INFO',
        },
        {
          context_window_size: selectedModel.overrides.context_window_size,
        },
      );
    } catch (error) {
      console.error('Failed to create MLCEngine:', error);
    }
  }

  async function generateUserPrompt() {
    console.log('Generating user prompt with ocr.');
    const ocrResponse = await executeOcrProcess(inputFiles[0]);
    loading = true;

    ocrResponseTime =
      parseFloat(ocrResponse.ProcessingTimeInMilliseconds) / 1000;
    console.log(`OCR responsed within ${ocrResponseTime} seconds.`, {
      ocrResponse,
    });
    userPromptText = ocrResponse?.ParsedResults?.[0]?.ParsedText;
  }

  async function promptLLM() {
    console.log('Prompting LLM...');
    const promptStartTime = Date.now();

    const promptResponse = await engine.chat.completions.create({
      messages: [
        { role: 'system', content: systemPromptText },
        { role: 'user', content: userPromptText },
      ],
      // below configurations are all optional
      n: 1,
      temperature: 0.01,
      max_tokens: 2048,
      frequency_penalty: 0.9,
      presence_penalty: 0.9,
      logit_bias: {
        '46510': -100,
        '7188': -100,
        '8421': 5,
        '51325': 5,
      },
      logprobs: true,
      top_logprobs: 2,
    });

    const promptEndTime = Date.now();
    llmResponseTime = (promptEndTime - promptStartTime) / 1000;
    console.log(`LLM responded within ${llmResponseTime} seconds.`, {
      promptResponse,
    });
    llmResults = promptResponse.choices;
    promptResStats = promptResponse.usage;

    loading = false;
  }

  async function reloadModel() {
    console.log('Reloading model.');
    engineReady = false;
    try {
      engine = await webllm.CreateMLCEngine(
        selectedModel?.model_id,
        {
          initProgressCallback: modelInitProgressCallback,
          logLevel: 'INFO',
        },
        {
          context_window_size: selectedModel.overrides.context_window_size,
        },
      );
    } catch (error) {
      console.error('Failed to create MLCEngine:', error);
    }
  }

  main();
</script>

{#if $initialized}
  <section>
    {#if !engineReady}
      <Card padded class="warning_hint">
        <h2>{$t('page.foodScan.loadingHint')}</h2>
        <p class="warning_sign">⚠️</p>
        <p>{@html $t('page.foodScan.warning')}</p>
        <p>{loadModelInfo}</p>
      </Card>
    {:else}
      <h3>{$t('page.foodScan.introduction')}</h3>
      <div class="file_inputs">
        <form>
          <label for="file_upload" class="custom_file_label"
            >{$t('page.foodScan.chooseFile')}</label
          >
          <input
            id="file_upload"
            class="file_input"
            type="file"
            accept="image/*"
            bind:files={inputFiles}
          />
        </form>

        <p>{$t('page.foodScan.or')}</p>

        <form>
          <label for="camera_upload" class="custom_file_label"
            >{$t('page.foodScan.takePicture')}</label
          >
          <input
            id="camera_upload"
            class="file_input"
            type="file"
            accept="image/*"
            bind:files={inputFiles}
            capture
          />
        </form>
      </div>

      {#if inputFiles?.length > 0}
        <ContentOutput {imagePreviewSrc} {loading} {inputFiles} {llmResults} />

        <FormField>
          <Checkbox bind:checked={debugInfoActive} />
          <p slot="label">{$t('page.foodScan.technicalInfo')}</p>
        </FormField>

        {#if debugInfoActive}
          <DebugInformation
            {selectedModel}
            {availableModels}
            {systemPromptText}
            {userPromptText}
            {ocrResponseTimeText}
            {llmResponseTimeText}
            {completionTokens}
            {promptTokens}
            {totalTokens}
            {prefillTokensPerS}
            {decodeTokensPerS}
            on:reloadModel={reloadModel}
          />
        {/if}
      {/if}
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    padding-top: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-direction: column;
    height: 80vh;
    overflow: auto;
    text-align: center;
  }

  :global(.warning_hint) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .warning_sign {
    font-size: 2rem;
    margin: 0;
  }

  .file_inputs {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }

  .file_input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  .custom_file_label {
    display: inline-block;
    padding: 10px 15px;
    background-color: var(--black30);
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  button {
    all: unset;
  }
</style>
