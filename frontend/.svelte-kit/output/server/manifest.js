export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.Rf1LGIWG.js","app":"_app/immutable/entry/app.8KaSPs07.js","imports":["_app/immutable/entry/start.Rf1LGIWG.js","_app/immutable/chunks/entry.v6MB4tcA.js","_app/immutable/chunks/scheduler.wABwkFYf.js","_app/immutable/entry/app.8KaSPs07.js","_app/immutable/chunks/scheduler.wABwkFYf.js","_app/immutable/chunks/index.3gQ9iq04.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/sverdle",
				pattern: /^\/sverdle\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
