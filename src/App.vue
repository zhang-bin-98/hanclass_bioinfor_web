<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="text-white"
      :class="
        !user
          ? 'bg-light-green-9'
          : user.user_role
            ? 'bg-blue-grey-9'
            : 'bg-primary'
      "
    >
      <q-toolbar>
        <q-toolbar-title>2019中国新冠肺炎信息数据库</q-toolbar-title>

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
            :to="{ name: 'SeqList' }"
          />
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            label="序列比对"
            icon="manage_search"
            :to="{ name: 'SeqBlast' }"
          />
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            label="基因表达"
            icon="fitbit"
            :to="{ name: 'GeneExp' }"
          />
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            label="上传数据"
            icon="cloud_upload"
            :to="{ name: 'SeqUpload' }"
          />
          <q-breadcrumbs-el
            active-class="text-cyan-12"
            :label="
              !user
                ? '登录'
                : user.user_role
                  ? '用户列表'
                  : '用户中心'
            "
            icon="person"
            :to="{ name: 'UserMessage' }"
          />
        </q-breadcrumbs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>51522zzwlwlbb</q-toolbar-title>
        <q-btn-group flat>
          <a href="./docs">
            <q-btn flat label="关于网站" class="text-grey-1" />
          </a>
          <a href="https://github.com/zhang-bin-98/hanclass_bioinfor_web">
            <q-btn flat label="前端仓库" class="text-grey-1" />
          </a>
          <a href="https://github.com/zhang-bin-98/hanclass_bioinfor_server">
            <q-btn flat label="后端仓库" class="text-grey-1" />
          </a>
        </q-btn-group>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index"

const store = mainStore()
const route = useRoute()

const {user} = storeToRefs(store)

</script>