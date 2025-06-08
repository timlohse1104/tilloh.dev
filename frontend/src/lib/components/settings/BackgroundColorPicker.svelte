<script lang="ts">
  import { backgroundColorStore } from '$lib/util/stores/store-background-color';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Popover from 'carbon-components-svelte/src/Popover/Popover.svelte';
  import PaintBrush from 'carbon-icons-svelte/lib/PaintBrush.svelte';
  import ColorPicker from '../shared/ColorPicker.svelte';

  export let customStyle = '';

  let open = false;
  let ref = null;

  const changeBackgroundColor = (rgba) => {
    backgroundColorStore.set(rgba.detail);
  };

  const rgbaToHex = (r, g, b, a) => {
    console.log('hexColor input', r, g, b, a);
    // Ensure RGBA values are within the correct range
    r = Math.min(255, Math.max(0, Math.round(r)));
    g = Math.min(255, Math.max(0, Math.round(g)));
    b = Math.min(255, Math.max(0, Math.round(b)));
    a = Math.min(1, Math.max(0, a));

    // Convert RGB components to hex
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const red = toHex(r);
    const green = toHex(g);
    const blue = toHex(b);

    // Combine into standard hex format
    const hexColor = `#${red}${green}${blue}`;

    // Optionally handle alpha channel
    if (a < 1) {
      const alpha = Math.round(a * 255);
      const alphaHex = toHex(alpha);
      return `${hexColor}${alphaHex}`;
    }

    return hexColor;
  };
</script>

{#if initialized}
  <section style={customStyle} bind:this={ref} style:position="relative">
    <Button
      kind="tertiary"
      iconDescription={$t(
        'page.settings.dashboard.background.color.description',
      )}
      tooltipPosition="right"
      tooltipAlignment="end"
      on:click={() => (open = !open)}
      icon={PaintBrush}
    ></Button>
    <Popover
      bind:open
      highContrast
      caret
      align="bottom-left"
      on:click:outside={({ detail }) => {
        open = ref.contains(detail.target);
      }}
    >
      <ColorPicker
        on:colorChange={changeBackgroundColor}
        startColor={$backgroundColorStore
          ? rgbaToHex(
              $backgroundColorStore?.r,
              $backgroundColorStore?.g,
              $backgroundColorStore?.b,
              $backgroundColorStore?.a,
            )
          : '#161616'}
      />
    </Popover>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    span {
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }
</style>
