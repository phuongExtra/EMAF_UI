<template>
  <app-header />
  <div class="manage-event el-div-main">
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
            v-if="auth.role === Const.USER_ROLE.ROLE_STAFF"
            class="btn-create"
            @click="$router.push({ path: '/create-event' })"
            >Create Event</el-button
          >
          <el-button
            v-if="auth.role === Const.USER_ROLE.ROLE_STAFF"
            class="btn-create"
            @click="$router.push({ path: '/config-event' })"
            >Config Event</el-button
          >
        </el-col>
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
            @keyup.enter="handleFilterEvent()"
          >
            <template #suffix>
              <el-button @click="handleFilterEvent()">
                <el-icon :size="20"> <Search /></el-icon>
                <p>Search</p>
              </el-button>
            </template></el-input
          >
        </el-col>
      </el-col>

      <el-col :span="24">
        <el-table
          v-loading="loading"
          class="eventTable"
          :data="listEvents"
          style="width: 100%"
          @row-dblclick="handleRowClick"
        >
          <el-table-column label="" width="170">
            <template #default="scope">
              <div class="eventTable__banner">
                <el-image
                  v-if="scope.row?.banner"
                  :size="30"
                  :src="scope.row.banner"
                  class="banner"
                />
                <img v-else src="../../assets/default.png" class="banner" />
                &ensp;
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Name" width="170">
            <template #default="scope">
              {{ scope.row.eventName }}
            </template>
          </el-table-column>
          <el-table-column label="Location" width="170">
            <template #default="scope">
              {{ showLocation(scope.row.location) }}
            </template>
          </el-table-column>

          <el-table-column label="Start Time" width="120">
            <template #default="scope">
              {{ convertDateToShow(scope.row.startTime) }}
            </template>
          </el-table-column>
          <el-table-column label="End Time" width="120">
            <template #default="scope">
              {{ convertDateToShow(scope.row.endTime) }}
            </template>
          </el-table-column>
          <el-table-column label="Participants" width="90">
            <template #default="scope">
              {{ scope.row.maxNumOfParticipant }}
            </template>
          </el-table-column>
          <el-table-column label="Host" width="120">
            <template #default="scope">
              {{ scope.row.requestedBy }}
            </template>
          </el-table-column>
          <el-table-column label="Type" width="80">
            <template #default="scope">
              <div>
                <el-tag type="info">{{ scope.row.type }} </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Status" width="80">
            <template #default="scope">
              <div>
                <el-tag :type="colorStatus(scope.row.status)"
                  >{{ scope.row.status }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    </el-row>
  </div>
  <app-footer />
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
//import type { Action } from "element-plus";
</script>
<script>
import { mapActions, mapState } from "vuex";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
import Const from "@/const/data";
export default {
  name: "list-event",
  components: { AppHeader, AppFooter },
  data() {
    return {
      statusChoose: [],
      typeChoose: "",
      optionStatus: Const.EVENT_OPTIONS_STATUS,
      optionType: Const.EVENT_ONTIONS_TYPE,
      page: 1,
      size: 5,
      txtSearchValue: "",
      loading: false,
      checkGetMyEvent: false,
      auth: {},
      dialogNotiVisible: false,
      notiStatus: "",
      dialogReasonVisible: false,
      feedback: "",
    };
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
    const authStr = localStorage.getItem("auth");
    const auth = JSON.parse(authStr).auth;
    this.auth = auth;
  },
  async mounted() {
    this.loading = true;
    await this.handleFilterEvent();
    this.checkGetMyEvent = false;
  },
  methods: {
    ...mapActions("event", ["getMyEvent", "getAllEvent"]),

    colorStatus(status) {
      switch (status) {
        case "PENDING":
          return "warning";
        case "REJECTED":
          return "danger";
        case "APPROVED":
          return "success";
        case "STOPPED":
          return "info";

        default:
          return "";
      }
    },
    showLocation(value) {
      if (value === "FPT") {
        return "Trường Đại học FPT";
      } else if (value === "QK7") {
        return "Trường quân sự quân khu 7";
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
          if (this.auth.role === Const.USER_ROLE.ROLE_MANAGER) {
            payload.status = Const.EVENT_STATUS.PENDING;
          } else {
            payload.status = this.optionStatus.join(",");
          }
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
        this.loading = false;
        setTimeout(() => {}, 500);
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
      this.checkGetMyEvent = true;
      this.handleChangePage(1);
    },

    async handleRowClick(row) {
      this.$router.push({ path: `/event/${row.id}` });
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
<style lang="scss">
.manage-event {
  .search {
    .col-search {
      .el-select {
        .el-input {
          min-height: 44px;
        }
      }
    }
  }
  .el-table .cell {
    word-break: break-word !important;
    .el-tag {
      width: 78px;
    }
  }
  .el-table {
    .eventTable__banner {
      width: 217px;
      height: 150px;
    }
    .banner {
      width: 100%;
      height: 210px;
      display: block;
      object-fit: cover;
    }
    .el-table__header-wrapper {
      th {
        background-color: #e8e4e4;
        border-bottom: 1px solid #999999;
        border-right: #fff;
      }
    }
    .el-table__body-wrapper {
      td {
        margin: 1px;
        background-color: #f4f4f4;
        border-bottom: var(--el-input-border, var(--el-border-base));
        border-right: #fff;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.manage-event {
  ::v-deep(.el-table__header),
  ::v-deep(.el-table__body),
  ::v-deep(.el-select) {
    width: 100% !important;
  }
  .search {
    display: flex;
    margin-bottom: 30px;
    justify-content: space-between;
    // .btn-create-event {
    //   margin-left: 20px;
    //   border-radius: 20px;
    //   color: #fff;
    //   background-color: #409eff;
    // }
    .col-search {
      display: flex;
      justify-content: flex-end;
      button {
        border-radius: 0px;
        background-color: #fff;
        height: 100%;

        margin-right: -10px;
        width: 100px;
        .el-icon {
          color: #c0c4cc;
        }
        p {
          margin-left: 5px;
          color: #c0c4cc;
        }
      }
      .el-input {
        width: 600px;
      }
    }
  }

  .eventTable {
    &__banner {
      display: flex;
      align-items: center;
    }
    word-wrap: break-word;
    .el-image {
      height: 150px;
      width: 300px;
    }
    .el-button {
      width: 100px !important;
      height: 25px;
      font-family: "Open Sans", sans-serif;
      font-size: 12px !important;
    }
    .group-button {
      display: flex;
      justify-content: flex-end;
    }
    .tag-request {
      z-index: 2;
      text-align: center;
      width: 70px;
      position: absolute;
      background-color: rgb(244, 222, 8);
      border-color: #f67043;
      right: 10px;
      top: 16px;
      transform: rotate(30deg);
    }
    .box-status {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-tag {
        width: 68px;
      }
    }
  }
}
</style>
