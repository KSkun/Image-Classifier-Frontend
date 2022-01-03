<template>
  <router-view></router-view>
</template>

<script>
export const appName = '快速文本/非文本图像分类系统'
export const urlPrefix = 'http://localhost:5000'

export default {
  name: 'App',
  mounted() {
    if (localStorage.tokenExpire < Date.now()) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpire')
      localStorage.login = false
    }
  }
}
</script>

<style scoped>

</style>