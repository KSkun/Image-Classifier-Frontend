<template>
  <el-form ref="new_task_form" :model="form" label-width="100px" class="new_task_form">
    <el-form-item label="关键词">
      <el-input v-model="form.keyword"></el-input>
    </el-form-item>
    <el-form-item label="搜索引擎">
      <el-checkbox-group v-model="form.engines">
        <el-checkbox v-for="engine in avaEngines" :key="engine.name" :label="engine.name">
          {{ engine.display_name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="数量">
      <el-input-number v-model="form.limit"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-on:click="onSubmit()">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import {urlPrefix} from "@/App";
import {ElMessage} from "element-plus";

const new_task_data = reactive({
  keyword: '',
  engines: [],
  limit: 0
})

export default {
  name: "TaskNewTab",
  data() {
    return {
      form: new_task_data,
      avaEngines: [],
    }
  },
  async created() {
    await axios.get(urlPrefix + '/api/task/engines')
        .then(response => {
          if (!response.data.success) {
            ElMessage.error(response.statusText + ': ' + response.data.error)
          }
          this.avaEngines = response.data.data.engines
        })
        .catch(error => {
          let errorMessage
          if (!error.response) {
            errorMessage = 'api network error'
          } else {
            errorMessage = error.response.statusText + ': ' + error.message;
            if (error.response.data.success === false) {
              errorMessage = error.response.data.error
            }
          }
          ElMessage.error(errorMessage)
        })
  },
  methods: {
    onSubmit() {
      let form = this.$refs['new_task_form'].model
      // TODO
      console.log('new task keyword ' + form.keyword + ' engines ' + form.engines.toString() + ' limit ' + form.limit)
    }
  }
}
</script>

<style scoped>
.new_task_form {
  align-items: center;
  margin: 100px;
}
</style>