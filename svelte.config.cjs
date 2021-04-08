const node = require('@sveltejs/adapter-node');
const pkg = require('./package.json');
const path = require('path');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: node(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			resolve: {
				alias: {
					$calculator: path.resolve('src/lib/calculator'),
					$markdown: path.resolve('src/lib/markdown'),
					$pomodoro: path.resolve('src/lib/pomodoro'),
					$quotes: path.resolve('src/lib/quotes'),
					$drumkit: path.resolve('src/lib/drumkit')
				}
			},
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			}
		}
	}
};
