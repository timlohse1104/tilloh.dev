<script lang="ts">
  import { backgroundStore } from '$lib/util/stores/store-background';
  import { t } from '$lib/util/translations';
  import DashboardCard from '../admin/DashboardCard.svelte';
  import BackgroundColorPicker from './BackgroundColorPicker.svelte';
  import BackgroundSwitch from './BackgroundSwitch.svelte';
  import LanguageSwitch from './LanguageSwitch.svelte';
  import ThemeSwitch from './ThemeSwitch.svelte';

  $: isBackgroundPlain = $backgroundStore === 'default' ? true : false;
</script>

<section>
  <DashboardCard
    header={$t('page.settings.dashboard.theme.header')}
    description={$t('page.settings.dashboard.theme.description')}
  >
    <ThemeSwitch />
  </DashboardCard>
  <DashboardCard
    header={$t('page.settings.dashboard.language.header')}
    description={$t('page.settings.dashboard.language.description')}
  >
    <LanguageSwitch />
  </DashboardCard>
  <DashboardCard
    header={$t('page.settings.dashboard.background.header')}
    description={$t('page.settings.dashboard.background.description')}
  >
    <BackgroundSwitch />
  </DashboardCard>

  {#if isBackgroundPlain}
    <DashboardCard
      header={$t('page.settings.dashboard.background.color.header')}
      description={$t('page.settings.dashboard.background.color.description')}
    >
      <BackgroundColorPicker />
    </DashboardCard>
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    max-width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
