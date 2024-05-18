import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import router from './router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Sidebar from './components/Sidebar.vue'
const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.component('Navbar', Navbar)
app.component('Sidebar', Sidebar)
app.component('Footer', Footer)
app.mount('#app')
