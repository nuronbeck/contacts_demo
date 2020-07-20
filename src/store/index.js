import Vue from 'vue'
import Vuex from 'vuex'

// App global store modules
import contacts from './modules/contacts'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    strict: true,
    contacts,
    user
  }
})
