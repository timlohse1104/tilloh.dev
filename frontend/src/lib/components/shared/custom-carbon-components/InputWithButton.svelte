<script lang="ts">
  import { isEnter } from '$lib/util/helper';
  import { initialized } from '$lib/util/translations';
  import { Button, TextInput } from 'carbon-components-svelte';

  export let value;
  export let placeholder = '';
  export let helperText = '';
  export let labelText = '';
  export let icon;
  export let iconDescription = '';
  export let action;
  export let kind:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'ghost'
    | 'danger'
    | 'danger-tertiary'
    | 'danger-ghost' = 'tertiary';
  export let customClasses = '';
  export let customStyle = '';
</script>

{#if $initialized}
  <section class={customClasses} style={customStyle}>
    <TextInput
      bind:value
      {placeholder}
      {helperText}
      {labelText}
      on:keyup={(event) => {
        if (isEnter(event)) {
          action();
        }
      }}
    />
    <Button
      {kind}
      size="field"
      {iconDescription}
      {icon}
      on:click={action}
      disabled={value ? false : true}
    />
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    display: flex;
    justify-content: center;
    align-items: end;
  }
</style>
