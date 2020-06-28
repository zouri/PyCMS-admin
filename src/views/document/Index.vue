<template>
  <div class="page-header-index-wide">
    <a-card :bodyStyle="{padding: 0}">
      <div slot="title">
        <span style="margin-right: 30px">文档管理</span>
        <a-button icon="sync" @click="GetDocumentList" :loading="tableLoading" title="刷新本地数据" class="action_btn" />
        <!-- <a-input-search placeholder="输入你的关键词" @search="onSearch">
          <a-button type="primary" icon="sync" @click="GetDocumentList"></a-button>
        </a-input-search> -->
      </div>

      <div slot="extra">
        <a-button
          @click="EditDocument('new')"
          type="primary"
          class="action_btn"
          title="新建文章"
        >
          新建
        </a-button>
        <!-- <a-popconfirm
          title="确认删除这些栏目吗?"
          @confirm="delFewDocument"
          okText="Yes"
          cancelText="No"
          :disabled="has_selected"
        >
          <a-button :disabled="has_selected" type="danger" class="action_btn">删除</a-button>
        </a-popconfirm> -->
        <a-button :disabled="has_selected" @click="showConfirm" type="danger" class="action_btn">删除</a-button>
      </div>
      <a-row>
        <a-table
          rowKey="id"
          size="middle"
          :columns="tableHeader"
          :dataSource="tableData"
          :loading="tableLoading"
          :pagination="pagination"
          :rowSelection="{ selectedRowKeys: selected_row_keys, onChange: onSelectChange }"
          @change="onPageChange"
          :scroll="{ y: table_height}"
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
            <a-button @click="EditDocument(row.id)" size="small" class="action_btn" >
              编辑
            </a-button>
          </template>

        </a-table>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { docs, docsDel, docUpdateAttr } from '@/api/document_manager'
export default {
  name: 'DocumentManager',
  data () {
    return {
      selected_row_keys: [],
      columns_data: [],
      tableData: null,
      tableLoading: true,
      current_column: 'all',
      pageNumber: 1,
      pageLimit: 15,
      dataTotal: 0
    }
  },
  computed: {
    pagination () {
      return {
				pageSize: 10, // 默认每页显示数量
				showSizeChanger: true, // 显示可改变每页数量
				showTotal: total => `总数 ${total}`, // 显示总数
				pageSizeOptions: ['10', '20', '30', '40'] // 每页数量选项
        // showSizeChange: (this.pageNumber, this.pageLimit) => this.pageSize = pageSize, // 改变每页数量时更新显示
			}
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
          dataIndex: 'create_time'
          // width: 190
        },
        {
          title: '发布时间',
          dataIndex: 'pub_time',
          // width: 190,
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
    },
    table_height () {
      const h = document.documentElement.clientHeight || document.body.clientHeight
      console.log(h)
      return h - 350
    },
    has_selected () {
      return !this.selected_row_keys.length > 0
    }
  },
  watch: {
    '$route' (to, from) {
      // 获取当前栏目
      this.GetDocumentList()
    }
  },
  mounted () {
    // this.modalWidth = window.outerWidth / 2
    this.GetDocumentList()
  },
  methods: {
    showConfirm () {
      this.$confirm({
        title: '删除',
        content: '确认删除这些栏目吗？',
        onOk () {
          this.delFewDocument()
        },
        onCancel () {}
      })
    },
    onSelectColumn (e) {
      this.GetDocumentList()
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selected_row_keys = selectedRowKeys
    },
    onPageChange (e) {
      this.pageNumber = e.current
      this.pageLimit = e.defaultPageSize
      this.GetDocumentList()
    },
    GetDocumentList () {
      this.tableLoading = true
      // 获取当前栏目
      this.current_column = this.$route.path.replace('/document/', '').replace('/', '')
      const param = { 'page_number': this.pageNumber, 'limit': this.pageLimit, 'column_id': this.current_column }
      docs(param)
        .then(response => {
          const data = response.data
          this.tableData = data.resources
          this.dataTotal = data.total
          this.tableLoading = false
        })
        .catch(error => {
          this.tableLoading = false
          console.log(error)
        })
    },
    delFewDocument () {
      this.tableLoading = true
      docsDel(this.selected_row_keys)
        .then(reponse => {
          console.log(reponse.data)
          this.GetDocumentList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    EditDocument (docId) {
      console.log(`/document/editor/${this.current_column}/${docId}`)
      alert(1)
      this.$router.push({ path: `/document/editor/${this.current_column}/${docId}` })
    },
    UpdateStatus (row, statusCode) {
      this.tableLoading = true
      docUpdateAttr(row.id, 'status', statusCode)
        .then(response => {
          const data = response.data
          console.log(data, 'ok')
          this.GetDocumentList()
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

<style lang="less" scoped>
  .action_btn {
    margin: 2px 2px 2px 2px
  }
  /*.ant-form-item-label > label {*/
  /*  white-space: normal;*/
  /*}*/
</style>
