<script lang="ts">
  import { dev } from '$app/environment';
  import { environment } from '$lib/util/environment';
  import { sharedIdentifierStore } from '$lib/util/stores';
  import { initialized, locale, t } from '$lib/util/translations';
  import type { Identifier } from '$lib/util/types';
  import Button, { Icon, Label } from '@smui/button';
  import Card from '@smui/card';
  import Snackbar from '@smui/snackbar';
  import { onMount } from 'svelte';

  const apiURL = dev
    ? environment.localApiBaseUrl
    : environment.productionApiBaseUrl;
  let shareDataOnline;
  let name = '';
  let saveButton;
  let connectButton;
  let openIdentifierInfo = false;
  let idInput = '';
  let snackbar: Snackbar;
  let snackbarMessage = '';

  $: sameName = $sharedIdentifierStore.name === name;
  $: saveSubmittable = name && !sameName;
  $: connectSubmittable = !!idInput;
  $: if (saveButton) {
    saveButton.$$set({
      disabled: !saveSubmittable,
    });
  }
  $: if (connectButton) {
    connectButton.$$set({
      disabled: !connectSubmittable,
    });
  }

  onMount(() => {
    if ($sharedIdentifierStore.id && $sharedIdentifierStore.name) {
      name = $sharedIdentifierStore.name || '';
      shareDataOnline = true;
    } else {
      shareDataOnline = false;
    }
  });

  const saveOnlineIdentifier = async () => {
    if ($sharedIdentifierStore.id) {
      await fetch(`${apiURL}/identifiers/${$sharedIdentifierStore.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
        .then((response) => response.json())
        .then((data) => {
          const identifier: Identifier = {
            id: data._id,
            name: data.name,
          };

          $sharedIdentifierStore = identifier;
          name = data.name;
        });
    } else {
      await fetch(`${apiURL}/identifiers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
        .then((response) => response.json())
        .then((data) => {
          const identifier: Identifier = {
            id: data._id,
            name: data.name,
          };

          $sharedIdentifierStore = identifier;
          name = data.name;
          triggerSnackbar(
            $t('page.settings.onlinePersistence.snackbarIdentifierCreated', {
              identifierName: name,
            }),
          );
        })
        .catch((error) => {
          triggerSnackbar(error);
        });
    }
  };
</script>

{#if $initialized}
  <Card>
    <section>
      <h2>
        {$t('page.settings.languageSwitch.title')}
      </h2>
      <p class="language-switch-description">
        {$t('page.settings.languageSwitch.description')}
      </p>

      <div class="language-buttons">
        <Button on:click={() => ($locale = 'en')}>
          <Icon>
            <img
              class="language-button-icon"
              src={'/images/settings/united-kingdom.png'}
              alt="United Kingdom"
            />
          </Icon>
          <Label>{$t('lang.en')}</Label>
        </Button>
        <Button on:click={() => ($locale = 'de')}>
          <Icon>
            <img
              class="language-button-icon"
              src={'/images/settings/germany.png'}
              alt="Germany"
            />
          </Icon>
          <Label>{$t('lang.de')}</Label>
        </Button>
      </div>
    </section>
  </Card>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1rem;
    color: var(--color-text);

    span {
      color: var(--color-text);
    }
  }

  .language-switch-description {
    width: 90%;
    text-align: center;
  }

  .language-button-icon {
    width: 100%;
    height: 100%;
  }
</style>
