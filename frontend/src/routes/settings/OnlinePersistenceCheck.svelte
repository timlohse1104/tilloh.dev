<script lang="ts">
  import { isOnlinePersistenceStore } from '$lib/util/stores';
  import FormField from '@smui/form-field';
  import Switch from '@smui/switch';
</script>

<section>
  <h2>Offline / Online Speicherung</h2>
  <p>
    Diese Website enthält einige Seiten, die es dir erlauben, Zwischenstände zu
    speichern. Im Memorandum gibt es deine benutzerdefinierten Ordner und Links
    und in Catch-Em-All gibt es deinen Highscore. Sollen diese Informationen
    online gespeichert werden, sodass du von jedem anderen Gerät darauf
    zugreifen kannst?
  </p>

  <FormField>
    <Switch bind:checked={$isOnlinePersistenceStore} icons={false} />
    <span slot="label">Daten zwischen Geräten teilen?</span>
  </FormField>
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
    color: var(--color-text);

    span {
      color: var(--color-text);
    }
  }
</style>
