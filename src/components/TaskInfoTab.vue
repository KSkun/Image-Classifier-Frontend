<template>
  <el-scrollbar style="height: 100%">
    <div style="margin: 50px">
      <el-descriptions class="margin-top" :column="4" border>
        <el-descriptions-item width="10%">
          <template #label>
            <div class="cell-item">ID</div>
          </template>
          {{ task.id }}
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">关键词</div>
          </template>
          {{ task.keyword }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">搜索引擎</div>
          </template>
          {{ task.engines }}
        </el-descriptions-item>
        <el-descriptions-item width="10%">
          <template #label>
            <div class="cell-item">数量</div>
          </template>
          {{ task.limit }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">状态</div>
          </template>
          <el-tag class="ml-2" :type="task.status === 'Done' ? 'success' : 'done'">
            {{ task.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">操作</div>
          </template>
          <el-button type="text" size="small" v-on:click="onDownloadZip('text')">下载文本图像</el-button>
          <el-button type="text" size="small" v-on:click="onDownloadZip('nontext')">下载非文本图像</el-button>
        </el-descriptions-item>
      </el-descriptions>

      <el-row style="margin-top: 20px" gutter="20"
              v-for="i in Math.ceil(images.length / 4)" v-bind:key="i">
        <el-col :span="6"
                v-for="image in images.slice((i - 1) * 4, i * 4)" v-bind:key="image.filename">
          <el-card :body-style="{ padding: '0px' }">
            <div :style="{'height': '200px', 'overflow': 'hidden', 'background-image': 'url(' + image.url + ')',
                  'background-repeat': 'no-repeat', 'background-size': 'contain', 'background-position': 'center'}">
            </div>
            <div style="padding: 14px; display: flex; justify-content: space-between; align-items: center">
                <span style="font-size: small; line-height: 15px; width: 150px; word-break: break-all;">
                  {{ image.filename }}
                </span>
              <el-tag :type="image.class === '文本' ? 'success' : image.class === '非文本' ? 'danger' : ''">
                {{ image.class }}
              </el-tag>
              <el-link :href="image.url" target="_blank">
                <el-button type="text" size="small">
                  <el-icon :size="20">
                    <Download/>
                  </el-icon>
                </el-button>
              </el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-scrollbar>
</template>

<script>
import axios from "axios";
import {urlPrefix, resPrefix} from "@/App";
import {ElMessage} from "element-plus";

export default {
  name: 'TaskInfoTab',
  props: ['taskID'],
  data() {
    return {
      task: {},
      images: [],
      resPrefix: resPrefix
    }
  },
  async created() {
    let _task
    await axios.get(urlPrefix + '/api/task/' + this.taskID, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.token
      }
    }).then(response => {
      if (!response.data.success) {
        ElMessage.error(response.statusText + ': ' + response.data.error)
      }
      _task = response.data.data
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

    let _engines
    await axios.get(urlPrefix + '/api/task/engines').then(response => {
      if (!response.data.success) {
        ElMessage.error(response.statusText + ': ' + response.data.error)
      }
      _engines = response.data.data.engines
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
    let engine_map = new Map()
    for (const engine of _engines) {
      engine_map.set(engine.name, engine.display_name)
    }

    this.task = {
      id: this.taskID,
      keyword: _task.keyword,
      engines: '',
      limit: _task.limit,
      status: 'Pending'
    }
    _engines = []
    for (const engine of _task.engines) {
      _engines.push(engine_map.get(engine))
    }
    this.task.engines = _engines.toString()
    if (_task.spider_done && _task.classifier_done) {
      this.task.status = 'Done'
    }

    await axios.get(urlPrefix + '/api/image/list', {
      params: {'task': this.taskID},
      headers: {'Authorization': 'Bearer ' + localStorage.token}
    }).then(response => {
      if (!response.data.success) {
        ElMessage.error(response.statusText + ': ' + response.data.error)
      }
      this.images = response.data.data.images
    }).catch(error => {
      let errorMessage
      if (!error.response) {
        errorMessage = error.message
      } else {
        errorMessage = error.response.statusText + ': ' + error.message
        if (error.response.data.success === false) {
          errorMessage = error.response.data.error
        }
      }
      ElMessage.error(errorMessage)
    })
    for (let image of this.images) {
      image.filename = image.url.split('/').pop()
      switch (image.class) {
        case 'text':
          image.class = '文本';
          break;
        case 'nontext':
          image.class = '非文本';
          break;
        default:
          image.class = 'Pending';
      }
    }
  },
  methods: {
    onDownloadZip: function (klass) {
      axios.get(urlPrefix + '/api/task/' + this.taskID + '/zip/' + klass, {
        headers: {'Authorization': 'Bearer ' + localStorage.token}
      }).then(response => {
        if (!response.data.success) {
          ElMessage.error(response.statusText + ': ' + response.data.error)
        }
        window.open(response.data.data.file, '_blank')
      }).catch(error => {
        let errorMessage
        if (!error.response) {
          errorMessage = error.message
        } else {
          errorMessage = error.response.statusText + ': ' + error.message
          if (error.response.data.success === false) {
            errorMessage = error.response.data.error
          }
        }
        ElMessage.error(errorMessage)
      })
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #e9eef3;
  text-align: center;
  line-height: 60px;
}

.image {
  width: 100%;
  display: block;
}
</style>