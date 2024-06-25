<script lang="ts">
  import { sharedIdentifierStore } from '$lib/util/stores';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
</script>

<section>
  <h2>Deine Informationen</h2>
  <p>
    Hier findest du deine persönliche ID. Um auf deine Zwischenstände von
    anderen Geräten zugreifen zu können, musst du diese ID kopieren und auf dem
    anderen Gerät eintragen.
  </p>

  <p>
    Bitte beachte, dass diese ID nur für dich bestimmt ist. Solltest du sie an
    andere weitergeben, können diese Personen deine Zwischenstände verändern!
  </p>

  <div class="infoBox">
    <Textfield
      label="Deine persönliche ID"
      value={$sharedIdentifierStore.id}
      style="width: 100%;"
      helperLine$style="width: 100%;"
      disabled
    ></Textfield>
    <IconButton
      on:click={() => navigator.clipboard.writeText($sharedIdentifierStore.id)}
      ><Icon class="material-icons">content_copy</Icon></IconButton
    >
  </div>
</section>

<style lang="scss">
  .infoBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
</style>
