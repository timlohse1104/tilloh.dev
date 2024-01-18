import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.gKzekQWq.js","_app/immutable/chunks/scheduler.7fJTJATM.js","_app/immutable/chunks/index.ESpeO4IN.js","_app/immutable/chunks/stores.besRvEek.js","_app/immutable/chunks/entry.M0uqKt0T.js","_app/immutable/chunks/index.UshG1r0L.js","_app/immutable/chunks/IconButton.kbYpcAUG.js","_app/immutable/chunks/Svg.VExdKD0h.js"];
export const stylesheets = ["_app/immutable/assets/0.8ss26YwO.css"];
export const fonts = ["_app/immutable/assets/fira-mono-cyrillic-ext-400-normal.dOGCK5uJ.woff2","_app/immutable/assets/fira-mono-cyrillic-ext-400-normal.NMV33Djq.woff","_app/immutable/assets/fira-mono-cyrillic-400-normal.N-vuOVMo.woff2","_app/immutable/assets/fira-mono-cyrillic-400-normal.6u0pR9ia.woff","_app/immutable/assets/fira-mono-greek-ext-400-normal.rKiNtwjr.woff2","_app/immutable/assets/fira-mono-greek-ext-400-normal.RIQvDbIf.woff","_app/immutable/assets/fira-mono-greek-400-normal.At854Oju.woff2","_app/immutable/assets/fira-mono-greek-400-normal.1HkG0c9P.woff","_app/immutable/assets/fira-mono-latin-ext-400-normal.-l34kfv6.woff2","_app/immutable/assets/fira-mono-latin-ext-400-normal.JVpQ_zQA.woff","_app/immutable/assets/fira-mono-latin-400-normal.yoy1YEIp.woff2","_app/immutable/assets/fira-mono-latin-400-normal.IOFtdsH_.woff"];
