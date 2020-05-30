<template>
  <div class="app-container" gutter="20">
    <el-row justify="end">
      <el-col :offset="0">
        <el-button-group style="margin-bottom: 10px;">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="dialogFormVisible = true;addType = 'son';dialagType='add';"
          >子节点</el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="dialogFormVisible = true;addType = 'brother';dialagType='add';"
          >兄弟节点</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      ref="treeTable"
      v-loading="listLoading"
      element-loading-text="Loading"
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :default-expand-all="tableExpand"
      :expand-row-keys="expandKeys"
      fit
      stripe
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @select="singleSelect"
      @select-all="cancelSelect"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" sortable width="50" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="value" label="编码" width="180" />
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="typeCssFormater(scope.row)"
            effect="dark"
          >{{ typeFormater(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="图标" width="100">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="100" />
      <el-table-column prop="url" label="URL" />
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="updateResource(scope.row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeResource(scope.$index, scope.row)"
            />
          </el-button-group>
          <!-- <el-button size="mini" @click="updateResource(scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="removeResource(scope.$index, scope.row)">
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <el-dialog
      title="增加/编辑资源"
      :visible.sync="dialogFormVisible"
      width="30%"
      center
      @close="resetForm()"
    >
      <el-form :model="addForm" label-width="100px" label-position="right">
        <el-form-item label="资源名">
          <el-input v-model="addForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="资源编码">
          <el-input v-model="addForm.value" auto-complete="off" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择资源类型">
            <el-option label="菜单" value="0" />
            <el-option label="页面" value="1" />
            <el-option label="按钮" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标">
          <e-icon-picker v-model="addForm.icon" :options="options" />
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="addForm.url" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述/备注">
          <el-input v-model="addForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateResource">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, add, remove } from '@/api/resourcemanage'
import moment from 'moment'

export default {
  filters: {},
  data() {
    return {
      list: undefined,
      addForm: {
        name: undefined,
        value: undefined,
        type: undefined,
        url: undefined,
        remark: undefined,
        parentId: undefined,
        id: undefined,
        icon: undefined
      },
      listLoading: true,
      dialogFormVisible: false,
      addType: undefined,
      dialagType: undefined,
      options: {
        FontAwesome: false,
        ElementUI: true
      },
      tableExpand: false,
      expandKeys: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    addOrUpdateResource() {
      if (this.dialagType === 'update') {
        add(this.addForm).then(response => {
          if (response.code === '200') {
            this.dialogFormVisible = false
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.fetchData()
          }
        })
      } else {
        this.addResource()
      }
    },
    addResource() {
      if (!this.currentSelection) {
        this.addForm.parentId = null
      } else {
        if (this.addType === 'son') {
          this.addForm.parentId = this.currentSelection.id
        }
        if (this.addType === 'brother') {
          this.addForm.parentId = this.currentSelection.parentId
        }
      }
      add(this.addForm).then(response => {
        console.log(response.code === '200')
        if (response.code === '200') {
          this.dialogFormVisible = false
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        }
      })
    },
    updateResource(row) {
      this.addForm.name = row.name
      this.addForm.value = row.value
      this.addForm.remark = row.remark
      this.addForm.parentId = row.parentId
      this.addForm.id = row.id
      this.addForm.type = row.type + ''
      this.addForm.url = row.url
      this.addForm.icon = row.icon
      this.dialogFormVisible = true
      this.dialagType = 'update'
    },
    removeResource(index, row) {
      this.$confirm(
        '此操作将永久删除资源[' + row.name + '], 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          remove({ resourceId: row.id }).then(response => {
            if (response.code === '200') {
              this.$message({
                type: 'success',
                message: response.message
              })
              this.fetchData()
              return
            }
            this.$message({
              type: 'error',
              message: response.message
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    statusFormater(row, index, value) {
      const statusMap = {
        0: '可用',
        1: '不可用'
      }
      return statusMap[value]
    },
    typeFormater(row, index, value) {
      const statusMap = {
        0: '菜单',
        1: '页面',
        2: '按钮'
      }
      return statusMap[row.type]
    },
    typeCssFormater(row, index, value) {
      const statusMap = {
        0: 'info',
        1: 'warning',
        2: 'danger'
      }
      return statusMap[row.type]
    },
    dateFormater(row, index, value) {
      if (value === undefined) {
        return ''
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    resetForm(formName) {
      this.addForm.name = undefined
      this.addForm.value = undefined
      this.addForm.remark = undefined
      this.addForm.url = undefined
      this.addForm.id = undefined
      this.addForm.type = undefined
      this.addForm.icon = undefined
    },
    singleSelect(selection, row) {
      this.$refs.treeTable.clearSelection()
      this.$refs.treeTable.toggleRowSelection(row, true)
      this.currentSelection = row
    },
    cancelSelect() {
      this.$refs.treeTable.clearSelection()
      this.currentSelection = {}
    }
  }
}
</script>
