<template>
  <div class="menu">
    <el-card class="box-card">
    <el-button @click="$router.push({name: 'menu-create'})">添加</el-button>
    <el-table
      :data="menus"
      style="width: 100%">
      <el-table-column
        type="index"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称">
      </el-table-column>
      <el-table-column
        prop="level"
        label="菜单级数">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="前端图标">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
        <el-button @click="handleClick(scope.row.id)" size="small">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAllMenus, deleteMenu } from "@/services/menu";

export default Vue.extend({
  name: "MenuIndex",
  data () {
    return {
      menus: []
    };
  },
  created () {
    this.loadMenu();
  },
  methods: {
    async loadMenu () {
      const { data } = await getAllMenus();
      this.menus = data.data;
    },
    handleClick (id: string) {
      this.$router.push({
        name: "menu-edit",
        params: {
          id
        }
      });
      console.log("handleClick");
    },
    handleDelete (id: number) {
      this.$confirm("确认删除？", "删除提示", {})
        .then(async () => {
          // 请求删除操作
          const { data } = await deleteMenu(id);
          if (data.code === "000000") {
            this.$message.success("删除成功");
            this.loadMenu();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
