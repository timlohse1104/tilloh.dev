

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.2btJjsGI.js","_app/immutable/chunks/scheduler.wABwkFYf.js","_app/immutable/chunks/index.3gQ9iq04.js","_app/immutable/chunks/stores.z3f0SChb.js","_app/immutable/chunks/entry.v6MB4tcA.js"];
export const stylesheets = [];
export const fonts = [];
