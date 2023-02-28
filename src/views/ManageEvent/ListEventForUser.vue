<template>
  <app-header />
  <div class="list-event-user el-div-main" v-loading="loading">
    <el-dialog v-model="dialogNotiVisible" title="" width="30%">
      <span style="font-size: 16px"> {{ notiStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="success"
            plain
            @click="dialogNotiVisible = !dialogNotiVisible"
            >OK</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-row>
      <el-col :span="24" class="search">
        <el-col :span="8">
          <el-button
            v-if="auth.role === Const.USER_ROLE.ROLE_STUDENT"
            style="width: 205px"
            class="btn-create"
            @click="$router.push({ path: '/create-event-request' })"
            >Create Event Request</el-button
          ></el-col
        >
        <el-col :span="16" class="col-search">
          <div style="width: 150px; margin-right: 20px">
            <el-select
              v-model="typeChoose"
              placeholder="Type"
              width="120"
              clearable
            >
              <el-option
                v-for="item in optionType"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div style="width: 150px; margin-right: 20px">
            <el-select
              v-model="statusChoose"
              placeholder="Status"
              width="120"
              clearable
              multiple
            >
              <el-option
                v-for="item in optionStatus"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <el-input
            v-model="txtSearchValue"
            placeholder="Enter event name for searching"
            @keyup.enter="handleFilterEvent"
          >
            <template #suffix>
              <button @click="handleFilterEvent">
                <el-icon :size="20"> <Search /></el-icon>
              </button> </template
          ></el-input>
        </el-col>
      </el-col>

      <el-col class="list-event-user-inner">
        <el-row
          v-if="events.totalElements !== 0"
          style="width: 80%"
          :gutter="20"
          class="mt-12"
        >
          <el-col
            v-for="item of listEvents"
            :key="item.id"
            :span="24"
            class="mt-24"
          >
            <event-card :event="item" />
          </el-col>
        </el-row>

        <el-col :span="24" v-if="events.totalElements !== 0">
          <el-row class="mt-24">
            <el-col :span="24" class="d-flex content-center">
              <el-pagination
                v-model:currentPage="page"
                background
                layout="prev, pager, next"
                :total="totalElements"
                :page-size="size"
                @current-change="handleChangePage"
              />
            </el-col>
          </el-row>
        </el-col>
        <div v-else class="d-flex items-center mt-12 empty-project">
          <span class="mr-12">There's no events now!</span>
        </div>
      </el-col>
    </el-row>
  </div>
  <app-footer />
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
</script>
<script>
import { mapActions, mapState } from "vuex";
import EventCard from "../../components/list-event/EventCard.vue";
import Const from "@/const/data";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "list-event",
  data() {
    return {
      statusChoose: [],
      typeChoose: null,
      optionStatus: Const.EVENT_OPTIONS_STATUS,
      optionType: Const.EVENT_ONTIONS_TYPE,
      page: 1,
      size: 4,
      txtSearchValue: "",
      loading: false,
      checkGetMyEvent: false,
      dialogNotiVisible: false,
      notiStatus: "",
      auth: {},
    };
  },
  components: {
    EventCard,
    AppHeader,
    AppFooter,
  },
  computed: {
    ...mapState("event", ["events"]),
    //...mapMutations("event", ["setEvents"]),
    listEvents() {
      return this.events.data;
    },
    totalElements() {
      return this.events.totalElements;
    },
  },
  async created() {
    this.loading = true;
    await this.handleFilterEvent();
  },
  async mounted() {
    const authStr = localStorage.getItem("auth");
    const auth = JSON.parse(authStr);
    this.auth = auth.auth;
    this.optionStatus = this.optionStatus.filter((item) => {
      return item === "APPROVED" || item === "RUNNING" || item === "FINISHED";
    });
    this.checkGetMyEvent = false;
  },
  methods: {
    ...mapActions("event", ["getMyEvent", "getAllEvent"]),

    colorStatus(status) {
      switch (status) {
        case "Pending":
          return "warning";
        case "Reject":
          return "danger";
        case "Approve":
          return "success";
        default:
          return "";
      }
    },

    getLocaltion(item) {
      return item
        ? item?.address + ", " + item?.district + ", " + item?.city
        : null;
    },

    handleFilterEvent() {
      this.handleChangePage(1);
    },
    async handleChangePage(page) {
      const payload = {
        page: page,
        size: this.size,
      };
      if (this.typeChoose) {
        payload.type = this.typeChoose;
      }

      if (this.statusChoose) {
        if (this.statusChoose.length > 1) {
          payload.status = this.statusChoose.join(",");
        } else if (this.statusChoose.length === 1) {
          payload.status = this.statusChoose[0];
        } else if (this.statusChoose.length === 0) {
          payload.status = "RUNNING,APPROVED,FINISHED";
        }
      }

      if (this.txtSearchValue) {
        payload.search = this.txtSearchValue;
      }

      try {
        this.loading = true;
        if (this.checkGetMyEvent) {
          await this.getMyEvent(payload);
        } else {
          await this.getAllEvent(payload);
        }
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    sortStartTime: function (a, b) {
      if (a.startTime && b.startTime) {
        return a.startTime - b.startTime;
      }
      return 0;
    },
    sortEndTime: function (a, b) {
      if (a.endTime && b.endTime) {
        return a.endTime - b.endTime;
      }
      return 0;
    },
    filterMyEvent() {
      // this.listEvent = this.listEvent.filter((item) => {
      //   return item.host === "Phúc";
      // });
      // console.log(this.listEvent);
      this.optionStatus = Const.EVENT_OPTIONS_STATUS;
      this.checkGetMyEvent = true;
      this.handleChangePage(1);
    },

    convertDateToShow(value) {
      return value.length == 14
        ? value.replace(
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
            "$1/$2/$3 $4:$5:$6"
          )
        : value.replace(
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/,
            "$1/$2/$3 $4:$5:00"
          );
    },
    convertDate(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2),
        hours = ("0" + date.getHours()).slice(-2),
        minutes = ("0" + date.getMinutes()).slice(-2),
        seconds = ("0" + date.getSeconds()).slice(-2);
      return [date.getFullYear(), mnth, day, hours, minutes, seconds].join("");
    },
  },
};
</script>

<style lang="scss" scoped>
.list-event-user {
  ::v-deep(.el-table__header),
  ::v-deep(.el-table__body),
  ::v-deep(.el-select) {
    width: 100% !important;
  }
  .search {
    display: flex;
    margin-bottom: 30px;
    justify-content: space-between;

    .col-search {
      display: flex;
      justify-content: flex-end;
      button {
        border: none;
        background-color: #fff;
        height: 40px;
        margin-top: 1px;
        width: 40px;
        .el-icon {
          color: #c0c4cc;
        }
      }
      .el-input {
        width: 600px;
      }
    }
  }
  .list-event-user-inner {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
<style lang="scss">
.list-event-user {
  .search {
    .col-search {
      .el-select {
        .el-input {
          min-height: 44px;
        }
      }
    }
  }
}
</style>

