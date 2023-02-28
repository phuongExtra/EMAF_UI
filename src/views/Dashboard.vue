<template>
  <app-header />
  <h1>Dashboard</h1>

  <div class="d-flex flex-wrap" style="justify-content: center"></div>
  <app-footer />
</template>

<script>
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "Dashboard-gage",
  components: { AppHeader, AppFooter },
  data() {
    return {
      dataReportChart: [],
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
h1 {
  color: var(--el-text-color-regular);
  margin: 10px 0px 10px 30px;
}
.el-card {
  width: 48%;
  height: 300px;
  margin: 2px;
  .el-card__body {
    height: 100%;
  }
  &__body {
    height: 100%;
  }
}
.chart {
  h2 {
    display: flex;
    justify-content: center;
  }
  height: 100%;
}
</style>
