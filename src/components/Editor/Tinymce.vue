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
  import storage from 'store'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { axios } from '@/utils/request'
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  import 'tinymce/icons/default'
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
          language_url: `/apps/admin/tinymce/langs/zh_CN.js`,
          language: 'zh_CN',
          skin_url: `/apps/admin/tinymce/skins/ui/oxide`,
          content_css: `/apps/admin/tinymce/skins/content/default/content.css`,
          // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
          // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
          height: 480,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          relative_urls: false, // 关闭转换相对路径
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
          file_picker_types: 'media',
          file_picker_callback: (cb, value, meta) => {
            // 当点击meidia图标上传时,判断meta.filetype == 'media'有必要，因为file_picker_callback是media(媒体)、image(图片)、file(文件)的共同入口
            if (meta.filetype === 'media') {
              // 创建一个隐藏的type=file的文件选择input
              const input = document.createElement('input')
              input.setAttribute('type', 'file')
              input.onchange = function () {
                const file = this.files[0] // 只选取第一个文件。如果要选取全部，后面注意做修改
                let xhr, formData
                // eslint-disable-next-line prefer-const
                xhr = new XMLHttpRequest()
                xhr.open('POST', '/apps/api/media/upload')
                xhr.setRequestHeader('Access-Token', storage.get(ACCESS_TOKEN))
                xhr.upload.onprogress = function (e) {
                  // 进度(e.loaded / e.total * 100)
                }
                xhr.onerror = function () {
                  // 根据自己的需要添加代码
                  console.log(xhr.status)
                  // eslint-disable-next-line no-useless-return
                  return
                }
                xhr.onload = function () {
                  if (xhr.status < 200 || xhr.status >= 300) {
                    console.log('HTTP 错误: ' + xhr.status)
                    return
                  }
                  let response
                  // eslint-disable-next-line prefer-const
                  response = JSON.parse(xhr.responseText)
                  // 假设接口返回JSON数据为{status: 0, msg: "上传成功", data: {location: "/localImgs/1546434503854.mp4"}}
                  if (response.error_code === 0) {
                    // 接口返回的文件保存地址
                    const mediaLocation = response.data.url
                    alert(mediaLocation)
                    // cb()回调函数，将mediaLocation显示在弹框输入框中
                    cb(mediaLocation, { title: file.name })
                  } else {
                    console.log(response.message)
                    // eslint-disable-next-line no-useless-return
                    return
                  }
                }
                // eslint-disable-next-line prefer-const
                formData = new FormData()
                // 假设接口接收参数为file,值为选中的文件
                formData.append('file', file)
                // 正式使用将下面被注释的内容恢复
                xhr.send(formData)
              }
              // 触发点击
              input.click()
            }
          },
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
              xhr.open('POST', '/apps/api/media/upload')
              xhr.setRequestHeader('Access-Token', storage.get(ACCESS_TOKEN))
              xhr.onload = function () {
                var response
                if (xhr.status !== 200) {
                  failure('HTTP Error: ' + xhr.status)
                  return
                }
                response = JSON.parse(xhr.responseText)
                // console.log(response, '这里是数据')
                // console.log(typeof response.data, '这里是数据类型')
                if (!response.data || typeof response.data.abs_path !== 'string') {
                  failure('Invalid JSON: ' + xhr.responseText)
                  return
                }
                console.log(response.data.abs_path)
                success('/static/upload_file/' + response.data.abs_path)
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
