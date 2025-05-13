<script lang="ts">
  import { Modal } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let open = false;
  export let questionHeader;
  export let questionContent;
  export let noActionText;
  export let noAction = undefined;
  export let yesActionText;
  export let yesAction = undefined;

  const executeNoAction = () => {
    if (noAction) {
      noAction();
    }
    dispatch('close');
  };

  const executeYesAction = () => {
    if (yesAction) {
      yesAction();
    }
    dispatch('close');
  };
</script>

<Modal
  bind:open
  modalHeading={questionHeader}
  primaryButtonText={yesActionText}
  secondaryButtonText={noActionText}
  on:click:button--primary={executeYesAction}
  on:click:button--secondary={executeNoAction}
>
  <p class="mb1">
    {questionContent}
  </p>
</Modal>
