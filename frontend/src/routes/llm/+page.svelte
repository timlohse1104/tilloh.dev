<script lang="ts">
  import { executeOcrProcess } from '$lib/api/ocr.api';
  import * as webllm from '@mlc-ai/web-llm';

  const selectedModel = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
  // const selectedModel = 'gemma-2-9b-it-q4f32_1-MLC';
  let engine: webllm.MLCEngineInterface;
  const defaultSystemPrompt = `"Der User schickt dir Texte, die durch einen OCR Prozess aus Rechnungen ausgelesen wurden. Antworte immer im Format von .env Dateien mit dieser Struktur: 'key1="gefundener Wert1"
key2="gefundener Wert2"'. Gib keine zusätzliche Erklärung zurück. Solltest du einem Schlüssel keinen Wert zuordnen können, lasse den Wert frei. Am wichtigsten ist, dass Schlüssel, die nicht auf der Rechnung zu finden sind, einen leeren Wert zugeordnet bekommen. Wenn alle angegebenen Schlüssel befüllt sind, gib keine weiteren oder doppelten Schlüssel an. Finde diese Schlüssel: vendorName (Name des Rechnungsstellers), dueDate (Das Fälligkeitsdatum der Rechnung), invoiceReceiptDate (Das Rechnungsdatum), invoiceReceiptId (Die Rechnungsnummer), paymentTerms (Die Zahlungsbedingungen der Rechnung), receiverAddress (Die Adresse des Empfängers - bitte ohne Namen angeben), subtotal (Der Nettobetrag ohne Umsatz- / Mehrwertsteuer), tax (Der Umsatz- / Mehrwertsteuerbetrag), total (Die Gesamtsumme mit Umsatz- / Mehrwertsteuer), taxPayerId (Die Steuernummer des Anbieters), oekoId (Die Öko-Kontrollnummer), vendorAddress (Die Adresse des Anbieters - bitte ohne Namen angeben), taxPayerUstId (Die Umsatzsteuer-Identifikationsnummer des Anbieters - DE + 9 Zahlen), taxRate (Der Umsatz- / Mehrwertsteuersatz als Prozentzahl), iban1 (Die erste erkannte IBAN), iban2 (Die zweite erkannte IBAN), bic1 (Die ersten erkannten BIC), bic2 (Die zweiten erkannten BIC), deliveryDate (Das Lieferdatum des Rechnungsinhalts), vendorPhone (Die Telefonnummer des Anbieters), vendorFax (Die Faxnummer des Anbieters), vendorEmail (Die Email-Adresse des Anbieters - keine URL), invoiceReceiptType (Der Dokumenttyp - Angebot / Auftrag / Bescheid / Gutschrift / Kontoauszug / Lieferschein / Lohnunterlagen / Mahnung / Rechnung / Vertrag - Fallback ist Sonstige), invoiceReceiptYear (Die Jahreszahl des Rechnungsdatums), discountRate (Der Skontosatz als Prozentzahl), discountDueDate (Das Fälligkeitsdatum vom Skonto), discountTotal (Der Betrag von Gesamtsumme abzüglich des Skontowertes), receiverCompany (Der Name des Unternehmens des Rechnungsempfängers), ibanList (Die Liste aller IBANs aus der Rechnung), bicList (Die Liste aller BICs aus der Rechnung).

 Hier ist ein Beispiel eines Outputs nach einer Anfrage von dem User:
 user: Milchvieh GmbH - Mittelstraße 35 21473 Kiel stadt.werk GmbH Bettina Musterfrau Musterstr. 10 34552 Kopenhagen, Dänemark Rechnungsdatum 22.08.2024 Leistungsdatum 14.08.2024 Kundennummer 0890 Rechnungsnummer: R-CL-2024-00015 Vielen Dank für Ihren Auftrag. Wir berechnen Ihnen folgende Lieferung bzw. Leistung: Nr. Position Menge Einheit USt. Preis Gesamt 1 Ferkel 1 Stück 19 % 357,50 € 357,50 € Zwischensumme netto 357,50 € USt. 19 % 67,93 € Gesamtsumme 425,43 € Bitte begleichen Sie den Rechnungsbetrag bis zum 22.09.2024. Bei Zahlung bis zum 29.08.2024 gewähren wir 2% Skonto. Seite 1 von 1 Milchvieh GmbH Bankverbindung Steuer-Nr.: 162/248/13744 Mittelstraße 35 ING (ehem. ING-DiBa) USt.-ID-Nr.: DE296921904 21473 Kiel IBAN 1: DE74500105174386278432 IBAN2: DE39 2176 3542 0000 4172 20 Öko-Nr.: DK-ÖKO-100 lorenz@stadtwerk.org BIC1: INGDDEFFXXX BIC 2: GENODEF1BDS Telefon: 0431/525478 Fax: 0431/525472

 assistant:
vendorName="Milchvieh GmbH"
dueDate="22.09.2024"
invoiceReceiptDate="22.08.2024"
invoiceReceiptId="R-CL-2024-00015"
paymentTerms="Bitte begleichen Sie den Rechnungsbetrag bis zum 22.09.2024."
receiverAddress="Musterstr. 10 34552 Kopenhagen, Dänemark"
subtotal="357,50"
tax="67,93"
total="425,43"
taxPayerId="162/248/13744"
oekoId="DK-ÖKO-100"
vendorAddress="Mittelstraße 35 - 21473 Kiel"
taxPayerUstId="DE296921904"
taxRate="19%"
iban1="DE74500105174386278432"
iban2="DE39217635420000417220"
bic1="INGDDEFFXXX"
bic2="GENODEF1BDS"
deliveryDate="14.08.2024"
vendorPhone="0431/525478"
vendorFax="0431/525472"
vendorEmail="lorenz@stadtwerk.org"
invoiceReceiptType="Rechnung"
invoiceReceiptYear="2024"
discountRate="2%"
discountDueDate="29.08.2024"
discountTotal="416,92"
receiverCompany="stadt.werk GmbH"
ibanList="DE74500105174386278432","DE39217635420000417220"
bicList="INGDDEFFXXX","GENODEF1BDS"
User:
Llama:"`;
  let systemPromptText = defaultSystemPrompt;
  let userPromptText = '';
  let llmResults = [];
  let promptResStats: any = {};
  let inputFiles: File[];

  $: completionTokens = promptResStats?.completion_tokens || '-';
  $: promptTokens = promptResStats?.prompt_tokens || '-';
  $: totalTokens = promptResStats?.total_tokens || '-';
  $: prefillTokensPerS = promptResStats?.extra?.prefill_tokens_per_s || '-';
  $: decodeTokensPerS = promptResStats?.extra?.decode_tokens_per_s || '-';

  // TODO: Refactor this the svelte way
  function setLabel(id: string, text: string) {
    const label = document.getElementById(id);
    if (label == null) {
      throw Error('Cannot find label ' + id);
    }
    label.innerText = text;
  }

  async function main() {
    const initProgressCallback = (report: webllm.InitProgressReport) => {
      setLabel('init-label', report.text);
    };
    // Option 1: If we do not specify appConfig, we use `prebuiltAppConfig` defined in `config.ts`
    engine = await webllm.CreateMLCEngine(
      selectedModel,
      {
        initProgressCallback: initProgressCallback,
        logLevel: 'INFO', // specify the log level
      },
      // customize kv cache, use either context_window_size or sliding_window_size (with attention sink)
      {
        // TODO: Make this maschine dependend
        context_window_size: 4096,
        // sliding_window_size: 1024,
        // attention_sink_size: 4,
      },
    );

    // Option 2: Specify your own model other than the prebuilt ones
    // const appConfig: webllm.AppConfig = {
    //   model_list: [
    //     {
    //       model: "https://huggingface.co/mlc-ai/Llama-3.1-8B-Instruct-q4f32_1-MLC",
    //       model_id: "Llama-3.1-8B-Instruct-q4f32_1-MLC",
    //       model_lib:
    //         webllm.modelLibURLPrefix +
    //         webllm.modelVersion +
    //         "/Llama-3_1-8B-Instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm",
    //       overrides: {
    //         context_window_size: 2048,
    //       },
    //     },
    //   ],
    // };
    // const engine: webllm.MLCEngineInterface = await webllm.CreateMLCEngine(
    //   selectedModel,
    //   { appConfig: appConfig, initProgressCallback: initProgressCallback },
    // );

    // Option 3: Instantiate MLCEngine() and call reload() separately
    // const engine: webllm.MLCEngineInterface = new webllm.MLCEngine({
    //   appConfig: appConfig, // if do not specify, we use webllm.prebuiltAppConfig
    //   initProgressCallback: initProgressCallback,
    // });
    // await engine.reload(selectedModel);

    // To change model, either create a new engine via `CreateMLCEngine()`, or call `engine.reload(modelId)`
  }

  async function promptLLM() {
    console.log('Prompting LLM...');

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

    console.log('LLM responded.', promptResponse);
    llmResults = promptResponse.choices;
    promptResStats = promptResponse.usage;
    systemPromptText = '';
    userPromptText = '';
    console.log('Reset prompt input field.');
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

  function reloadModel() {
    console.log('Reloading model.');
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
  <br />
  <button on:click={generateUserPrompt}>Generate User Prompt</button>
  <br />

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
