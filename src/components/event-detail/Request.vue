<template>
  <div class="d-flex-center fw-wrap" style="flex-wrap: wrap">
    <el-dialog v-model="dialogNotiVisible" title="Status" width="30%">
      <span style="font-size: 16px"> {{ notiStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="sucess" plain @click="handleConfirm">OK</el-button>
          <el-button
            type="info"
            plain
            @click="this.dialogNotiVisible = !this.dialogNotiVisible"
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-row class="search-area" v-if="showSearchArea">
      <el-button @click="handleDownload()" style="margin-right: 50px"
        >Export</el-button
      >

      <el-select v-model="statusChoose" placeholder="Type" clearable>
        <el-option
          v-for="item in optionStatus"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-input
        v-model="txtSearchValue"
        placeholder="Enter participant name for searching"
        @keyup.enter="handleFilterParticipant()"
      >
        <template #suffix>
          <el-button @click="handleFilterParticipant()">
            <el-icon :size="20"> <Search /></el-icon>
            <p>Search</p>
          </el-button>
        </template></el-input
      >

      <!-- view table   -->
    </el-row>
    <!-- v-if="eventDetail?.roleInEvent === Const.USER_ROLE.ROLE_ORGANIZER" -->
    <el-col :span="22" v-if="this.requestList && this.requestList.length">
      <div>
        <el-table
          :data="requestList"
          highlight-current-row
          style="width: 100%"
          v-if="eventDetail.roleInEvent === Const.USER_ROLE.ROLE_ORGANIZER"
        >
          <el-table-column label="NO." width="70">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Email" width="280">
            <template #default="scope">
              {{ scope.row?.email }}
            </template>
          </el-table-column>
          <el-table-column label="Name" width="230">
            <template #default="scope">
              {{ scope.row?.fullName }}
            </template>
          </el-table-column>
          <el-table-column label="Status" width="140">
            <template #default="scope">
              {{ scope.row?.status }}
            </template>
          </el-table-column>
          <el-table-column label="" width="300">
            <template #default="scope">
              <div
                class="group-button"
                v-if="
                  scope.row.status === 'NEW' &&
                  eventDetail.status !== 'FINISHED'
                "
              >
                <el-button @click="handleAccept(scope.row.eventParticipationId)"
                  >Accept</el-button
                >
                <el-button @click="handleReject(scope.row.eventParticipationId)"
                  >Reject</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          :data="requestList"
          highlight-current-row
          style="width: 100%"
          v-else
        >
          <el-table-column label="NO." width="100">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Email" width="300">
            <template #default="scope">
              {{ scope.row?.email }}
            </template>
          </el-table-column>
          <el-table-column label="Name" width="300">
            <template #default="scope">
              {{ scope.row?.fullName }}
            </template>
          </el-table-column>
          <el-table-column label="Status" width="280">
            <template #default="scope">
              {{ scope.row?.status }}
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
      </div>
    </el-col>

    <el-empty v-else description="There is no request here" />
  </div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
</script>
<script>
import { mapActions, mapState } from "vuex";
import Const from "../../const/data";
import { ElMessage } from "element-plus";

export default {
  name: "request-event",
  data() {
    return {
      Const,
      eventId: null,

      status: null,
      page: 1,
      size: 15,
      totalElements: null,
      requestList: [],
      txtSearchValue: null,
      statusChoose: null,
      optionStatus: ["NEW", "APPROVED", "REJECTED"],
      dialogNotiVisible: false,
      notiStatus: "",
      changeStatus: "",
      requestId: null,
      auth: null,
    };
  },
  props: {
    eventDetail: Object,
  },
  computed: {
    ...mapState("event", ["participants", "participant", "event"]),
    showSearchArea() {
      return (
        this.event.roleInEvent === Const.USER_ROLE.ROLE_ORGANIZER ||
        this.event.roleInEvent === Const.USER_ROLE.ROLE_COLLABORATOR
      );
    },
  },

  async mounted() {
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
    this.eventId = this.$route.params.eventId;
    this.handleChangePage(1);
  },
  methods: {
    ...mapActions("event", [
      "filterEventParticipant",
      "rejectParticipation",
      "approveParticipation",
      "registerParticipation",
      "cancelParticipation",
      "reportRequest",
    ]),

    //call api

    handleFilterParticipant() {
      this.handleChangePage(1);
    },
    async handleChangePage(page) {
      const payload = {
        eventId: this.eventId,
        page: page,
        size: this.size,
      };

      if (this.txtSearchValue) {
        payload.search = this.txtSearchValue;
      }

      if (this.statusChoose) {
        payload.status = this.statusChoose;
      }

      const res = await this.filterEventParticipant(payload);
      if (res) {
        this.requestList = res.data;
        this.totalElements = res.totalElements;
      }
    },

    async handleDownload() {
      await this.reportRequest(this.eventId).then((res) => {
        if (res) {
          window.open(res, "_blank");
        }
      });
    },

    handleAccept(id) {
      this.changeStatus = "ACCEPT";
      this.notiStatus = "Do you want to accept this participant request?";
      this.requestId = id;
      this.dialogNotiVisible = true;
    },
    handleReject(id) {
      this.changeStatus = "REJECT";
      this.notiStatus = "Do you want to reject this participant request?";
      this.requestId = id;
      this.dialogNotiVisible = true;
    },
    async handleConfirm() {
      switch (this.changeStatus) {
        case "ACCEPT":
          await this.approveParticipation(this.requestId)
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message:
                    "Congrats, approve the event participation request successfully!",
                  type: "success",
                });
              } else {
                ElMessage.error(
                  "Oops, fail to approve the event participation request "
                );
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error("Oops,  approve join the event fail");
            });
          break;
        case "REJECT":
          await this.rejectParticipation(this.requestId)
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message:
                    "Congrats, reject the event participation request successfully!",
                  type: "success",
                });
              } else {
                ElMessage.error(
                  "Oops,fail to reject the event participation request"
                );
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error(
                "Oops,fail to reject the event participation request"
              );
            });
          break;
      }
      this.dialogNotiVisible = false;
      this.handleFilterParticipant();
    },
  },
};
</script>
<style lang="scss">
.search-area {
  margin-bottom: 30px;
  display: flex;
  width: 100%;
  justify-content: center;
  .el-select {
    width: 120px;
    margin-right: 40px;
    .el-input {
      width: 120px;
      .el-input__inner {
        font-size: 14px;
      }
    }
  }
  .el-input {
    width: 400px;
    .el-input__inner {
      font-size: 15px;
    }
    button {
      border-radius: 0px;
      background-color: #fff;
      height: 42px;

      margin-right: -12px;
      width: 100px;
      .el-icon {
        color: #c0c4cc;
      }
      p {
        margin-left: 5px;
        color: #c0c4cc;
      }
      span {
        font-size: 15px;
      }
    }
  }
  .btn-join-event {
    margin-left: 40px;
  }
}
.group-button {
  justify-content: center;
  margin-left: 25px;
}
</style>

