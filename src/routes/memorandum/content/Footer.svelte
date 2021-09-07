<script>
</script>

<footer>
  <span>Created by Tilloh. Made with ♥</span>
  <span
    >Special thanks to Team Assets - Nico, Christian, Jurij, Philipp, Patrick</span
  >
</footer>

<style type="scss">
  @import "./_variables";

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $black80;
    color: $lightgrey80;
    padding: 0 20px;
    font-size: 14px;

    @media #{$tablet} {
      font-size: 12px;
    }

    @media #{$phone} {
      font-size: 10px;
    }
  }

  :global(body.light-theme) footer {
    background-color: $light80;
    color: $darkgrey80;
  }
</style>
