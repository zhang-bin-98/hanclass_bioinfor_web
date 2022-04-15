import { createRouter, createWebHashHistory } from "vue-router"
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index"

// pages
const Home = () => import("@/pages/BaseHome.vue")
const NotFound = () => import("@/pages/Base404.vue")

const UserLogin = () => import("@/pages/UserLogin.vue")
const UserMessage = () => import("@/pages/UserMessage.vue")

const GeneList = () => import("@/pages/GeneList.vue")
const GeneUpload = () => import("@/pages/GeneUpload.vue")

const About = () => import("@/pages/About.vue")

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
        component: UserMessage,
        meta: { requiresAuth: true }
    },
    // gene
    {
        path: "/GeneList",
        name: "GeneList",
        component: GeneList
    },
    {
        path: "/GeneUpload",
        name: "GeneUpload",
        component: GeneUpload,
        meta: { requiresAuth: true }
    },
    // About
    {
        path: "/About",
        name: "About",
        component: About
    },
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

router.beforeEach((to, from) => {
    const store = mainStore()
    // console.log({to, from, user: store.user})
    if (to.meta.requiresAuth && !store.user) {
        return { 
            path: "/UserLogin", 
            query: { redirect: to.fullPath },
        }
    }
})

export default router