<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
      class="login-form"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" :loading="isLoginLoading" type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { login } from "@/services/user";

export default Vue.extend({
  name: "LoginIndex",
  data() {
    return {
      isLoginLoading: false,
      form: {
        phone: "18631142257",
        password: "111111"
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async onSubmit() {
      // 1. 表单验证
      // await (this.$refs.form as Form).validate() // 如果验证不通过，会抛出一个 Promise 异常，阻断后面程序的运行
      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate();

        // 表单按钮 loading
        this.isLoginLoading = true;

        // 2. 验证通过 -> 提交表单
        const { data } = await login(this.form);
        console.log(data);
        // 3. 处理请求结果
        if (data.state !== 1) {
          this.isLoginLoading = false;
          // 失败：给出提示
          return this.$message.error(data.message);
        }
        // 成功：跳转到首页
        this.$message.success("登录成功");
        this.$store.commit("setUser", data.content);
        this.$router.push((this.$route.query.redirect as string) || "/");
      } catch (err) {
        console.log("登录失败", err);
      }

      // 结束登录按钮的 Loading
      this.isLoginLoading = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
