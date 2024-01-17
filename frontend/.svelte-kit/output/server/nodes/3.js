import * as universal from '../entries/pages/about/_page.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/about/+page.ts";
export const imports = ["_app/immutable/nodes/3.bQXd1R1y.js","_app/immutable/chunks/scheduler.L3ee0gTq.js","_app/immutable/chunks/index.6n1W-5BD.js"];
export const stylesheets = ["_app/immutable/assets/3.K6EPUmo2.css"];
export const fonts = [];
