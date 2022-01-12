<template>
  <el-form ref="new_task_form" :model="form" :rules="rules" label-width="100px" class="new_task_form">
    <el-form-item label="关键词" prop="keyword">
      <el-input v-model="form.keyword"></el-input>
    </el-form-item>
    <el-form-item label="搜索引擎" prop="engines">
      <el-checkbox-group v-model="form.engines">
        <el-checkbox v-for="engine in avaEngines" :key="engine.name" :label="engine.name">
          {{ engine.display_name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="数量" prop="limit">
      <el-input-number v-model="form.limit" :min="1" :max="1000"></el-input-number>
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

export default {
  name: "TaskNewTab",
  data() {
    return {
      form: reactive({
        keyword: '',
        engines: [],
        limit: 0
      }),
      rules: {
        keyword: [
          {required: true, message: '请输入关键词', trigger: 'change'}
        ],
        engines: [
          {required: true, type: 'array', message: '请选中至少一个搜索引擎', trigger: 'change'}
        ],
        limit: [
          {required: true}
        ]
      },
      avaEngines: [],
    }
  },
  async created() {
    // get available engine list
    await axios.get(urlPrefix + '/api/task/engines').then(response => {
      if (!response.data.success) {
        ElMessage.error(response.statusText + ': ' + response.data.error)
      }
      this.avaEngines = response.data.data.engines
    }).catch(error => {
      let errorMessage
      if (!error.response) {
        errorMessage = error.message
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
      // validate local token
      if (parseFloat(localStorage.tokenExpire) * 1000 < Date.now()) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpire')
        localStorage.removeItem('username')
        localStorage.login = false
      }

      if (!localStorage.login || localStorage.login === 'false') {
        this.$router.push('/login')
      }

      let token = localStorage.token

      // create task
      let form = this.$refs['new_task_form'].model
      axios.post(urlPrefix + '/api/task', {
        keyword: form.keyword,
        engines: form.engines,
        limit: form.limit
      }, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(response => {
        if (!response.data.success) {
          ElMessage.error(response.statusText + ': ' + response.data.error)
        }
        console.log('created ' + response.data.data._id)
      }).catch(error => {
        let errorMessage
        if (!error.response) {
          errorMessage = error.message
        } else {
          errorMessage = error.response.statusText + ': ' + error.message;
          if (error.response.data.success === false) {
            errorMessage = error.response.data.error
          }
        }
        ElMessage.error(errorMessage)
      })
      ElMessage.success('任务已创建')
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