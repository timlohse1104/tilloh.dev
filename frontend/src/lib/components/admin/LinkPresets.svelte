<script lang="ts">
  import { adminLinkPresetStore } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import CopyButton from 'carbon-components-svelte/src/CopyButton/CopyButton.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Link from 'carbon-icons-svelte/lib/Link.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import User from 'carbon-icons-svelte/lib/User.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  const dispatch = createEventDispatcher();

  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

  const triggerNotification = (id: string) => {
    notificationInfoText = $t('page.admin.copiedToClipboard', {
      id,
    });
    timeout = 3_000;
  };
</script>

{#if $initialized}
  <section class="admin_sections">
    <div class="admin_sections_headline">
      <h2>
        {$t('page.admin.linkPresets.title')}
        <span>({$adminLinkPresetStore.length})</span>
      </h2>
    </div>
    <Accordion class="mt1">
      {#each $adminLinkPresetStore as linkPreset}
        <AccordionItem>
          <svelte:fragment slot="title">
            <div class="admin_list_item_headline">
              <svelte:component this={Link} />
              {linkPreset.key}
              -
              <svelte:component this={User} />
              {linkPreset.identifier}
            </div>
          </svelte:fragment>
          <div class="admin_list_item_content">
            <div>
              <p>
                ✨{new Date(linkPreset.created).toLocaleString('de-DE')}
                📅{new Date(linkPreset.updated).toLocaleString('de-DE')}
              </p>
              <p>
                🆔{linkPreset._id}
              </p>
            </div>
            <div class="admin_list_button_group">
              <CopyButton
                text={linkPreset._id}
                feedback="✅"
                feedbackTimeout={0}
                iconDescription="TODO"
                on:click={() => triggerNotification(linkPreset._id)}
              />
              <Button
                kind="danger"
                size="field"
                iconDescription="TODO"
                icon={TrashCan}
                on:click={() =>
                  dispatch('removeLinkPresets', {
                    identifier: linkPreset.identifier,
                    key: linkPreset.key,
                    keyId: linkPreset._id,
                  })}
              />
            </div>
          </div>
        </AccordionItem>
      {/each}
    </Accordion>

    {#if showNotification}
      <div transition:fade>
        <InlineNotification
          {timeout}
          kind="info-square"
          subtitle={notificationInfoText}
          class="inline_notification"
          on:close={(e) => {
            timeout = undefined;
            notificationInfoText = undefined;
          }}
        />
      </div>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}
