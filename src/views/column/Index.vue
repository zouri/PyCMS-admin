<template>
  <div class="page-header-index-wide">
    <a-card title="栏目管理" :bodyStyle="{padding: 0}">
      <div slot="extra">
        <a-button @click="edit_col_model = true" type="primary" class="action_btn">新增栏目</a-button>

        <a-popconfirm
          title="确认删除这些栏目吗?"
          @confirm="delColumn"
          okText="Yes"
          cancelText="No"
        >
          <!-- <a href="#">Delete</a> -->
          <a-button :disabled="del_col_btn" type="danger" class="action_btn">删除栏目</a-button>
        </a-popconfirm>
      </div>

      <!-- 表格调整 -->
      <a-table
        rowKey="id"
        size="middle"
        :columns="table_columns"
        :dataSource="table_data"
        :rowSelection="{ selectedRowKeys: selected_row_keys, onChange: onSelectChange }"
      >
        <template slot="operation" slot-scope="text, row">
          <a-button @click="editerColumn(row)" size="small" class="action_btn" >
            编辑
          </a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 新建栏目表单 -->
    <a-modal v-model="edit_col_model" @ok="handleSubmit">
      <span slot="title">
        新增栏目
      </span>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
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
import { GetColumns, CreateColumn, DeleteColumns } from '@/api/column_manager'
export default {
  name: 'ColumnManager',
  data () {
    return {
      edit_col_model: false,
      table_data: null,
      table_columns: [
        {
          title: 'id',
          dataIndex: 'id',
          width: 60
        },
        {
          title: '栏目标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '栏目ID',
          dataIndex: 'name',
          ellipsis: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          ellipsis: true,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      selected_row_keys: [],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  computed: {
    del_col_btn () {
      return this.selected_row_keys.length === 0
    }
  },
  created () {
    this.initTreeData()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selected_row_keys = selectedRowKeys
    },
    initTreeData () {
      GetColumns()
        .then(response => {
          console.log(response.data)
          this.table_data = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    addColumn () {
      console.log('abcdef')
    },
    delColumn () {
      DeleteColumns(this.selected_row_keys)
      .then(response => {
        this.initTreeData()
        })
      .catch(error => {
        console.log(error, 'abcdef')
        this.$notification['error']({
          message: '错误',
          description: ((error.response || {}).data || {}).message || '请检查要删除的栏目是否为空',
          duration: 4
        })
      })
    },
    editerColumn (row) {
      console.log(row)
    },
    // 表单内容
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          CreateColumn(values)
            .then(response => {
              this.initTreeData()
              this.edit_col_model = false
              })
            .catch(error => {
              this.$notification['error']({
                message: '错误',
                description: ((error.response || {}).data || {}).message || '请求出现错误，请稍后再试',
                duration: 4
              })
            })
        }
      })
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
