<template>
  <app-header />
  <div class="el-div-main">
    <h1>Welcome to our event!</h1>
    <div id="qrcode" :style="heightSreen()">
      <div class="qrcode-inner">
        <QrcodeVue :value="url" :size="size" level="H" />
        <h3>Please Scan QR to Check-in</h3>
      </div>
    </div>
  </div>
  <app-footer />
</template>

<script>
import { mapActions, mapState } from "vuex";
import QrcodeVue from "qrcode.vue";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "Check-in",
  components: {
    QrcodeVue,
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      value: "",
      size: 300,
      eventId: "",
    };
  },
  computed: {
    ...mapState("event", ["event", "linkCheckIn"]),
    eventDetail() {
      return this.event;
    },
    url() {
      return this.event?.hashCheckin;
    },
  },
  async mounted() {
    this.eventId = this.$route.params.eventId;
    await this.getEventDetail(this.eventId);
  },
  methods: {
    ...mapActions("event", ["getEventDetail"]),

    heightSreen() {
      var x = screen.height - 500;
      console.log(x);
      return "height:" + x + "px";
    },
  },
};
</script>

<style lang="scss">
#qrcode {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  h3 {
    margin-top: 20px;
    margin-left: -10px;
  }
  .qrcode-inner {
    display: flex;
    width: 330px;
    flex-wrap: wrap;
    justify-content: center;
  }
}
h1 {
  display: flex;
  justify-content: center;
}
</style>

