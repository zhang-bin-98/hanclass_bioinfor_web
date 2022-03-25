<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-light-green-9 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="gene.svg" />
          </q-avatar>
          51522zzwlwlbb
        </q-toolbar-title>

        <q-space />

        <q-breadcrumbs active-color="white">
          <q-breadcrumbs-el label="首页" icon="home" :to="{ name: 'Home' }" />
          <q-breadcrumbs-el label="基因列表" icon="widgets" :to="{ name: 'GeneList' }" />
          <q-breadcrumbs-el
            :label="user.value ? '用户中心' : '登录'"
            icon="person"
            :to="user.value ? { name: 'UserMessage' } : { name: 'UserLogin' }"
          />
        </q-breadcrumbs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-slide-transition>
        <router-view />
      </q-slide-transition>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>Title</q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { reactive, provide } from 'vue'

const user = reactive({})
provide('user', user)

</script>