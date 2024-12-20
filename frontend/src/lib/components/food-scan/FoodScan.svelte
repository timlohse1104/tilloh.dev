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
  const defaultSystemPrompt = `Du erhältst vom User einen Text mit Inhaltsstoffen eines Nahrungsmittels. Du antwortest darauf ausschließlich mit der Bezeichnung des Lebensmittels und ob es vegan ist "ja" (das Lebensmittel enthält nur pflanzliche Inhaltsstoffe) / "nein" (das Lebensmittel enthält zumindest ein offensichtliches Tierprodukt). Trenne die beiden Informationen durch ein Semikolon.

    Beispiel:
    Text vom User: "1000Va
    oodess
    Fromarsac, Marsac sur l'Isle,
    24052 Périgueux, Cedex 9, France
    Brotaufstrich auf Mandelbasis
    Zutaten: Wasser, 16% MANDELPÜREE,
    Rapsöl, Inulin, Kartoffelstärke, Kräuter der Provence,
    Kräuter, Knoblauch, Zitronensaftkonzentrat, Speisesalz,
    natürliche Aromen, Stickstoff zum Aufschlagen.
    Kann Spuren von Sellerie und weiteren Schalenfrüchten enthalten.
    Durchschnittliche
    Nährwerte pro
    Brennwert
    100 g
    Portion
    30 g
    939 kJ/
    282 kJ/
    227 kcal
    68 kcal
    Fett
    19 g
    5,7 g
    davon gesättigte
    Fettsäuren
    1,7 g
    0,5 g
    Kohlenhydrate
    7,4 g
    3272770 015653
    Nach dem Öffnen alsbald
    verzehren. Bei +2°C bis +8°C
    mindestens haltbar bis:
    siehe Deckelrand
    2,2 g
    davon Zucker
    1,1 g
    ‹ 0,5 g
    Ballaststoffe
    4,0 g
    1,2 g
    Eiweiß
    4,6 g
    Salz
    1,4 g
    1,1g
    0,33 g
    Eine Packung entspricht ca. 4,5 Portionen
    Ich liebe
    Verbraucherservice:
    Käse.com
    D PF 1627, 65006 Wiesbaden
    140ge •
    info@bresso.de
    info@bresso.at
    A25417-03
    ZHau"
    Antwort: "Brotaufstrich auf Mandelbasis;ja"
    `;
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
    console.log(promptResponse.choices[0].message.content);
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
    <Card padded class="warning_hint">
      <h2>⚠️ This application takes a while to load! ⚠️</h2>
      <p>Please be patient</p>
      <p>{loadModelInfo}</p>
    </Card>
  {:else}
    <h3>
      Let's scan the backside of a food item to get an estimation wether it is
      vegan or not.
    </h3>
    <label for="file-upload" class="custom_file_label">Choose file</label>
    <input
      id="file-upload"
      class="file_input"
      type="file"
      accept="image/png, image/jpeg"
      bind:files={inputFiles}
    />

    {#if inputFiles?.length > 0}
      <div class="initial_scan_output">
        <img class="image_preview" src={imagePreviewSrc || ''} alt="Preview" />

        <div class="prompt_output">
          {#if loading && inputFiles.length != 0}
            <p>⌛ Loading...</p>
          {:else if !loading && llmResults.length != 0}
            {#each llmResults as responseTexts, index (index)}
              <h3>{responseTexts.message.content.split(';')[0]}</h3>
              <p id="generate-label">
                {#if responseTexts.message.content
                  .split(';')[1]
                  .toLowerCase()
                  .includes('ja')}
                  <span>✅ Vegan.</span>
                {:else}
                  <span>❌ Not vegan.</span>
                {/if}
              </p>
            {/each}
          {/if}
        </div>
      </div>
      <FormField>
        <Checkbox bind:checked={debugInfoActive} />
        <p slot="label">Technical information</p>
      </FormField>
    {/if}

    {#if debugInfoActive}
      <div>
        <h3>Debug Information</h3>
        <p>Selected model: {selectedModel?.model_id}</p>
        <Select
          class="select_model"
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
      </div>
    {/if}
  {/if}
</section>

<style lang="scss">
  section {
    padding-top: 2rem;
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-direction: column;
    height: 80vh;
    overflow: auto;
  }

  :global(.warning_hint) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .initial_scan_output {
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }

  .prompt_output {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.25rem 0.25rem 0 0;
  }

  h3 {
    margin: 0;
  }

  .image_preview {
    max-width: 33vw;
  }

  .file_input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  .custom_file_label {
    display: inline-block;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
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
