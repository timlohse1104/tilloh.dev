import * as universal from '../entries/pages/catch-em-all/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/catch-em-all/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/catch-em-all/+page.ts";
export const imports = ["_app/immutable/nodes/4.CKbg2sHK.js","_app/immutable/chunks/scheduler.L3ee0gTq.js","_app/immutable/chunks/index.6n1W-5BD.js"];
export const stylesheets = ["_app/immutable/assets/4.U9CsSMvX.css"];
export const fonts = [];
