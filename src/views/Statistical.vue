<template>
  <app-header />
  <div class="el-div-main">
    <div class="statistical-page">
      <el-row :gutter="24" style="dislay: flex; justify-content: center; margin-bottom: 30px">
        <h1>Statistical</h1>
      </el-row>
      <el-row :gutter="24" style="dislay: flex; justify-content: center; margin-bottom: 30px">
        <el-date-picker
          v-model="chooseYear"
          type="year"
          placeholder="Pick a year"
          :disabled-date="pickerOptions"
          style="height: 44px; width: 300px; margin-right: 30px"
        />
        <el-select
          v-model="typeSemester"
          placeholder="Type"
          width="120"
          style="height: 42px; width: 300px; margin-right: 30px"
        >
          <el-option v-for="item in optionSemester" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-button @click="handleFilter" type="primary">Submit</el-button>
        <el-button @click="handleExport" type="primary">Export</el-button>
      </el-row>
      <el-row style="dislay: flex; justify-content: center; margin-top: 70px; margin-bottom: 70px">
        <el-col :span="9" style="dislay: flex; justify-content: center">
          <div style="width: 450px"><canvas id="donutCharts"></canvas></div>
        </el-col>

        <el-col :span="15" style="dislay: flex; justify-content: center">
          <div style="width: 900px">
            <canvas id="barCharts" style="height: 400px"></canvas>
          </div>
        </el-col>
      </el-row>

      <el-row class="mt-30 d-flex content-center">
        <el-table class="eventTable" :data="listEventbyPaging" style="width: 100%" @row-dblclick="handleRowClick">
          <el-table-column label="NO." width="70">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Name" width="220">
            <template #default="scope">
              {{ scope.row.eventName }}
            </template>
          </el-table-column>
          <el-table-column label="Organizer name" width="220">
            <template #default="scope">
              {{ scope.row.organizerName }}
            </template>
          </el-table-column>
          <el-table-column label="Type" width="120">
            <template #default="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
          <el-table-column label="Location" width="170">
            <template #default="scope">
              {{ showLocation(scope.row.location) }}
            </template>
          </el-table-column>
          <el-table-column label="Room" width="160">
            <template #default="scope">
              {{ scope.row.room ? getListRoom(scope.row.room) : "-" }}
            </template>
          </el-table-column>
          <el-table-column label="Min Num Of Participant" width="140">
            <template #default="scope">
              {{ scope.row.minNumOfParticipant }}
            </template>
          </el-table-column>
          <el-table-column label="Max Num Of Participant" width="140">
            <template #default="scope">
              {{ scope.row.maxNumOfParticipant }}
            </template>
          </el-table-column>
          <el-table-column label="Actual Num Of Participant" width="140">
            <template #default="scope">
              {{ scope.row.actualNumOfParticipant }}
            </template>
          </el-table-column>
          <el-table-column label="Status" width="150">
            <template #default="scope">
              {{ scope.row.status }}
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mt-24 d-flex">
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
      </el-row>
    </div>
  </div>
  <app-footer />
</template>

<script setup>
// import { ElMessage } from "element-plus";
</script>

<script>
import { mapState, mapActions } from "vuex";
import Chart from "chart.js/auto";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";

import moment from "moment";
import Const from "../const/data";

