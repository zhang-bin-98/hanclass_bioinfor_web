import { createRouter, createWebHashHistory } from "vue-router"

// const home = () => import("../home")
// const login = () => import("../login")
const Home = () => import("@/pages/BaseHome.vue")
const NotFound = () => import("@/pages/Base404.vue")

const routes = [
    {
        path: "/",
        redirect: { name: 'Home' }
    },
    {
        path: "/home",
        name: "Home",
        component: Home
    },
    // {
    //     path: "/login",
    //     name: "login",
    //     component: login
    // }
    { 
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound 
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router