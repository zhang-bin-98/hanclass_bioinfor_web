import { createRouter, createWebHashHistory } from "vue-router"
import { mainStore } from "@/store/index"

// pages
const Home = () => import("@/pages/BaseHome.vue")
const NotFound = () => import("@/pages/Base404.vue")

const UserLogin = () => import("@/pages/UserLogin.vue")
const UserMessage = () => import("@/pages/UserMessage.vue")

const SeqList = () => import("@/pages/SeqList.vue")
const SeqUpload = () => import("@/pages/SeqUpload.vue")

const SeqBlast = () => import('@/pages/SeqBlast.vue')

const GeneExp = () => impost('@/pages/GeneExp.vue')

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
    // seq
    {
        path: "/SeqList",
        name: "SeqList",
        component: SeqList
    },
    {
        path: "/SeqUpload",
        name: "SeqUpload",
        component: SeqUpload,
        meta: { requiresAuth: true }
    },
    {
        path: "/SeqBlast",
        name: "SeqBlast",
        component: SeqBlast,
        meta: { requiresAuth: true }
    },
    // gene
    {
        path: "/GeneExp",
        name: "GeneExp",
        component: GeneExp
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