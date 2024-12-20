<script lang="ts">
  import { executeOcrProcess } from '$lib/api/ocr.api';
  import * as webllm from '@mlc-ai/web-llm';
  import Card from '@smui/card';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import Select, { Option } from '@smui/select';
  const { prebuiltAppConfig } = webllm;
  const { model_list: availableModels } = prebuiltAppConfig;
  let selectedModel = availableModels[4];
  let engine: webllm.MLCEngineInterface;
  const defaultSystemPrompt =
    'Du erhältst vom User einen Text, der per OCR aus einem Bild der Rückseite einer Nahrungsmittel-Verpackung ausgelesen wurde. Du antwortest darauf ausschließlich mit der Bezeichnung des Lebensmittels (z.B. Vollmilchschokolade) und ob das Nahrungsmittel vegan ist ("vegan" / "nicht vegan" ). Vegan bedeuetet, dass das Lebensmittel nur aus pflanzlichen Inhaltsstoffe besteht. Trenne die beiden Informationen durch ein Semikolon.';
  let systemPromptText = defaultSystemPrompt;
  let userPromptText = '';
  let llmResults = [];
  let promptResStats: any = {};
  let inputFiles: File[] = [];
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
  $: if (inputFiles?.length > 0) generateUserPrompt();
  $: if (userPromptText) promptLLM();
  $: if (selectedModel) reloadModel();

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

    const initProgress = engine.getInitProgressCallback();
    console.log('initProgress', initProgress);
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

<section>
  {#if !engineReady}
    <Card padded class="margin-bottom:1rem;">
      <h2>⚠️ This application takes a while to load. Please be patient.</h2>
      <p>{loadModelInfo}</p>
    </Card>
  {:else}
    <h3>
      Upload an image of the backside of a food item to get an estimation.
    </h3>
    <span>
      <input
        type="file"
        accept="image/png, image/jpeg, application/pdf"
        bind:files={inputFiles}
      />

      <FormField>
        <Checkbox bind:checked={debugInfoActive} />
        <p slot="label">More information</p>
      </FormField>
    </span>

    {#if loading && inputFiles.length != 0}
      <p>⌛ Loading...</p>
    {:else if !loading && llmResults.length != 0}
      <h3>Einschätzung</h3>
      {#each llmResults as responseTexts, index (index)}
        <p id="generate-label">
          {#if responseTexts?.message?.content?.toLowerCase() === 'vegan'}
            <span>✅</span>
          {:else}
            <span>❌</span>
          {/if}
          {@html responseTexts.message.content
            .split(';')
            .map((line) => `<p style="margin: 0; font-size: 14px;">${line}</p>`)
            .join('')}
        </p>
      {/each}
    {/if}

    {#if debugInfoActive}
      <h3>Debug Information</h3>
      <p>Selected model: {selectedModel?.model_id}</p>
      <Select
        class="select-model"
        bind:value={selectedModel}
        label="Select Model"
      >
        {#each availableModels as model}
          <Option value={model}
            >{model?.model_id} ({model.vram_required_MB}MB VRAM / {model
              ?.overrides?.context_window_size} window size)</Option
          >
        {/each}
      </Select>

      <p>System Prompt</p>
      <Card padded>{systemPromptText}</Card>

      <p>User Prompt</p>
      <Card padded>{userPromptText}</Card>

      <p>Stats</p>
      <table>
        <tr>
          <th>ocr time</th>
          <th>llm time</th>
          <th>completion_tokens</th>
          <th>prompt_tokens</th>
          <th>total_tokens</th>
          <th>prefill_tokens_per_s</th>
          <th>decode_tokens_per_s</th>
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
    {/if}
  {/if}
</section>

<style lang="scss">
  :global(.select-model) {
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
