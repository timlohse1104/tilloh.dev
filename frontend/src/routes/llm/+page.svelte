<script lang="ts">
  import * as webllm from '@mlc-ai/web-llm';

  const selectedModel = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
  let engine: webllm.MLCEngineInterface;
  let systemPromptText = '';
  let userPromptText = '';
  let llmResults = [];
  let promptResStats: any = {};

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
        context_window_size: 8096,
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
      max_tokens: 1024,
      frequency_penalty: 0.9,
      presence_penalty: 0.9,
      // 46510 and 7188 are "California", and 8421 and 51325 are "Texas" in Llama-3.1-8B-Instruct
      // So we would have a higher chance of seeing the latter two, but never the first in the answer
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
    promptResStats = JSON.stringify(promptResponse.usage);
    systemPromptText = '';
    userPromptText = '';
    console.log('Reset prompt input field.');
  }

  main();
  // webLLMGlobal = {};
</script>

<svelte:head>
  <title>llm</title>
  <meta name="llm" content="tilloh.dev" />
</svelte:head>

<h2>WebLLM Test Page</h2>
Open console to see output
<br />
<br />
<!-- svelte-ignore a11y-label-has-associated-control -->
<label id="init-label"> </label>

<h3>System Prompt</h3>
<div class="prompt-input-area">
  <input id="prompt-label" bind:value={systemPromptText} />
</div>

<h3>User Prompt</h3>
<div class="prompt-input-area">
  <input id="prompt-label user-prompt-input" bind:value={userPromptText} />
  <button on:click={promptLLM}>Send</button>
</div>

<h3>Response</h3>
{#each llmResults as responseTexts, index (index)}
  <span id="generate-label">{responseTexts.message.content}</span>
{/each}

<br />

<h3>Stats</h3>
<table>
  <tr>
    <th>completion_tokens</th>
    <th>prompt_tokens</th>
    <th>total_tokens</th>
    <th>promptResStats</th>
    <th>promptResStats</th>
  </tr>
  <tr>
    <td>{promptResStats?.completion_tokens || '-'}</td>
    <td>{promptResStats?.prompt_tokens || '-'}</td>
    <td>{promptResStats?.total_tokens || '-'}</td>
    <td>{promptResStats?.extra?.prefill_tokens_per_s || '-'}</td>
    <td>{promptResStats?.extra?.decode_tokens_per_s || '-'}</td>
  </tr>
</table>

<style lang="scss">
  .prompt-input-area {
    display: flex;
    margin-bottom: 20px;
    height: 100px;
  }

  input {
    flex-grow: 10;
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
