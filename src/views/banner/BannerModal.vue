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
            'type',
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
            'orders_id',
            {
              initialValue: 100,
              rules: [{ required: true, message: '请输入类型!' }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="图片">
        <a-upload
          action="/apps/api/upload/img"
          list-type="picture"
          :headers="headers"
          :file-list="fileList"
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
import { setBanner } from '@/api/public_info'
export default {
  data () {
    return {
      headers: {
        'Access-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      visible: false,
      title: '',
      fileList: []
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
      } else {
        this.title = '修改图片'
        this.fileList = [{
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
          values.img = this.fileList[0]
          this.form.setFieldsValue(values)
        })
      }
    },
    handleChange (info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map(file => {
        if (file.response) {
          const u = file.response.data.abs_url
          file.url = u
          // if (u.indexOf('http') >= 0) {
          //   file.url = u
          // } else {
          //   file.url = u
          // }
        }
        return file
      })
      this.fileList = fileList
    },
    handleSubmit (e) {
      e.preventDefault()
      // 判断是新上传的还是老的文件
      const f = this.fileList[0]
      let imgName = ''
      if (f.url === undefined) {
        // 新上传
        imgName = f.response.data.url
      } else {
        imgName = f.url
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          const data = {
            'title': values.title,
            'orders_id': values.orders_id,
            'link_url': values.link_url,
            'type': values.type,
            'img_name': imgName
          }
          setBanner(data)
            .then(response => {
              this.$message.success('成功上传')
            })
            .catch(response => {
              this.$message.error('失败上传')
            })
          console.log('Received values of form: ', data)
        }
      })
    },
    handelImg (rule, value, callback) {
      callback()
    },
    cancelHandel () {
      this.fileList = []
      this.form.resetFields()
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
