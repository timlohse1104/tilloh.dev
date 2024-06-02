<script lang="ts">
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import { onMount } from 'svelte';
  import { routes } from '../../lib/config/applications';
  import { UnoSort } from './classes/uno-sort';

  const { 'uno-sort': unoSortRoute } = routes;

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

    <h2>Sortierungsregeln</h2>
    <p class="rule-info">
      1. Farbkarten werden nach ihrer Anzahl auf der Hand sortiert, die Farbe
      mit den geringsten Karten ist ganz links. <br />
      2. Farbkarten werden innerhalb der Farbe nach ihrer Wertigkeit aufsteigend
      sortiert. <br />
      3. Farben mit der gleichen Anzahl an Karten werden nach ihrer Gesamt-Wertigkeit
      sortiert. <br />
      4. Schwarze Karten werden immer ganz rechts gehalten. <br />
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

  <hr />

  <div class="uno-card-area">
    <div>
      <p class="label">
        Stapel <span id="stackSize" bind:this={stackSizeElement}></span>
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
        Hand des Spielers <span id="handSize" bind:this={handSizeElement}
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
      // display: none;
      width: 50%;
      margin-bottom: 1rem;
    }
  }

  .rule-info {
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    margin: 1rem;
  }

  hr {
    border: 1px solid var(--white30);
    width: 75%;

    @media #{$tablet} {
      width: 85%;
    }

    @media #{$phone} {
      width: 95%;
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
  }

  :global(.card-title-background) {
    position: relative;
    width: 70px;
    height: 110px;
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

  #player-hand {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: stretch;
  }

  .label,
  span {
    margin: 1rem;
    font-size: 24px;
    font-weight: bold;
  }

  #stack {
    background-color: black;
    color: white;
  }

  .uno-card-area {
    overflow-y: auto;
    display: flex;
    height: 53vh;
  }
</style>
