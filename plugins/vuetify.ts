import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import { VEmptyState } from 'vuetify/labs/VEmptyState';

const azTheme: ThemeDefinition = {
	colors: {
		primary: '#266047',
		background: '#F8F8EE',
		surface: '#ffffff80',
		secondary: '#60263f',
	},
};

export default defineNuxtPlugin(app => {
	const vuetify = createVuetify({
		components: {
			VEmptyState,
		},
		defaults: {
			global: {
				clearable: true,
				autocomplete: 'off',
			},
			VTextField: {
				density: 'compact',
			},
			VSelect: {
				density: 'compact',
			},
		},
		theme: {
			defaultTheme: 'azTheme',
			themes: {
				azTheme,
			},
		},
	});
	app.vueApp.use(vuetify);
});
