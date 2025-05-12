<script lang="ts">
  import { verifyId } from '$lib/api/admin.api';
  import { isEnter } from '$lib/util/helper';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import { t } from '$lib/util/translations';
  import { InlineNotification, PasswordInput } from 'carbon-components-svelte';
  import { fade } from 'svelte/transition';

  export let token: string = '';
  export let isVerified: boolean = false;
  export let isAdminLogin: boolean = false;
  export let callback: () => Promise<void> = async () => {};

  let verificationError: string = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

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

    if (!isAdminLogin) $identifierStore = token;
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
        console.log(e.detail.timeout);
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
