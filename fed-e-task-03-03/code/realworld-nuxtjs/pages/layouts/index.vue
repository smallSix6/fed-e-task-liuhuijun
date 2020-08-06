<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link class="nav-link" to="/" exact>Home</nuxt-link>
          </li>
          <template v-if="user">
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/editor">
                <i class="ion-compose"></i>&nbsp;New Post
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/settings">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/profile/123">
                <img
                  class="user-pic"
                  src="https://afamilycdn.com/150157425591193600/2020/6/22/1047269652580241088180549131903921390294921n-15927891132591048910622-1592790142342-15927901423421981866629-1592794605512-1592794605877678602276.jpg"
                />
                {{user.username}}
              </nuxt-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
            </li>
          </template>
        </ul>
      </div>
    </nav>
    <!-- 顶部导航栏 -->

    <!-- 子路由 -->
    <nuxt-child />
    <!-- 子路由 -->

    <!-- 底部 -->
    <footer>
      <div class="container">
        <nuxt-link class="logo-font" to="/">conduit</nuxt-link>
        <span class="attribution">
          An interactive learning project from
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
    <!-- 底部 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Header",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped>
</style>