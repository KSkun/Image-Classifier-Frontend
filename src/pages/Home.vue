<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="12"><b>{{ appName + ' by KSkun' }}</b></el-col>
        <el-col :span="12" style="text-align: right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ username }}
              <el-icon>
                <arrow-down/>
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-on:click="onLogout()">注销</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '2']" default-active="1">
            <el-menu-item index="1">
              <template #title>
                <el-icon>
                  <home-filled/>
                </el-icon>
                主页
              </template>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <briefcase/>
                </el-icon>
                任务
              </template>
              <el-menu-item index="2-1">
                <el-icon>
                  <circle-plus-filled/>
                </el-icon>
                新建
              </el-menu-item>
              <el-menu-item index="2-2">
                <el-icon>
                  <info-filled/>
                </el-icon>
                已有
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-scrollbar>
        <el-main v-bind:is="currentMainComponent">
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script>
import {appName} from "@/App";

export default {
  name: "Home",
  data() {
    return {
      appName: appName,
      username: localStorage.username,
    }
  },
  computed: {
    currentMainComponent: function () {
      return null
    }
  },
  mounted() {
    document.title = appName

    if (parseFloat(localStorage.tokenExpire) * 1000 < Date.now()) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpire')
      localStorage.removeItem('username')
      localStorage.login = false
    }

    if (!localStorage.login || localStorage.login === 'false') {
      this.$router.push('/login')
    }
  },
  methods: {
    onLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpire')
      localStorage.removeItem('username')
      localStorage.login = false

      this.$router.push('/login')
    }
  }
}
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  line-height: 60px;
}

.el-aside {
  color: var(--el-text-color-primary);
}

html, body, #app, .el-container {
  height: 100%;
}
</style>
