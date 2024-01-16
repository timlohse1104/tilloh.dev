export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","images/catch-em-all/Catch_em_all_demobild.png","images/catch-em-all/Catch_em_all_demobild.png:Zone.Identifier","images/catch-em-all/Gotcha.png","images/catch-em-all/Gotcha.png:Zone.Identifier","images/catch-em-all/LookAway.png","images/catch-em-all/LookAway.png:Zone.Identifier","images/catch-em-all/Pokecoin.png","images/catch-em-all/Pokecoin.png:Zone.Identifier","images/catch-em-all/Welcome.png","images/catch-em-all/Welcome.png:Zone.Identifier","images/catch-em-all/favicon.png","images/catch-em-all/favicon.png:Zone.Identifier","images/catch-em-all/pokeballs/master_ball.png","images/catch-em-all/pokeballs/master_ball.png:Zone.Identifier","images/catch-em-all/pokeballs/pokeball.png","images/catch-em-all/pokeballs/pokeball.png:Zone.Identifier","images/catch-em-all/pokeballs/super_ball.png","images/catch-em-all/pokeballs/super_ball.png:Zone.Identifier","images/catch-em-all/pokeballs/ultra_ball.png","images/catch-em-all/pokeballs/ultra_ball.png:Zone.Identifier","images/catch-em-all/pokemons/abra.png","images/catch-em-all/pokemons/abra.png:Zone.Identifier","images/catch-em-all/pokemons/bellsprout.png","images/catch-em-all/pokemons/bellsprout.png:Zone.Identifier","images/catch-em-all/pokemons/bulbasaur.png","images/catch-em-all/pokemons/bulbasaur.png:Zone.Identifier","images/catch-em-all/pokemons/caterpie.png","images/catch-em-all/pokemons/caterpie.png:Zone.Identifier","images/catch-em-all/pokemons/charmander.png","images/catch-em-all/pokemons/charmander.png:Zone.Identifier","images/catch-em-all/pokemons/dratini.png","images/catch-em-all/pokemons/dratini.png:Zone.Identifier","images/catch-em-all/pokemons/eevee.png","images/catch-em-all/pokemons/eevee.png:Zone.Identifier","images/catch-em-all/pokemons/jigglypuff.png","images/catch-em-all/pokemons/jigglypuff.png:Zone.Identifier","images/catch-em-all/pokemons/mankey.png","images/catch-em-all/pokemons/mankey.png:Zone.Identifier","images/catch-em-all/pokemons/meowth.png","images/catch-em-all/pokemons/meowth.png:Zone.Identifier","images/catch-em-all/pokemons/mew.png","images/catch-em-all/pokemons/mew.png:Zone.Identifier","images/catch-em-all/pokemons/pidgey.png","images/catch-em-all/pokemons/pidgey.png:Zone.Identifier","images/catch-em-all/pokemons/pikachu.png","images/catch-em-all/pokemons/pikachu.png:Zone.Identifier","images/catch-em-all/pokemons/psyduck.png","images/catch-em-all/pokemons/psyduck.png:Zone.Identifier","images/catch-em-all/pokemons/rattata.png","images/catch-em-all/pokemons/rattata.png:Zone.Identifier","images/catch-em-all/pokemons/snorlax.png","images/catch-em-all/pokemons/snorlax.png:Zone.Identifier","images/catch-em-all/pokemons/squirtle.png","images/catch-em-all/pokemons/squirtle.png:Zone.Identifier","images/catch-em-all/pokemons/venonat.png","images/catch-em-all/pokemons/venonat.png:Zone.Identifier","images/catch-em-all/pokemons/weedle.png","images/catch-em-all/pokemons/weedle.png:Zone.Identifier","images/catch-em-all/pokemons/zubat.png","images/catch-em-all/pokemons/zubat.png:Zone.Identifier","images/catch-em-all/wallpaper.jpg","images/catch-em-all/wallpaper.jpg:Zone.Identifier","images/memorandum/black_bulb_off.png","images/memorandum/black_bulb_on.png","images/memorandum/black_download_folder.png","images/memorandum/black_new_folder.png","images/memorandum/black_rl_player_stats.png","images/memorandum/menu.png","images/memorandum/modern_memorandum_showoff.jpg","images/memorandum/modernwork.jpg","images/memorandum/readme-images/create-folder-demo.png","images/memorandum/readme-images/create-link-demo.png","images/memorandum/readme-images/device_demo_image.jpg","images/memorandum/readme-images/edit-header-demo.png","images/memorandum/readme-images/edit-link-demo.png","images/memorandum/readme-images/light-theme-demo.png","images/memorandum/readme-images/memorandum-desktop.png","images/memorandum/readme-images/memorandum-phone.png","images/memorandum/readme-images/memorandum-tablet.png","images/memorandum/readme-images/startup-decision-demo.png","images/memorandum/searchicon.png","images/memorandum/wallpaper.png","images/memorandum/white_bulb_off.png","images/memorandum/white_bulb_on.png","images/memorandum/white_download_folder.png","images/memorandum/white_new_folder.png","images/memorandum/white_rl_player_stats.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.4sobJB01.js","app":"_app/immutable/entry/app.v5uu5KDE.js","imports":["_app/immutable/entry/start.4sobJB01.js","_app/immutable/chunks/entry.p85PCMl3.js","_app/immutable/chunks/scheduler.ZYyOQGSR.js","_app/immutable/entry/app.v5uu5KDE.js","_app/immutable/chunks/scheduler.ZYyOQGSR.js","_app/immutable/chunks/index.hJxheIky.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/catch-em-all",
				pattern: /^\/catch-em-all\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/memorandum",
				pattern: /^\/memorandum\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
