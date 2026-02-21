<script lang="ts">
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';

  let {
    open = $bindable(false),
    questionHeader,
    questionContent,
    noActionText,
    noAction = undefined,
    yesActionText,
    yesAction = undefined,
    onClose
  } = $props();

  const executeNoAction = () => {
    if (noAction) {
      noAction();
    }
    onClose();
  };

  const executeYesAction = () => {
    if (yesAction) {
      yesAction();
    }
    onClose();
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
