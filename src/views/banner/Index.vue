<template>
  <div class="clearfix">
    <a-card>
      <div slot="title">
        <span style="margin-right: 30px">轮播图管理</span>
        <a-button icon="sync" @click="getBannerList" :loading="tableLoading" title="刷新本地数据" class="action_btn" />
      </div>
      <div slot="extra">
        <!-- <a-popconfirm
          title="确认删除这些图片吗?"
          @confirm="delFewBanner"
          okText="Yes"
          cancelText="No"
          :disabled="has_selected"
        >
          <a-button :disabled="has_selected" type="danger" class="action_btn">删除</a-button>
        </a-popconfirm> -->
        <a-button :disabled="has_selected" @click="showConfirm" type="danger" class="action_btn">删除</a-button>
        <a-button @click="$refs.edit_banner.edit('new')" type="primary" title="添加图片" >
          添加
        </a-button>
      </div>
      <a-row>
        <a-table
          :columns="columns"
          :data-source="dataList"
          :loading="tableLoading"
          :rowSelection="{ selectedRowKeys: selected_row_keys, onChange: onSelectChange }"
          rowKey="id"
        >
          <span slot="id" slot-scope="id">
            #{{ id }}
          </span>
          <span slot="url" slot-scope="url">
            <img :src="url" style="height: 80px">
          </span>
          <template slot="operation" slot-scope="text, row" >
            <a @click="$refs.edit_banner.edit(row)">编辑</a>
            <a-divider type="vertical" />

            <a-popconfirm
              title="确认删除这条吗"
              ok-text="Yes"
              cancel-text="No"
              @confirm="delFewBanner(row.id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-row>
      <a-divider>效果预览</a-divider>
    </a-card>

    <banner-edit-modal ref="edit_banner" @ok="cloneEditBanner" />
  </div>
</template>
<script>
import { BannersManager } from '@/api/public_info'
import BannerEditModal from './BannerModal'
// 1280 520
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '类型',
    dataIndex: 'type_',
    key: 'type_',
    width: 100
  },
  {
    title: '排序序号',
    dataIndex: 'order_id',
    key: 'order_id',
    width: 120,
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.order_id - b.order_id
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '链接地址',
    dataIndex: 'link_url',
    key: 'link_url'
  },
  {
    title: '图片',
    dataIndex: 'url',
    key: 'url',
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 140,
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    BannerEditModal
  },
  data () {
    return {
      tableLoading: true,
      previewVisible: false,
      previewImage: '',
      columns: columns,
      dataList: [],
      dataListPre: [],
      selected_row_keys: []
    }
  },
  computed: {
    has_selected () {
      return !this.selected_row_keys.length > 0
    }
  },
  mounted () {
    this.getBannerList()
  },
  methods: {
    showConfirm () {
      this.$confirm({
        title: '删除',
        content: '确认删除这些图片吗？',
        onOk () {
          this.delFewBanner()
        },
        onCancel () {}
      })
    },
    getBannerList () {
      this.tableLoading = true
      BannersManager('get')
        .then(res => {
          // console.log(res)
          if (res.error_code !== 0) {
            this.$message.error('获取数据失败')
          } else {
            this.dataList = res.data
          }
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    },
    delFewBanner (id) {
      let d = this.selected_row_keys
      if (id !== undefined) {
        d = [id]
      }
      this.tableLoading = true
      BannersManager('delete', d)
        .then(reponse => {
          this.$message.success('删除成功')
          this.getBannerList()
        })
        .catch(error => {
          console.log(error)
          this.$message.error('删除失败')
        })
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selected_row_keys = selectedRowKeys
    },
    cloneEditBanner () {
      this.getBannerList()
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ dataList }) {
      this.dataList = dataList
    }
  }
}
</script>
<style scoped>
.action_btn {
    margin: 2px 2px 2px 2px
  }
</style>
