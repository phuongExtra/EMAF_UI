<template>
  <el-card
    :class="!detail ? 'cursor-pointer' : ''"
    @click="$router.push(`/event/${event.id}`)"
  >
    <el-row :gutter="24" class="eventCard">
      <el-col :span="4" class="eventCard__banner">
        <img :src="event.banner" style="width: 100%" />
      </el-col>
      <el-col :span="20" class="eventCard__body">
        <h3 class="mb-12">{{ event.eventName }}</h3>
        <div class="d-flex content-flex-start items-center">
          <Clock />
          <span>
            {{ moment(event.startTime, "YYYYMMDDHHmmss").format("DD/MM/YYYY") }}
            -
            {{ moment(event.endTime, "YYYYMMDDHHmmss").format("DD/MM/YYYY") }}
          </span>
          &emsp; &emsp; &emsp; &emsp;
          <Location />
          <span>
            {{ showLocation(event.location) }}
          </span>
          <div
            v-if="event.eventRoomSchedules"
            style="margin-left: 20px; font-size: 13px"
          >
            Rooms: (
            <span
              v-for="(item, index) in event.eventRoomSchedules"
              :key="index"
            >
              {{ item?.room.roomName }}
              <span
                v-if="
                  event.eventRoomSchedules.length !== 1 &&
                  index < event.eventRoomSchedules.length - 1
                "
                >,
              </span>
            </span>
            )
          </div>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <p
          v-if="event.shortDescription"
          class="mt-8 mb-12 w-100"
          v-html="event.shortDescription"
        ></p>
        <!--eslint-enable-->
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { Clock, Location } from "@element-plus/icons-vue";
</script>
<script>
import moment from "moment";

export default {
  name: "EventCard",
  props: {
    event: {
      type: Object,
      required: true,
    },
    viewMore: {
      type: Boolean,
      required: false,
      default: true,
    },
    detail: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    showLocation(value) {
      if (value === "FPT") {
        return "Trường Đại học FPT";
      } else if (value === "QK7") {
        return "Trường quân sự quân khu 7";
      }
    },
  },
  data() {
    return {
      moment,
    };
  },
  components: { Location, Clock },
};
</script>

<style lang="scss" scoped>
.eventCard {
  &__banner {
    img {
      height: 120px;
    }
  }
  &__body {
    position: relative;
    div {
      font-size: 12px;

      svg {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }
    span {
      font-size: 13px;
    }
    .el-icon {
      margin-top: 2px;
      margin-right: 3px;
    }
    p {
      font-size: 15px;
    }
  }
}
</style>

