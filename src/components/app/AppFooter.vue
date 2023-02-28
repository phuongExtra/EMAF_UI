<template>
  <el-footer class="appFooter">
    <div class="appFooter__copyRight"><p>Copyright © 2022 EMAF</p></div>
  </el-footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style lang="scss" scoped>
.appFooter {
  margin-top: -15px;
  position: relative;
  width: 100%;
  height: var(--footerHeight);

  &__copyRight {
    width: calc(100%);
    position: absolute;
    bottom: 0;
    padding: 12px 0;

    p {
      width: 100%;
      text-align: center;
    }
  }
}
</style>

