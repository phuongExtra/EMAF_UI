<template>
  <app-header />
  <main class="px-120" v-loading="loading">
    <h1>Home page</h1>

    <div v-if="eventHome.runningEvents && eventHome.runningEvents.length > 0">
      <h3>Ongoing Event</h3>
      <div class="d-flex" style="justify-content: center">
        <el-carousel
          :interval="4000"
          :type="eventHome.runningEvents.length >= 3 ? 'card' : ''"
          height="500px"
        >
          <el-carousel-item
            v-for="item in eventHome.runningEvents"
            :key="item"
            @click="this.$router.push({ path: `/event/${item.id}` })"
          >
            <div class="d-flex w-100 h-100 items-center content-center b-white">
              <div class="card-item w-100 content-center">
                <div class="image">
                  <img :src="item.banner" class="img-cover" />
                </div>
                <div class="card-content">
                  <div class="content">
                    <h4>{{ item.eventName }}</h4>

                    <p v-if="item.masterOfCeremonies" class="speaker">
                      <b>MC: {{ item.masterOfCeremonies }}</b>
                    </p>

                    <p v-if="item.speakers" class="speaker">
                      <b>Speaker: {{ item.speakers }}</b>
                    </p>

                    <p>
                      <Clock />{{ convertDateToShow(item.startTime) + " - " }}
                    </p>
                    <p style="margin: 0px 10px 5px 58px">
                      {{ convertDateToShow(item.endTime) }}
                    </p>
                    <p><Location />{{ showLocation(item.location) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div v-if="eventHome.approvedEvents && eventHome.approvedEvents.length > 0">
      <h3>Upcoming Event</h3>
      <div class="d-flex flex-wrap" style="justify-content: center">
        <el-carousel
          :interval="40000000"
          :type="eventHome.approvedEvents.length >= 3 ? 'card' : ''"
          height="500px"
        >
          <el-carousel-item
            v-for="item in eventHome.approvedEvents"
            :key="item"
            @click="this.$router.push({ path: `/event/${item.id}` })"
          >
            <div class="d-flex w-100 h-100 items-center content-center b-white">
              <div class="card-item w-100 content-center">
                <div class="image">
                  <img :src="item.banner" class="img-cover" />
                </div>
                <div class="card-content">
                  <div class="content">
                    <h4>{{ item.eventName }}</h4>

                    <p v-if="item.masterOfCeremonies" class="speaker">
                      <b>MC: {{ item.masterOfCeremonies }}</b>
                    </p>

                    <p v-if="item.speakers" class="speaker">
                      <b>Speaker: {{ item.speakers }}</b>
                    </p>

                    <p>
                      <Clock />{{ convertDateToShow(item.startTime) + " - " }}
                    </p>
                    <p style="margin: 0px 10px 5px 58px">
                      {{ convertDateToShow(item.endTime) }}
                    </p>
                    <p><Location />{{ showLocation(item.location) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div v-if="eventHome.finishedEvents && eventHome.finishedEvents.length > 0">
      <h3>Finished Event</h3>
      <div class="d-flex flex-wrap" style="justify-content: center">
        <el-carousel
          :interval="4000"
          :type="eventHome.finishedEvents.length >= 3 ? 'card' : ''"
          height="500px"
        >
          <el-carousel-item
            v-for="item in eventHome.finishedEvents"
            :key="item"
            @click="this.$router.push({ path: `/event/${item.id}` })"
          >
            <div class="d-flex w-100 h-100 items-center content-center b-white">
              <div class="card-item w-100 content-center">
                <div class="image">
                  <img :src="item.banner" class="img-cover" />
                </div>
                <div class="card-content">
                  <div class="content">
                    <h4>{{ item.eventName }}</h4>

                    <p v-if="item.masterOfCeremonies" class="speaker">
                      <b>MC: {{ item.masterOfCeremonies }}</b>
                    </p>

                    <p v-if="item.speakers" class="speaker">
                      <b>Speaker: {{ item.speakers }}</b>
                    </p>

                    <p>
                      <Clock />{{ convertDateToShow(item.startTime) + " - " }}
                    </p>
                    <p style="margin: 0px 10px 5px 58px">
                      {{ convertDateToShow(item.endTime) }}
                    </p>
                    <p><Location />{{ showLocation(item.location) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </main>
  <app-footer />
</template>

<script setup>
import { Clock, Location } from "@element-plus/icons-vue";
</script>
<script>
import { mapActions, mapState } from "vuex";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "Home-gage",
  components: { AppHeader, AppFooter },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState("event", ["event", "eventHome"]),
  },
  mounted() {
    this.loaddata();
  },
  methods: {
    ...mapActions("event", ["getAllEventHome"]),
    async loaddata() {
      this.loading = true;
      try {
        await this.getAllEventHome((res) => {
          if (res) {
            this.loading = false;
          }
        });
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
      this.loading = false;
    },
    convertDateToShow(value) {
      return value.length == 14
        ? value.replace(
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
            "$1/$2/$3  $4:$5:$6"
          )
        : value.replace(
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/,
            "$1/$2/$3 $4:$5"
          );
    },
    showLocation(value) {
      if (value === "FPT") {
        return "Trường Đại học FPT";
      } else if (value === "QK7") {
        return "Trường quân sự quân khu 7";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  color: var(--el-text-color-regular);
  margin: 10px 0px 30px 30px;
}
h3 {
  margin: 30px 0px 20px 100px;
}
.el-carousel {
  width: 100%;
  height: 530px;
  //background: rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;

  .el-carousel__container {
    height: 470px !important;
  }
  .el-carousel__item {
    display: flex;
    justify-content: center;

    .card-item {
      display: flex;
      width: 80%;
      // background: #eae9e9;

      .image {
        height: 500px !important;
        display: flex;
        align-items: center;
        background: #fff;
      }

      .card-content {
        display: flex;
        align-items: center;
        background-color: #f1f1f1;

        .content {
          width: 344px !important;

          h4 {
            text-align: center;
            width: 100%;
            margin: 75px 0px 30px 0px;
          }
          p {
            font-size: 17px;
            margin: 0px 10px 0px 35px;
            svg {
              width: 18px;
              height: 18px;
              margin-right: 5px;
              margin-top: -2px;
            }
          }
          .speaker {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}
.el-carousel__item img {
  height: 100%;
  justify-items: center;
  width: 400px;
}

// .el-carousel__item:nth-child(2n) {
//   background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }
</style>
