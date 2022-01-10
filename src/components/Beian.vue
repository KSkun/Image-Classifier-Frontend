<template>
  <el-link style="font-size: small" href="https://beian.miit.gov.cn/#/Integrated/index">{{ beian }}</el-link>
</template>

<script>
import {beian} from "@/App"

export default {
  name: "Beian",
  data() {
    return {
      beian: beian
    }
  }
}
</script>

<style scoped>

</style>