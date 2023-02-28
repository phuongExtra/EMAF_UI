<template>
  <app-header />
  <div class="el-div-main config-event">
    <!-- <el-dialog v-model="notiVisible" title="" width="30%">
      <span style="font-size: 16px"> {{ notiStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="notiVisible = !notiVisible">OK</el-button>
        </span>
      </template>
    </el-dialog> -->

    <el-dialog v-model="dialogNotiVisible" title="Status" width="30%">
      <span style="font-size: 16px"> {{ createStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="handleConfirm">OK</el-button>
        </span>
      </template>
    </el-dialog>
    <el-col :span="15" class="config-event-inner">
      <div class="title" style="margin-bottom: 30px">
        <h2>Event Configuration</h2>
      </div>

      <el-row>
        <div class="info">
          <el-col :span="8">
            <div class="label">Request Limit Period</div>
          </el-col>
          <el-col :span="10">
            <div class="box-edit">
              <div class="input">
                <el-input-number
                  v-model="requestLimitPeriod"
                  :min="minRequestLimitPeriod"
                  :max="maxRequestLimitPeriod"
                />
                <p>days</p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="8">
            <div class="label">Check-in Open Time</div>
          </el-col>
          <el-col :span="10">
            <div class="box-edit">
              <div class="input">
                <el-input-number
                  v-model="timeCheckIn"
                  :min="minTimeCheckIn"
                  :max="maxTimeCheckIn"
                  :step="5"
                />
                <p>minutes</p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="8">
            <div class="label">Check-out Open Time</div>
          </el-col>
          <el-col :span="10">
            <div class="box-edit">
              <div class="input">
                <el-input-number
                  v-model="timeCheckOut"
                  :min="minTimeCheckOut"
                  :max="maxTimeCheckOut"
                  :step="5"
                />
                <p>minutes</p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="8">
            <div class="label">Status</div>
          </el-col>
          <el-col :span="10">
            <div class="box-edit">
              <div class="input">
                <el-switch
                  v-model="status"
                  inline-prompt
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                  "
                  active-text="Active"
                  inactive-text="InActive"
                />
              </div>
            </div>
          </el-col>
        </div>

        <div class="info group-button">
          <el-button
            type="info"
            class="btn-cancel"
            @click="$router.push({ path: '/all-events' })"
            >Cancel</el-button
          >
          <el-button
            class="btn-create"
            v-if="!checkUpdate"
            @click="handleCreateConfigEvent"
            >Create</el-button
          >
          <el-button class="btn-create" v-else @click="handleUpdateConfigEvent"
            >Update</el-button
          >
        </div>
      </el-row>
    </el-col>
  </div>
  <app-footer />
</template>

<script setup>
// import Const from "@/const/data";
import { ElMessage } from "element-plus";
// import moment from "moment";
</script>
<script>
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
// import Utils from "@/utils/utils";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "ConfigEvent",
  components: { AppHeader, AppFooter },
  data() {
    return {
      errors: {},
      requestLimitPeriod: 1,
      minRequestLimitPeriod: 1,
      maxRequestLimitPeriod: 1000,
      timeCheckIn: 0,
      minTimeCheckIn: 0,
      maxTimeCheckIn: 180,
      timeCheckOut: 0,
      minTimeCheckOut: 0,
      maxTimeCheckOut: 180,
      minParticipationThreshold: 0,
      maxParticipationThreshold: 100,
      status: false,
      checkUpdate: false,
      notiVisible: false,
      notiStatus: "",
    };
  },
  computed: {
    ...mapState("event", [""]),
  },
  async created() {
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
    try {
      await this.getEventConfigAuto().then((res) => {
        if (res.id !== null) {
          this.checkUpdate = true;
          this.timeCheckIn = res.checkinOpenTime;
          this.timeCheckOut = res.checkoutOpenTime;
          this.requestLimitPeriod = res.requestLimitPeriod;
          this.status = res.status === "ACTIVE" ? true : false;
          // this.notiStatus =
          //   "Config event is available, please update this config!";
        } else {
          // this.notiStatus =
          //   "Config event is unavailable, please create a config!";
        }
      });
    } catch (e) {
      console.log(e);
      this.checkUpdate = false;
      // this.notiStatus = "Config event is unavailable, please create a config!";
    }
    // this.notiVisible = true;
  },
  methods: {
    ...mapActions("event", [
      "createEventConfig",
      "updateEventConfig",
      "getEventConfigAuto",
    ]),

    ...mapMutations("event", [""]),
    async handleCreateConfigEvent() {
      const payload = {
        requestLimitPeriod: this.requestLimitPeriod,
        checkinOpenTime: this.timeCheckIn,
        checkoutOpenTime: this.timeCheckOut,
        status: this.status ? "ACTIVE" : "INACTIVE",
      };
      try {
        await this.createEventConfig(payload).then(() => {
          ElMessage({
            message: "Congrats, Config event successfully!",
            type: "success",
          });
        });
      } catch (e) {
        ElMessage.error("Oops, Config event fail");
        console.log(e);
      }
    },
    async handleUpdateConfigEvent() {
      const payload = {
        requestLimitPeriod: this.requestLimitPeriod,
        checkinOpenTime: this.timeCheckIn,
        checkoutOpenTime: this.timeCheckOut,
        status: this.status ? "ACTIVE" : "INACTIVE",
      };
      try {
        await this.updateEventConfig(payload).then(() => {
          ElMessage({
            message: "Congrats, Update Config event successfully!",
            type: "success",
          });
          setTimeout(() => {
            this.$router.push({ path: `/all-events` });
          }, 500);
        });
      } catch (e) {
        ElMessage.error("Oops, Update config event fail");
        console.log(e);
      }
    },
  },
};
</script>
<style lang="scss">
.config-event {
  .info {
    .box-edit {
      .box-end-time {
        flex-wrap: nowrap;
        margin-left: 272px;
        .el-input {
          .el-input__inner {
            width: 220px;
          }
        }
      }
    }
    .input {
      display: flex;
      width: 100%;
      align-items: center;
      p {
        margin-left: 10px;
      }
      .el-select {
        min-height: 42px;
        .select-trigger {
          min-height: 42px !important;
        }
        .el-input__wrapper {
          min-height: 42px;
        }
      }
      .el-switch {
        margin-top: 3px;
      }
    }
    .button-new-tag {
      height: 30px;
    }
    .input-tag {
      height: 30px;
    }
    .el-tag {
      height: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
.config-event {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .info {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: end;
    .label {
      margin-right: 10px;
      margin-top: 10px;
      font-size: 16px;
    }
    .box-edit {
      display: flex;
      .box-end-time {
        flex-wrap: nowrap;
        .el-input {
          .el-input__inner {
            width: 220px;
          }
        }
      }
      .el-checkbox {
        margin-top: 5px;
        margin-right: 40px;
      }
      .checkbox-equipment {
        width: 500px;
      }
      .equipment-count {
        margin-right: 30px;
        font-size: 16px;
        padding-top: 10px;
        width: 70px;
      }
      .time-line {
        display: flex;
      }
    }
    .el-tag {
      margin: 0px 5px 5px 0px;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;

      .el-input__inner {
        height: 24px;
      }
    }
  }
  .group-button {
    display: flex;
    justify-content: center;
    margin-top: 100px;
    .el-button + .el-button {
      margin-left: 60px;
    }
    .el-button {
      border-radius: 5px;
      width: 120px;
    }
  }
}
</style>
