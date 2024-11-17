<script lang="ts">
  import { executeOcrProcess } from '$lib/api/ocr.api';
  import * as webllm from '@mlc-ai/web-llm';

  const selectedModel = 'Llama-3.2-1B-Instruct-q0f16-MLC';
  // const selectedModel = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
  // const selectedModel = 'gemma-2-9b-it-q4f32_1-MLC';
  let engine: webllm.MLCEngineInterface;
  const defaultSystemPrompt = `Der User schickt dir einen Text, der durch einen OCR Prozess aus einem Bild einer Lebensmittel Inhaltsangabe ausgelesen wurden. Antworte immer im Format von .env Dateien mit dieser Struktur: 'key1="gefundener Wert1"\nkey2="gefundener Wert2"'. Gib keine zusätzliche Erklärung zurück. Solltest du einem Schlüssel keinen Wert zuordnen können, lasse den Wert frei. Finde diese Schlüssel: foodName (Name des Lebensmittel), diet (die Ernährungsweise des Lebensmittels, vegan - vegetarisch - normal), dietReason (der Grund für die Ernährungsweise des Lebensmittels)Hier sind zwei Beispiele eines Outputs nach einer Anfrage von dem User:

  User: "GREENFORCE\nENTDECKE TOLLE REZEPTE UND VIELE WEITERE LECKERE\nGREENFORCE-PRODUKTE UND NEWS AUF\nGREENFORCE.COM, FACEBOOK, INSTAGRAM UND TIKTOK!\nVEGANER LEBERKÄSE\nMIT ERBSENPROTEIN\nNährwerte\nEnergie\nFett\n-davon gesättigte Fettsäuren\nKohlenhydrate\n- davon Zucker\nBallaststoffe\nEiweiß\nSalz\n8/100 g\n699 kJ /169 kcal\n14 g\n1,0 g\n1,7 g\n0,3 g\n4.2 g\n1,2 g\n2,5 g\n260322 214738\nNETTOFÜLLGEWICHT:\n160 g (2x 80g)\nGREENFORCE\nFUTURE FOOD AG\nSTREITFELDSTR. 25C\n6000891 •\nUnter Schutzatmosphäre verpackt.\nD-81673 MÜNCHEN\nUngeöffnet bei maximal +7°C zu verbrauchen bis:\nMat.-Nr. 143807/2\n18.09.2024\nGF 2681534 08:27"
  Assistent:
  foodName="Veganer Leberkäse"\ndiet="vegan"\ndietReason="enthält keine tierischen Produkte"

  User: "Nestlé. Good food, Good life.\nNAHRWERTINFORMATIONEN\nBei einer Portion von 20 g\nPro\nPro\n100 g\nPortion\nEnergie\n2130 kJ\n426 kJ\n509 kcal\n102 kcal\nFett\n26,2 g\ndavon gesättigte Fettsäuren 14,4 g\n5,2 g\n2,9 g\nKohlenhydrate\n59,8 g\ndavon Zucker\n12,0 g\n40,8 g\n8,2 g\n% RM*\nPro\nPortion\n5 %\n7 %\n15 %\n5 %\n9 %\nBallaststoffe\n3,0 g\n0,6 g\nEiweiß\n6,8 g\n1,4 g\nSalz\n0,78 g\n0,16 g\n3 %\n3 %\n*RM: Referenzmenge für einen durchschnittlichen Erwachsenen\n((8400 kJ /2000 kcal). Packung enthalt 7,5 Portionen.\nHAST DU FRAGEN?\nDE 069 6671-30 71\nwww.nestle.de\nNestlé Deutschland AG,\n60523 Frankfurt am Main, Deutschland.\n* Reg. Trademark of Societé des Produits Nestlé S.A.\n221\nPAP\nA NATO\nKakao\nCocoa Plan\nwww.nestlecocoaplan.com\nZUTATEN\nKnusperpralinen mit Milchschokolade (72%), Cornflakes (24%) und\nMandeln (4%). Milchschokolade enthält neben Kakaobutter auch\nandere pflanzliche Fette. Zutaten: Zucker, Cornflakes (Mais, Zucker,\nSalz, GERSTENMALZEXTRAKT), Kakaobutter' (12,2%), Kakaomasse'\n(10,6%), MAGERMILCHPULVER, MOLKENERZEUGNIS, MANDELN,\npflanzliche Fette (Palm, Shea), BUTTERREINFETT, Emulgator\nLecithine, natürliches Vanillearoma. Kann enthalten: SOJA und andere\nNÜSSE. Wichtig: Da es sich bei den Mandeln um ein Naturprodukt\nhandelt, können Schalenteile enthalten sein.\n'Rainforest Alliance-zertifiziert. Mehr erfahren unter ra.org\nHergestellt in Deutschland mit Mandeln aus der EU.\nHALTBARKEIT\nTrocken lagern. Vor Wärme schutzen.\nMindestens haltbar bis Ende: siehe Seite.\nHILF MIT ... ENTSORGE RICHTIG\nKARTON\nFOLIE\n499652\n613035\nPapiertonne Gelber Sack\n2 x 75 g = 150 g C* - 44239519/100140772"
  Assistent:
  foodName="Kakao"\ndiet="vegetarisch"\ndietReason="enthält Milchschokolade und andere Milch Erzeugnisse, jedoch kein Fleisch"`;
  let systemPromptText = defaultSystemPrompt;
  let userPromptText = '';
  let llmResults = [];
  let promptResStats: any = {};
  let inputFiles: File[] = [];
  let loadModelInfo = '';

  $: completionTokens = promptResStats?.completion_tokens || '-';
  $: promptTokens = promptResStats?.prompt_tokens || '-';
  $: totalTokens = promptResStats?.total_tokens || '-';
  $: prefillTokensPerS = promptResStats?.extra?.prefill_tokens_per_s || '-';
  $: decodeTokensPerS = promptResStats?.extra?.decode_tokens_per_s || '-';
  $: if (inputFiles?.length > 0) generateUserPrompt();

  function setLabel(id: string, text: string) {
    loadModelInfo = text;
  }

  async function main() {
    const initProgressCallback = (report: webllm.InitProgressReport) => {
      setLabel('init-label', report.text);
    };
    try {
      engine = await webllm.CreateMLCEngine(
        selectedModel,
        {
          initProgressCallback: initProgressCallback,
          logLevel: 'INFO',
        },
        {
          // TODO: Make this maschine dependend
          context_window_size: 4096,
        },
      );
    } catch (error) {
      console.error('Failed to create MLCEngine:', error);
    }
  }

  async function generateUserPrompt() {
    console.log('Generating user prompt with ocr.');
    const ocrResponse = await executeOcrProcess(inputFiles[0]);

    console.log(
      `OCR responsed within ${parseFloat(ocrResponse.ProcessingTimeInMilliseconds) / 1000} seconds.`,
      { ocrResponse },
    );
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
    console.log(
      `LLM responded within ${(promptEndTime - promptStartTime) / 1000} seconds.`,
      {
        promptResponse,
      },
    );
    llmResults = promptResponse.choices;
    promptResStats = promptResponse.usage;
  }

  async function reloadModel() {
    console.log('Reloading model.');
    await engine.reload(selectedModel);
  }

  main();
