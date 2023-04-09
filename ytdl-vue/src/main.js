import { createApp } from 'vue'
import App from './App.vue'
import createPersistedState from "vuex-persistedstate";
import { createStore } from 'vuex'

// Create a new store instance.
let store = createStore({
    state: {
        jwt: "",
    },
    mutations: {
        setJwt(state, jwt) {
            state.jwt = jwt;
        },
    },
    plugins: [createPersistedState()],
})

createApp(App).use(store).mount('#app')
