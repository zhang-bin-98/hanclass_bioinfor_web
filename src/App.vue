<template>
    <n-layout position="absolute">
        <n-message-provider>
            <Header></Header>
        </n-message-provider>
        <n-layout-content>
            <router-view></router-view>
        </n-layout-content>
        <n-layout-footer>成府路</n-layout-footer>
    </n-layout>
</template>

<script setup>
import { reactive, provide } from 'vue'

const user = reactive({})
provide('user', user)

</script>