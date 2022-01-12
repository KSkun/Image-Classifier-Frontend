import {createApp} from 'vue'
import routes from './routes'
import {createRouter, createWebHashHistory} from 'vue-router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import App from '@/App'

// frontend router
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

const app = createApp(App)

// register icons
Object.keys(Icons).forEach(key => {
    if (key === 'Menu') { // work around for menu icon
        app.component('icon-menu', Icons[key])
    } else {
        app.component(key, Icons[key])
    }
})

app.use(router)
app.use(ElementPlus)

app.mount('#app')