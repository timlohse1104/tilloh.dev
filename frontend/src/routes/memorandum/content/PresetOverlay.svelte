<script lang="ts">
  import Accordion, { Content, Header, Panel } from '@smui-extra/accordion';
  import Dialog, { Content as DialogContent, Title } from '@smui/dialog';
  import Fab, { Icon, Label } from '@smui/fab';
  import IconButton from '@smui/icon-button';
  import List, { Graphic, Item, Text } from '@smui/list';
  import Snackbar, { Actions } from '@smui/snackbar';
  import hljs from 'highlight.js';
  import { onMount } from 'svelte';
  import {
    localPresetStore,
    presetOverlayOptionsStore,
  } from '../util/stores.js';

  let codeElement;
  let files: FileList;
  let presetUploadSnackbar: Snackbar;
  let presetDownloadSnackbar: Snackbar;
  let detailOpen = false;
  let configFileInput: HTMLInputElement;

  $: if (files) {
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result.toString();
        const json = JSON.parse(result);
        localPresetStore.set(json);
        codeElement.innerHTML = JSON.stringify(json, null, 2);
      };
      reader.readAsText(file);
      presetUploadSnackbar.open();
    }
  }

  $: folderAmount = $localPresetStore.Folders.length;
  $: linkAmount = [
    ...$localPresetStore.Folders.map((folder) => folder.links.length),
  ].reduce((a, b) => a + b, 0);

  function closeOverlay() {
    $presetOverlayOptionsStore.showOverlay = false;
  }

  function triggerFileSelect() {
    configFileInput.click();
  }

  function triggerFileDownload() {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify($localPresetStore, null, 2));
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

<Dialog
  bind:open={$presetOverlayOptionsStore.showOverlay}
  aria-labelledby="large-scroll-title"
  aria-describedby="large-scroll-content"
  surface$style="width: 50vw; max-width: calc(100vw - 32px);"
>
  <Title id="large-scroll-title">
    Einstellung der Link und Ordner Konfiguration
    <p class="large-scroll-subtitle">
      Sichere hier deine aktuellen Links und Ordner lokal als Datei, um sie auf
      einem beliebigen Gerät weiter zu verwenden.
    </p>
  </Title>

  <div class="buttons">
    <input
      bind:this={configFileInput}
      type="file"
      bind:files
      style="display: none"
    />
    <Fab color="primary" on:click={triggerFileSelect} extended>
      <Icon class="material-icons">file_upload</Icon>
      <Label>Import</Label>
    </Fab>
    <Fab on:click={triggerFileDownload} extended>
      <Icon class="material-icons">file_download</Icon>
      <Label>Export</Label>
    </Fab>
  </div>

  <Title>Das ist deine aktuelle Konfiguration</Title>

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

  <DialogContent id="large-scroll-content">
    <div>
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
                >{JSON.stringify($localPresetStore, null, 2)}</code
              >
          </pre></Content
          >
        </Panel>
      </Accordion>
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
  </DialogContent>
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .code-container {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--trans);

    code {
      line-height: 1.5;
      font-size: 12px;
      font-family: var(--font-mono);
      background-color: var(--pre-background);
      border-radius: 3px;
      padding: 0.5em;
      overflow-x: auto;
      color: var(--color-text);
    }
  }

  .buttons {
    display: flex;
    justify-content: space-evenly;
  }

  .large-scroll-subtitle {
    font-size: 1rem;
  }
</style>
