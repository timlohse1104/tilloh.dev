<script lang="ts">
  import { executeOcrProcess } from '$lib/api/ocr.api';
  import { initialized, t } from '$lib/util/translations';
  import * as webllm from '@mlc-ai/web-llm';
  import Card from '@smui/card';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Select, { Option } from '@smui/select';

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
      <label for="file-upload" class="custom_file_label"
        >{$t('page.foodScan.chooseFile')}</label
      >
      <input
        id="file-upload"
        class="file_input"
        type="file"
        accept="image/png, image/jpeg"
        bind:files={inputFiles}
      />

      {#if inputFiles?.length > 0}
        <div class="initial_scan_output">
          <img
            class="image_preview"
            src={imagePreviewSrc || ''}
            alt="Preview"
          />

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
        <FormField>
          <Checkbox bind:checked={debugInfoActive} />
          <p slot="label">{$t('page.foodScan.technicalInfo')}</p>
        </FormField>

        {#if debugInfoActive}
          <div>
            <h3>{$t('page.foodScan.debug.title')}</h3>
            <p>
              {$t('page.foodScan.debug.selectedModel', {
                modelName: selectedModel?.model_id,
              })}
            </p>
            <Select
              class="select_model"
              bind:value={selectedModel}
              label="Select Model"
              on:SMUISelect:change={reloadModel}
            >
              {#each availableModels as model}
                <Option value={model}
                  >{model?.model_id} ({model.vram_required_MB}MB VRAM / {model
                    ?.overrides?.context_window_size} window size)</Option
                >
              {/each}
            </Select>

            <p>{$t('page.foodScan.debug.systemPrompt')}</p>
            <Card padded>{systemPromptText}</Card>

            <p>{$t('page.foodScan.debug.userPrompt')}</p>
            <Card padded>{userPromptText}</Card>

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
          </div>
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
