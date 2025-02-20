<script lang="ts">
  import { verifyId } from '$lib/api/admin.api';
  import { isEnter } from '$lib/util/helper';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import { t } from '$lib/util/translations';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';

  export let token: string = '';
  export let isVerified: boolean = false;
  export let isAdminLogin: boolean = false;
  export let callback: () => Promise<void> = async () => {};

  let verificationError: string = '';

  const verify = async () => {
    const verifyResponse = await verifyId(
      token,
      isAdminLogin ? 'admin' : 'user',
    );

    if (!verifyResponse && verifyResponse?.statusCode !== 200) {
      const errorMessage = `Error verifying ${isAdminLogin ? 'admin' : 'user'} ID.`;
      console.error(errorMessage);
      verificationError = $t('page.shared.verificationError');
      isVerified = false;
      return;
    }

    isVerified = verifyResponse.isVerified;
    if (!isVerified) {
      verificationError = isAdminLogin
        ? $t('page.shared.admin.verificationError')
        : $t('page.shared.user.verificationError');
      return;
    }

    if (!isAdminLogin) $identifierStore = token;
    await callback();
  };
</script>

<div class="verify_content">
  <Textfield
    variant="outlined"
    bind:value={token}
    label={isAdminLogin ? 'Admin ID' : 'User ID'}
    style="margin-top: 1rem; width: 100%; max-width: 300px;"
    on:keyup={(event) => {
      if (isEnter(event)) verify();
    }}
  >
    <Icon class="material-icons" slot="leadingIcon">fingerprint</Icon>
    <Icon class="material-icons" slot="trailingIcon">arrow_circle_right</Icon>
    <HelperText slot="helper" style="color: red; font-size: 0.8rem;"
      >{verificationError}</HelperText
    >
  </Textfield>
</div>

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
