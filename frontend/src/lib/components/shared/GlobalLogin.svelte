<script lang="ts">
  // 1. IMPORTS
  import { verifyId } from '$lib/api/admin.api';
  import { isEnter } from '$lib/util/helper';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { t } from '$lib/util/translations';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import PasswordInput from 'carbon-components-svelte/src/TextInput/PasswordInput.svelte';
  import { fade } from 'svelte/transition';

  // 2. PROPS
  let {
    token = $bindable(''),
    isVerified = $bindable(false),
    isAdminLogin = false,
    callback = async () => {}
  } = $props();

  // 3. STATE
  let verificationError = $state('');
  let timeout = $state<number | undefined>(undefined);

  // 4. DERIVED
  const showNotification = $derived(timeout !== undefined);

  // 5. FUNCTIONS
  const verify = async () => {
    const verifyResponse = await verifyId(
      token,
      isAdminLogin ? 'admin' : 'user',
    );

    if (!verifyResponse && verifyResponse?.statusCode !== 200) {
      const errorMessage = `Error verifying ${isAdminLogin ? 'admin' : 'user'} ID.`;
      console.error(errorMessage);
      verificationError = $t('page.shared.verificationError');
      timeout = 3_000;
      isVerified = false;
      return;
    }

    isVerified = verifyResponse.isVerified;
    if (!isVerified) {
      verificationError = isAdminLogin
        ? $t('page.shared.admin.verificationError')
        : $t('page.shared.user.verificationError');
      timeout = 3_000;
      return;
    }

    if (!isAdminLogin) {
      $identifierStore = token;
      celebrate();
    }
    await callback();
  };
</script>

<div class="verify_content">
  <div>
    <PasswordInput
      placeholder={isAdminLogin ? 'Admin ID' : 'User ID'}
      size="xl"
      bind:value={token}
      on:keyup={(event) => {
        if (isEnter(event)) verify();
      }}
    />
  </div>
</div>

{#if showNotification}
  <div transition:fade>
    <InlineNotification
      {timeout}
      kind="error"
      lowContrast
      subtitle={verificationError}
      class="inline_notification"
      on:close={(e) => {
        timeout = undefined;
        token = '';
      }}
    />
  </div>
{/if}

<style lang="scss">
  .verify_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
