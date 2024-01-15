import * as universal from '../entries/pages/catch-em-all/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/catch-em-all/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/catch-em-all/+page.ts";
export const imports = ["_app/immutable/nodes/4.C3HIZHFh.js","_app/immutable/chunks/environment.30ImaL5r.js","_app/immutable/chunks/scheduler.wABwkFYf.js","_app/immutable/chunks/index.3gQ9iq04.js"];
export const stylesheets = [];
export const fonts = [];
