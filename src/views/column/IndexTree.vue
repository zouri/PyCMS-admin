<template>
  <div class="page-header-index-wide">
    <a-card title="栏目管理">
      <div slot="extra">
        <a-button @click="add_col_model = true" class="action_btn">新增根栏目</a-button>
        <a-button @click="add_col_model = true" :disabled="add_sub_btn" type="primary" class="action_btn">新增子栏目</a-button>
        <a-button @click="delColumn()" :disabled="del_col_btn" type="danger" class="action_btn">删除</a-button>
      </div>
      <a-tree
        checkable
        :treeData="tree_data"
        :replaceFields="replace_fields"
        :checkStrictly="true"
        @select="this.onSelect"
        @check="this.onCheck"
      >
        <!-- <span slot="title0010" style="color: #1890ff">sss</span> -->
      </a-tree>
    </a-card>

    <!-- 新建栏目表单 -->
    <a-modal v-model="add_col_model" title="新增栏目">

      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit" >
        <a-form-item label="标题">
          <a-input
            v-decorator="[ 'title', { rules: [{ required: true, message: '请输入栏目标题' }] }, ]"
            placeholder="栏目标题如: '新闻资讯'"
          />
        </a-form-item>
        <a-form-item label="栏目ID">
          <a-input
            v-decorator="[ 'name', { rules: [{ required: true, message: '请输入栏目ID' }] }, ]"
            placeholder="栏目ID如: 'xinwen'"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { GetColumns, CreateCol } from '@/api/column_manager'
export default {
  name: 'ColumnManager',
  data () {
    return {
      add_col_model: false,
      tree_data: null,
      replace_fields: {
        key: 'id'
      },
      selected_col: 0,
      checked_col: [],

      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  computed: {
    add_sub_btn () {
      return !this.selected_col.selected
    },
    del_col_btn () {
      return this.checked_col.length === 0
    }
  },
  created () {
    this.initTreeData()
  },
  methods: {
    onSelect (keys, info) {
      this.selected_col = info
      console.log(this.selected_col)
    },
    onCheck (e, info) {
      this.checked_col = e.checked
    },
    initTreeData () {
      GetColumns()
        .then(response => {
          console.log(response.data)
          this.tree_data = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSubmit (e) {
      console.log(e, 'eeeee')
    },
    addColumn () {
      // CreateCol()
      console.log('abcdef')
    },
    delColumn () {
      CreateCol()
      console.log('删除,删除')
    }
  }
}
</script>

<style lang="less">
  .action_btn {
    margin: 2px 2px 2px 2px
  }
  /*.ant-form-item-label > label {*/
  /*  white-space: normal;*/
  /*}*/
</style>
