import * as server from '../entries/pages/sverdle/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/sverdle/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.2KI5RQWU.js","_app/immutable/chunks/scheduler.wABwkFYf.js","_app/immutable/chunks/index.3gQ9iq04.js","_app/immutable/chunks/entry.v6MB4tcA.js"];
export const stylesheets = ["_app/immutable/assets/6.zpJKtCAG.css"];
export const fonts = [];
