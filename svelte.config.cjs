const adapter = require('@sveltejs/adapter-netlify');
const pkg = require('./package.json');
const path = require('path');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	kit: {
		adapter: adapter(),

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
