<template>
  <app-header />

  <div class="noti">
    <el-table class="list-table" :data="listNoti" @row-dblclick="handleRowClick">
      <el-table-column label="NO." width="70">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="300">
        <template #default="scope">
          {{ scope.row?.content }}
        </template>
      </el-table-column>
      <el-table-column width="250" style="display: flex">
        <template #default="scope">
          <div class="group-button">
            <el-button @click="deleteNotification(scope.row.id)">Delete</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <app-footer />
</template>

<script>
import { mapActions, mapState } from "vuex";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";

export default {
  name: "notification-page",
  components: { AppHeader, AppFooter },
  data() {
    return {
      listNoti: [],
    };
  },
  computed: {
    ...mapState("event", ["notis"]),
  },
  methods: {
    ...mapActions("event", ["getAllNoti", "deleteNoti"]),
    async deleteNotification(id) {
      await this.deleteNoti(id).then((res) => {
        console.log(res);
        this.listNoti = this.listNoti.filter((item) => {
          return item.id !== id;
        });
      });
    },
    handleRowClick(row) {
      this.$router.push({ path: `/event/${row.targetUrl}` });
    },
  },

  async mounted() {
    this.listNoti = await this.getAllNoti();
  },
};
</script>

<style lang="scss" scoped>
.noti {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  min-height: 500px;

  .list-table {
    width: auto;

    .group-button {
      display: flex;
      justify-content: center;
    }
  }
}
</style>

