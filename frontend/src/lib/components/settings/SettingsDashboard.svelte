<script lang="ts">
  import { t } from '$lib/util/translations';
  import DashboardCard from '../admin/DashboardCard.svelte';
  import LanguageSwitch from '../shared/LanguageSwitch.svelte';
  import ThemeSwitch from '../shared/ThemeSwitch.svelte';
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
