<template>
  <div
    class="d-flex-center fw-wrap"
    style="flex-wrap: wrap"
    v-loading="loading"
  >
    <el-dialog v-model="dialogNotiVisible" title="Status" width="30%">
      <span style="font-size: 16px"> {{ notiStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" plain @click="handleConfirm">OK</el-button>
          <el-button
            type="info"
            plain
            @click="this.dialogNotiVisible = !this.dialogNotiVisible"
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-row class="search-area">
      <el-input
        v-model="txtSearchValue"
        placeholder="Enter email user for choosing..."
        @keyup.enter="handleSearchUser()"
        @change="this.visibleError = false"
        v-if="eventDetail?.roleInEvent === 'ROLE_ORGANIZER'"
      />

      <el-button
        :disabled="listUserChoose.length === 0"
        @click="handleSendInvi()"
        style="height: 44px; margin-left: 20px"
        v-if="eventDetail?.roleInEvent === 'ROLE_ORGANIZER'"
      >
        <p>Send Invitation</p>
      </el-button>

      <div
        class="group-button"
        v-if="
          eventDetail?.roleInEvent === 'ROLE_COLLABORATOR' &&
          userEventRoleStatus === 'PENDING'
        "
      >
        <el-button @click="handleAccept()">Accept</el-button>
        <el-button @click="handleReject(this.auth.username)">Reject</el-button>
      </div>
      <div style="width: 100%">
        <p
          v-if="this.visibleError"
          class="fForm__error"
          style="text-align: center"
        >
          Not found email match!!
        </p>
      </div>
    </el-row>

    <!-- view table   -->
    <el-row style="width: 100%">
      <el-tag
        v-for="user in listUserChoose"
        :key="user"
        class="mx-1"
        type="warning"
        closable
        :disable-transitions="false"
        @close="handleClose(user)"
        style="margin: 2px"
      >
        {{ user.email }}
      </el-tag>
    </el-row>

    <el-row
      style="width: 100%; margin: 30px 0px; justify-content: center"
      v-if="userSearchList && userSearchList.length > 0"
    >
      <el-table :data="userSearchList" style="width: 50%">
        <el-table-column label="Table search user" width="400">
          <template #default="scope">
            {{ scope.row?.email }}
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template #default="scope">
            <el-button @click="addUserList(scope.row)">Add</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- v-if="eventDetail?.roleInEvent === Const.USER_ROLE.ROLE_ORGANIZER" -->
    <el-col
      :span="22"
      v-if="this.collaborationList && this.collaborationList.length"
    >
      <div>
        <el-table
          :data="collaborationList"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="NO." width="100">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Email" width="300">
            <template #default="scope">
              {{ scope.row?.user?.email }}
            </template>
          </el-table-column>
          <el-table-column label="Name" width="200">
            <template #default="scope">
              {{
                getFullname(
                  scope.row?.user?.firstName,
                  scope.row?.user?.lastName
                )
              }}
            </template>
          </el-table-column>
          <el-table-column label="Status" width="150">
            <template #default="scope">
              {{ scope.row?.status }}
            </template>
          </el-table-column>
          <el-table-column label="" width="200">
            <template #default="scope">
              <el-button
                v-if="scope.row.status === 'ACCEPTED'"
                @click="cancelColl(scope.row.id)"
                >Remove</el-button
              >
              <el-button v-else @click="cancelColl(scope.row.id)"
                >Cancel</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>

    <el-empty
      v-if="
        this.collaborationList &&
        this.collaborationList.length === 0 &&
        eventDetail.roleInEvent !== Const.USER_ROLE.ROLE_ORGANIZER
      "
      description="There is no request here"
    />
  </div>
</template>

<script setup>
// import { Search } from "@element-plus/icons-vue";
</script>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Const from "../../const/data";
import { ElMessage } from "element-plus";

export default {
  name: "collaboration-event",
  data() {
    return {
      Const,
      loading: false,
      dialogSearchVisible: false,
      eventId: null,
      status: null,
      page: 1,
      size: 15,
      txtSearchValue: null,
      statusChoose: null,
      optionStatus: ["NEW", "APPROVED", "REJECTED"],
      dialogNotiVisible: false,
      notiStatus: "",
      changeStatus: "",
      auth: null,
      listUserChoose: [],
      userSearchList: [],
      visibleError: false,
      idCollaborate: null,
    };
  },
  props: {
    eventDetail: Object,
  },
  computed: {
    ...mapState("event", ["collaborationList"]),
    ...mapState("user", ["userList"]),

    userEventRoleId() {
      if (this.collaborationList) {
        return this.collaborationList.filter((item) => {
          return item?.user?.email === this.auth.username;
        })[0].id;
      }
      return null;
    },
    userEventRoleStatus() {
      if (this.collaborationList) {
        return this.collaborationList.filter((item) => {
          return item?.user?.email === this.auth?.username;
        })[0]?.status;
      }
      return null;
    },
  },

  async mounted() {
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
    this.eventId = this.$route.params.eventId;
  },
  methods: {
    ...mapActions("event", [
      "sendCollaboration",
      "cancelCollaboration",
      "deleteCollaboration",
      "acceptCollaboration",
      "rejectCollaboration",
      "sendCollaboration",
      "getEventDetail",
    ]),
    ...mapActions("user", ["listUser"]),
    ...mapMutations("event", ["setCollaborationList"]),

    //call api

    async handleSearchUser() {
      try {
        const payload = {
          eventId: this.eventDetail.id,
          email: this.txtSearchValue,
        };
        await this.listUser(payload).then((res) => {
          this.userSearchList = res;
          if (res && res.length === 0) {
            this.visibleError = true;
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    handleClose(tag) {
      this.listUserChoose.splice(this.listUserChoose.indexOf(tag.index), 1);
    },
    addUserList(value) {
      if (value) {
        if (!this.listUserChoose.includes(value)) {
          this.listUserChoose.push(value);
        }
      }
    },

    async handleSendInvi() {
      const userIdList = [];
      this.listUserChoose.forEach((item) => {
        userIdList.push(item.id);
      });
      const payload = {
        eventId: this.eventId,
        userIdList: userIdList,
      };
      this.loading = true;
      try {
        await this.sendCollaboration(payload).then((res) => {
          this.loading = false;
          this.listUserChoose = [];
          this.userSearchList = [];
          if (res === true) {
            ElMessage({
              message: "Congrats, Send invitation successfully!",
              type: "success",
            });
            this.txtSearchValue = "";
          } else {
            ElMessage.error("Oops, Send invitation fail");
          }
          this.getEventDetail(this.eventId);
        });
      } catch (e) {
        console.log(e);
        // ElMessage.error("Oops, Send invitation fail");

        // location.reload();
      }
    },

    cancelColl(id) {
      this.changeStatus = "CANCEL";
      this.idCollaborate = id;
      this.notiStatus = "Do you want to cancel?";
      this.dialogNotiVisible = true;
    },

    handleAccept() {
      this.changeStatus = "ACCEPT";
      this.notiStatus = "Do you want to accept this invitation to collaborate?";
      this.dialogNotiVisible = true;
    },
    handleReject() {
      this.changeStatus = "REJECT";
      this.notiStatus = "Do you want reject this invitation to collaborate?";
      this.dialogNotiVisible = true;
    },
    async handleConfirm() {
      switch (this.changeStatus) {
        case "CANCEL":
          await this.cancelCollaboration(this.idCollaborate)
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message:
                    "Congrats, cancel this invitation to collaborate successfully!",
                  type: "success",
                });
                location.reload();
              } else {
                ElMessage.error(
                  "Oops, cancel this invitation to collaborate fail"
                );
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error(
                "Oops, cancel this invitation to collaborate fail"
              );
            });
          break;
        case "REJECT":
          await this.rejectCollaboration(this.userEventRoleId)
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message:
                    "Congrats, reject this invitation to collaborate successfully!",
                  type: "success",
                });
                location.reload();
              } else {
                ElMessage.error(
                  "Oops, reject this invitation to collaborate fail"
                );
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error(
                "Oops, reject this invitation to collaborate fail"
              );
            });
          break;
      }
      this.dialogNotiVisible = false;
    },
    getFullname(first, last) {
      return first + " " + last;
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

