<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑菜单': '添加菜单' }}</span>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择活动区域">
            <el-option label="无上级菜单" value="'-1'"></el-option>
            <el-option :label="item.name" :value="item.id" v-for="item in parentMenuList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="shown">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number :min="1" label="描述文字" v-model="form.orderNum"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')"
            >提交</el-button
          >
          <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Vue from "vue";
import { createOrUpdate, getEditMenuInfo } from "@/services/menu";
export default Vue.extend({
  name: "MenuCreateOrEdit",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: "-1",
        name: "",
        href: "",
        icon: "",
        orderNum: 0,
        description: "",
        shown: false
      },
      rules: {
        name: []
      },
      parentMenuList: []
    };
  },
  created () {
    this.loadMenuInfo();
  },
  methods: {
    onSubmit () {
      // 1. 表单验证
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 2. 验证通过，提交表单
          const { data } = await createOrUpdate(this.form);
          console.log(data);
          if (data.code === "000000") {
            this.$router.back();
            this.$message.success("提交成功");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    async loadMenuInfo () {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1);
      console.log(data);
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo;
      }
      if (data.code === "000000") {
        this.parentMenuList = data.data.parentMenuList;
      }
    }
  }
});
</script>

<style></style>
