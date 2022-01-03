import {createApp} from 'vue'
import routes from './routes'
import {createRouter, createWebHashHistory} from 'vue-router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App';

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.mount('#app')