<template>
  <div class="page-header-index-wide">
    <a-card>
      <div slot="title">
        <span>文档管理</span>
        <a-button
          icon="sync"
          shape="circle"
          @click="GetArticleList"
          :loading="tableLoading"
          title="刷新本地数据"
          class="action_btn"
        />
        <!-- <a-input-search placeholder="输入你的关键词" @search="onSearch">
          <a-button type="primary" icon="sync" @click="GetArticleList"></a-button>
        </a-input-search> -->
      </div>
      <div slot="extra">
        <a-button @click="EditArticle('new')" type="primary" class="action_btn">新增</a-button>
        <a-button :disabled="few_action" @click="EditArticle('new')" type="danger" class="action_btn">删除</a-button>
        <a-button :disabled="few_action" @click="EditArticle('new')" class="action_btn">修改状态</a-button>
      </div>
      <a-row>
        <a-table
          rowKey="id"
          :columns="tableHeader"
          :dataSource="tableData"
          :loading="tableLoading"
          :pagination="pagination"
          @change="onChange"
        >
          <span slot="status" slot-scope="status">
            <a-tag v-if="status === 2" :color="'green'" :key="status">已发布</a-tag>
            <a-tag v-else-if="status === 3" :color="'orange'" :key="status">已撤回</a-tag>
            <a-tag v-else :color="'blue'" :key="status">未发布</a-tag>
          </span>
          <span slot="pub_time" slot-scope="text, row">
            <span v-if="row.status == 2">{{ row.pub_time }}</span>
          </span>
          <template slot="operation" slot-scope="text, row">
            <!-- 1: 未发布    2: 已发布    3: 已撤回-->
            <a-button v-if="row.status === 2" @click="UpdateStatus(row, 3)" type="primary" size="small" class="action_btn" >
              撤回
            </a-button>
            <a-button v-else @click="UpdateStatus(row, 2)" type="primary" size="small" class="action_btn" >
              发布
            </a-button>
            <a-button @click="EditArticle(row.id)" size="small" class="action_btn" >
              编辑
            </a-button>
            <a-popconfirm title="删掉这篇文章?" @confirm="() => onDelete(row)" >
              <a-button type="danger" size="small" class="action_btn" >
                删除
              </a-button>
            </a-popconfirm>
          </template>

        </a-table>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { docs, docDel, docUpdateAttr } from '@/api/document_manager'
export default {
  name: 'DocumentManager',
  data () {
    return {
      // modalWidth: 600,
      // operationPublish: false,
      // operationDel: false,
      // operationRecycle: false,
      // operationBtnDisable: false,
      few_action: true,
      tableData: null,
      tableLoading: true,
      pageNumber: 0,
      pageLimit: 15,
      dataTotal: 0,
      visible: false
    }
  },
  computed: {
    pagination () {
      const data = {
        current: this.pageNumber,
        defaultPageSize: this.pageLimit,
        total: this.dataTotal
      }
      console.log(data, '计算属性')
      return data
    },
    tableHeader () {
      return [
        {
          title: 'id',
          dataIndex: 'id',
          width: 60
        },
        {
          title: '栏目',
          dataIndex: 'column',
          width: 100
        },
        {
          title: '标题',
          dataIndex: 'title',
          ellipsis: true,
          scopedSlots: { customRender: 'titleV' }
        },
        {
          title: '内容',
          dataIndex: 'content',
          ellipsis: true,
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '作者',
          dataIndex: 'author',
          width: 100
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          width: 190
        },
        {
          title: '发布时间',
          dataIndex: 'pub_time',
          width: 190,
          scopedSlots: { customRender: 'pub_time' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  mounted () {
    // this.modalWidth = window.outerWidth / 2
    this.GetArticleList()
  },
  methods: {
    onChange (e) {
      // current: 2,defaultPageSize: 15,pageSize: 15,total: 16
      console.log(e, '分页')
      // this.tableLoading = true
      this.pageNumber = e.current
      this.pageLimit = e.defaultPageSize
      this.GetArticleList()
    },
    GetArticleList () {
      this.tableLoading = true
      const param = { 'page_number': this.pageNumber, 'limit': this.pageLimit }
      docs(param)
        .then(response => {
          console.log(response, '返回的数据')
          const data = response.data
          this.UpdateData(data)
          this.tableLoading = false
        })
        .catch(error => {
          this.tableLoading = false
          console.log(error)
        })
    },
    UpdateData (data) {
      this.tableData = data.resources
      this.dataTotal = data.total
    },
    onDelete (id) {
      this.tableLoading = true
      docDel(id)
        .then(response => {
          console.log(response)
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    },
    EditArticle (docId) {
      this.$router.push({ path: `/document/editor/${docId}` })
    },
    UpdateStatus (row, statusCode) {
      this.tableLoading = true
      docUpdateAttr(row.id, 'status', statusCode)
        .then(response => {
          const data = response.data
          console.log(data, 'ok')
          this.GetArticle()
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    }
  }
}
</script>

<style lang="less">
  .action_btn {
    margin: 2px 2px 2px 2px
  }
  /*.ant-form-item-label > label {*/
  /*  white-space: normal;*/
  /*}*/
</style>
