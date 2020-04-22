<template>
  <div class="page-header-index-wide">
    <a-card>
      <div slot="title" style="margin-right: 10px">
        <a-input v-model="articleInfo.title" placeholder="请输入文章标题" />
      </div>
      <div slot="extra">
        <!-- 0: 本地未保存   1: 未发布   2: 已发布   3: 已撤回-->
        <a-button
          v-if="articleInfo.status === 2"
          @click="updateStatus(3)"
          type="danger"
          class="action_btn"
        >
          撤回
        </a-button>
        <!--        v-else-if="articleInfo.status === 3 || articleInfo.status === 1 "-->
        <a-button
          v-else
          @click="actionModal = true"
          type="primary"
          class="action_btn"
        >
          保存
        </a-button>

        <a-button
          @click="previewModal = true"
          class="action_btn"
        >
          预览
        </a-button>

        <a-popconfirm
          title="删掉这篇文章?"
          @confirm="() => deleteArticle()"
        >
          <a-button
            type="danger"
            class="action_btn"
          >
            删除
          </a-button>
        </a-popconfirm>
      </div>
      <QuillEditor v-model="articleInfo.content"/>
    </a-card>

    <a-modal v-model="actionModal" title="文章操作">
      <template slot="footer">
        <a-button key="back" @click="actionArticle(1)">
          否,仅保存不发布
        </a-button>
        <a-button key="submit" type="primary" :loading="actionModalLoading" @click="actionArticle(2)">
          是,保存并发布
        </a-button>
      </template>
      保存文章并发布
    </a-modal>

    <a-modal v-model="previewModal" title="文章预览" width="90%">
      <div v-html="articleContent"></div>
    </a-modal>
  </div>
</template>

<script>
import { articleDel, articleUpdateStatus, articleDetails, articleUpdate, articleAdd } from '@/api/article_manager'
import QuillEditor from '@/components/Editor/QuillEditor'
export default {
  name: 'Editor',
  components: {
    QuillEditor
  },
  props: {
    articleId: {
      type: String,
      default: 'new'
    }
  },
  data () {
    return {
      articleInfo: {
        id: '',
        title: '',
        content: '',
        author: '',
        create_time: '',
        pub_time: '',
        status: 0
      },
      actionModal: false,
      actionModalLoading: false,
      previewModal: false
    }
  },
  computed: {
    articleContent () {
      return this.articleInfo.content
    }
  },
  created () {
    if (this.articleId !== 'new') {
      articleDetails(this.articleId)
        .then(response => {
          this.articleInfo = response.data
        })
        .catch(errors => {
          console.log(errors)
        })
    }
  },
  mounted () {
    console.log(this.articleId, 'ididididi')
    console.log(this.articleId, 'ididididi')
    console.log(this.articleId, 'ididididi')
  },
  methods: {
    actionArticle (action) {
      this.articleInfo.status = action
      console.log(this.articleInfo.content, '问问你问问')
      console.log(this.articleContent, 'CCCCCCCC')
      if (this.articleId === 'now') {
        // this.addArticle()
      } else {
        // this.updateArticle()
      }
    },
    addArticle () {
      articleAdd(this.articleInfo)
        .then(response => {
          console.log('abc')
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateArticle () {
      articleUpdate(this.articleInfo)
        .then(response => {
          console.log('abc')
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteArticle () {
      this.tableLoading = true
      articleDel(this.articleId)
        .then(response => {
          console.log(response)
          this.tableLoading = false
        })
        .catch(error => {
          console.log(error)
          this.tableLoading = false
        })
    },
    updateStatus (statusCode) {
      this.tableLoading = true
      articleUpdateStatus(this.articleId, this.articleStatus)
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

<style scoped>
  .action_btn {
    margin: 2px 2px 2px 2px
  }
</style>
