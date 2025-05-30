import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        component: () => import( '../views/AboutView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to)=>{
    if(to.name!=="login") {
        let userItem = localStorage.getItem("user")
        if (!userItem) {
            return {name: "login"}
        }
    }
})

export default router
