<template>
    <n-layout position="absolute">
        <n-layout-header bordered>颐和园路</n-layout-header>
        <!-- <n-layout has-sider>
            <n-layout-sider content-style="padding: 24px;">海淀桥</n-layout-sider>
            <n-layout>
                <n-layout-content content-style="padding: 24px;">平山道</n-layout-content>
                <n-layout-footer>成府路</n-layout-footer>
            </n-layout>
        </n-layout> -->
        <router-view></router-view>
    </n-layout>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
    user: null,
    token: null
})

</script>