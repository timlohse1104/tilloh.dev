<script lang="ts">
  // 1. IMPORTS
  import { verifyId } from '$lib/api/admin.api';
  import { isEnter } from '$lib/util/helper';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import PasswordInput from 'carbon-components-svelte/src/TextInput/PasswordInput.svelte';
  import Login from 'carbon-icons-svelte/lib/Login.svelte';
  import { fade } from 'svelte/transition';

  // 2. PROPS
  let {
    token = $bindable(''),
    isVerified = $bindable(false),
    isAdminLogin = false,
    callback = async () => {},
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
  <div class="login_block">
    <div class="branding">
      <img src="/images/logo.png" alt="tilloh.dev logo" class="branding_logo" />
      <h1 class="branding_title">tilloh.dev</h1>
      <p class="branding_tagline">{$t('page.shared.login.tagline')}</p>
    </div>

    <div class="input_row">
      <PasswordInput
        placeholder={isAdminLogin
          ? $t('page.shared.login.adminPlaceholder')
          : $t('page.shared.login.placeholder')}
        showPasswordLabel={$t('page.shared.login.showPasswordLabel')}
        size="xl"
        bind:value={token}
        on:keyup={(event) => {
          if (isEnter(event)) verify();
        }}
      />
      <Button
        kind="primary"
        icon={Login}
        iconDescription="Login"
        on:click={verify}
        class="login_button"
      />
    </div>
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
  @use '../../styles/variables.scss' as *;

  .verify_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .login_block {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    width: 40%;

    @media #{$tablet} {
      width: 60%;
    }

    @media #{$phone} {
      width: 95%;
    }
  }

  .branding {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .branding_logo {
    height: 7.5rem;
    width: auto;
    object-fit: contain;
    // PNG has ~27% transparent padding on each side — shift left to align visual content
    margin-left: calc(-279 / 1024 * 7.5rem + 1rem);
  }

  .branding_title {
    font-size: 2.5rem;
    margin-left: 1rem;
    letter-spacing: 0.08em;
    text-align: left;
  }

  .branding_tagline {
    font-size: 0.95rem;
    opacity: 0.5;
    margin: 0 0 2rem 1rem;
    text-align: left;
    letter-spacing: 0.06em;
  }

  .input_row {
    display: flex;
    align-items: stretch;
    width: 100%;
  }

  :global(.bx--text-input-wrapper) {
    width: 100%;
  }

  :global(.bx--btn.login_button) {
    @include carbon-icon-button;
    min-height: unset;
    height: 100%;
    padding: 0 1rem;
  }
</style>
