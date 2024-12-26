<script lang="ts">
  import { verifyAdminId } from '$lib/api/admin.api';
  import { isEnter } from '$lib/util/helper';
  import { t } from '$lib/util/translations';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';

  export let isAdmin: boolean = false;
  export let token: string = '';
  export let isVerified: boolean = false;

  let verificationError: string = '';

  const verifyId = async () => {
    const verifyResponse = await verifyAdminId(token);

    if (!verifyResponse && verifyResponse?.statusCode !== 200) {
      console.error('Error verifying admin ID');
      isVerified = false;
      return;
    }

    const { isAdmin } = verifyResponse;
    if (!isAdmin) {
      verificationError = $t('page.admin.verificationError');
      isVerified = false;
      return;
    }
    isVerified = verifyResponse.isAdmin;
  };
</script>

<div class="verify_content">
  <Textfield
    variant="outlined"
    bind:value={token}
    label="Admin ID"
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
</style>
