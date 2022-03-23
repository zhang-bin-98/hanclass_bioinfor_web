<template>
    <n-layout-header bordered>
        <n-grid x-gap="2" :cols="2">
            <n-gi>
                <n-space justify="start" style="height: 50px;" align="center" >
                    <n-tag :bordered="false" size="large">
                        <n-gradient-text
                            gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
                        >51522zzwlwlbb</n-gradient-text>

                        <template #avatar>
                            <n-icon size="24">
                                <people />
                            </n-icon>
                        </template>
                    </n-tag>
                </n-space>
            </n-gi>
            <n-gi>
                <n-space justify="end">
                    <n-menu :options="menuOptions" mode="horizontal" />
                </n-space>
            </n-gi>
        </n-grid>
    </n-layout-header>
</template>

<script setup>
import { h } from "vue";
import { inject } from 'vue'
import { useMessage, NIcon } from 'naive-ui'
import { RouterLink } from "vue-router";
import {
    People,
    Person,
    HomeOutline as HomeIcon
} from "@vicons/ionicons5";

// 头像
const user = inject('user')
window.$message = useMessage()

// 渲染头像
function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
    {
        label: () => h(RouterLink, {
            to: {
                name: "Home"
            }
        }, { default: () => "主页" }),
        key: "go-back-home",
        icon: renderIcon(HomeIcon)
    },
    // 登陆状态改变 菜单改变
    // 增删
    {
        label: () => h(RouterLink, {
            to: {
                name: "UserLogin"
            }
        }, {
            default: () => user.value ? user.value.username : "请登录"
        }),
        key: "go-to-login",
        icon: renderIcon(Person)
    }
];




</script>