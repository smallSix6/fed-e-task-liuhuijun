<template>
  <div class="resource">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select clearable v-model="form.categoryId">
              <el-option v-for="cate in categories" :key="cate.id" :label="cate.name" :value="cate.id"></el-option>
            </el-select>
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
      :data="resources"
      v-loading="isLoading"
      style="width: 100%">
      <el-table-column
        type="index"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="资源名称">
      </el-table-column>
      <el-table-column
        prop="url"
        label="资源路径">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="添加时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
        <el-button @click="handleClick(scope.row.id)" size="small">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :disabled="isLoading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.current"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Vue from "vue";
import { getResourcePages } from "@/services/resource";
import { getCategory } from "@/services/resource-category";
export default Vue.extend({
  name: "ResourceList",
  data () {
    return {
      resources: [],
      form: {
        name: "",
        url: "",
        categoryId: null,
        size: 10, // 每页数量
        current: 1 // 当前页
      },
      categories: [],
      total: 0,
      isLoading: false
    };
  },
  created () {
    this.loadCategory();
    this.loadResources();
  },
  methods: {
    async loadResources () {
      this.isLoading = true;
      const { data } = await getResourcePages(this.form);
      this.resources = data.data.records;
      this.total = data.data.total;
      this.isLoading = false;
    },
    async loadCategory () {
      const { data } = await getCategory();
      this.categories = data.data;
    },
    onSubmit () {
      this.form.current = 1;
      this.loadResources();
    },
    onReset () {
      this.form.current = 1;
      this.$refs.form.resetFields();
      this.loadResources();
    },
    handleSizeChange (val) {
      this.form.size = val;
      this.form.current = 1;
      this.loadResources();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.form.current = val;
      this.loadResources();
      console.log(`当前页: ${val}`);
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
