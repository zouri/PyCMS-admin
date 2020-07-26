<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-list
        :grid="{ gutter: 16, column: 6, xs: 2, md: 4, lg: 6, xl: 8 }"
        :data-source="data_list"
        :loading="dataLoading"
      >
        <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
          <a-card hoverable :bodyStyle="{padding: '3px'}">
            <img :alt="item.file_name" :src="`/static/upload_file/` + item.tb_url" style="width: 100%" />
            <a-card-meta :title="item.title">
              {{ item.type }}
            </a-card-meta>
            <template slot="actions" class="ant-card-actions">
              <a-icon type="eye" alt="预览" @click="handlePreview(item)" />
              <a-icon key="edit" type="edit" @click="editMedia(item)" />
              <a-icon key="delete" type="delete" @click="deleteMedia(item)" />
            </template>
          </a-card>
        </a-list-item>
      </a-list>
    </a-card>

    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <div v-if="previewData.type === 1" >
        <img style="width: 100%" :src="`/static/upload_file/` + previewData.url" />
      </div>
      <div v-else-if="previewData.type === 2">
        <video controls style="width: 100%" >
          <source :src="`/static/upload_file/` + previewData.url" type="video/mp4">
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
      <p><b>简介: </b>{{ previewData.title }}</p>
      <p><b>上传时间: </b>{{ previewData.time }}</p>
      <!-- <p><b>上传用户: </b>{{ previewData.time }}</p> -->
    </a-modal>
  </page-header-wrapper>
</template>
<script>
import { mediaList, mediaDelete } from '@/api/media'
export default {
  name: 'MediaManager',
  data () {
    return {
      previewData: {},
      previewVisible: false,
      dataLoading: true,
      data_list: []
    }
  },
  computed: {
    previewImageData () {
      return {
        title: this.previewImage.title,
        url: `/static/upload_file/` + this.previewImage.url,
        time: this.previewImage.create_time
      }
    }
  },
  created () {
    mediaList()
      .then(res => {
        const data = res.data
        this.data_list = data.resources
        // console.log(this.data_list)
        this.dataLoading = false
      })
      .catch(error => {
        this.dataLoading = false
        console.log(error)
      })
  },
  methods: {
    handlePreview (data) {
      this.previewData = data
      this.previewVisible = true
    },
    handleCancel () {
      this.previewVisible = false
      this.previewData = {}
    },
    getCover (item) {
      if (item.type === 1) {
        return `/static/upload_file/` + item.tb_url
      } else {
        return '/apps/admin/default_video.svg'
      }
    },
    editMedia () {
      mediaDelete()
      // sd
    },
    deleteMedia () {
    }
  }
}
</script>
<style scoped>
.title {
  position: absolute;
  width: 100%;
  z-index: 2;
  left: 0;
  top: 0;
}
.img {
  width: 100%;
  position:relative;
}
.cover {
  background-position: center;
  background-repeat: no-repeat;
  background-size:cover;
  background-attachment:fixed;
}
.last_abc {
  background: #000;
  filter: alpha(opacity=38);
  -moz-opacity: 0.38;
  -khtml-opacity: 0.38;
  opacity: 0.38;
  transition: all 300ms ease-in-out;
  margin: 0;
}
</style>
