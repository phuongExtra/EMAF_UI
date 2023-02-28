<template>
  <div>
    <el-dialog v-model="dialogReasonVisible" title="Reject reason" width="30%">
      <p><span v-html="eventDetail.staffFeedback"></span></p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="dialogReasonVisible = !dialogReasonVisible">OK</el-button>
        </span>
      </template>
    </el-dialog>

    <el-row class="status">
      <p>Status of Event:</p>
      <el-tag :type="colorStatus(eventDetail.status)" size="large">{{ eventDetail.status }} </el-tag>
    </el-row>
    <el-row class="status" style="margin-top: 5px" v-if="auth.role === 'ROLE_STUDENT'">
      <p>You are :</p>
      <el-tag type="waring" size="large">{{ showRole(eventDetail.roleInEvent) }} </el-tag>
    </el-row>
    <el-row class="status reason" v-if="eventDetail.status === 'REJECTED'">
      <span @click="this.dialogReasonVisible = true">Click to view reason</span>
    </el-row>

    <div class="info" v-if="eventDetail.masterOfCeremonies || eventDetail.speakers" style="justify-content: flex-end">
      <div>
        <div class="content" v-if="eventDetail.masterOfCeremonies">
          <p>
            <b>MC: {{ eventDetail.masterOfCeremonies }}</b>
          </p>
        </div>
        <div class="content" v-if="eventDetail.speakers">
          <br />
          <p>
            <b>Speaker: {{ eventDetail.speakers }}</b>
          </p>
        </div>
      </div>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Name</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <p>{{ eventDetail.eventName }}</p>
        </div>
      </el-col>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Short Description</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <p class="p-area" v-html="eventDetail.shortDescription"></p>
        </div>
      </el-col>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Description</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <div class="content">
            <p class="p-area" v-html="eventDetail.description"></p>
          </div>
        </div>
      </el-col>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Type</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <div class="content">
            <p>
              <el-tag type="info">{{ eventDetail.type }} </el-tag>
            </p>
          </div>
        </div>
      </el-col>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Max Number of Paricipants</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <div class="content">
            <p>
              {{ eventDetail.maxNumOfParticipant }}
            </p>
          </div>
        </div>
      </el-col>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Location</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <p>
            {{ showLocation(eventDetail.location) }}
          </p>
        </div>
      </el-col>
    </div>

    <div
      class="info"
      v-if="
        eventDetail.location &&
        eventDetail.location === 'FPT' &&
        eventDetail.eventRoomSchedules &&
        eventDetail.eventRoomSchedules.length > 0
      "
    >
      <el-col :span="4">
        <div class="label">Room</div>
      </el-col>
      <el-col :span="20">
        <div class="content" style="display: block">
          <p v-for="item in eventDetail.eventRoomSchedules" :key="item">
            {{ item.room.roomName }}
          </p>
        </div>
      </el-col>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Start Time</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <p>
            {{
              eventDetail.startTime ? moment(eventDetail.startTime, "YYYYMMDDHHmmss").format("DD/MM/YYYY HH:mm") : "-"
            }}
          </p>
          <el-row class="box-end-time">
            <el-col :span="14">
              <div class="label">End Time</div>
            </el-col>
            <p>
              {{
                eventDetail.startTime ? moment(eventDetail.endTime, "YYYYMMDDHHmmss").format("DD/MM/YYYY HH:mm") : "-"
              }}
            </p>
          </el-row>
        </div>
      </el-col>
    </div>

    <div class="info">
      <el-col :span="4">
        <div class="label">Register Start Time</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <p>
            {{
              eventDetail.registrationStartTime
                ? moment(eventDetail.registrationStartTime, "YYYYMMDDHHmmss").format("DD/MM/YYYY HH:mm")
                : "-"
            }}
          </p>
          <el-row class="box-end-time">
            <el-col :span="14">
              <div class="label">Register End Time</div>
            </el-col>
            <p>
              {{
                eventDetail.registerEndTime
                  ? moment(eventDetail.registerEndTime, "YYYYMMDDHHmmss").format("DD/MM/YYYY HH:mm")
                  : "-"
              }}
            </p>
          </el-row>
        </div>
      </el-col>
    </div>

    <div class="info" v-if="eventDetail.eventTimelines && eventDetail.eventTimelines.length > 0">
      <el-col :span="4">
        <div class="label">Timeline</div>
      </el-col>
      <el-col :span="20">
        <div class="content timeline" v-for="item in eventDetail.eventTimelines" :key="item">
          <p>{{ item.content }}</p>
          <p v-if="item.activity">{{ item.activity }}</p>
          <div style="display: flex">
            <p v-if="item.startTime" style="margin-right: 5px">
              {{ item.startTime }}
            </p>
            <p v-if="item.endTime">{{ "  ~ " + item.endTime }}</p>
          </div>
          <br />
        </div>
      </el-col>
    </div>

    <div class="info" v-if="eventDetail.eventEquipments && eventDetail.eventEquipments.length > 0">
      <el-col :span="4">
        <div class="label">Equipment</div>
      </el-col>
      <el-col :span="20">
        <div class="content" v-for="item in eventDetail.eventEquipments" :key="item">
          <p style="width: 300px">{{ item.equipment.equipmentName }}</p>
          <p>{{ "Quantity: " + item.quantity }}</p>
        </div>
      </el-col>
    </div>

    <div
      class="info"
      v-if="
        (eventDetail?.roleInEvent !== null || auth.role === 'ROLE_STAFF' || auth.role === 'ROLE_MANAGER') &&
        eventDetail.note
      "
    >
      <el-col :span="4">
        <div class="label">Note</div>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <p>
            {{ eventDetail.note }}
          </p>
        </div>
      </el-col>
    </div>

    <div v-if="eventDetail?.roleInEvent !== null || auth.role === 'ROLE_STAFF' || auth.role === 'ROLE_MANAGER'">
      <el-divider />

      <h5>Config this event</h5>

      <div
        class="info"
        v-if="eventDetail?.roleInEvent !== null || auth.role === 'ROLE_STAFF' || auth.role === 'ROLE_MANAGER'"
      >
        <el-col :span="4">
          <div class="label">Min Number Participant</div>
        </el-col>
        <el-col :span="20">
          <div class="content">
            <p>
              {{ eventDetail.minNumOfParticipant }}
            </p>
          </div>
        </el-col>
      </div>

      <div
        class="info"
        v-if="eventDetail?.roleInEvent !== null || auth.role === 'ROLE_STAFF' || auth.role === 'ROLE_MANAGER'"
      >
        <el-col :span="4">
          <div class="label">Max Number Participant</div>
        </el-col>
        <el-col :span="20">
          <div class="content">
            <p>
              {{ eventDetail.maxNumOfParticipant }}
            </p>
          </div>
        </el-col>
      </div>

      <div
        class="info"
        v-if="eventDetail?.roleInEvent !== null || auth.role === 'ROLE_STAFF' || auth.role === 'ROLE_MANAGER'"
      >
        <el-col :span="4">
          <div class="label">Require Approve</div>
        </el-col>
        <el-col :span="20">
          <div class="content">
            <p>
              {{ eventDetail.approvalRequired ? "Yes" : "No" }}
            </p>
          </div>
        </el-col>
      </div>

      <div
        class="info"
        v-if="eventDetail?.roleInEvent !== null || auth.role === 'ROLE_STAFF' || auth.role === 'ROLE_MANAGER'"
      >
        <el-col :span="4">
          <div class="label">Require Check-in</div>
        </el-col>
        <el-col :span="20">
          <div class="content">
            <p>
              {{ showCheckInRequired(eventDetail.checkinRequired) }}
            </p>
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Utils from "@/utils/utils";
import moment from "moment";
export default {
  name: "infomation-event",
  data() {
    return {
      auth: {},
      response: {},
      currentTab: "information",
      moment,
      dialogReasonVisible: false,
    };
  },
  props: {
    eventDetail: Object,
  },
  computed: {
    ...mapState("event", ["event", "request"]),
  },
  async created() {},
  async mounted() {
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
  },
  methods: {
    ...mapActions("event", ["getEventDetail", "approveEvent", "rejectEvent"]),

    showRole(role) {
      return role ? role.slice(5) : "NOT MEMBER";
    },

    showCheckInRequired(type) {
      if (type === "BOTH") {
        return "Have both check-in & check-out";
      } else if (type === "CHECKIN") {
        return "Only check-in";
      } else {
        return "Not check-in & check-out";
      }
    },

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
        case "FINISHED":
          return "warning";

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

    handleChangeTab() {},
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    convertDateTime(date) {
      return Utils.convertDatetime(date);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    },
    async handleChangeStatus(status) {
      const payload = {
        eventId: this.eventDetail.id,
      };

      switch (status) {
        case "approve":
          await this.approveEvent(payload);
          return;
        case "reject":
          await this.rejectEvent(payload);
          return;
      }
    },
  },
};
</script>
<style lang="scss">
.event-detail {
  .info {
    .content {
      .box-end-time {
        flex-wrap: nowrap;
        margin-left: 220px;
        width: 320px;
        .el-input {
          .el-input__inner {
            width: 220px;
          }
        }
      }
      .avatar-uploader:hover {
        border-color: #f67043;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 178px;
        height: 178px;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }
  .reason {
    span:hover {
      border-bottom: 1px #8c939d;
      color: #409eff;
      cursor: pointer;
    }
  }
  .status {
    display: flex;
    justify-content: end;
    width: 100%;

    p {
      font-size: 14px;
      display: flex;
      align-items: center;
      margin-right: 15px;
    }
    .el-tag {
      height: 40px;
      width: 150px;
      .el-tag__content {
        font-size: 16px !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.event-detail {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .btn-update {
    width: 100%;
    display: flex;
    justify-content: end;
  }
  .edit-banner {
    width: 100%;
    height: 100%;
    .banner {
      width: 100%;
      height: 210px;
      display: block;
    }
  }
  .title {
    display: flex;
    justify-content: center;
    margin-bottom: 60px;
  }
  .timeline {
    justify-content: space-between;
    height: 24px;
    display: contents !important;
  }
  .info {
    line-height: 22px;
    margin-top: 30px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .label {
      margin-right: 10px;
      font-size: 16px;
      color: #606266;
    }
    .content {
      display: flex;
      font-size: 16px;
    }
    .el-tag {
      font-size: 16px;
    }
  }
  .group-button {
    display: flex;
    justify-content: center;
    margin-top: 100px;
    .el-button + .el-button {
      margin-left: 70px;
    }
    .el-button {
      border-radius: 5px;
      width: 120px;
    }
  }
}
</style>
