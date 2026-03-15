<script lang="ts">
  // 1. IMPORTS
  import { createJoke } from '$lib/api/jokes.api';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { initialized, t } from '$lib/util/translations';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Select from 'carbon-components-svelte/src/Select/Select.svelte';
  import SelectItem from 'carbon-components-svelte/src/Select/SelectItem.svelte';
  import TextArea from 'carbon-components-svelte/src/TextArea/TextArea.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import { fade } from 'svelte/transition';

  // 2. PROPS
  let { open = $bindable(false) } = $props();

  // 3. CONST
  const languages = ['de', 'en'];

  // 4. STATE
  let jokeText = $state('');
  let jokeLanguage = $state('de');
  let timeout = $state<number | undefined>(undefined);

  // 5. DERIVED
  const submittable = $derived(jokeText && jokeLanguage);
  const showNotification = $derived(timeout !== undefined);

  // 6. EFFECTS
  $effect(() => {
    if (open) {
      jokeText = '';
      jokeLanguage = 'de';
      timeout = undefined;
    }
  });

  // 8. FUNCTIONS
  const submitJoke = async () => {
    const createResponse = await createJoke({
      text: jokeText,
      language: jokeLanguage,
      categories: [],
    });

    if (createResponse?._id) {
      celebrate();
      timeout = 1500;
      jokeText = '';
      jokeLanguage = 'de';
    }
  };

  const closeOverlay = () => {
    open = false;
    timeout = undefined;
  };
</script>

<Modal
  bind:open
  modalHeading={$t('page.jokes.createJokeModalTitle')}
  primaryButtonText={$t('page.shared.save')}
  primaryButtonIcon={Save}
  primaryButtonDisabled={!submittable}
  secondaryButtonText={$t('page.shared.abort')}
  on:click:button--primary={submitJoke}
  on:click:button--secondary={closeOverlay}
>
  {#if $initialized}
    <TextArea
      helperText={$t('page.jokes.newJokeHelperText')}
      placeholder={$t('page.jokes.newJokeTextInput')}
      rows={5}
      cols={60}
      bind:value={jokeText}
    />

    <div class="mt2">
      <Select
        labelText={$t('page.jokes.newJokeLanguage')}
        bind:selected={jokeLanguage}
      >
        {#each languages as language}
          <SelectItem value={language} />
        {/each}
      </Select>
    </div>

    {#if showNotification}
      <div transition:fade>
        <InlineNotification
          {timeout}
          kind="success"
          lowContrast
          subtitle={$t('page.jokes.jokeCreatedSnackbar')}
          class="mt2"
          on:close={() => {
            timeout = undefined;
            open = false;
          }}
        />
      </div>
    {/if}
  {:else}
    <p>Locale initializing...</p>
  {/if}
</Modal>
