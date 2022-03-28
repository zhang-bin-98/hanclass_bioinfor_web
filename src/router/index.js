import { createRouter, createWebHashHistory } from "vue-router"

const Home = () => import("@/pages/BaseHome.vue")
const NotFound = () => import("@/pages/Base404.vue")

const UserLogin = () => import("@/pages/UserLogin.vue")
const UserMessage = () => import("@/pages/UserMessage.vue")

const GeneList = () => import("@/pages/GeneList.vue")
const GeneUpload = () => import("@/pages/GeneUpload.vue")

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
    {
        path: "/GeneList",
        name: "GeneList",
        component: GeneList
    },
    {
        path: "/GeneUpload",
        name: "GeneUpload",
        component: GeneUpload
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

router.afterEach((to, from) => {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    to.meta.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  })

export default router