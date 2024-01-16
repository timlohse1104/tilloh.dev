import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2._x0Kbwuk.js","_app/immutable/chunks/scheduler.ZYyOQGSR.js","_app/immutable/chunks/index.hJxheIky.js","_app/immutable/chunks/Svg.tCo6DiIL.js","_app/immutable/chunks/stores.yabhuQlD.js","_app/immutable/chunks/entry.p85PCMl3.js"];
export const stylesheets = ["_app/immutable/assets/2.5VFvxlie.css"];
export const fonts = [];
