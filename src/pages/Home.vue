<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="12"><b>{{ appName + ' by KSkun' }}</b></el-col>
        <el-col :span="12" style="text-align: right">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-icon><avatar/></el-icon>
              {{ username }}
              <el-icon><arrow-down/></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-on:click="onLogout()">
                  <el-icon>
                    <back/>
                  </el-icon>
                  注销
                </el-dropdown-item>
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
            <el-menu-item index="1" v-on:click="currentMainComponent = homeComp">
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
              <el-menu-item index="2-1" v-on:click="currentMainComponent = taskNewComp">
                <el-icon>
                  <circle-plus-filled/>
                </el-icon>
                新建
              </el-menu-item>
              <el-menu-item index="2-2" v-on:click="currentMainComponent = taskInfoComp">
                <el-icon>
                  <info-filled/>
                </el-icon>
                已有
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main>
        <component v-bind:is="currentMainComponent"></component>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {appName} from "@/App";
import TaskNewTab from "@/components/TaskNewTab";
import HomeTab from "@/components/HomeTab";
import {markRaw} from "vue";

export default {
  name: "Home",
  data() {
    return {
      appName: appName,
      username: localStorage.username,

      homeComp: markRaw(HomeTab),
      taskNewComp: markRaw(TaskNewTab),
      taskInfoComp: null, // TODO

      currentMainComponent: markRaw(HomeTab),
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

.el-main {
  padding: 0 !important;
}
</style>
