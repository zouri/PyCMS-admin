<template>

  <a-modal
    title="修改封面"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancelHandel">
    <a-row>
      <a-col v-if="is_previews" :xs="24" :md="24" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col v-else :xs="24" :md="24" :style="{height: '350px'}">
        <div class="cover-upload-preview">
          <img :src="url"/>
        </div>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
          <a-button icon="upload" @click="url=null">选择图片</a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{span: 1, offset: 2}" :md="2">
        <a-button icon="plus" @click="changeScale(1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="minus" @click="changeScale(-1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="undo" @click="rotateLeft"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="redo" @click="rotateRight"/>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="finish('blob')">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>

</template>
<script>
export default {
  data () {
    return {
      visible: false,
      url: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        img: this.url,
        autoCrop: true,
        fixedBox: true,
        autoCropWidth: 480,
        autoCropHeight: 300
      },
      previews: {}
    }
  },
  computed: {
    is_previews () {
      return this.url === null
    }
  },
  methods: {
    edit (coverUrl) {
      console.log(coverUrl, '传输叔叔')
      this.visible = true
      this.url = coverUrl
      /* 获取原始头像 */
    },
    close () {
      this.url = null
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload (file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      return false
    },

    // 上传图片（点击上传按钮）
    finish (type) {
      console.log('finish')
      const _this = this
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
          formData.append('file', data, this.fileName)
          this.$http.post('/upload/img', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
              console.log('upload response:', response)
              if (response.error_code === 0) {
                _this.$message.success('上传成功')
                _this.$emit('ok', '/static/upload_file/' + response.data.abs_path)
                _this.visible = false
              } else {
                _this.$message.danger('上传失败')
              }
            })
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    okHandel () {
      const vm = this
      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success('上传封面成功')
      }, 2000)
    },

    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>

  .cover-upload-preview {
    position: absolute;
    /*top: 50%;*/
    /*transform: translate(50%, -50%);*/
    width: 480px;
    height: 300px;
    /*border-radius: 50%;*/
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
