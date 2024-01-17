import { c as create_ssr_component } from "../../../chunks/ssr.js";
const css = {
  code: "#gameScreen.svelte-nixbjo{border:1px solid grey;box-shadow:1px 5px 10px;height:100%;margin:0 auto}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-oi96ow_START -->${$$result.title = `<title>Catch-em-all</title>`, ""}<meta name="description" content="Catch-em-all"><meta name="ssr" content="false"><!-- HEAD_svelte-oi96ow_END -->`, ""} <div class="headline" data-svelte-h="svelte-1q3eupa"><h1>Catch-em-all</h1></div> <canvas id="gameScreen" class="svelte-nixbjo"></canvas>`;
});
export {
  Page as default
};
