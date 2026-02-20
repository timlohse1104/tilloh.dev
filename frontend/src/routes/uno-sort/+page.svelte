<script lang="ts">
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { UnoSort } from '$lib/types/uno-sort';
  import { languageStore } from '$lib/util/stores/store-language';
  import { initialized, setLocale, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import NumberInput from 'carbon-components-svelte/src/NumberInput/NumberInput.svelte';
  import { onMount } from 'svelte';

  const { 'uno-sort': unoSortRoute } = applicationRoutes;

  let handSizeElement;
  let stackSizeElement;
  let handDivElement;
  let unoSort;
  let pickAmount = 1;

  $: locale = $languageStore;

  $: stackSize = unoSort?.getStackSize();

  onMount(async () => {
    unoSort = new UnoSort(handDivElement, stackSizeElement, handSizeElement);
    unoSort.start(7);
    await setLocale($languageStore);
  });

  const pickCards = (amount: number) => {
    unoSort.pickCards(amount);
    unoSort.sortHand();
    unoSort.printHand();
    unoSort.printStackSize();
  };

  const reset = () => {
    handSizeElement.innerHTML = '0';
    stackSizeElement.innerHTML = '';
    handDivElement.innerHTML = '';
    unoSort = new UnoSort(handDivElement, stackSizeElement, handSizeElement);
    unoSort.start(7);
  };
</script>

<svelte:head>
  <title>{unoSortRoute.name[locale]}</title>
  <meta name={unoSortRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if unoSortRoute.toggle}
  {#if $initialized}
    <section>
      <div class="uno_header">
        <h1>UNO</h1>

        <div class="sort_header">
          <h2>{$t('page.unoSort.title')}</h2>
        </div>

        <p class="rule_info">
          {@html $t('page.unoSort.rules')}
        </p>
        <div class="uno_menu">
          <NumberInput
            min={0}
            max={stackSize}
            label={`Karte${pickAmount > 1 ? 'n' : ''}`}
            bind:value={pickAmount}
          />

          <Button size="field" on:click={() => pickCards(pickAmount)}>
            {$t('page.unoSort.draw')}
          </Button>
          <Button size="field" kind="tertiary" on:click={reset}>
            {$t('page.shared.reset')}
          </Button>
        </div>
      </div>

      <div class="uno_card_area">
        <div class="stack_area">
          <p class="label">
            {$t('page.unoSort.stack')}
            <span class="card_amount_info" bind:this={stackSizeElement}></span>
          </p>

          <br />
          <div class="uno_card" id="stack">
            <div class="card_title_background">
              <p class="uno_card_title">UNO</p>
            </div>
          </div>
        </div>

        <div>
          <p class="label">
            {$t('page.unoSort.playerHand')}
            <span class="card_amount_info" bind:this={handSizeElement}></span>
          </p>

          <br />

          <div id="player_hand" bind:this={handDivElement}></div>
        </div>
      </div>
    </section>
  {:else}
    <section>Locale initializing...</section>
  {/if}
{:else}
  <ToggledApplicationInfo />
{/if}

<style lang="scss">
  @use '../../lib/styles/variables.scss' as *;

  section {
    padding: 1rem;
  }

  .uno_header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .sort_header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .uno_menu {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin: 1rem;
    gap: 1rem;
  }

  h1 {
    margin: auto;
    width: 25%;
    text-align: center;
    margin-bottom: 3rem;
    color: yellow;
    font-size: 6em;
    transition: 0.5s;
    text-shadow: 0 0 15px black;
    transform-origin: bottom;
    transform: rotate(-25deg);
    text-shadow:
      -2px -1px black,
      -3px -2px black,
      -4px -3px black,
      -5px -4px black,
      -6px -5px black,
      -7px -6px black;

    @media #{$phone} {
      width: 50%;
      margin-bottom: 1rem;
    }
  }

  .rule_info {
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    margin: 1rem;

    @media #{$phone} {
      display: none;
    }
  }

  .stack_area {
    @media #{$phone} {
      display: none;
    }
  }

  :global(.uno_card) {
    border: 5px solid white;
    border-radius: 10px;
    padding: 0.5rem;
    display: grid;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 120px;
    font-size: x-large;
    margin: 0 0 12px 12px;
    position: relative;
  }

  :global(.card_title_background) {
    position: relative;
    width: 45px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(
      circle at top left,
      white 100%,
      transparent 100%
    );
    border-radius: 50px;
    transform: skewX(-25deg);
  }

  :global(.uno_card_title) {
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    text-shadow: 0 0 5px black;
  }

  :global(.uno_card_digit_top_left) {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    font-size: 0.75em;
    font-weight: bold;
    text-shadow: 0 0 5px black;
    width: min-content;
  }

  :global(.uno_card_digit_bottom_right) {
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
    font-size: 0.75em;
    font-weight: bold;
    text-shadow: 0 0 5px black;
    width: min-content;
    transform: rotate(180deg);
  }

  #player_hand {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  .label,
  span {
    font-size: 24px;
    font-weight: bold;
    vertical-align: middle;
  }

  #stack {
    background-color: black;
    color: white;
  }

  .uno_card_area {
    overflow-y: auto;
    display: flex;
    height: 53vh;
    gap: 2rem;

    @media #{$tablet} {
      height: 45vh;
    }

    @media #{$phone} {
      flex-direction: column;
      height: 40vh;
    }
  }

  .card_amount_info {
    font-size: 0.5em;
    font-weight: normal;
  }
</style>
