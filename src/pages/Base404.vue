<template>
  <n-layout-content>
    <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-button @click="this.$router.replace({ path: '/' })" >回主页</n-button>
      </template>
    </n-result>
  </n-layout-content>
</template>
