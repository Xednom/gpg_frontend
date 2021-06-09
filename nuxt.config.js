/*!

 =========================================================
 * Nuxt Black Dashboard PRO - v1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/nuxt-black-dashboard-pro
 * Copyright 2019 Creative Tim (https://www.creative-tim.com)

 * Coded by Creative Tim

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { style } from "d3-selection";

 let apiUrl = "";
 if (process.env.NODE_ENV === "production") {
   apiUrl = process.env.API_URL;
 } else {
   apiUrl = "http://127.0.0.1:8000/";
 }
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'GPG Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/landmaster.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800'},
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css'}
    ],
    bodyAttrs: {
      // class: 'sidebar-mini' // delete the class to have the sidebar expanded by default. Add `white-content` class here to enable "white" mode.
    }
  },
  router: {
    middleware: ["auth"],
    linkExactActiveClass: 'active'
  },
  publicRuntimeConfig: {
    baseURL: process.env.NODE_ENV === 'production' ? process.env.API_URL : 'http://127.0.0.1:8000/'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'assets/css/demo.css',
    'assets/css/nucleo-icons.css',
    'assets/sass/black-dashboard-pro.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    `~/plugins/dashboard-plugin.js`,
    { src: '~/plugins/full-calendar.js', ssr: false },
    { src: '~/plugins/world-map.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'bootstrap-vue/nuxt',
    'nuxt-i18n'
  ],
  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true
  },
  // Axios module configuration
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
		baseURL: apiUrl
	},
	auth: {
		strategies: {
			local: {
				scheme: "refresh",
				endpoints: {
					login: {
						url: "auth/jwt/create/",
						method: "post",
						propertyName: "access"
					},
					user: {
						url: "auth/users/me/",
						method: "get",
						propertyName: false
					},
					refresh: {
						url: "auth/jwt/refresh/",
						method: "post"
					},
					logout: false
				},
				token: {
					property: "access",
					type: "jwt",
					maxAge: 60 * 5 // 5 minutes
				},
				user: {
					property: ""
				},
				refreshToken: {
					property: "refresh",
					data: "refresh",
					maxAge: 60 * 60 * 24
				},
				tokenRequired: true,
				tokenType: "jwt",
				globalToken: true
			}
		}
	},
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js'
      },
      {
        code: 'ar',
        file: 'ar.js'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    transpile: [
      ({ isServer }) => 'vue-typeahead-bootstrap'
    ],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    babel: {
      plugins: [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ]
    }
  }
}
