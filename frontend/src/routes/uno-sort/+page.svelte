<script lang="ts">
  import Button, { Label } from '@smui/button';
  import { Icon } from '@smui/common';
  import Textfield from '@smui/textfield';
  import Tooltip from '@smui/tooltip/src/Tooltip.svelte';
  import Wrapper from '@smui/tooltip/src/Wrapper.svelte';
  import { onMount } from 'svelte';
  import { applicationRoutes } from '../../lib/config/applications';
  import { UnoSort } from './classes/uno-sort';

  const { 'uno-sort': unoSortRoute } = applicationRoutes;
  const sortInfotext = `
    1. Farbkarten werden nach ihrer Anzahl auf der Hand sortiert, die Farbe mit den geringsten Karten ist ganz links.<br/>
    2. Farbkarten werden innerhalb der Farbe nach ihrer Wertigkeit aufsteigend sortiert.<br/>
    3. Farben mit der gleichen Anzahl an Karten werden nach ihrer Gesamt-Wertigkeit sortiert.<br/>
    4. Schwarze Karten werden immer ganz rechts gehalten.<br/>
  `;

  let handSizeElement;
  let stackSizeElement;
  let handDivElement;
  let unoSort;
  let pickAmount = 1;

  $: stackSize = unoSort?.getStackSize();

  function pickCards(amount: number) {
    unoSort.pickCards(amount);
    unoSort.sortHand();
    unoSort.printHand();
    unoSort.printStackSize();
  }

  function reset() {
    handSizeElement.innerHTML = '0';
    stackSizeElement.innerHTML = '';
    handDivElement.innerHTML = '';
    unoSort = new UnoSort(handDivElement, stackSizeElement, handSizeElement);
    unoSort.start(7);
  }

  onMount(() => {
    unoSort = new UnoSort(handDivElement, stackSizeElement, handSizeElement);
    unoSort.start(7);
  });
</script>

<svelte:head>
  <title>{unoSortRoute.name}</title>
  <meta name={unoSortRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  <div class="uno-header">
    <h1>UNO</h1>

    <div class="sort-header">
      <h2>Sortierungsregeln</h2>
      <div class="sort-info-icon">
        <Wrapper>
          <Icon class="material-icons">info</Icon>
          <Tooltip xPos="start" yPos="below">
            {@html sortInfotext}
          </Tooltip>
        </Wrapper>
      </div>
    </div>

    <p class="rule-info">
      {@html sortInfotext}
    </p>
    <div class="uno-menu">
      <Textfield
        bind:value={pickAmount}
        type="number"
        input$max={stackSize}
        input$min="0"
        suffix={`Karte${pickAmount > 1 ? 'n' : ''}`}
      />
      <Button on:click={() => pickCards(pickAmount)} variant="raised">
        <Label>ziehen</Label>
      </Button>
      <Button on:click={reset} variant="outlined">
        <Label>Zurücksetzen</Label>
      </Button>
    </div>
  </div>

  <div class="uno-card-area">
    <div class="stack-area">
      <p class="label">
        Stapel <span class="card-amount-info" bind:this={stackSizeElement}
        ></span>
      </p>

      <br />
      <div class="uno-card" id="stack">
        <div class="card-title-background">
          <p class="uno-card-title">UNO</p>
        </div>
      </div>
    </div>

    <div>
      <p class="label">
        Hand des Spielers <span
          class="card-amount-info"
          bind:this={handSizeElement}
        ></span>
      </p>

      <br />

      <div id="player-hand" bind:this={handDivElement}></div>
    </div>
  </div>
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    padding: 1rem;
  }

  .uno-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .sort-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .sort-info-icon {
    display: none;
    cursor: pointer;
    color: var(--light80);

    @media #{$phone} {
      display: block;
    }
  }

  .uno-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .rule-info {
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    margin: 1rem;

    @media #{$phone} {
      display: none;
    }
  }

  .stack-area {
    @media #{$phone} {
      display: none;
    }
  }

  :global(.uno-card) {
    box-shadow: var(--sharpen);
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

  :global(.card-title-background) {
    position: relative;
    width: 90px;
    height: 100px;
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

  :global(.uno-card-title) {
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    text-shadow: 0 0 5px black;
  }

  :global(.uno-card-digit-top-left) {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    font-size: 0.75em;
    font-weight: bold;
    text-shadow: 0 0 5px black;
    width: min-content;
  }

  :global(.uno-card-digit-bottom-right) {
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
    font-size: 0.75em;
    font-weight: bold;
    text-shadow: 0 0 5px black;
    width: min-content;
    transform: rotate(180deg);
  }

  #player-hand {
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

  .uno-card-area {
    overflow-y: auto;
    display: flex;
    height: 53vh;
    gap: 2rem;

    @media #{$phone} {
      flex-direction: column;
      height: 45vh;
    }

    @media #{$tablet} {
      height: 45vh;
    }
  }

  .card-amount-info {
    font-size: 0.5em;
    font-weight: normal;
  }
</style>
