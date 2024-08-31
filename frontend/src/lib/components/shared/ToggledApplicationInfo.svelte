<script lang="ts">
  import { initialized, t } from '$lib/util/translations';
  import Button, { Label } from '@smui/button';
  import Icon from '@smui/textfield/icon';
</script>

<div class="toggled-application-info-outer">
  <div class="toggled-application-info-inner">
    <Icon class="material-icons toggled-application-icon">construction</Icon>
    {#if $initialized}
      <h2>{$t('page.shared.toggledSiteHeadline')}</h2>
      <p>{$t('page.shared.toggledSiteTryAgainText')}</p>
      <div class="back-button">
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
    {:else}
      <h3>Locale initializing...</h3>
    {/if}
  </div>
</div>

<style lang="scss">
  .toggled-application-info-outer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }

  .toggled-application-info-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.toggled-application-icon) {
    font-size: 5rem;
    color: var(--light80);
  }

  .back-button {
    margin-top: 3rem;
  }
</style>
