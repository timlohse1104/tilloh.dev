<script lang="ts">
  import { initialized, t } from '$lib/util/translations';
  import Button, { Label } from '@smui/button';
  import Icon from '@smui/textfield/icon';
</script>

{#if $initialized}
  <div class="toggled_application_info_outer">
    <div class="toggled_application_info_inner">
      <Icon class="material-icons toggled_application_icon">construction</Icon>
      <h2>{$t('page.shared.toggledSiteHeadline')}</h2>
      <p>{$t('page.shared.toggledSiteTryAgainText')}</p>
      <div class="back_button">
        <Button
          color="secondary"
          variant="outlined"
          href="/"
          style="text-decoration: none;"
        >
          <Icon class="material-icons">home</Icon>
          <Label>{$t('page.shared.toggledSiteBackButtonText')}</Label>
        </Button>
      </div>
    </div>
  </div>
{:else}
  <div class="toggled_application_info_outer">Locale initializing...</div>
{/if}

<style lang="scss">
  .toggled_application_info_outer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }

  .toggled_application_info_inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.toggled_application_icon) {
    font-size: 5rem;
    color: var(--light80);
  }

  .back_button {
    margin-top: 3rem;
  }
</style>
