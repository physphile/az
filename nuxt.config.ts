// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
	runtimeConfig: {
		app: {
			baseURL: process.env.BASE_URL,
		},
	},
	devtools: { enabled: true },
	build: {
		transpile: ['trpc-nuxt', 'vuetify'],
	},
	modules: [
		(_options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', config => {
				// @ts-expect-error
				config.plugins.push(vuetify({ autoImport: true }));
			});
		},
		'@pinia/nuxt'
		//...
	],
	vite: {
		optimizeDeps: {
			esbuildOptions: {
				target: 'esnext',
			},
		},
		vue: {
			template: {
				transformAssetUrls,
			},
		},
		build: {
			target: 'esnext',
		},
	},
});
