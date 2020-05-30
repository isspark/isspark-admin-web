<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input
        v-model="listQuery.username"
        placeholder="用户名"
        style="width: 200px;"
        clearable
        @keyup.enter.native="fetchData"
      />
      <el-input
        v-model="listQuery.mobile"
        placeholder="手机号码"
        style="width: 200px;margin-left: 10px;"
        clearable
        @keyup.enter.native="fetchData"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px;"
        @click="fetchData"
      >搜索</el-button>
      <el-button
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="dialogFormVisible = true;addOrUpdateFlag = 0"
      >添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      stripe
    >
      <el-table-column label="序号" width="95" type="index" />
      <el-table-column label="用户名" prop="name" />
      <el-table-column label="真实姓名" prop="realName" align="center" />
      <el-table-column label="手机号" prop="mobile" align="center" />
      <el-table-column label="性别" prop="sex" :formatter="sexFormater" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.sex === 0 ? 'el-icon-male' : 'el-icon-female'" />
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createTime" :formatter="dateFormater" align="center" />
      <el-table-column label="状态" prop="status" :formatter="statusFormater" align="center">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.status === 0 ? 'success' : 'danger'"
            effect="plain"
          >{{ scope.row.status === 0 ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="updateUser(scope.$index, scope.row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.$index, scope.row)"
            />
          </el-button-group>
          <!-- <el-button size="mini" @click="updateUser(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="removeUser(scope.$index, scope.row)">
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="total"
      :current-page="listQuery.currentPage"
      :page-sizes="pagesizes"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- Form -->
    <el-dialog
      title="增加/修改用户"
      :visible.sync="dialogFormVisible"
      width="30%"
      center
      @close="resetForm('addUserForm')"
    >
      <el-form
        ref="addUserForm"
        :model="addUserForm"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addUserForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addUserForm.realName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addUserForm.sex" placeholder="请选择性别">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUserForm.mobile" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="addUserForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1"
          />
          <!-- </el-switch> -->
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-tree
            ref="tree"
            :data="roleTree.treeData"
            show-checkbox
            node-key="id"
            check-strictly
            :default-expanded-keys="roleTree.expandedKeys"
            :default-checked-keys="roleTree.checkedKeys"
            :props="roleTree.props"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  page,
  add,
  remove,
  update,
  getRoleIdsByUserId
} from '@/api/usermanage'
import { tree } from '@/api/rolemanage'
import moment from 'moment'

export default {
  data() {
    return {
      list: null,
      listQuery: {
        username: undefined,
        mobile: undefined,
        currentPage: 1,
        pageSize: 10
      },
      roleTree: {
        expandedKeys: [],
        checkedKeys: [],
        treeData: [],
        props: {
          label: 'name'
        }
      },
      pagesizes: [10, 20, 50, 100],
      total: 0,
      addUserForm: {
        id: undefined,
        name: undefined,
        mobile: undefined,
        realName: undefined,
        password: undefined,
        sex: '0',
        status: undefined,
        roleIds: []
      },
      addOrUpdateFlag: 0,
      listLoading: true,
      dialogFormVisible: false,
      currentPage: 1,
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        realName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        mobile: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
    this.getTreeData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        console.log(response.data)
        const data = response.data
        this.list = response.data.records
        this.total = data.total
        this.listQuery.currentPage = data.current
        this.listLoading = false
      })
    },
    saveOrUpdate(addUserForm) {
      this.addUserForm.roleIds = this.$refs.tree.getCheckedKeys()
      this.$refs[addUserForm].validate(valid => {
        if (valid) {
          if (this.addOrUpdateFlag === 0) {
            add(this.addUserForm).then(response => {
              if (response.code === '200') {
                this.dialogFormVisible = false
                this.$message({
                  message: '添加用户成功！',
                  type: 'success'
                })
                this.fetchData()
                this.resetForm(addUserForm)
                return
              }
              this.dialogFormVisible = true
            })
          }
          if (this.addOrUpdateFlag === 1) {
            console.log('修改中')
            update(this.addUserForm).then(response => {
              if (response.code === '200') {
                this.dialogFormVisible = false
                this.$message({
                  message: '更新用户成功！',
                  type: 'success'
                })
                this.fetchData()
                this.resetForm(addUserForm)
                return
              }
            })
          }
        }
      })
    },
    getTreeData() {
      tree().then(response => {
        console.log(response.data)
        this.roleTree.treeData = response.data
      })
    },
    updateUser(index, row) {
      this.dialogFormVisible = true
      this.addOrUpdateFlag = 1
      this.addUserForm.name = row.name
      this.addUserForm.id = row.id
      this.addUserForm.mobile = row.mobile
      this.addUserForm.realName = row.realName
      this.addUserForm.password = row.password
      this.addUserForm.sex = row.sex + ''
      this.addUserForm.status = row.status + ''
      getRoleIdsByUserId({ userId: row.id }).then(response => {
        console.log(response.data === null)
        if (
          response.code === '200' &&
          response.data !== undefined &&
          response.data !== null
        ) {
          this.$refs.tree.setCheckedKeys(response.data)
          this.addUserForm.roleIds = response.data
        }
      })
    },
    removeUser(index, row) {
      console.log(index)
      console.log(row)
      this.$confirm(
        '此操作将永久删除用户[' + row.name + '], 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          remove({ userId: row.id }).then(response => {
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
      this.addUserForm.name = undefined
      this.addUserForm.id = undefined
      this.addUserForm.mobile = undefined
      this.addUserForm.realName = undefined
      this.addUserForm.password = undefined
      this.$refs.tree.setCheckedKeys([])
    },
    sexFormater(row, index, value) {
      const statusMap = {
        0: '男',
        1: '女'
      }
      return statusMap[value]
    },
    statusFormater(row, index, value) {
      const statusMap = {
        0: '可用',
        1: '不可用'
      }
      return statusMap[value]
    },
    dateFormater(row, index, value) {
      if (value === undefined) {
        return ''
      }
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.fetchData()
    }
  }
}
</script>
