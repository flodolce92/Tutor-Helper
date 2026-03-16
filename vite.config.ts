import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api/v2': {
				target: 'https://api.intra.42.fr/v2',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/v2/, ''),
			},
		},
	},
});
