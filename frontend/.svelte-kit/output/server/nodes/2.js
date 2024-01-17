import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.TZA2weFF.js","_app/immutable/chunks/scheduler.L3ee0gTq.js","_app/immutable/chunks/index.6n1W-5BD.js","_app/immutable/chunks/Svg.VkJ7zRc_.js","_app/immutable/chunks/classAdderBuilder.eU7pa9cK.js","_app/immutable/chunks/stores.bHyO-bvi.js","_app/immutable/chunks/entry.0k9DXXSf.js","_app/immutable/chunks/index.YyQYkOuZ.js"];
export const stylesheets = ["_app/immutable/assets/2.5VFvxlie.css"];
export const fonts = [];
