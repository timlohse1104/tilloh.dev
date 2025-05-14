<script lang="ts">
  import { executeOcrProcess } from '$lib/api/ocr.api';
  import { initialized, t } from '$lib/util/translations';
  import * as webllm from '@mlc-ai/web-llm';
  import {
    Checkbox,
    FileUploaderDropContainer,
    Tag,
    Tile,
  } from 'carbon-components-svelte';
  import ContentOutput from './ContentOutput.svelte';
  import DebugInformation from './DebugInformation.svelte';

  const { prebuiltAppConfig } = webllm;
  const { model_list: availableModels } = prebuiltAppConfig;
  // console.log(availableModels.map((model, i) => `${i} ${model.model_id}`));
  const defaultSystemPrompt = `Du erhältst einen Text der auf der Rückseite der Verpackung eines Nahrungsmittels steht. Du antwortest darauf ausschließlich mit der Bezeichnung des Lebensmittels und ob es vegan ist (ja / nein)! Trenne die beiden Informationen durch ein Semikolon.`;
  const followUpQuestionSystemPrompt = `Du erhältst eine Frage zum Lebensmittel, das du vorhin analysiert hast. Du antwortest darauf ausschließlich mit einer klaren und prägnanten Antwort.`;

  let engine: webllm.MLCEngineInterface;
  let selectedModel = availableModels[4]; // Llama-3.2-3B-Instruct-q4f32_1-MLC
  let systemPromptText = defaultSystemPrompt;
  let userPromptText = '';
  let llmResult = '';
  let promptResStats: any = {};
  let inputFiles: File[] = [];
  let imagePreviewSrc = '';
  let loadModelInfo = '';
  let debugInfoActive = false;
  let ocrResponseTime = 0;
  let llmResponseTime = 0;
  let loading = false;
  let engineReady = false;
  let isWebGPUNotAvailableError = false;

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
  $: diet =
    llmResult?.split(';')?.[1]?.toLowerCase() === 'ja'
      ? 'vegan'
      : 'nicht vegan';
  $: followUpQuestions = [
    `Warum ist dieses Lebensmittel ${diet}?`,
    'Ist das Lebensmittel gesund?',
    'Ist das Lebensmittel laktosefrei?',
    'Ist das Lebensmittel glutenfrei?',
  ];

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
        class="file_input"
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
              <Tag
                on:click={() => askFollowUpQuestion(question)}
                class="followup_question_tags"
              >
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

  :global(.followup_question_tags:hover) {
    cursor: pointer;
  }

  .warning_sign {
    font-size: 2rem;
    margin: 0;
  }

  .file_input {
    width: 100%;
  }

  :global(.file_input .bx--file__drop-container) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
