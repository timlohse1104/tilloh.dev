import * as universal from '../entries/pages/memorandum/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/memorandum/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/memorandum/+page.ts";
export const imports = ["_app/immutable/nodes/5.X6v3brRP.js","_app/immutable/chunks/scheduler.L3ee0gTq.js","_app/immutable/chunks/index.6n1W-5BD.js","_app/immutable/chunks/Svg.VkJ7zRc_.js","_app/immutable/chunks/IconButton.a0JQl0R_.js","_app/immutable/chunks/index.YyQYkOuZ.js","_app/immutable/chunks/classAdderBuilder.eU7pa9cK.js"];
export const stylesheets = ["_app/immutable/assets/5.LWmNAJkW.css"];
export const fonts = [];
