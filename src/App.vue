<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="text-white"
      :class="
        !user.value
          ? 'bg-light-green-9'
          : user.value.user_role
            ? 'bg-blue-grey-9'
            : 'bg-primary'
      "
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="gene.svg" />
          </q-avatar>2019中国新冠肺炎序列数据库
        </q-toolbar-title>

        <q-space />

        <q-breadcrumbs active-color="white">
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            label="首页"
            icon="home"
            :to="{ name: 'Home' }"
          />
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            label="序列数据"
            icon="widgets"
            :to="{ name: 'GeneList' }"
          />
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            label="上传数据"
            icon="cloud_upload"
            :to="user.value ? { name: 'GeneUpload' } : { name: 'UserLogin' }"
          />
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            :label="
              !user.value
                ? '登录'
                : user.value.user_role
                  ? '用户列表'
                  : '用户中心'
            "
            icon="person"
            :to="user.value ? { name: 'UserMessage' } : { name: 'UserLogin' }"
          />
        </q-breadcrumbs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition :name="route.meta.transition">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>51522zzwlwlbb</q-toolbar-title>
        <q-btn-group flat>
          <q-btn label="前端仓库" />
          <q-btn label="后端仓库" />
        </q-btn-group>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { reactive, provide } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const user = reactive({})
provide('user', user)

</script>