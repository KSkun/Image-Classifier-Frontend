<template>
  <div class="welcome_text">
    <p>欢迎使用 {{ appName }}！</p>
  </div>
</template>

<script>
import {appName} from '@/App'

export default {
  name: "HomeTab",
  data() {
    return {
      appName: appName
    }
  }
}
</script>

<style scoped>
.welcome_text {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}

p {
  margin: 0 auto;
  font-size: xx-large;
}
</style>