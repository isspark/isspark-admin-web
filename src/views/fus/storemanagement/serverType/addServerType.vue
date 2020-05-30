<template>
  <el-container style="height: 600px; border: 1px solid #eee">
    <el-header style="margin-top: 30px;">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="服务类型名称">
          <el-input v-model="formInline.serverName" placeholder="请输入服务类型名称" />
        </el-form-item>
        <el-form-item label="商户">
          <el-select v-model="formInline.storeId" placeholder="请选择商户">
            <el-option label="全部" value="-1" />
            <el-option label="平台" value="1001" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="onSubmit">查询</el-button>
          <el-button type="primary" round @click="dialogFormVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="服务名称" min-width="180" width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" min-width="180" width="300">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>老板电话: {{ scope.row.boosName }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.stroeName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :current-page.sync="currentPage1"
          prev-text="上一页"
          next-text="下一页"
          sizes-text="总共"
          :page-size="5"
          layout="slot, prev, pager, next"
          :total="tableDataSize"
          @current-change="handleCurrentChange"
        >
          <template v-slot>
            <span class="el-pagination__total">
              总共
              <label>{{ tableDataSize }}</label> 条数据
            </span>
          </template>
        </el-pagination>
      </div>
    </el-main>

    <el-dialog title="添加服务类型" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="类型名称 ：" :label-width="formLabelWidth">
          <el-input v-model="form.name" style="width: 70%" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addServerType">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑服务类型" :visible.sync="dialogFormVisible4edit">
      <el-form :model="editForm">
        <el-form-item label="类型名称 ：" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" style="width: 70%" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible4edit = false">取 消</el-button>
        <el-button type="primary" @click="editServerType">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
/* eslint-disable */
import { getToken } from "@/utils/auth";
import { addServerType, getServerTypeList, deleteServerType } from "@/api/fus";

export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogFormVisible4edit: false,
      currentEditId: -1,
      form: {
        name: ""
      },
      editForm: {
        name: ""
      },
      formInline: {
        serverName: "",
        storeId: ""
      },
      formLabelWidth: "120px",
      currentPage1: 1,

      tableData: [],
      tableDataSize: 0
    };
  },
  mounted() {
    this.serverTypeList({ page: 1, pageSize: 5 });
  },
  methods: {
    handleEdit(index, row) {
      console.log("row: " + JSON.stringify(row));
      this.dialogFormVisible4edit = true;
      this.editForm.name = row.name;
      this.currentEditId = row.id;
    },
    handleDelete(index, row) {
      var currentToken = getToken();
      deleteServerType(row.id, currentToken)
        .then(content => {
          this.$message("删除成功！");
          this.serverTypeList({ page: 1, pageSize: 5 });
        })
        .catch(err => {
          console.log(err);
        });
      
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.serverTypeList({ page: val, pageSize: 5 });
    },
    onSubmit() {
      var queryData = {};
      queryData.page = 1;
      queryData.pageSize = 5;
      if (this.formInline.serverName != "") {
        queryData.name = this.formInline.serverName;
      }
      if (this.formInline.storeId != "-1") {
        queryData.storeId = this.formInline.storeId;
      }

      this.serverTypeList(queryData);
    },
    serverTypeList(queryData) {
      var currentToken = getToken();
      getServerTypeList(queryData, currentToken)
        .then(content => {
          this.tableData = content.data.data.fusServerTypeDetailInfoVos;
          this.tableDataSize = content.data.data.count;

          console.log("content : " + JSON.stringify(content));
        })
        .catch(err => {
          console.log(err);
        });
    },
    addServerType() {
      this.dialogFormVisible = false;
      var currentToken = getToken();
      console.log("form : " + JSON.stringify(this.form));
 
      addServerType({ name: this.form.name }, currentToken)
        .then(content => {
          this.obj = content;
          this.$message("添加成功！");
          console.log("content : " + JSON.stringify(content));
          this.serverTypeList({ page: 1, pageSize: 5 });
        })
        .catch(err => {
          console.log(err);
        });
    },
    editServerType() {
      var currentToken = getToken();
      addServerType(
        { name: this.editForm.name, id: this.currentEditId },
        currentToken
      )
        .then(content => {
          this.obj = content;
          this.dialogFormVisible4edit = false;
          this.$message("修改成功！");
          this.currentEditId = -1;
          console.log("content : " + JSON.stringify(content));
          this.serverTypeList({ page: 1, pageSize: 5 });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.block {
  margin-top: 10px;
}
</style>