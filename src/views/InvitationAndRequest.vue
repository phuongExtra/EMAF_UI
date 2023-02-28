<template>
  <app-header />
  <div class="el-div-main" v-loading="loading">
    <el-dialog v-model="dialogStatusVisible" title="Confirm" width="30%">
      <span style="font-size: 16px"> {{ changeStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="confirmChangeStatus">OK</el-button>
          <el-button type="info" plain @click="this.dialogStatusVisible = !this.dialogStatusVisible">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="invitation-and-request">
      <div class="radio-options">
        <el-radio-group v-model="chooseList" size="large" @change="handleFilter()">
          <el-radio-button label="Participation Requests" />
          <el-radio-button label="Collaboration Invitations" />
        </el-radio-group>
      </div>

      <el-table class="list-table" :data="listData" v-if="this.chooseList === 'Collaboration Invitations'">
        <el-table-column label="NO." width="70">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="Event Name" width="400">
          <template #default="scope">
            {{ scope.row?.eventName }}
          </template>
        </el-table-column>

        <el-table-column label="Email" width="200">
          <template #default="scope">
            {{ scope.row?.user.email }}
          </template>
        </el-table-column>

        <el-table-column label="Name" width="200">
          <template #default="scope">
            {{ getName(scope.row?.user?.lastName, scope.row?.user?.firstName) }}
          </template>
        </el-table-column>

        <el-table-column label="Status" width="100">
          <template #default="scope">
            {{ scope.row?.status }}
          </template>
        </el-table-column>
        <el-table-column width="250" style="display: flex">
          <template #default="scope">
            <div class="group-button">
              <el-button @click="acceptInvitation(scope.row.id)">Accept</el-button>
              <el-button @click="rejectInvitation(scope.row.id)">Reject</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table class="list-table" :data="listData" v-else>
        <el-table-column label="NO." width="100">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="Event Name" width="500">
          <template #default="scope">
            {{ scope.row?.eventName }}
          </template>
        </el-table-column>

        <el-table-column label="Status" width="100">
          <template #default="scope">
            {{ scope.row?.status }}
          </template>
        </el-table-column>
        <el-table-column width="200" style="display: flex">
          <template #default="scope">
            <div class="group-button">
              <el-button @click="cancelRequest(scope.row.id)">Cancel</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <app-footer />
</template>

<script>
import { ElMessage } from "element-plus";
// import Const from "@/const/data";
import { mapActions, mapState } from "vuex";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "requestAndInvitation",
  components: { AppHeader, AppFooter },
  data() {
    return {
      listData: [],
      chooseList: "Participation Requests",
      dialogStatusVisible: false,
      changeStatus: "",
      requestId: "",
      type: "",
      loading: false,
    };
  },
  computed: {
    ...mapState("event", ["requests", "invitations"]),
  },
  methods: {
    ...mapActions("event", [
      "getAllInvitations",
      "getAllRequests",
      "cancelParticipation",
      "acceptCollaboration",
      "rejectCollaboration",
    ]),

    getName(last, first) {
      return (last + " " + first).trim();
    },
    async handleFilter() {
      this.loading = true;
      if (this.chooseList === "Collaboration Invitations") {
        this.listData = await this.getAllInvitations();
      } else {
        this.listData = await this.getAllRequests();
      }
      this.loading = false;
    },
    cancelRequest(id) {
      this.changeStatus = "Are you sure to cancel this request?";
      this.requestId = id;
      this.type = "CANCEL";
      this.dialogStatusVisible = true;
    },
    acceptInvitation(id) {
      this.changeStatus = "Are you sure to accept this invitation?";
      this.requestId = id;
      this.type = "ACCEPT";
      this.dialogStatusVisible = true;
    },
    rejectInvitation(id) {
      this.changeStatus = "Are you sure to reject this invitation?";
      this.requestId = id;
      this.type = "REJECT";
      this.dialogStatusVisible = true;
    },
    async confirmChangeStatus() {
      if (this.type === "CANCEL") {
        await this.cancelParticipation(this.requestId)
          .then((res) => {
            if (res === true) {
              this.dialogStatusVisible = false;
              ElMessage({
                message: "Congrats, Cancel successfuly!",
                type: "success",
              });
            } else {
              ElMessage.error("Oops, Fail to cancel ");
            }
          })
          .catch((e) => {
            console.log(e);
            ElMessage.error("Oops, Fail to cancel");
          });
        this.handleFilter();
      } else if (this.type === "ACCEPT") {
        await this.acceptCollaboration(this.requestId)
          .then((res) => {
            if (res === true) {
              this.dialogStatusVisible = false;
              ElMessage({
                message: "Congrats, Cancel successfuly!",
                type: "success",
              });
            } else {
              ElMessage.error("Oops, Fail to cancel ");
            }
          })
          .catch((e) => {
            console.log(e);
            ElMessage.error("Oops, Fail to cancel");
          });
        this.handleFilter();
      } else if (this.type === "REJECT") {
        await this.rejectCollaboration(this.requestId)
          .then((res) => {
            if (res === true) {
              this.dialogStatusVisible = false;
              ElMessage({
                message: "Congrats, reject successfuly!",
                type: "success",
              });
            } else {
              ElMessage.error("Oops, Fail to reject ");
            }
          })
          .catch((e) => {
            console.log(e);
            ElMessage.error("Oops, Fail to reject");
          });
        this.handleFilter();
      }
    },
  },
  created() {
    this.chooseList = "Participation Requests";
  },
  mounted() {
    this.handleFilter();
  },
};
</script>

<style lang="scss" scoped>
.invitation-and-request {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .radio-options {
    width: 100%;
    margin-bottom: 30px;
    margin-left: 20px;
  }
  .list-table {
    width: auto;

    .group-button {
      display: flex;
      justify-content: center;
    }
  }
}
</style>

