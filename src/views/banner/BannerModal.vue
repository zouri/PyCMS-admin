<template>
  <a-modal :title="title" :visible="visible" :width="800" :footer="null" @cancel="cancelHandel">
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      @submit="handleSubmit"
    >
      <a-form-item label="自定义类型">
        <a-select
          v-decorator="[
            'type_',
            {
              initialValue: 'index',
              rules: [{ required: true, message: 'Please select your gender!' }]
            },
          ]"
        >
          <a-select-option value="index">首页</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="排序序号">
        <a-input-number
          style="width: 100%"
          v-decorator="[
            'order_id',
            {
              initialValue: 100,
              rules: [{ required: true, message: '请输入类型!' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="图片">
        <a-upload
          action="/apps/api/media/upload"
          list-type="picture"
          :headers="headers"
          :file-list="bannerList"
          @change="handleChange"
          v-decorator="[
            'img',
            {rules: [
              { required: true, message: '请上传图片' },
              { validator: (rule, value, callback) => this.handelImg(rule, value, callback) },
            ]}
          ]"
        >
          <a-button><a-icon type="upload" /> 本地上传 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="标题">
        <a-textarea
          placeholder="这里输入图片相关注释说明"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          v-decorator="[
            'title',
            {
              rules: [{ required: false, message: '标题内容' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="链接">
        <a-input
          placeholder="输入链接"
          v-decorator="[
            'link_url',
            {
              rules: [{ required: false, message: '输入链接地址' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { UpdateBanner, BannersManager } from '@/api/public_info'
export default {
  data () {
    return {
      headers: {
        'Access-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      visible: false,
      title: '',
      bannerList: [],
      bannerInfo: null
    }
  },
  computed: {
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'banner' })
  },
  methods: {
    edit (t) {
      this.visible = true
      if (t === 'new') {
        this.title = '添加图片'
        this.bannerInfo = t
      } else {
        this.title = '修改图片'
        this.bannerInfo = t
        this.bannerList = [{
          uid: '-1',
          name: t.title,
          status: 'done',
          url: t.url
        }]
        this.$nextTick(() => {
          const values = this.form.getFieldsValue()
          Object.keys(values).forEach((k) => {
              values[k] = t[k]
          })
          values.img = this.bannerInfo
          this.form.setFieldsValue(values)
        })
      }
    },
    handleChange (info) {
      let bannerList = [...info.fileList]
      bannerList = bannerList.slice(-1)
      bannerList = bannerList.map(file => {
        if (file.response && file.response.error_code === 0) {
          const data = file.response.data
          this.bannerInfo = data
        }
        return file
      })
      this.bannerList = bannerList
    },
    addBanner (data) {
      BannersManager('post', data)
        .then(response => {
          this.$message.success('新增成功')
          this.visible = false
        })
        .catch(response => {
          this.$message.error('上传失败')
        })
    },
    modifyBanner (id, data) {
      UpdateBanner(id, data)
        .then(response => {
          this.$message.success('修改成功')
          this.visible = false
        })
        .catch(response => {
          this.$message.error('修改失败')
        })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // 判断是新上传的还是老的文件
          const data = {
            'title': values.title,
            'order_id': values.order_id,
            'link_url': values.link_url,
            'type_': values.type_,
            'img_id': this.bannerInfo.file_id
          }
          if (this.bannerInfo.id === undefined) {
            this.addBanner(data)
          } else {
            this.modifyBanner(this.bannerInfo.id, data)
          }
          // console.log('Received values of form: ', data)
        }
      })
    },
    handelImg (rule, value, callback) {
      callback()
    },
    cancelHandel () {
      this.bannerList = []
      this.form.resetFields()
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
