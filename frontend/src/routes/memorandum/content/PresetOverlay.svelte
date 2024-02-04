<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import Accordion, { Content, Header, Panel } from '@smui-extra/accordion';
  import Fab, { Icon, Label } from '@smui/fab';
  import IconButton from '@smui/icon-button';
  import List, { Graphic, Item, Text } from '@smui/list';
  import Snackbar, { Actions } from '@smui/snackbar';
  import { onMount } from 'svelte';
  import { localPreset, presetOverlayOptions } from '../util/stores.js';

  let codeElement;
  let files: FileList;
  let presetUploadSnackbar: Snackbar;
  let presetDownloadSnackbar: Snackbar;
  let detailOpen = false;

  $: if (files) {
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        const json = JSON.parse(result);
        localPreset.set(json);
        codeElement.innerHTML = JSON.stringify(json, null, 2);
      };
      reader.readAsText(file);
      presetUploadSnackbar.open();
    }
  }

  $: folderAmount = $localPreset.Folders.length;
  $: linkAmount = [
    ...$localPreset.Folders.map((folder) => folder.links.length),
  ].reduce((a, b) => a + b, 0);

  function closeOverlay() {
    $presetOverlayOptions.showOverlay = false;
  }

  function triggerFileSelect() {
    configInput.click();
  }

  function triggerFileDownload() {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify($localPreset, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    const date = new Date();
    downloadAnchorNode.setAttribute(
      'download',
      `memorandum-config-${date.toLocaleDateString()}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    presetDownloadSnackbar.open();
  }

  onMount(() => {
    hljs.highlightAll();
  });
</script>

<section>
  <button id="exitOverlay" on:click={closeOverlay}> X </button>

  <div class="configPreview">
    <h1>Einstellung der Link und Ordner Konfiguration</h1>

    <p>
      Sichere hier deine aktuellen Links und Ordner lokal als Datei, um sie auf
      einem beliebigen Gerät weiter zu verwenden.
    </p>

    <div class="buttons">
      <input id="configInput" type="file" bind:files style="display: none" />
      <Fab color="primary" on:click={triggerFileSelect} extended>
        <Icon class="material-icons">file_upload</Icon>
        <Label>Import</Label>
      </Fab>
      <Fab on:click={triggerFileDownload} extended>
        <Icon class="material-icons">file_download</Icon>
        <Label>Export</Label>
      </Fab>
    </div>

    <h2>Das ist deine aktuelle Konfiguration</h2>

    <List dense>
      <Item>
        <Graphic class="material-icons">folder</Graphic>
        <Text>{folderAmount} Ordner</Text>
      </Item>
      <Item>
        <Graphic class="material-icons">link</Graphic>
        <Text>{linkAmount} Links</Text>
      </Item>
    </List>

    <div class="accordion-container">
      <Accordion>
        <Panel bind:open={detailOpen}>
          <Header
            >Technische Daten
            <IconButton slot="icon" toggle pressed={detailOpen}>
              <Icon class="material-icons" on>expand_less</Icon>
              <Icon class="material-icons">expand_more</Icon>
            </IconButton>
          </Header>
          <Content
            ><pre class="code-container">
            <code class="language-json" bind:this={codeElement}
                >{JSON.stringify($localPreset, null, 2)}</code
              >
          </pre></Content
          >
        </Panel>
      </Accordion>
    </div>
  </div>

  <Snackbar bind:this={presetUploadSnackbar}>
    <Label>Konfiguration erfolgreich importiert</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>

  <Snackbar bind:this={presetDownloadSnackbar}>
    <Label>Download der Konfiguration gestartet.</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</section>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  @import '$lib/styles/_variables.scss';

  section {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: $darkgrey90;
    z-index: 1;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    justify-items: center;
    align-items: center;
  }

  #exitOverlay {
    background-color: $red70;
    padding: 12px 18px;
    color: white;
    font-size: 18px;
    border: solid 0px;
    box-shadow: $sharpen;
    position: absolute;
    top: 0;
    right: 0;

    &:hover {
      background-color: $red;
    }
  }

  .configPreview {
    width: 90%;
    height: 100%;
    background-color: $darkgrey80;
    padding: 20px;
    overflow: auto;

    h1 {
      margin-top: 3rem;
    }

    p {
      text-align: center;
    }

    h2 {
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
  }

  .code-container {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: $trans;

    code {
      font-size: 14px;
      line-height: 1.5;
      font-family: 'Fira Code', monospace;
    }
  }

  .buttons {
    display: flex;
    justify-content: space-evenly;
    margin-top: 2rem;
  }
</style>
