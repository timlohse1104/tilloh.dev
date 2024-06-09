<script lang="ts">
  import { utilityRoutes } from '$lib/config/applications';
  import { isEnter } from '$lib/util/helper.js';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';

  const { admin: adminRoute } = utilityRoutes;
  let tempAdminId = '';

  function verifyId() {
    console.log('verifyId: ', tempAdminId);
  }
</script>

<svelte:head>
  <title>{adminRoute.name}</title>
  <meta name={adminRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  <div class="main-content">
    <h1>Admin Panel</h1>

    <p>Admin ID: {tempAdminId}</p>

    <Textfield
      variant="outlined"
      bind:value={tempAdminId}
      label="Admin ID"
      style="margin-top: 1rem; width: 100%"
      on:keyup={(event) => {
        if (isEnter(event)) verifyId();
      }}
    >
      <Icon class="material-icons" slot="leadingIcon">fingerprint</Icon>
    </Textfield>
  </div>
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.8;

    .main-content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: 2rem;
    }
  }
</style>
