<template>
  <div class="menu-create">
    <create-or-update />
  </div>
</template>

<script>
import Vue from "vue";
import CreateOrUpdate from "./components/CreateOrUpdate.vue";
export default Vue.extend({
  name: "MenuCreate",
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