export default {
  name: "UserProfile",
  data() {
    return {
      Const,
      moment,
      optionSemester: ["All", "Spring", "Summer", "Fall"],
      chooseYear: new Date().getFullYear().toString(),
      typeSemester: "All",
      configBarChart: {
        type: "bar",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          datasets: [
            {
              label: Const.EVENT_STATUS.FINISHED,
              data: [0, 0],
              backgroundColor: ["rgba(255, 159, 64, 0.2)"],
              borderColor: ["rgb(255, 159, 64)"],

              borderWidth: 1,
            },
            {
              label: Const.EVENT_STATUS.STOPPED,
              data: [0, 0],
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgb(255, 99, 132)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {},
          height: "400px",
        },
      },
      configDonutChart: {
        type: "doughnut",
        data: {
          labels: Const.EVENT_ONTIONS_TYPE,
          datasets: [
            {
              label: "My First Dataset",
              data: [10, 0, 0, 0, 0],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              hoverOffset: 5,
            },
          ],
        },
        options: {},
      },
      startTime: "",
      endTime: "",
      donut: null,
      bar: null,
      page: 1,
      size: 10,
    };
  },
  components: { AppHeader, AppFooter },
  computed: {
    ...mapState("event", ["events", "eventReports"]),
    listEvent() {
      return this.events;
    },
    totalElements() {
      return this.eventReports.totalElements;
    },

    listEventbyPaging() {
      return this.eventReports.data;
    },
    listEventStatusFinished() {
      return this.listEvent.filter((event) => {
        return event.status === Const.EVENT_STATUS.FINISHED;
      });
    },
    listEventStatusStopped() {
      return this.listEvent.filter((event) => {
        return event.status === Const.EVENT_STATUS.STOPPED;
      });
    },
  },
  async created() {
    this.convertDateTime();
  },
  mounted() {
    const donutObj = new Chart(document.getElementById("donutCharts"), this.configDonutChart);
    Object.seal(donutObj);
    this.donut = donutObj;
    const barObj = new Chart(document.getElementById("barCharts"), this.configBarChart);
    Object.seal(barObj);
    this.bar = barObj;
    this.handleFilter();
  },
  methods: {
    ...mapActions("event", ["getEventReport", "exportEventsReport", "getEventReportPaging"]),

    // moment: function () {
    //   return moment();
    // },

    pickerOptions(time) {
      return time.getTime() > new Date();
    },

    getListRoom(list) {
      let array = [];
      for (let item of list) {
        array.push(item.name);
      }
      return array.join(",");
    },

    showLocation(value) {
      if (value === "FPT") {
        return "Trường Đại học FPT";
      } else if (value === "QK7") {
        return "Trường quân sự quân khu 7";
      }
    },

    async handleChangePage(page) {
      const payload = {
        startTime: this.startTime,
        endTime: this.endTime,
        page: page,
        size: this.size,
      };

      await this.getEventReportPaging(payload);
    },

    convertDateTime() {
      let year = this.chooseYear;
      if (typeof this.chooseYear === "object") {
        year = this.chooseYear.getFullYear();
      }
      switch (this.typeSemester) {
        case "All": {
          this.startTime = year + "01010000";
          this.endTime = year + "12312359";
          return;
        }
        case "Spring": {
          this.startTime = year + "01010000";
          this.endTime = year + "04302359";
          return;
        }
        case "Summer": {
          this.startTime = year + "05010000";
          this.endTime = year + "08302359";
          return;
        }
        case "Fall": {
          this.startTime = year + "09010000";
          this.endTime = year + "12312359";
          return;
        }
      }
    },

    async handleExport() {
      this.convertDateTime();
      const payload = {
        startTime: this.startTime,
        endTime: this.endTime,
      };
      await this.exportEventsReport(payload).then((res) => {
        if (res) {
          window.open(res, "_blank");
        }
      });
    },
    convertDataBarChart(res) {
      switch (this.typeSemester) {
        case "All": {
          this.configBarChart.data.labels = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          if (res.length > 0) {
            for (let i = 0; i < 12; i++) {
              this.configBarChart.data.datasets[0].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.FINISHED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 1
                );
              }).length;
              this.configBarChart.data.datasets[1].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.STOPPED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 1
                );
              }).length;
            }
          } else {
            this.configBarChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.configBarChart.data.datasets[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
          return;
        }
        case "Spring": {
          this.configBarChart.data.labels = ["January", "February", "March", "April"];
          if (res.length > 0) {
            for (let i = 0; i < 3; i++) {
              this.configBarChart.data.datasets[0].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.FINISHED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 1
                );
              }).length;
              this.configBarChart.data.datasets[1].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.STOPPED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 1
                );
              }).length;
            }
          } else {
            this.configBarChart.data.datasets[0].data = [0, 0, 0, 0];
            this.configBarChart.data.datasets[1].data = [0, 0, 0, 0];
          }
          return;
        }
        case "Summer": {
          this.configBarChart.data.labels = ["May", "June", "July", "August"];

          if (res.length > 0) {
            for (let i = 0; i < 12; i++) {
              this.configBarChart.data.datasets[0].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.FINISHED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 5
                );
              }).length;
              this.configBarChart.data.datasets[1].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.STOPPED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 5
                );
              }).length;
            }
          } else {
            this.configBarChart.data.datasets[0].data = [0, 0, 0, 0];
            this.configBarChart.data.datasets[1].data = [0, 0, 0, 0];
          }
          return;
        }
        case "Fall": {
          this.configBarChart.data.labels = ["September", "October", "November", "December"];
          if (res.length > 0) {
            for (let i = 0; i < 12; i++) {
              this.configBarChart.data.datasets[0].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.FINISHED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 9
                );
              }).length;
              this.configBarChart.data.datasets[1].data[i] = res.filter((event) => {
                return (
                  event.status === Const.EVENT_STATUS.STOPPED &&
                  this.moment(event.startTime, "YYYYMMDDHHmm").month() + 1 === i + 9
                );
              }).length;
            }
          } else {
            this.configBarChart.data.datasets[0].data = [0, 0, 0, 0];
            this.configBarChart.data.datasets[1].data = [0, 0, 0, 0];
          }
          return;
        }
      }
    },

    async handleFilter() {
      this.convertDateTime();
      this.handleChangePage(1);
      const payload = {
        startTime: this.startTime,
        endTime: this.endTime,
      };
      await this.getEventReport(payload).then((res) => {
        if (res) {
          this.convertDataBarChart(res);
          this.bar.stop();
          this.donut.stop();

          this.configDonutChart.data.datasets[0].data[0] = res.filter((event) => {
            return event.type === Const.EVENT_ONTIONS_TYPE[0];
          }).length;
          this.configDonutChart.data.datasets[0].data[1] = res.filter((event) => {
            return event.type === Const.EVENT_ONTIONS_TYPE[1];
          }).length;
          this.configDonutChart.data.datasets[0].data[2] = res.filter((event) => {
            return event.type === Const.EVENT_ONTIONS_TYPE[2];
          }).length;
          this.configDonutChart.data.datasets[0].data[3] = res.filter((event) => {
            return event.type === Const.EVENT_ONTIONS_TYPE[3];
          }).length;
          this.configDonutChart.data.datasets[0].data[4] = res.filter((event) => {
            return event.type === Const.EVENT_ONTIONS_TYPE[4];
          }).length;
        }
      });

      this.bar.update();
      this.donut.update();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-div-main {
  .statistical-page {
  }
}
</style>
