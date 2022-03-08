import { createRouter, createWebHashHistory } from "vue-router"

const Home = () => import("@/pages/BaseHome.vue")
const NotFound = () => import("@/pages/Base404.vue")

const UserLogin = () => import("@/pages/UserLogin.vue")
const UserMessage = () => import("@/pages/UserMessage.vue")

// const GeneList = () => import("@/pages/GeneList.vue")
// const GeneDetail = () => import("@/pages/GeneDetail.vue")
// const GeneUpload = () => import("@/pages/GeneUpload.vue")

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
    // user
    {
        path: "/UserLogin",
        name: "UserLogin",
        component: UserLogin
    },
    {
        path: "/UserMessage",
        name: "UserMessage",
        component: UserMessage
    },
    // gene
    // 404
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