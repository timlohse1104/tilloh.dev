<script lang="ts">
  import { onMount } from 'svelte';
  import { UnoSort } from './classes/uno-sort';

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

  onMount(() => {
    unoSort = new UnoSort(handDivElement, stackSizeElement, handSizeElement);
    unoSort.start(7);
  });
</script>

<svelte:head>
  <title>Uno Sort</title>
  <meta name="uno-sort" content="Uno Sort" />
</svelte:head>

<section>
  <h1>UNO</h1>
  <p class="label" id="section1">Aktionen</p>
  <br />
  <button id="pickCard" on:click={pickCard}>Karte ziehen</button>
  <button id="pickTwoCards" on:click={pickTwoCards}>Zwei Karten ziehen</button>
  <button id="pickFourCards" on:click={pickFourCards}>Vier Karten ziehen</button
  >
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
    font-size: 8em;
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
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    border: 1px solid #2d2d2d;
    padding: 1rem;
    display: grid;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 150px;
    font-size: xx-large;
    margin: 0 0 12px 12px;
  }

  :global(.uno-cardTitle) {
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    text-shadow: var(--darkgrey80) 0 0 5px;
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

  button {
    padding: 1rem;
    margin: 1rem;
  }

  #stack {
    background-color: black;
    color: white;
  }

  .uno-cardArea {
    overflow: auto;
    display: flex;
  }
</style>
