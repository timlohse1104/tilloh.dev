<script lang="ts">
  import Card, { Content } from '@smui/card';
  // const dispatch = createEventDispatcher();

  // export let adminToken: string;
  export let identifierAmount: number;
</script>

<section>
  <div class="dashboard-content">
    <h2>Dashboard</h2>

    <div class="identifiers-overview">
      <Card>
        <Content>
          <h3>Identifiers</h3>
          <p>{identifierAmount}</p></Content
        >
      </Card>
    </div>
  </div>
</section>

<style lang="scss">
</style>
