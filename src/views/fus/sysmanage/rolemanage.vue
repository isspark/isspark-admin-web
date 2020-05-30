<template>
  <div class="app-container" gutter="20">
    <el-row justify="end">
      <el-col :offset="0">
        <el-button-group style="margin-bottom: 10px;">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="dialogFormVisible = true;addType = 'son';dialagType='add';"
          >子节点</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="dialogFormVisible = true;addType = 'brother';dialagType='add';"
          >兄弟节点</el-button>
          <!-- <el-button type="primary" icon="el-icon-share" disabled />
          <el-button type="primary" icon="el-icon-delete" disabled />-->
        </el-button-group>
      </el-col>
    </el-row>
    <el-table
      ref="treeTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      default-expand-all
      fit
      highlight-current-row
      stripe
      row-key="id"
      :indent="30"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @select="singleSelect"
      @select-all="cancelSelect"
    >
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column label="序号" width="95" type="index" /> -->
      <el-table-column label="角色名称" prop="name" />
      <el-table-column label="角色编码" prop="value" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="注册时间" prop="createTime" :formatter="dateFormater" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="updateRole(scope.row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.$index, scope.row)"
            />
          </el-button-group>
          <!-- <el-button size="mini" @click="updateRole(scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="removeRole(scope.$index, scope.row)">
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!-- Form -->
    <el-dialog
      title="增加/编辑角色"
      :visible.sync="dialogFormVisible"
      width="30%"
      center
      @close="resetForm()"
    >
      <el-form :model="addForm" label-width="100px" label-position="right">
        <el-form-item label="角色名">
          <el-input v-model="addForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="addForm.value" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述/备注">
          <el-input v-model="addForm.remark" type="textarea" />
        </el-form-item>
        <el-form-item label="资源" prop="roleIds">
          <el-tree
            ref="tree"
            :data="resourceTree.treeData"
            show-checkbox
            node-key="id"
            check-strictly
            :default-expanded-keys="resourceTree.expandedKeys"
            :default-checked-keys="resourceTree.checkedKeys"
            :props="resourceTree.props"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, tree, remove, getResourceIdsByRoleId } from '@/api/rolemanage'
import { list } from '@/api/resourcemanage'
import moment from 'moment'

export default {
  data() {
    return {
      list: undefined,
      addForm: {
        name: undefined,
        value: undefined,
        remark: undefined,
        parentId: undefined,
        id: undefined,
        resourceIds: undefined
      },
      resourceTree: {
        treeData: undefined,
        expandedKeys: undefined,
        checkedKeys: undefined,
        props: {
          label: 'name'
        }
      },
      listLoading: true,
      dialogFormVisible: false,
      currentSelection: undefined,
      addType: undefined,
      dialagType: undefined
    }
  },
  created() {
    this.fetchData()
    this.getResourceTree()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      tree().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    getResourceTree() {
      list().then(response => {
        this.resourceTree.treeData = response.data
      })
    },
    addOrUpdateRole() {
      this.addForm.resourceIds = this.$refs.tree.getCheckedKeys()
      if (this.dialagType === 'update') {
        add(this.addForm).then(response => {
          if (response.code === '200') {
            this.dialogFormVisible = false
            this.$message({
              message: '更新角色成功！',
              type: 'success'
            })
            this.fetchData()
            this.resetForm()
          }
        })
      } else {
        this.addRole()
      }
    },
    addRole() {
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
      console.log(this.addForm.parentId)
      add(this.addForm).then(response => {
        console.log(response.code === '200')
        if (response.code === '200') {
          this.dialogFormVisible = false
          this.$message({
            message: '添加角色成功！',
            type: 'success'
          })
          this.fetchData()
          this.resetForm()
        }
      })
    },
    updateRole(row) {
      this.addForm.name = row.name
      this.addForm.value = row.value
      this.addForm.remark = row.remark
      this.addForm.parentId = row.parentId
      this.addForm.id = row.id
      this.dialogFormVisible = true
      this.dialagType = 'update'
      getResourceIdsByRoleId({ roleId: row.id }).then(response => {
        console.log(response.data === null)
        if (
          response.code === '200' &&
          response.data !== undefined &&
          response.data !== null
        ) {
          this.$refs.tree.setCheckedKeys(response.data)
          this.addForm.resourceIds = response.data
        }
      })
    },
    removeRole(index, row) {
      console.log(index)
      console.log(row)
      this.$confirm(
        '此操作将永久删除角色[' + row.name + '], 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          remove({ roleId: row.id }).then(response => {
            if (response.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
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
    resetForm(formName) {
      this.addForm.name = undefined
      this.addForm.value = undefined
      this.addForm.remark = undefined
      this.addForm.parentId = undefined
      this.addForm.id = undefined
      this.$refs.tree.setCheckedKeys([])
    },
    dateFormater(row, index, value) {
      if (value === undefined) {
        return ''
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    singleSelect(selection, row) {
      this.$refs.treeTable.clearSelection()
      this.$refs.treeTable.toggleRowSelection(row, true)
      this.addForm.parentId = row.parentId
      this.addForm.brotherId = row.id
      this.currentSelection = row
    },
    cancelSelect() {
      this.$refs.treeTable.clearSelection()
      this.currentSelection = {}
    }
  }
}
</script>
