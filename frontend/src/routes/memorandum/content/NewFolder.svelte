<script>
</script>

<button on:click on:keydown>
  <section>
    <p>Neuer Ordner</p>
    <p>+</p>
  </section>
</button>

<style lang="scss">
  @import '$lib/styles/_mixins.scss';
  @import '$lib/styles/_variables.scss';

  section {
    display: flex;
    height: calc(100% - 40px);
    margin: $defPadding;
    border: solid 3px $darkgrey80;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $black30;

    &:hover {
      box-shadow: 0 0 20px $white30;
    }

    p {
      color: white;
      text-shadow: 0 0 5px $white30;
      font-size: 50px;
      margin: 0;
      padding: 0;
    }
  }

  // Remove default button styles
  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }
</style>
