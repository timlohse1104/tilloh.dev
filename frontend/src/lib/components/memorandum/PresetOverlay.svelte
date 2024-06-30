<script lang="ts">
  import {
    localPresetStore,
    presetOverlayOptionsStore,
  } from '$lib/util/memorandum/stores.js';
  import Accordion, { Content, Header, Panel } from '@smui-extra/accordion';
  import Button, { Label } from '@smui/button';
  import Dialog, {
    Actions as DialogActions,
    Content as DialogContent,
    Title,
  } from '@smui/dialog';
  import { Icon } from '@smui/fab';
  import IconButton from '@smui/icon-button';
  import List, { Graphic, Item, Text } from '@smui/list';
  import Snackbar, { Actions } from '@smui/snackbar';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import hljs from 'highlight.js';
  import { onMount } from 'svelte';

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

  const closeOverlay = () => {
    $presetOverlayOptionsStore.showOverlay = false;
  };

  const triggerFileSelect = () => {
    configFileInput.click();
  };

  const triggerFileDownload = () => {
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
  };

  onMount(() => {
    hljs.highlightAll();
  });
</script>

<Dialog
  bind:open={$presetOverlayOptionsStore.showOverlay}
  scrimClickAction=""
  aria-labelledby="large-scroll-title"
  aria-describedby="large-scroll-content"
  surface$style="width: 50vw; max-width: calc(100vw - 32px);"
>
  <Title id="large-scroll-title">
    Einstellung der Link und Ordner Konfiguration
    <p class="large-scroll-subtitle">
      Sichere hier deine aktuellen Links und Ordner lokal als Datei, um sie auf
      einem beliebigen Gerät weiter zu verwenden.
      <Wrapper>
        <Icon class="material-icons">info</Icon>
        <Tooltip xPos="start" yPos="detected"
          >Drücke die 'Esc'-Taste um diese Übersicht zu schließen.</Tooltip
        >
      </Wrapper>
    </p>
  </Title>

  <Title>Das ist deine aktuelle Konfiguration</Title>

  <List dense>
    <Item style="margin-left:calc(var(--default-padding)/2);">
      <Graphic class="material-icons">folder</Graphic>
      <Text>{folderAmount} Ordner</Text>
    </Item>
    <Item style="margin-left:calc(var(--default-padding)/2);">
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

  <DialogActions>
    <Button
      on:click={() => {
        triggerFileSelect();
        event.stopPropagation();
      }}
      variant="outlined"
    >
      <Icon class="material-icons">file_upload</Icon>
      <Label>Import</Label>
    </Button>
    <Button on:click={triggerFileDownload} color="secondary" variant="outlined">
      <Icon class="material-icons">file_download</Icon>
      <Label>Export</Label>
    </Button>
  </DialogActions>
</Dialog>

<input
  bind:this={configFileInput}
  type="file"
  bind:files
  style="display: none"
/>

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

  .large-scroll-subtitle {
    font-size: 1rem;
  }
</style>
