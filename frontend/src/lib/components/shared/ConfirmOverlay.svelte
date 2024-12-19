<script lang="ts">
  import Button, { Label } from '@smui/button';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
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

<Dialog
  bind:open
  aria-labelledby="question_title"
  aria-describedby="question_content"
>
  <Title id="question_title">{questionHeader}</Title>
  <Content id="question_content">{questionContent}</Content>
  <Actions>
    <Button on:click={executeNoAction}>
      <Label>{noActionText}</Label>
    </Button>
    <Button on:click={executeYesAction}>
      <Label>{yesActionText}</Label>
    </Button>
  </Actions>
</Dialog>

<style lang="scss">
</style>
