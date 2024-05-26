<script lang="ts">
  import Button, { Label } from '@smui/button';
  import { Icon } from '@smui/fab';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import { onMount } from 'svelte';
  import { routes } from '../../lib/config/applications';
  import { UnoSort } from './classes/uno-sort';

  const { 'uno-sort': unoSortRoute } = routes;

  let handSizeElement;
  let stackSizeElement;
  let handDivElement;
  let unoSort;

  function pickCard() {
    unoSort.pickCards(1);
    unoSort.sortHand();
    unoSort.printHand();
    unoSort.printStackSize();
  }

  function pickTwoCards() {
    unoSort.pickCards(2);
    unoSort.sortHand();
    unoSort.printHand();
    unoSort.printStackSize();
  }

  function pickFourCards() {
    unoSort.pickCards(4);
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
  <h1>UNO</h1>

  <br /><br />
  <Button on:click={pickCard} variant="raised">
    <Label>Karte ziehen</Label>
  </Button>
  <Button on:click={pickTwoCards} variant="raised">
    <Label>Zwei Karten ziehen</Label>
  </Button>
  <Button on:click={pickFourCards} variant="raised">
    <Label>Vier Karten ziehen</Label>
  </Button>
  <Button on:click={reset} variant="outlined">
    <Label>Zurücksetzen</Label>
  </Button>
  <Wrapper>
    <Button color="secondary" variant="outlined">
      <Icon class="material-icons">info</Icon>
      <Label>Info</Label>
      <Tooltip xPos="start" yPos="below">
        Sortierungsregeln: <br />
        1. Farbkarten werden nach ihrer Anzahl auf der Hand sortier, die Farbe mit
        den geringsten Karten beginnt. <br />
        2.Zahlenkarten werden nach ihrer Zahl aufsteigend sortiert. <br />
        3. Sonderkarten werden aufgrund ihrer Wertigkeit immer ans Ende der Farbe
        sortiert.
      </Tooltip>
    </Button>
  </Wrapper>
  <hr />

  <div class="uno-cardArea">
    <div>
      <p class="label">
        Stapel <span id="stackSize" bind:this={stackSizeElement}></span>
      </p>

      <br />
      <div class="uno-card" id="stack">
        <p class="uno-cardTitle">UNO</p>
      </div>
    </div>

    <div>
      <p class="label">
        Hand des Spielers <span id="handSize" bind:this={handSizeElement}
        ></span>
      </p>

      <br />

      <div id="playerHand" bind:this={handDivElement}></div>
    </div>
  </div>
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    padding: 1rem;
  }

  h1 {
    margin: auto;
    width: 25%;
    text-align: center;
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
      display: none;
    }
  }

  :global(.uno-card) {
    box-shadow: var(--sharpen);
    border: 1px solid var(--white30);
    padding: 0.5rem;
    display: grid;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 120px;
    font-size: xx-large;
    margin: 0 0 12px 12px;
  }

  :global(.uno-cardTitle) {
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    text-shadow: var(--black80) 2px 2px 5px;
  }

  .uno-card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  #playerHand {
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

  .uno-cardArea {
    overflow-y: auto;
    display: flex;
    height: 65vh;
  }
</style>
