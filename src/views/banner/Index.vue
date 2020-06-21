<template>
  <div class="clearfix">
    <a-card title="轮播图管理">
      <div slot="extra">
        <a-button @click="$refs.edit_banner.edit('new')" type="primary" title="添加图片" >
          添加
        </a-button>
      </div>
      <a-row>
        <a-table :columns="columns" :data-source="dataListPre">
          <span slot="id" slot-scope="id">
            #{{ id }}
          </span>
          <span slot="url" slot-scope="url">
            <img :src="url" style="height: 80px">
          </span>
          <template slot="operation" slot-scope="text, row">
            <a @click="$refs.edit_banner.edit(row)">编辑</a>
            <a-divider type="vertical" />
            <a>删除</a>
          </template>
        </a-table>
      </a-row>
      <a-divider>效果预览</a-divider>
      <!-- <a-row>
        <a-col :span="24">
          <a-carousel autoplay>
            <img v-for="item in dataListPre" :key="item.url" :src="item.url" :alt="item.url" />
          </a-carousel>
        </a-col>
      </a-row> -->
    </a-card>
    <!-- <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal> -->
    <banner-edit-modal ref="edit_banner"/>
  </div>
</template>
<script>
import { banner, setBanner } from '@/api/public_info'
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
    dataIndex: 'type',
    key: 'type',
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
    title: '链接',
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
      previewVisible: false,
      previewImage: '',
      columns: columns,
      dataList: [],
      dataListPre: [
        {
          id: 1,
          type: 'index',
          order_id: 1,
          title: '这里是标题标题',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          link_url: 'http://zouri.net'
        }
      ]
    }
  },
  computed: {
  },
  created () {
    this.dataList.forEach(item => {
      this.dataListPre.push(item)
    })
  },
  mounted () {
    this.getBannerList()
  },
  methods: {
    getBannerList () {
      banner().then(response => {
        this.dataList = response.data
      })
    },
    setBannerList () {
      setBanner()
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
<style>

</style>
