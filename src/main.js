import { createApp, h } from 'vue'
import routes from './routes'

const App = {
    data: () => ({
        currentRoute: window.location.pathname
    }),

    computed: {
        ViewComponent () {
            const matchingPage = routes[this.currentRoute] || '404'
            return require(`./pages/${matchingPage}.vue`).default
        }
    },

    render () {
        // support specified page title
        if (this.ViewComponent.meta.title) {
            document.title = this.ViewComponent.meta.title
        }
        return h(this.ViewComponent)
    },

    created () {
        window.addEventListener('popstate', () => {
            this.currentRoute = window.location.pathname
        })
    }
}

createApp(App).mount('#app')