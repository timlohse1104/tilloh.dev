import * as universal from '../entries/pages/memorandum/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/memorandum/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/memorandum/+page.ts";
export const imports = ["_app/immutable/nodes/5.reRzh9Ux.js","_app/immutable/chunks/scheduler.7fJTJATM.js","_app/immutable/chunks/index.ESpeO4IN.js","_app/immutable/chunks/Svg.VExdKD0h.js","_app/immutable/chunks/IconButton.kbYpcAUG.js","_app/immutable/chunks/index.UshG1r0L.js","_app/immutable/chunks/classAdderBuilder.qFeSpoFo.js"];
export const stylesheets = ["_app/immutable/assets/5.gBk-hWzX.css"];
export const fonts = [];
