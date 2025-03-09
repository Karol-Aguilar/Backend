import vuetify from 'vite-plugin-vuetify';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@nuxt/devtools', // Opcional: Habilita herramientas de desarrollo
    async (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        if (config.plugins) {
          config.plugins.push(vuetify({ autoImport: true }));
        }
      });
    },
  ],

  vite: {
    plugins: [vuetify({ autoImport: true })], // Forma más directa de agregar el plugin
    define: {
      'process.env.DEBUG': 'false', // Puede ayudar a evitar errores de depuración
    },
    vue: {
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    },
  },
});
