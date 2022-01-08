<template>
  <el-table style="width: 100%" height="200" :data="tableData">
    <el-table-column prop="id" label="ID" width="250"></el-table-column>
    <el-table-column prop="keyword" label="关键字" width="300"></el-table-column>
    <el-table-column prop="engines" label="搜索引擎" width="200"></el-table-column>
    <el-table-column prop="limit" label="数量" width="100"></el-table-column>
    <el-table-column label="状态" width="100">
      <template #default="scope">
        <el-tag class="ml-2" :type="scope.row.status === 'Done' ? 'success' : 'done'">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <el-button type="primary" size="small">详情</el-button>
<!--      <el-button type="danger" size="small">删除</el-button>-->
    </el-table-column>
  </el-table>
</template>

<script>
import axios from "axios";
import {urlPrefix} from "@/App";
import {ElMessage} from "element-plus";

export default {
  name: "TaskListTab",
  data() {
    return {
      tableData: []
    }
  },
  async created() {
    let _tableData
    await axios.get(urlPrefix + '/api/task/list', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.token
      }
    }).then(response => {
      if (!response.data.success) {
        ElMessage.error(response.statusText + ': ' + response.data.error)
      }
      _tableData = response.data.data.tasks
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

    console.log(_tableData)
    for (const data of _tableData) {
      console.log(data)
      let newData = {
        id: data.id,
        keyword: data.keyword,
        engines: [],
        limit: data.limit,
        status: 'Pending'
      }
      for (const engine of data.engines) {
        newData.engines.push(engine_map.get(engine))
      }
      if (data.spider_done && data.classifier_done) {
        newData.status = 'Done'
      }
      console.log(newData)
      this.tableData.push(newData)
    }
  },
}
</script>

<style scoped>

</style>