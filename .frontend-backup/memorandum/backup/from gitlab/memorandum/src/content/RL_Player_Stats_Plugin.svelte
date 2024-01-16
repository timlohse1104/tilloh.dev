<script>
  const PLACEHOLDER_TEXT = "Rocket League Player ID";
  let player_id = "";
  $: api_url = `https://api.tilloh.dev/player_stats/${player_id}`;

  function loadPlayerStats() {
    if (player_id) window.open(api_url, "_blank");
  }
</script>

<div id="wrapperBox">
  <img
    id="statsImg"
    alt="Input a player id to "
    src="../images/white_rl_player_stats.png"
  />
  <form on:submit|preventDefault={loadPlayerStats}>
    <input
      bind:value={player_id}
      required={true}
      placeholder={PLACEHOLDER_TEXT}
    />
  </form>
</div>

<style type="text/scss">
  @import "./variables.scss";
  @import "./mixins.scss";

  #wrapperBox {
    @include menu-item-box;
    display: flex;
    flex-grow: 1;
  }

  form {
    margin: 0;
    display: flex;
    align-items: center;
    input {
      margin: 0;
    }
  }

  :global(body.light-theme) #wrapperBox {
    &:hover {
      background-color: $light50;
    }
  }

  img {
    border: none;
    height: 90%;
    width: auto;

    &:hover {
      content: url("../images/white_rl_player_stats.png");
    }
  }

  :global(body.light-theme) #statsImg {
    content: url("../images/black_rl_player_stats.png");

    &:hover {
      content: url("../images/black_rl_player_stats.png");
    }
  }
</style>
