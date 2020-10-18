<template>
  <div class="menu-create">
    <create-or-update :isEdit="true" />
  </div>
</template>

<script>
import Vue from "vue";
import CreateOrUpdate from "./components/CreateOrUpdate.vue";
export default Vue.extend({
  name: "MenuEdit",
  components: {
    CreateOrUpdate
  },
  data () {
    return {
    };
  }
});
</script>

<style></style>
