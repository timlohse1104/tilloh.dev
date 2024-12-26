<script lang="ts">
  import { verifyAdminId, verifyUserId } from '$lib/api/admin.api';
  import { isEnter } from '$lib/util/helper';
  import { t } from '$lib/util/translations';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';

  export let isAdminRoute: boolean = false;
  export let token: string = '';
  export let isVerified: boolean = false;

  let verificationError: string = '';

  const verifyId = async () => {
    const verifyResponse = isAdminRoute
      ? await verifyAdminId(token)
      : await verifyUserId(token);

    if (!verifyResponse && verifyResponse?.statusCode !== 200) {
      console.error(`Error verifying ${isAdminRoute ? 'admin' : 'user'} ID`);
      isVerified = false;
      return;
    }

    const { isVerifiedUser } = verifyResponse;
    if (!isVerified) {
      verificationError = isAdminRoute
        ? $t('page.shared.admin.verificationError')
        : $t('page.shared.user.verificationError');
      isVerified = false;
      return;
    }
    isVerified = isVerifiedUser;
  };
</script>

<div class="verify_content">
  <Textfield
    variant="outlined"
    bind:value={token}
    label={isAdminRoute ? 'Admin ID' : 'User ID'}
    style="margin-top: 1rem; width: 100%; max-width: 300px;"
    on:keyup={(event) => {
      if (isEnter(event)) verifyId();
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
