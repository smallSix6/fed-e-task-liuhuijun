<template>
  <div class="user">
    <List />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import List from "./components/List.vue";
export default Vue.extend({
  name: "UserIndex",
  components: {
    List
  }
});
</script>

<style lang="scss" scoped>

</style>
