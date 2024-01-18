import * as universal from '../entries/pages/about/_page.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/about/+page.ts";
export const imports = ["_app/immutable/nodes/3.T61yH0Si.js","_app/immutable/chunks/scheduler.7fJTJATM.js","_app/immutable/chunks/index.ESpeO4IN.js"];
export const stylesheets = ["_app/immutable/assets/3.K6EPUmo2.css"];
export const fonts = [];
