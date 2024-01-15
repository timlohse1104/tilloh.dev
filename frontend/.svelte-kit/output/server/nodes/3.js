import * as universal from '../entries/pages/about/_page.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/about/+page.ts";
export const imports = ["_app/immutable/nodes/3.ShdHB99f.js","_app/immutable/chunks/environment.30ImaL5r.js","_app/immutable/chunks/scheduler.wABwkFYf.js","_app/immutable/chunks/index.3gQ9iq04.js"];
export const stylesheets = [];
export const fonts = [];
