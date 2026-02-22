<script lang="ts">
  // 1. IMPORTS
  import { executeOcrProcess } from '$lib/api/ocr.api';
  import { initialized, t } from '$lib/util/translations';
  import * as webllm from '@mlc-ai/web-llm';
  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import FileUploaderDropContainer from 'carbon-components-svelte/src/FileUploader/FileUploaderDropContainer.svelte';
  import Tag from 'carbon-components-svelte/src/Tag/Tag.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import ContentOutput from './ContentOutput.svelte';
  import DebugInformation from './DebugInformation.svelte';

  // 2. CONST (non-reactive constants)
  const { prebuiltAppConfig } = webllm;
  const { model_list: availableModels } = prebuiltAppConfig;
  const defaultSystemPrompt = `Du erhältst einen Text der auf der Rückseite der Verpackung eines Nahrungsmittels steht. Du antwortest darauf ausschließlich mit der Bezeichnung des Lebensmittels und ob es vegan ist (ja / nein)! Trenne die beiden Informationen durch ein Semikolon.`;
  const followUpQuestionSystemPrompt = `Du erhältst eine Frage zum Lebensmittel, das du vorhin analysiert hast. Du antwortest darauf ausschließlich mit einer klaren und prägnanten Antwort.`;

  // 4. STATE
  let engine = $state<webllm.MLCEngineInterface>(undefined);
  let selectedModel = $state(availableModels[4]); // Llama-3.2-3B-Instruct-q4f32_1-MLC
  let systemPromptText = $state(defaultSystemPrompt);
  let userPromptText = $state('');
  let llmResult = $state('');
  let promptResStats = $state<any>({});
  let inputFiles = $state<File[]>([]);
  let imagePreviewSrc = $state('');
  let loadModelInfo = $state('');
  let debugInfoActive = $state(false);
  let ocrResponseTime = $state(0);
  let llmResponseTime = $state(0);
  let loading = $state(false);
  let engineReady = $state(false);
  let isWebGPUNotAvailableError = $state(false);

  // 5. DERIVED
  const ocrResponseTimeText = $derived(ocrResponseTime ? `${ocrResponseTime} s` : '-');
  const llmResponseTimeText = $derived(llmResponseTime ? `${llmResponseTime} s` : '-');
  const completionTokens = $derived(promptResStats?.completion_tokens || '-');
  const promptTokens = $derived(promptResStats?.prompt_tokens || '-');
  const totalTokens = $derived(promptResStats?.total_tokens || '-');
  const prefillTokensPerS = $derived(promptResStats?.extra?.prefill_tokens_per_s || '-');
  const decodeTokensPerS = $derived(promptResStats?.extra?.decode_tokens_per_s || '-');
  const diet = $derived(llmResult?.split(';')?.[1]?.toLowerCase() === 'ja' ? 'vegan' : 'nicht vegan');
  const followUpQuestions = $derived([
    `Warum ist dieses Lebensmittel ${diet}?`,
    'Ist das Lebensmittel gesund?',
    'Ist das Lebensmittel laktosefrei?',
    'Ist das Lebensmittel glutenfrei?',
  ]);

  // 6. EFFECTS
  $effect(() => {
    if (inputFiles?.length > 0) {
      imagePreviewSrc = URL.createObjectURL(inputFiles[0]);
      generateUserPrompt();
    }
  });

  $effect(() => {
    if (userPromptText) promptLLM();
  });

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
      isWebGPUNotAvailableError = error.message.includes(
        'WebGPU is not supported',
      );
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
  async function promptLLM(followUpQuestion: string = '') {
    console.log('Prompting LLM...');
    const promptStartTime = Date.now();
    let messages: any = [];

    if (followUpQuestion) {
      messages = [
        { role: 'system', content: followUpQuestionSystemPrompt },
        { role: 'user', content: userPromptText },
        { role: 'assistant', content: llmResult },
        { role: 'user', content: followUpQuestion },
      ];
    } else {
      messages = [
        { role: 'system', content: systemPromptText },
        { role: 'user', content: userPromptText },
      ];
    }

    const promptResponse = await engine.chat.completions.create({
      messages,
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

    if (followUpQuestion) {
      llmResult += `;${promptResponse.choices[0].message.content}`;
    } else {
      llmResult = promptResponse.choices[0].message.content;
    }
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
  async function askFollowUpQuestion(question: string) {
    loading = true;
    promptLLM(question);
  }

  main();
</script>

{#if $initialized}
  <section>
    {#if isWebGPUNotAvailableError}
      <Tile class="warning_hint">
        <h2>
          {$t('page.foodScan.webGPUNotAvailableTitle')}
        </h2>
        <p>
          {$t('page.foodScan.webGPUNotAvailableError')}
        </p>
      </Tile>
    {:else if !engineReady}
      <Tile class="warning_hint">
        <h2>{$t('page.foodScan.loadingHint')}</h2>
        <p class="warning_sign">⚠️</p>
        <p>{@html $t('page.foodScan.warning')}</p>
        <p>{loadModelInfo}</p>
      </Tile>
    {:else}
      <h3>{$t('page.foodScan.introduction')}</h3>
      <FileUploaderDropContainer
        labelText={$t('page.foodScan.chooseFile')}
        accept={['.jpg', '.jpeg', '.png']}
        bind:files={inputFiles}
      />

      {#if inputFiles?.length > 0}
        <ContentOutput
          {imagePreviewSrc}
          {loading}
          {inputFiles}
          {llmResult}
          {diet}
        />

        {#if llmResult}
          <div class="followup_tags">
            {#each followUpQuestions as question}
              <Tag interactive on:click={() => askFollowUpQuestion(question)}>
                {question}
              </Tag>
            {/each}
          </div>
        {/if}
      {/if}

      <Checkbox
        bind:checked={debugInfoActive}
        labelText={$t('page.foodScan.technicalInfo')}
      />

      {#if debugInfoActive}
        <DebugInformation
          bind:selectedModel
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
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    padding-top: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-direction: column;
    overflow: auto;
    text-align: center;
  }

  :global(.warning_hint) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 2rem;
    padding: 2rem;
  }

  .warning_sign {
    font-size: 2rem;
    margin: 0;
  }
</style>