</script>

<svelte:head>
  <title>llm</title>
  <meta name="llm" content="tilloh.dev" />
</svelte:head>

<section>
  <h2>OCRSpace and WebLLM</h2>

  <h3>Loading model {selectedModel}</h3>
  <p>{loadModelInfo}</p>
  <button on:click={() => reloadModel()}>Reload Model</button>
  Open console to see output
  <br />
  <br />
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label id="init-label"> </label>

  <h3>Upload img / pdf file</h3>
  <input
    type="file"
    accept="image/png, image/jpeg, application/pdf"
    bind:files={inputFiles}
  />

  <h3>System Prompt</h3>
  <div class="prompt-input-area">
    <input class="prompt-input" bind:value={systemPromptText} />
  </div>

  <h3>User Prompt</h3>
  <div class="prompt-input-area">
    <input class="prompt-input" bind:value={userPromptText} />
    <button on:click={promptLLM}>Send</button>
  </div>

  <h3>Response</h3>
  {#each llmResults as responseTexts, index (index)}
    <span id="generate-label">
      {@html responseTexts.message.content
        .split('\n')
        .map((line) => `<p style="margin: 0; font-size: 14px;">${line}</p>`)
        .join('')}
    </span>
  {/each}

  <br />

  <h3>Stats</h3>
  <table>
    <tr>
      <th>completion_tokens</th>
      <th>prompt_tokens</th>
      <th>total_tokens</th>
      <th>prefill_tokens_per_s</th>
      <th>decode_tokens_per_s</th>
    </tr>
    <tr>
      <td>{completionTokens}</td>
      <td>{promptTokens}</td>
      <td>{totalTokens}</td>
      <td>{prefillTokensPerS}</td>
      <td>{decodeTokensPerS}</td>
    </tr>
  </table>
</section>

<style lang="scss">
  .prompt-input-area {
    display: flex;
    margin-bottom: 20px;
    height: 100px;
    width: 100%;
  }

  .prompt-input {
    flex-grow: 10;
    width: 100%;
  }

  button {
    flex-grow: 0;
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
