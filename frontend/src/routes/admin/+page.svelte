<script lang="ts">
  import { verifyAdminId } from '$lib/api/admin.api';
  import { deleteIdentifier, getIdentifiers } from '$lib/api/identifiers.api';
  import { utilityRoutes } from '$lib/config/applications';
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import { isEnter } from '$lib/util/helper.js';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import Dashboard from './content/Dashboard.svelte';
  import Identifiers from './content/Identifiers.svelte';

  const { admin: adminRoute } = utilityRoutes;
  let adminToken = '';
  let isVerified = false;
  let verificationError = '';
  let identifiers: IdentifierDto[] = [];

  async function verifyId() {
    const verifyResponse = await verifyAdminId(adminToken);

    if (!verifyResponse && verifyResponse?.statusCode !== 200) {
      console.error('Error verifying admin ID');
      isVerified = false;
      return;
    }

    const { isAdmin } = verifyResponse;
    if (!isAdmin) {
      verificationError = 'Admin ID konnte nicht verifiziert werden.';
      isVerified = false;
      return;
    }
    isVerified = verifyResponse.isAdmin;
    loadIdentifiers();
  }

  const loadIdentifiers = async () => {
    identifiers = await getIdentifiers(adminToken);
    console.log({ identifiers }, 'Identifiers reloaded.');
  };

  const removeIdentifier = async (event) => {
    const { identifierId } = event.detail;
    try {
      await deleteIdentifier(adminToken, identifierId);
    } catch (error) {
      console.error('Error deleting identifier', error);
      return;
    }

    const deletedIdentifier = identifiers.find(
      (identifier) => identifier._id === identifierId,
    );
    console.log({ deletedIdentifier }, 'Identifier deleted.');
    identifiers = identifiers.filter(
      (identifier) => identifier._id !== identifierId,
    );
  };
</script>

<svelte:head>
  <title>{adminRoute.name}</title>
  <meta name={adminRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  <div class="main-content">
    {#if !isVerified}
      <Textfield
        variant="outlined"
        bind:value={adminToken}
        label="Admin ID"
        style="margin-top: 1rem; width: 100%; max-width: 300px;"
        on:keyup={(event) => {
          if (isEnter(event)) verifyId();
        }}
      >
        <Icon class="material-icons" slot="leadingIcon">fingerprint</Icon>
        <Icon class="material-icons" slot="trailingIcon"
          >arrow_circle_right</Icon
        >
        <HelperText
          persistent
          slot="helper"
          style="color: red; font-size: 0.8rem;">{verificationError}</HelperText
        >
      </Textfield>
    {:else}
      <h1>Admin Panel</h1>

      <Dashboard identifierAmount={identifiers.length} />
      <Identifiers
        {identifiers}
        on:reloadIdentifiers={loadIdentifiers}
        on:removeIdentifier={removeIdentifier}
      />
    {/if}
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
      text-align: center;
    }
  }
</style>
