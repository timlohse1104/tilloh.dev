import * as universal from '../entries/pages/memorandum/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/memorandum/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/memorandum/+page.ts";
export const imports = ["_app/immutable/nodes/5.T5xhYMhZ.js","_app/immutable/chunks/scheduler.ZYyOQGSR.js","_app/immutable/chunks/index.hJxheIky.js"];
export const stylesheets = [];
export const fonts = [];
