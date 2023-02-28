<template>
  <el-row class="appApp">
    <el-col :span="24">
      <div class="appApp__content">
        <router-view></router-view>
      </div>
    </el-col>
  </el-row>
</template>

<script setup></script>
<script>
import Utils from "@/utils/utils";

export default {
  name: "App",

  computed: {
    isAuthenticated() {
      return Utils.isAuthenticated();
    },
  },
  methods: {},
  created() {},
};
</script>
<style lang="scss" scoped>
.appApp {
  overflow-x: hidden;
  &__content {
    min-height: calc(100vh - 80px - 50px);
    background: #fff;
    .title {
      height: 30px;
      width: 100%;
    }
    .footer-main {
      height: 30px;
    }
  }
}
</style>

