<template>
  <div class="user">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="dateTime" label="注册时间">
              <el-date-picker
                v-model="form.dateTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
              </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="isLoading" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="isLoading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
      :data="users"
      v-loading="isLoading"
      style="width: 100%">
      <el-table-column
        prop="id"
        align="center"
        label="用户ID">
      </el-table-column>
      <el-table-column
        align="center"
        label="头像">
        <template slot-scope="scope">
        <el-avatar :src="scope.row.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        :width="230"
        align="center"
        label="注册时间">
        <template slot-scope="scope">{{scope.row.createTime | format}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
        <el-tag :type="scope.row.status === 'ENABLE' ? 'success': 'danger'">
          {{scope.row.status}}
        </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :width="200"
        align="center"
        label="操作">
        <template slot-scope="scope">
        <el-button v-if="scope.row.status === 'ENABLE'" type="danger" @click="handleForbid(scope.row.id)" size="small">禁用</el-button>
        <el-button type="primary" size="small" @click="handleRole(scope.row.id)">分配角色</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :disabled="isLoading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.currentPage"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="30%">
      <el-select width="100%" v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { getUserPages } from "@/services/user";
import { allocateUserRoles, getAllRole, getUserRole, forbidUser } from "@/services/role";

Vue.filter("format", value => {
  const t = new Date(value);
  return `${t.getFullYear()}-${JSON.stringify(t.getMonth() + 1).padStart(2, "0")}-${JSON.stringify(t.getDate()).padStart(2, "0")} ${JSON.stringify(t.getHours()).padStart(2, "0")}:${JSON.stringify(t.getMinutes()).padStart(2, "0")}:${JSON.stringify(t.getSeconds()).padStart(2, "0")}`;
});
export default Vue.extend({
  name: "UserList",
  data () {
    return {
      users: [],
      form: {
        dateTime: "",
        name: "",
        pageSize: 10, // 每页数量
        currentPage: 1 // 当前页
      },
      roleIdList: [],
      roleArr: [],
      dialogVisible: false,
      total: 0,
      isLoading: false,
      roles: [],
      userRoles: [],
      userId: null,
      pickerOptions: {
        shortcuts: [{
          text: "最近一周",
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "最近一个月",
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "最近三个月",
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.loadUsers();
    this.loadRoles();
  },
  methods: {
    async loadUsers () {
      this.isLoading = true;
      const { data } = await getUserPages(this.form);
      this.users = data.data.records;
      this.total = data.data.total;
      this.isLoading = false;
    },
    async loadRoles () {
      const { data: { data: roles } } = await getAllRole();
      this.roles = roles;
    },
    onSubmit () {
      this.form.currentPage = 1;
      this.form.startCreateTime = this.form.dateTime[0];
      this.form.endCreateTime = this.form.dateTime[1];
      this.loadUsers();
    },
    onReset () {
      this.form.currentPage = 1;
      this.$refs.form.resetFields();
      this.loadUsers();
    },
    handleSizeChange (val) {
      this.form.pageSize = val;
      this.form.currentPage = 1;
      this.loadUsers();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.form.currentPage = val;
      this.loadUsers();
      console.log(`当前页: ${val}`);
    },
    async handleForbid (id) {
      try {
        const { data } = await forbidUser(id);
        if (data.code === "000000") {
          this.$message.success(data.mesg);
          this.loadUsers();
        } else {
          this.$message.error(data.mesg);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async handleRole (id) {
      const { data: { data: roles } } = await getUserRole(id);
      this.roleIdList = roles.map(item => item.id);
      this.userId = id;
      this.dialogVisible = true;
    },
    async submitRole () {
      try {
        const { data } = await allocateUserRoles({
          userId: this.userId,
          roleIdList: this.roleIdList
        });
        if (data.code === "000000") {
          this.$message.success(data.mesg);
          this.dialogVisible = false;
          this.loadUsers();
        } else {
          this.$message.error(data.mesg);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
