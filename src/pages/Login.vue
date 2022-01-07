<template>
  <div>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">{{ appName }}</h3>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" placeholder="" v-model="form.username"
                  @keyup.enter="onSubmit('loginForm')"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="" v-model="form.password"
                  @keyup.enter="onSubmit('loginForm')"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import {appName, urlPrefix} from "@/App";
import {Base64} from "js-base64";
import {ElMessage} from "element-plus";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: '',
        password: ''
      },

      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },

      appName: appName,
    }
  },
  mounted() {
    document.title = '登录 - ' + appName

    if (parseFloat(localStorage.tokenExpire) * 1000 < Date.now()) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpire')
      localStorage.login = false
    }

    if (localStorage.login === 'true') {
      this.$router.push('/')
    }
  },
  methods: {
    onSubmit: function (formName) {
      const form = this.$refs[formName];
      form.validate(valid => {
        if (valid) {
          axios.get(urlPrefix + '/api/user/token', {
            params: {
              username: form.model.username,
              password: Base64.encode(form.model.password)
            }
          }).then(response => {
            if (!response.data.success) {
              ElMessage.error(response.statusText + ': ' + response.data.error)
            }

            const token = response.data.data.token, expire_at = response.data.data.expire_at
            localStorage.login = true
            localStorage.token = token
            localStorage.tokenExpire = expire_at
            localStorage.username = form.model.username
            ElMessage.success('登录成功')

            this.$router.push('/')
          }).catch(error => {
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
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  box-shadow: 0 0 10px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>