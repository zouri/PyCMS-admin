<template>
  <div class="page-header-index-wide">
    <a-card title="文章管理">
      <a-row :gutter="24" style="margin-bottom: 10px">
        <a-col span="2">
          <a-button type="primary" @click="EditArticle('new')" >新增</a-button>
        </a-col>
        <a-col span="4" offset="16">
          <a-input-search placeholder="input search text" />
        </a-col>
        <a-col span="2">
          <a-button type="primary" icon="sync" @click="GetArticle"/>
        </a-col>
      </a-row>
      <a-row>
        <a-table
          rowKey="id"
          :columns="tableHeader"
          :dataSource="tableData"
          :loading="tableLoading"
          :pagination="pagination"
        >
          <span slot="status" slot-scope="status">
            <a-tag v-if="status === 0" :color="'blue'" :key="status">未发布</a-tag>
            <a-tag v-else-if="status === 1" :color="'green'" :key="status">已发布</a-tag>
            <a-tag v-else :color="'red'" :key="status">已撤回</a-tag>
          </span>

          <template slot="operation" slot-scope="text, row">
            <!-- 1: 未发布    2: 已发布    3: 已撤回-->
            <a-button
              v-if="row.status === 2"
              @click="UpdateStatus(row, 3)"
              type="danger"
              size="small"
              class="action_btn"
            >
              撤回
            </a-button>
            <a-button
              v-else
              @click="UpdateStatus(row, 2)"
              type="primary"
              size="small"
              class="action_btn"
            >
              发布
            </a-button>
            <a-button
              @click="EditArticle(row.id)"
              size="small"
              class="action_btn"
            >
              编辑
            </a-button>

            <a-popconfirm
              title="删掉这篇文章?"
              @confirm="() => onDelete(row)"
            >
              <a-button
                type="danger"
                size="small"
                class="action_btn"
              >
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
import { articleList, articleDel, articleUpdateStatus } from '@/api/article_manager'
export default {
  name: 'ArticleManager',
  data () {
    return {
      modalWidth: 600,
      operationPublish: false,
      operationDel: false,
      operationRecycle: false,
      operationBtnDisable: false,
      tableData: null,
      tableLoading: true,
      dataOffset: 0,
      dataLimit: 15,
      dataTotal: 0,
      visible: false
    }
  },
  computed: {
    pagination () {
      return {
        current: this.dataOffset,
        defaultPageSize: this.dataLimit,
        total: this.dataTotal
      }
    },
    tableHeader () {
      return [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: '栏目',
          dataIndex: 'column'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '内容',
          dataIndex: 'content'
        },
        {
          title: '作者',
          dataIndex: 'author'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time'
        },
        {
          title: '发布时间',
          dataIndex: 'publish_time'
        },
        {
          title: '状态',
          dataIndex: 'status',
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
    this.modalWidth = window.outerWidth / 2
    this.GetArticle()
  },
  methods: {
    GetArticle () {
      this.tableLoading = true
      const param = { 'offset': this.dataOffset, 'limit': this.dataLimit }
      articleList(param)
        .then(response => {
          const data = response.result
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
      articleDel(id)
        .then(response => {
          console.log(response)
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    },
    EditArticle (articleId) {
      // path = { path: `/article/editor/${articleId}`
      this.$router.push({ path: `/article/editor/${articleId}` })
    },
    UpdateStatus (row, statusCode) {
      this.tableLoading = true
      articleUpdateStatus(row.id, statusCode)
        .then(response => {
          const data = response.data
          console.log(data, 'ok')
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
