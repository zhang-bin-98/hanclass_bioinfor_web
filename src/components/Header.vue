<template>
    <n-layout-header bordered>登录用户： {{ user.value? user.value.username : "请登录" }}</n-layout-header>
</template>

<script setup>
import { inject } from 'vue'
import { useMessage } from 'naive-ui'

const user = inject('user')

window.$message = useMessage()

</script>