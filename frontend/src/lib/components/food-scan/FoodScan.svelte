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
    'Der User schickt dir einen Text, welcher die Zusammensetzung eines Nahrungsmittels beschreibt. Du antwortest darauf ausschließlich mit der Bezeichnung des Lebensmittels (z.B. Vollmilchschokolade), der passendenen Ernährungsweise ("vegan" = keine tierischen Inhaltsstoffe vorhanden, "vegetarisch" = maximal Milchprodukte enthalten, "fleischlich" = enthält mindestens fleischliche Inhaltsstoffe) und der Begründung warum du entschieden hast, dass das Lebensmittel vegan, vegetarisch oder fleischlich ist. Gib nur die geforderten Informationen an. Trenne die drei Informationen durch ein Semikolon.';
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
  <Card padded>
    <h2>Can i eat it?</h2>

    <p>⚠️ Wait for the model to be loaded.</p>
    <p>{loadModelInfo}</p>

    <h3>Upload image of food in question</h3>
    <span>
      <input
        type="file"
        accept="image/png, image/jpeg, application/pdf"
        bind:files={inputFiles}
      />

      <FormField>
        <Checkbox bind:checked={debugInfoActive} />
        <span slot="label">More information</span>
      </FormField>
    </span>

    {#if loading && inputFiles.length != 0}
      <p>⌛ Loading...</p>
    {:else if !loading && llmResults.length != 0}
      <h3>Einschätzung</h3>
      {#each llmResults as responseTexts, index (index)}
        <p id="generate-label">
          {#if responseTexts?.message?.content
            ?.toLowerCase()
            ?.includes('vegan')}
            <span>🥬</span>
          {:else if responseTexts?.message?.content
            ?.toLowerCase()
            ?.includes('vegetarisch')}
            <span>🥛</span>
          {:else}
            <span>🥩</span>
          {/if}
          {@html responseTexts.message.content
            .split(';')
            .map((line) => `<p style="margin: 0; font-size: 14px;">${line}</p>`)
            .join('')}
        </p>
      {/each}
    {/if}
  </Card>

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
