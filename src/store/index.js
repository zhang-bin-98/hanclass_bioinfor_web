// https://juejin.cn/post/6984604019272450085

import { reactive } from 'vue'

const state = reactive({
    user: null,
    token: null
})

export default function userStore () {

    const setUserAction = (newValue) => {
        state.user = newValue
    }

    const setTokenAction = (newValue) => {
        state.token = newValue
    }

    const clearUerAction = () => {
        state.user = null
        state.token = null
    }

    return {
        state,
        setUserAction,
        setTokenAction,
        clearUerAction
    }
}
