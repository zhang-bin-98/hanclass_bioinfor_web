<template>
    <n-layout position="absolute">
        <n-message-provider>
            <Header></Header>
            
        </n-message-provider>
        <router-view></router-view>
    </n-layout>
</template>

<script setup>
import { reactive, provide } from 'vue'

const user = reactive({})
provide('user', user)

</script>