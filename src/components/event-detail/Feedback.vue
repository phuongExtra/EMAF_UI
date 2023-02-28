<template>
  <div class="d-flex-center fw-wrap mt-48">
    <!-- <el-empty description="There is no feedback here" /> -->
    <div class="feedback">
      <div v-if="eventDetail.roleInEvent === 'ROLE_ORGANIZER'">
        <div class="d-flex-center mb-5" style="flex-wrap: wrap">
          <el-input
            v-model="txtLinkFeedback"
            placeholder="Enter link feedback..."
            @keyup.enter="handleCreateFeedBack"
            class="mb-30"
          />
          <el-button type="warning" @click="handleCreateFeedBack"
            >Submit</el-button
          >
        </div>
      </div>

      <div v-else>
        <div v-if="eventDetail.feedbackLink">
          <div class="d-flex-center mb-10">
            <el-button type="warning" @click="handleFeedback"
              >Feedback</el-button
            >
          </div>
        </div>
        <div v-else>
          <el-empty description="There is no link feedback here" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
</script>
<script>
import { mapActions, mapState } from "vuex";

import moment from "moment";
export default {
  name: "feedback-event",
  data() {
    return {
      auth: {},
      txtLinkFeedback: "",
      eventId: null,
    };
  },
  props: {
    eventDetail: Object,
  },
  computed: {
    ...mapState("event", ["event", "request"]),
    feedback() {
      this.txtLinkFeedback = this.eventDetail.feedbackLink;
      return this.txtLinkFeedback;
    },
  },

  async created() {},
  async mounted() {
    this.eventId = this.$route.params.eventId;
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }

    await this.getEventDetail(this.eventId);
    this.txtLinkFeedback = this.event.feedbackLink;
  },
  methods: {
    ...mapActions("event", ["updateFeedback", "getEventDetail"]),
    async handleCreateFeedBack() {
      const payload = {
        eventId: this.eventDetail?.id,
        feedbackLink: this.txtLinkFeedback,
      };
      try {
        const res = await this.updateFeedback(payload);
        if (res) {
          ElMessage({
            message: "Congrats, Update the feedback successfully!",
            type: "success",
          });
        }
      } catch (e) {
        ElMessage.error("Oops, Create the event fail");
      }
    },
    handleFeedback() {
      window.open(this.eventDetail?.feedbackLink, "_blank");
    },

    moment: function () {
      return moment();
    },
  },
};
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
.feedback {
  display: flex;
  justify-content: center;

  h5 {
    text-align: center;
  }
}
</style>

