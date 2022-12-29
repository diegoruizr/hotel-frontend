import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
import VeeValidate, {Validator} from 'vee-validate'
import lang from 'element-ui/lib/locale/lang/es'
import locale from 'element-ui/lib/locale'
import App from './App.vue'
import axios from 'axios'
import Vuex from 'vuex'
import VueStore from './store/store'
import VueI18n from 'vue-i18n'
import VueLanguages from './languages/i18n'
import validationEn from 'vee-validate/dist/locale/en'
import validationEs from 'vee-validate/dist/locale/es'
import spinner from './plugins/spinner'
// Plugins
import GlobalComponents from './gloablComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'

// router setup
import routes from './routes/routes'

// library imports

import './assets/sass/paper-dashboard.scss'
import './assets/sass/element_variables.scss'
import './assets/sass/demo.scss'

import sidebarLinks from './sidebarLinks'
import VueTabs from 'vue-nav-tabs'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css'
import Swal from 'sweetalert2'
import VModal from 'vue-js-modal'

// plugin setup
Vue.use(VueTabs)
Vue.use(VueRouter)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
locale.use(lang)
Vue.use(Vuex)
Vue.prototype.$http = axios
Vue.use(VueI18n)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(Tooltip)
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } })

// configure vuex
const store = new Vuex.Store(VueStore)
// configure i18n
const i18n = new VueI18n(VueLanguages)
// configure router
const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})
// configure vee -validate
Vue.use(VeeValidate, {
  i18nRootKey: 'validations', // customize the root path for validation messages.
  i18n,
  dictionary: {
    en: validationEn,
    es: validationEs
  }
})
const isUnique = (value, args) => {
  var localData = {value: value}
  if (args.length > 1) {
    if (args[1] !== undefined) {
      localData = {value: value, id: args[1]}
    }
  }
  return axios.post(`http://${store.getters.getIpServer}/${args[0]}`, localData, {headers: {'Authorization': `Bearer ${store.getters.getAccessToken}`, 'Accept': 'application/json', 'profile': store.getters.getProfile, 'company': store.getters.getCompany}})
    .then((response) => {
      return {
        valid: response.data.valid,
        data: {
          message: response.data.message
        }
      }
    })
}

// The messages getter may also accept a third parameter that includes the data we returned earlier.
Validator.extend('unique', {
  validate: isUnique,
  getMessage: () => {
    return i18n.t('unique_validator')
  }
})
Vue.use(spinner, { i18n })
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.getCompany === null) {
      next({ name: 'login' })
    } else {
      if (store.getters.getPermissions != null) {
        var finded
        var action = to.params.paramAction
        if (action === undefined) {
          action = to.meta.default
        }
        if (to.meta.hasParams) {
          finded = store.getters.getPermissions.find(permission => permission.route === to.name && permission.action === action)
        } else {
          finded = store.getters.getPermissions.find(permission => permission.route === to.name)
        }
        if (finded !== undefined || to.name === 'home') {
          next()
        } else {
          if (from.name === null || from.name === undefined) {
            next({name: 'home'})
          }
        }
      } else {
        axios.post(`http://${store.getters.getIpServer}/api/permission/get-permissions`, {}, {headers: {'Authorization': `Bearer ${store.getters.getAccessToken}`, 'Accept': 'application/json', 'profile': store.getters.getProfile, 'company': store.getters.getCompany}})
        .then(res => {
          Vue.prototype.$spinner.close()
          if (res.data.status === 400) {
            Swal({
              icon: 'error',
              title: 'Usuario sin permisos',
              text: 'El usuario no contiene ningun permiso valido'
            })
          } if (res.data.status === 200) {
            store.commit('setPermissions', res.data.permissions)
            var finded
            var action = to.params.paramAction
            if (action === undefined) {
              action = to.meta.default
            }
            if (to.meta.hasParams) {
              finded = res.data.permissions.find(permission => permission.route === to.name && permission.action === action)
            } else {
              finded = res.data.permissions.find(permission => permission.route === to.name)
            }
            if (finded !== undefined || to.name === 'home') {
              next({name: 'home'})
            } else {
              if (from.name === null || from.name === undefined) {
                next({name: 'home'})
              }
            }
          }
        }).catch(err => {
          Vue.prototype.$spinner.close()
          console.log(err)
          store.commit('setCompany', null)
          localStorage.removeItem('company')
          next({ name: 'login' })
        })
      }
    }
  } else {
    if (store.getters.getCompany !== null && to.name === 'login') {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})
Vue.config.warnHandler = function (msg, vm, trace) {
  if (!msg.includes('Duplicate keys detected:')) {
    // console.log(`Warn: ${msg}\nTrace: ${trace}`)
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  i18n
})
