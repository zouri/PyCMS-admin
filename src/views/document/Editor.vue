<template>
  <div class="page-header-index-wide">
    <a-card>
      <div slot="title" style="margin-right: 10px">
        <span>
          <span v-if="status != 'new'" >编辑文章</span>
          <span v-else>新建文章</span>
        </span>
        <span style="margin-left: 6px;">
          <a-tag v-if="status === 0" >未保存</a-tag>
          <a-tag v-else-if="status === 1" color="blue">未发布</a-tag>
          <a-tag v-else-if="status === 2" color="green">已发布</a-tag>
          <a-tag v-else-if="status === 3" color="orange">已撤回</a-tag>
        </span>
      </div>

      <div slot="extra">
        <!-- 0: 本地未保存   1: 未发布   2: 已发布   3: 已撤回-->
        <a-button v-if="status === 2" @click="updateStatus(3)" class="action_btn" >
          撤回
        </a-button>
        <a-button @click="actionModal = true" type="primary" class="action_btn">
          保存/发布
        </a-button>
        <a-popconfirm v-if="docId !== 'new'" title="删掉这篇文章?" @confirm="() => deleteDocument()" >
          <a-button type="danger" class="action_btn" >
            删除
          </a-button>
        </a-popconfirm>
      </div>

      <!-- 预览和标题 -->
      <a-row>
        <a-col :span="22">
          <textarea v-model="title" rows="1" type="textarea" class="title_input" placeholder="在这里输入你的标题" />
        </a-col>
        <a-col :span="2">
          <a-button @click="previewModal = true" class="action_btn" style="width: 100%" icon="eye" >
            预览
          </a-button>
        </a-col>
      </a-row>

      <!-- 编辑器 -->
      <editor ref="editor" v-model="content" />
    </a-card>

    <!-- 文章保存还是发布modal -->
    <a-modal v-model="actionModal" title="文章操作">
      <template slot="footer">
        <a-button key="back" @click="actionDocument(1)">
          否,仅保存不发布
        </a-button>
        <a-button key="submit" type="primary" :loading="actionModalLoading" @click="actionDocument(2)">
          是,保存并发布
        </a-button>
      </template>
      保存文章并发布
    </a-modal>

    <!-- 文章预览modal -->
    <a-modal v-model="previewModal" title="文章预览" width="970px">
      <div style="text-align: center"><h2>{{ title }}</h2></div>
      <div v-html="content"></div>
    </a-modal>
  </div>
</template>

<script>
import { docDel, docUpdateAttr, docDetails, docUpdate, docAdd } from '@/api/document_manager'
import TinymceEditor from '@/components/Editor/Tinymce'
export default {
  name: 'DocumentEditor',
  components: {
    'editor': TinymceEditor
  },
  props: {
    docId: {
      type: String,
      default: 'new'
    },
    colId: {
      type: String,
      default: 'new'
    }
  },
  data () {
    return {
      response_data: {},
      title: '',
      content: '',
      author: '',
      create_time: '',
      pub_time: '',
      column_id: this.colId,
      column: 'news',
      status: 0,
      actionModal: false,
      actionModalLoading: false,
      previewModal: false
    }
  },
  computed: {
    doc_info () {
      return {
        id: this.docId,
        title: this.title,
        content: this.content,
        column_id: this.column_id,
        status: this.status
      }
    }
  },
  watch: {
    response_data (newV) {
      const data = newV
      this.title = data.title
      this.content = data.content_html
      this.author = data.author
      this.create_time = data.create_time
      this.pub_time = data.pub_time
      this.column = data.column
      this.column_id = data.column_id
      this.status = data.status
    }
  },
  created () {
  },
  mounted () {
    // 如果不是新建文档则重新拉去文章内容
    if (this.docId !== 'new') {
      docDetails(this.docId)
      .then(response => {
        this.response_data = response.data
      })
      .catch(errors => {
        console.log(errors)
      })
    }
  },
  methods: {
    actionDocument (action) {
      this.status = action
      console.log(this.column_id, '这里是栏目ID')
      if (this.docId === 'new') {
        // this.addDocument()
        // 新增文档
        docAdd(this.doc_info)
          .then(response => {
            this.response_data = response.data
            this.$message.success('文章创建成功!')
            const url = '/document/' + 'editor/' + this.column_id + '/' + this.response_data.id
            this.$router.replace(url)
            this.actionModal = false
          })
          .catch(error => {
            this.$notification['error']({
              message: '错误',
              description: ((error.response || {}).data || {}).message || '请求出现错误，请稍后再试',
              duration: 4
            })
        })
      } else {
        // this.updateDocument()
        // 文档修改
        docUpdate(this.doc_info)
          .then(response => {
            this.response_data = response.data
            this.$message.success('文章更新成功!')
            this.actionModal = false
          })
          .catch(error => {
            this.$notification['error']({
              message: '错误',
              description: ((error.response || {}).data || {}).message || '请求出现错误，请稍后再试',
              duration: 4
            })
          })
      }
    },
    deleteDocument () {
      docDel(this.docId)
        .then(response => {
          this.$router.replace('/document_manager')
        })
        .catch(error => {
          this.$notification['error']({
            message: '错误',
            description: ((error.response || {}).data || {}).message || '请求出现错误，请稍后再试',
            duration: 4
          })
        })
    },
    updateStatus (statusCode) {
      docUpdateAttr(this.docId, 'status', statusCode)
        .then(response => {
          this.response_data = response.data
          this.$message.success('文章状态更新成功!')
          this.actionModal = false
        })
        .catch(error => {
          this.$notification['error']({
            message: '错误',
            description: ((error.response || {}).data || {}).message || '请求出现错误，请稍后再试',
            duration: 4
          })
        })
    }
  }
}
</script>

<style scoped>
  .action_btn {
    margin: 2px 2px 2px 2px
  }
  .title_input {
    /* border-bottom: 1px solid #000; */
    /* border: none;
    border-color: #40a9ff;
    box-shadow: none;
    border-radius: 0px;
    border-bottom: 1px solid #40a9ff;
    border-right-width: 1px !important;
    margin-bottom: 3px; */
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: 32px;
    font-weight: 700;
    color: #000;
    border: none;
    outline: none;
    resize: none;
    overflow: hidden;
  }
</style>
