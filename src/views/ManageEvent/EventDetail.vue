<template>
  <app-header />
  <div class="el-div-main event-detail">
    <el-dialog v-model="dialogStatusVisible" title="Confirm" width="30%">
      <span style="font-size: 16px"> {{ changeStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="confirmChangeStatus"
            >OK</el-button
          >
          <el-button
            type="info"
            plain
            @click="this.dialogStatusVisible = !this.dialogStatusVisible"
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogChooseRoom"
      title="Choose room for event..."
      width="50%"
      class="dialog-room"
    >
      <div class="d-flex" style="justify-content: space-around">
        <el-select
          v-model="roomchoose"
          filterable
          placeholder="Choose room..."
          multiple
        >
          <el-option
            v-for="item in rooms"
            :key="item"
            :label="item.roomName + ` (capacity:  ` + item.capacity + `)`"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <div class="d-flex">
          <p>
            {{ "Number of paticipant : " }}
            <b>{{ this.eventDetail.maxNumOfParticipant }}</b>
          </p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="handleConfirmSaveRoom"
            >OK</el-button
          >
          <el-button
            type="info"
            plain
            @click="this.dialogChooseRoom = !this.dialogChooseRoom"
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog title="Reject reason" v-model="dialogRejectVisible" width="50%">
      <div style="margin-bottom: 10px">
        <span style="font-size: 16px">
          {{ "Input reject reject event:" }}
        </span>
      </div>
      <ckeditor
        v-model="txtReason"
        :editor="editor"
        :config="editorConfig"
      ></ckeditor>
      <p v-if="errors.reason" class="fForm__error">
        {{ errors.reason }}
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="handleConfirmReject"
            >OK</el-button
          >
          <el-button
            type="info"
            plain
            @click="dialogRejectVisible = !dialogRejectVisible"
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog title="Stop reason" v-model="dialogStopVisible" width="50%">
      <div style="margin-bottom: 10px">
        <span style="font-size: 16px">
          {{ "Input reason stop event:" }}
        </span>
      </div>
      <ckeditor
        v-model="txtReasonStop"
        :editor="editor"
        :config="editorConfig"
      ></ckeditor>
      <p v-if="errors.reasonStop" class="fForm__error">
        {{ errors.reasonStop }}
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="handleConfirmStop"
            >OK</el-button
          >
          <el-button
            type="info"
            plain
            @click="dialogStopVisible = !dialogStopVisible"
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogDeleteVisible" width="30%">
      <span style="font-size: 16px"> Are you sure to delete the event? </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="handleConfirmDelete"
            >OK</el-button
          >
          <el-button
            type="info"
            plain
            @click="dialogDeleteVisible = !dialogDeleteVisible"
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-col :span="16">
      <div class="title">
        <h1 v-if="eventDetail.status === Const.EVENT_STATUS.NEW">
          Event Request Infomation
        </h1>
        <h1 v-else>Event Infomation</h1>
      </div>

      <el-row>
        <el-row class="btn-update">
          <el-button
            class="btn-join-event"
            v-if="
              auth?.role === Const.USER_ROLE.ROLE_STUDENT &&
              eventDetail?.eventParticipation === null &&
              eventDetail.status === Const.EVENT_STATUS.APPROVED &&
              event.roleInEvent !== Const.USER_ROLE.ROLE_ORGANIZER
            "
            type="success"
            @click="handleChangeStatus('JOINEVENT')"
          >
            Request to join Event</el-button
          >
          <el-button
            class="btn-join-event"
            v-if="
              auth?.role === Const.USER_ROLE.ROLE_STUDENT &&
              eventDetail?.eventParticipation?.status === 'NEW' &&
              eventDetail.status === Const.EVENT_STATUS.APPROVED
            "
            @click="handleChangeStatus('CANCELJOINEVENT')"
            >Cancel Request</el-button
          >

          <!-- <el-button
            v-if="isStartEvent"
            class="btn"
            type="success"
            @click="handleChangeStatus('START_EVENT')"
            >Start Event</el-button
          > -->

          <!-- <el-button
            v-if="
              eventDetail.status === Const.EVENT_STATUS.RUNNING &&
              isOwnerEvent &&
              countDownEndEvent <
                getTimeMinisecond(this.configEvent.checkoutOpenTime)
            "
            class="btn"
            type="success"
            @click="handleChangeStatus('END_EVENT')"
            >End Event</el-button
          > -->

          <el-button
            v-if="isCheckIn"
            class="btn"
            type="success"
            @click="$router.push({ path: `/checkin/${eventId}` })"
            ><el-icon><FullScreen /></el-icon>Check-in</el-button
          >
          <el-button
            v-if="isCheckOut"
            class="btn"
            type="warning"
            @click="$router.push({ path: `/checkout/${eventId}` })"
            ><el-icon><FullScreen /></el-icon>Check-out</el-button
          >

          <el-button
            v-if="
              eventDetail.status === Const.EVENT_STATUS.NEW &&
              auth?.role === Const.USER_ROLE.ROLE_STAFF
            "
            class="btn"
            type="success"
            @click="hanldeAcceptEvent()"
            >Accept</el-button
          >

          <el-button
            v-if="
              eventDetail.status === Const.EVENT_STATUS.PENDING &&
              auth?.role === Const.USER_ROLE.ROLE_MANAGER
            "
            class="btn"
            type="success"
            @click="handleChangeStatus(Const.EVENT_STATUS.APPROVED)"
            >Approve</el-button
          >
          <el-button
            v-if="
              (eventDetail.status === Const.EVENT_STATUS.NEW &&
                auth?.role === Const.USER_ROLE.ROLE_STAFF) ||
              (eventDetail.status === Const.EVENT_STATUS.PENDING &&
                auth?.role === Const.USER_ROLE.ROLE_MANAGER)
            "
            class="btn"
            type="warning"
            @click="this.dialogRejectVisible = true"
            >Reject</el-button
          >

          <el-button
            v-if="
              ((eventDetail.status === Const.EVENT_STATUS.NEW ||
                eventDetail.status === Const.EVENT_STATUS.REJECTED ||
                eventDetail.status === Const.EVENT_STATUS.STOPPED) &&
                isOwnerEvent &&
                auth?.role === Const.USER_ROLE.ROLE_STUDENT) ||
              ((eventDetail.status === Const.EVENT_STATUS.PENDING ||
                eventDetail.status === Const.EVENT_STATUS.REJECTED ||
                eventDetail.status === Const.EVENT_STATUS.STOPPED) &&
                isOwnerEvent &&
                auth?.role === Const.USER_ROLE.ROLE_STAFF)
            "
            class="btn"
            type="primary"
            @click="$router.push({ path: `/event-update/${this.eventId}` })"
            ><el-icon><Edit /></el-icon>Update Event</el-button
          >
          <el-button
            v-if="
              (eventDetail.status === Const.EVENT_STATUS.PENDING ||
                eventDetail.status === Const.EVENT_STATUS.RUNNING ||
                eventDetail.status === Const.EVENT_STATUS.APPROVED) &&
              isOwnerEvent
            "
            class="btn"
            type="danger"
            @click="this.dialogStopVisible = true"
            ><el-icon><CircleCloseFilled /></el-icon>Stop Event</el-button
          >

          <el-button
            v-if="
              ((eventDetail.status === Const.EVENT_STATUS.NEW ||
                eventDetail.status === Const.EVENT_STATUS.REJECTED) &&
                isOwnerEvent &&
                auth?.role === Const.USER_ROLE.ROLE_STUDENT) ||
              ((eventDetail.status === Const.EVENT_STATUS.PENDING ||
                eventDetail.status === Const.EVENT_STATUS.REJECTED) &&
                isOwnerEvent &&
                auth?.role === Const.USER_ROLE.ROLE_STAFF)
            "
            class="btn"
            type="danger"
            @click="this.dialogDeleteVisible = true"
            ><el-icon><Delete /></el-icon>Delete Event</el-button
          >
        </el-row>

        <div
          class="edit-banner info"
          style="justify-content: center; display: flex"
        >
          <img v-if="isHaveBanner" :src="eventDetail.banner" class="banner" />

          <img v-else src="../../assets/default.png" class="banner" />
        </div>

        <el-tabs
          v-model="currentTab"
          class="tabs"
          @tab-change="handleChangeTab(currentTab)"
        >
          <el-tab-pane label="Information" name="information" class="pt-8">
            <Information :eventDetail="eventDetail" />
          </el-tab-pane>
          <el-tab-pane
            label="Request"
            name="request"
            class="pt-8"
            v-if="isOwnerEvent || isCombor"
          >
            <Request :eventDetail="eventDetail" />
          </el-tab-pane>
          <el-tab-pane
            label="Collaboration"
            name="collaboration"
            class="pt-8"
            v-if="
              isOwnerEvent ||
              isCombor ||
              auth?.role === Const.USER_ROLE.ROLE_MANAGER ||
              auth?.role === Const.USER_ROLE.ROLE_STAFF
            "
          >
            <Collaboration :eventDetail="eventDetail" />
          </el-tab-pane>

          <el-tab-pane
            label="Comment"
            name="Comment"
            class="pt-8"
            v-if="
              isOwnerEvent ||
              isCombor ||
              auth?.role === Const.USER_ROLE.ROLE_MANAGER ||
              auth?.role === Const.USER_ROLE.ROLE_STAFF ||
              eventDetail?.eventParticipation?.status === 'APPROVED' ||
              eventDetail?.eventParticipation?.status === 'CHECKED_IN' ||
              eventDetail?.eventParticipation?.status === 'CHECKED_OUT'
            "
          >
            <Comment :eventDetail="eventDetail" />
          </el-tab-pane>

          <el-tab-pane
            label="Feedback"
            name="feedback"
            class="pt-8"
            v-if="
              isOwnerEvent ||
              isCombor ||
              auth?.role === Const.USER_ROLE.ROLE_MANAGER ||
              auth?.role === Const.USER_ROLE.ROLE_STAFF ||
              eventDetail?.eventParticipation?.status === 'APPROVED' ||
              eventDetail?.eventParticipation?.status === 'CHECKED_IN' ||
              eventDetail?.eventParticipation?.status === 'CHECKED_OUT'
            "
          >
            <Feedback :eventDetail="eventDetail" />
          </el-tab-pane>
          <el-tab-pane
            v-if="
              isOwnerEvent ||
              auth?.role === Const.USER_ROLE.ROLE_MANAGER ||
              auth?.role === Const.USER_ROLE.ROLE_STAFF
            "
            label="Document"
            name="Document"
            class="pt-8"
          >
            <Document :eventDetail="eventDetail" />
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-col>
  </div>
  <app-footer />
</template>

<script setup>
import {
  FullScreen,
  Edit,
  Delete,
  CircleCloseFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
</script>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
// import Utils from "@/utils/utils";
import moment from "moment";
import Const from "../../const/data";

import Information from "../../components/event-detail/Information";
import Collaboration from "../../components/event-detail/Collaboration";
import Document from "../../components/event-detail/Document";
import Feedback from "../../components/event-detail/Feedback";
import Request from "../../components/event-detail/Request";
import Comment from "../../components/event-detail/Comment";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "Event-detail",
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        placeholder: "Reject's description",
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",

          "bulletedList",
          "numberedList",
          "|",
          "outdent",
          "indent",
          "|",
          "blockQuote",
          "insertTable",
          "undo",
          "redo",
        ],
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
      },

      txtReason: "",
      txtReasonStop: "",
      auth: null,
      response: {},
      currentTab: "information",
      documents: {},
      feedbacks: {},
      collaborations: {},
      requests: {},
      eventId: "",
      dialogDeleteVisible: false,
      dialogStatusVisible: false,
      dialogChooseRoom: false,
      dialogRejectVisible: false,
      dialogStopVisible: false,
      roomchoose: null,
      rooms: [],
      changeStatus: "",
      statusWantChange: "",
      moment,
      Const,
      startTime: null,
      endTime: null,
      errors: {},
      configEvent: {
        checkinOpenTime: 0,
        checkoutOpenTime: 0,
      },
    };
  },
  components: {
    AppHeader,
    AppFooter,
    Information,
    Request,
    Document,
    Feedback,
    Collaboration,
    Comment,
  },
  computed: {
    ...mapState("event", ["event", "request", "linkCheckIn"]),
    ...mapState("room", ["rooms"]),
    eventDetail() {
      return this.event;
    },
    statusEvent() {
      return this.event.status;
    },
    isHaveBanner() {
      return !!this.eventDetail.banner;
    },
    isOwnerEvent() {
      return this.eventDetail.roleInEvent === Const.USER_ROLE.ROLE_ORGANIZER;
    },
    isCombor() {
      return this.eventDetail.roleInEvent === Const.USER_ROLE.ROLE_COLLABORATOR;
    },
    isStartEvent() {
      return (
        this.eventDetail.status === Const.EVENT_STATUS.APPROVED &&
        this.isOwnerEvent &&
        this.eventDetail.minNumOfParticipant <=
          this.eventDetail.numOfParticipationRegis &&
        this.countDownStartEvent < 300000
      ); //start event trước 5p
    },
    isCheckIn() {
      return (
        (this.eventDetail.status === Const.EVENT_STATUS.APPROVED ||
          this.eventDetail.status === Const.EVENT_STATUS.RUNNING) &&
        this.isOwnerEvent &&
        (this.eventDetail.checkinRequired === "BOTH" ||
          this.eventDetail.checkinRequired === "CHECKIN") &&
        this.countDownStartEvent <
          this.getTimeMinisecond(this.configEvent.checkinOpenTime)
      ); // hiện check in trước và sau thười gian checkinOpenTime phút
    },

    isCheckOut() {
      return (
        (this.eventDetail.status === Const.EVENT_STATUS.FINISHED ||
          this.eventDetail.status === Const.EVENT_STATUS.RUNNING) &&
        this.isOwnerEvent &&
        this.eventDetail.checkinRequired === "BOTH" &&
        this.countDownEndEvent <
          this.getTimeMinisecond(this.configEvent.checkoutOpenTime)
      ); // hiện check in trước và sau thười gian checkoutOpenTime phút
    },
    countDownStartEvent() {
      return (
        new Date(
          moment(this.eventDetail.startTime, "YYYYMMDDHHmmss").format(
            "yyyy/MM/DD HH:mm:ss"
          )
        ).getTime() - new Date()
      );
    },
    countDownEndEvent() {
      return (
        new Date(
          moment(this.eventDetail.endTime, "YYYYMMDDHHmmss").format(
            "yyyy/MM/DD HH:mm:ss"
          )
        ).getTime() - new Date()
      );
    },
  },
  async created() {
    this.eventId = this.$route.params.eventId;
    await this.getEventDetail(this.eventId).then((res) => {
      this.startTime = res.startTime;
      this.endTime = res.endTime;
    });

    await this.getEventConfig().then((res) => {
      this.configEvent = res;
    });

    console.log(this.configEvent.checkoutOpenTime);

    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
  },
  mounted() {
    const tab = localStorage.getItem("tabEvent");
    if (tab) {
      this.currentTab = JSON.parse(tab).tab;
    }
    window.scrollTo(0, 0);
  },

  methods: {
    ...mapActions("event", [
      "getEventDetail",
      "approveEvent",
      "rejectEvent",
      "stopEvent",
      "deleteEvent",
      "registerParticipation",
      "cancelParticipation",
      "startEvent",
      "endEvent",
      "updateEventRoom",
      "getEventConfig",
    ]),

    ...mapActions("room", ["getAllRoom", "getAllRoomAvailable"]),

    ...mapMutations("room", ["setRooms"]),

    handleChangeTab(currentTab) {
      console.log(this.currentTab);
      localStorage.setItem(
        "tabEvent",
        JSON.stringify({
          tab: currentTab,
        })
      );
    },
    getTimeMinisecond(time) {
      return time * 600000;
    },

    async hanldeAcceptEvent() {
      const payload = {
        startTime: this.startTime,
        endTime: this.endTime,
      };
      this.rooms = await this.getAllRoomAvailable(payload);
      this.dialogChooseRoom = true;
    },

    async handleConfirmSaveRoom() {
      this.handleChangeStatus(Const.EVENT_STATUS.ACCEPTED);
    },

    handleConfirmReject() {
      if (this.txtReason.trim()) {
        delete this.errors.reason;
        this.handleChangeStatus(Const.EVENT_STATUS.REJECTED);
      } else {
        this.errors.reason = "Please input reason reject event!";
      }
    },

    handleConfirmStop() {
      if (this.txtReasonStop.trim()) {
        delete this.errors.reasonStop;
        this.handleChangeStatus(Const.EVENT_STATUS.STOPPED);
      } else {
        this.errors.reasonStop = "Please input reason stop event!";
      }
    },

    async confirmChangeStatus() {
      switch (this.statusWantChange) {
        case "JOINEVENT":
          await this.registerParticipation(this.eventDetail.id)
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message:
                    "Congrats, send request to join the event successfuly!",
                  type: "success",
                });
              } else {
                ElMessage.error("Oops, Fail to send request to join the event");
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error("Oops, Fail to send request to join the event");
            });
          break;

        case "ACCEPTED":
          await this.updateEventRoom({
            eventId: this.eventDetail.id,
            roomIds: this.roomchoose,
          }).then((res) => {
            if (res === true) {
              this.approveEvent(this.eventDetail.id)
                .then((res) => {
                  if (res === true) {
                    ElMessage({
                      message: "Congrats, Accept the event successfully!",
                      type: "success",
                    });
                  } else {
                    ElMessage.error("Oops, Fail to accept the event");
                  }
                })
                .catch((e) => {
                  console.log(e);
                  ElMessage.error("Oops, Fail to accept the event");
                });
            }
          });

          this.dialogChooseRoom = false;
          break;

        case "START_EVENT":
          await this.startEvent(this.eventDetail.id)
            .then((res) => {
              if (res) {
                ElMessage({
                  message: "Congrats, start the event successfuly!",
                  type: "success",
                });
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error("Oops, Fail to start the event");
            });
          break;

        case "END_EVENT":
          await this.endEvent(this.eventDetail.id)
            .then((res) => {
              if (res) {
                ElMessage({
                  message: "Congrats, end the event successfuly!",
                  type: "success",
                });
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error("Oops, Fail to end the event");
            });
          break;

        case "CANCELJOINEVENT":
          await this.cancelParticipation(this.eventDetail.eventParticipation.id)
            .then((res) => {
              if (res === true) {
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
              ElMessage.error("Oops, Fail to cancel ");
            });
          break;

        case Const.EVENT_STATUS.APPROVED:
          await this.approveEvent(this.eventDetail.id)
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message: "Congrats, Approve the event successfuly!",
                  type: "success",
                });
              } else {
                ElMessage.error("Oops, Fail to approve the event");
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error("Oops, Fail to approve the event");
            });

          break;

        case Const.EVENT_STATUS.REJECTED:
          await this.rejectEvent({
            eventId: this.eventDetail.id,
            feedBack: this.txtReason,
          })
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message: "Congrats, Reject the event successfuly!",
                  type: "success",
                });
              } else {
                ElMessage.error("Oops, Fail to reject the event");
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error("Oops, Fail to reject the event");
            });

          break;

        case Const.EVENT_STATUS.STOPPED:
          await this.stopEvent({
            eventId: this.eventDetail.id,
            feedBack: this.txtReasonStop,
          })
            .then((res) => {
              if (res === true) {
                ElMessage({
                  message: "Congrats, Stop the event successfuly!",
                  type: "success",
                });
              } else {
                ElMessage.error("Oops, Fail to stop the event");
              }
            })
            .catch((e) => {
              console.log(e);
              ElMessage.error("Oops, Fail to stop the event");
            });
          break;
      }

      this.dialogStatusVisible = false;
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    async handleChangeStatus(status) {
      this.statusWantChange = status;
      switch (status) {
        case Const.EVENT_STATUS.ACCEPTED:
          this.changeStatus = "Are you sure to accept this event?";
          break;
        case Const.EVENT_STATUS.APPROVED:
          this.changeStatus = "Are you sure to approve this event?";
          break;
        case Const.EVENT_STATUS.REJECTED:
          this.changeStatus = "Are you sure to reject this event?";
          break;
        case Const.EVENT_STATUS.STOPPED:
          this.changeStatus = "Are you sure to stop this event?";
          break;
        case "JOINEVENT":
          this.changeStatus = "Are you sure to join this event?";
          break;
        case "CANCELJOINEVENT":
          this.changeStatus = "Are you sure to cancel join this event?";
          break;
        case "START_EVENT":
          this.changeStatus = "Are you sure to start this event?";
          break;
        case "END_EVENT":
          this.changeStatus = "Are you sure to end this event?";
          break;
      }
      this.dialogStatusVisible = true;
    },

    //confirm delete

    async handleConfirmDelete() {
      this.dialogDeleteVisible = false;
      await this.deleteEvent(this.eventId)
        .then((res) => {
          console.log(res);
          if (res === true) {
            ElMessage({
              message: "Congrats, Delete the event successfuly!",
              type: "success",
            });
            setTimeout(() => {
              if (this.auth?.role === Const.USER_ROLE.ROLE_STAFF) {
                this.$router.push({ path: `/all-events` });
              } else {
                this.$router.push({ path: `/list-events` });
              }
            }, 300);
          }
        })
        .catch((e) => {
          ElMessage.error("Oops, Fail to delete the event");
          console.log(e);
          location.reload();
        });
    },
  },
};
</script>
<style lang="scss">
.event-detail {
  padding-bottom: 10px !important;
  .el-tabs {
    width: 100%;
    .el-tabs__content {
      min-height: 200px;
    }
  }
  .dialog-room {
    .el-select {
      width: 300px;
      min-height: 40px;
      .el-input {
        min-height: 40px;
      }
    }
    p {
      font-size: 16px;
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
    margin-bottom: 20px;
  }
  .edit-banner {
    width: 100%;
    height: 100%;
    .banner {
      width: 50%;
      height: 50%;
      display: block;
      object-fit: cover;
    }
  }
  .title {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
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
