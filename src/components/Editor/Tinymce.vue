<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="tinymceInit"
      @onClick="onClick">
    </editor>
  </div>
</template>
<script>
// import { axios } from '@/utils/request'
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  // 编辑器插件plugins
  // 更多插件参考：https://www.tiny.cloud/docs/plugins/
  import 'tinymce/plugins/image'// 插入上传图片插件
  import 'tinymce/plugins/media'// 插入视频插件
  import 'tinymce/plugins/table'// 插入表格插件
  import 'tinymce/plugins/lists'// 列表插件
  import 'tinymce/plugins/paste'// 复制黏贴
  import 'tinymce/plugins/wordcount'// 字数统计插件
  export default {
    components: {
      Editor
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
      // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
      baseUrl: {
        type: String,
        default: '/assets'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table wordcount paste'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
      },
      accept: {
        type: String,
        default: 'image/jpeg, image/png'
      },
      maxSize: {
        type: Number,
        default: 2097152
      },
      withCredentials: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        tinymceInit: {
          language_url: `/tinymce/langs/zh_CN.js`,
          language: 'zh_CN',
          skin_url: `/tinymce/skins/ui/oxide`,
          content_css: `/tinymce/skins/content/default/content.css`,
          // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
          // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
          height: 480,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.6; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,
          paste_retain_style_properties: 'all',
          paste_word_valid_elements: '*[*]', // word需要它
          paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
          paste_convert_word_fake_lists: false, // 插入word文档需要该属性
          paste_webkit_styles: 'all',
          paste_merge_formats: true,
          nonbreaking_force_tab: false,
          paste_auto_cleanup_on_paste: false,
          style_formats: [
            {
              title: '首行缩进',
              block: 'p',
              styles: { 'text-indent': '2em' }
            },
            {
              title: '行高',
              items: [
                { title: '1', styles: { 'line-height': '1' }, inline: 'span' },
                { title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span' },
                { title: '2', styles: { 'line-height': '2' }, inline: 'span' },
                { title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span' },
                { title: '3', styles: { 'line-height': '3' }, inline: 'span' }
              ]
            }
          ],
          // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          // 如需ajax上传可参考 https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_handler: (blobInfo, success, failure) => {
            if (blobInfo.blob().size > self.maxSize) {
              failure('文件体积过大')
            }
            if (this.accept.indexOf(blobInfo.blob().type) >= 0) {
              uploadPic()
            } else {
              failure('图片格式错误')
            }
            function uploadPic () {
              var xhr, formData
              xhr = new XMLHttpRequest()
              xhr.withCredentials = false
              xhr.open('POST', '/apps/api/upload/img')
              xhr.onload = function () {
                var response
                if (xhr.status !== 200) {
                  failure('HTTP Error: ' + xhr.status)
                  return
                }
                response = JSON.parse(xhr.responseText)
                console.log(response, '这里是数据')
                console.log(typeof response.data, '这里是数据类型')
                if (!response.data || typeof response.data.url !== 'string') {
                  failure('Invalid JSON: ' + xhr.responseText)
                  return
                }
                console.log(response.data.url)
                success(response.data.url)
              }
              formData = new FormData()
              formData.append('file', blobInfo.blob(), blobInfo.filename())
              xhr.send(formData)
            }
          }
        },
        myValue: this.value,
        myValueText: ''
      }
    },
    mounted () {
    },
    methods: {
      // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
      // 需要什么事件可以自己增加
      onClick (e) {
        this.$emit('onClick', e, tinymce)
      },
      // 可以添加一些自己的自定义事件，如清空内容
      clear () {
        this.myValue = ''
      }
    },
    watch: {
      value (newValue) {
        this.myValue = newValue
      },
      myValue (newValue) {
        this.$emit('input', newValue)
      }
    }
  }
</script>
