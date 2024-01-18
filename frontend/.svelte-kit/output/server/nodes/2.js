import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.hc-vq-mX.js","_app/immutable/chunks/scheduler.7fJTJATM.js","_app/immutable/chunks/index.ESpeO4IN.js","_app/immutable/chunks/Svg.VExdKD0h.js","_app/immutable/chunks/classAdderBuilder.qFeSpoFo.js","_app/immutable/chunks/stores.besRvEek.js","_app/immutable/chunks/entry.M0uqKt0T.js","_app/immutable/chunks/index.UshG1r0L.js"];
export const stylesheets = ["_app/immutable/assets/2.5VFvxlie.css"];
export const fonts = [];
