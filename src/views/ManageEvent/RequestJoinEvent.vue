<template>
  <app-header />
  <el-main class="request-join-event">
    <!-- dialogConfirm -->
    <el-dialog v-model="dialogVisible" title="Reason" width="30%">
      <span>Do you want {{ changeStatus }} this request?</span>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = !dialogVisible">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
      </span>
    </el-dialog>

    <el-col :span="24" class="search" style="width: 100%">
      <el-col :span="12" class="col-search">
        <el-input
          v-model="txtSearchValue"
          placeholder="Enter project title for searching"
          style="width: 70%"
        />
      </el-col>
      <el-col :span="12" class="group-button">
        <el-row style="flex-wrap: nowrap">
          <el-select
            v-model="statusChoose"
            placeholder="Select status"
            clearable
            style="height: 42px"
          >
            <el-option
              v-for="item of statusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            style="width: 140px"
            type="primary"
            @click="handleFilterRequest"
            >Search</el-button
          >
        </el-row>
      </el-col>
    </el-col>

    <el-row class="mt-48">
      <el-col :span="24">
        <el-table
          class="requestJoinEventTable"
          :data="listRequests"
          style="width: 100%"
          @row-dblclick="handleRowClick"
        >
          <el-table-column label="NO." width="50">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Event" width="200">
            <template #default="scope">
              <div>
                <span class="label-lb16">{{ scope.row.event.title }} </span>
              </div>
              <div class="label-lb13">
                {{
                  moment(scope.row.event.createdAt, "YYYYMMDDHHmmss").format(
                    "DD/MM/YYYY HH:mm"
                  )
                }}
                -
                {{
                  moment(scope.row.event.updatedAt, "YYYYMMDDHHmmss").format(
                    "DD/MM/YYYY HH:mm"
                  )
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Project" width="300">
            <template #default="scope">
              <div>
                <span class="label-lb16">{{ scope.row.project.title }} </span>
                <!-- <div class="label-lb13">
                  <span>{{ scope.row.project.subTitle }} </span>
                </div> -->
              </div>
            </template>
          </el-table-column>

          <el-table-column label="Status" width="70">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 'NEW'" type="success">{{
                scope.row.status
              }}</el-tag>
              <el-tag v-if="scope.row.status === 'ACCEPTED'" type="warning">{{
                scope.row.status
              }}</el-tag>
              <el-tag v-if="scope.row.status === 'REJECTED'" type="info">{{
                scope.row.status
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="150" fixed="right">
            <template #default="scope">
              <div v-if="scope.row.status === 'NEW'" class="group-button">
                <el-button
                  type="success"
                  @click.stop="handleChangeStatus('ACCEPTED', scope.row)"
                  >Approve</el-button
                >
                <el-button
                  type="info"
                  @click.stop="handleChangeStatus('REJECTED', scope.row)"
                  >Reject</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="mt-24">
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
  </el-main>
  <app-footer />
</template>

<script>
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import moment from "moment";
export default {
  name: "ManageProject",
  data() {
    return {
      moment,
      txtSearchValue: "",
      searchValue: "",
      fields: [],
      technologies: [],
      status: null,
      page: 1,
      size: 20,
      statusOptions: [
        { id: "NEW", name: "New" },
        { id: "ACCEPTED", name: "Accepted" },
      ],
      fieldOptions: null,
      techOptions: null,
      posOptions: null,
      dialogVisible: false,
      txtReason: "",
      statusChoose: "",
      projectId: "",
      changeStatus: "",
      requestId: "",
      eventParticipantRequest: {},
    };
  },
  components: { AppHeader, AppFooter },
  computed: {
    ...mapState("event", ["requests", "setRequest"]),

    listRequests() {
      return this.requests.data;
    },
    totalElements() {
      return this.requests.totalElements;
    },
  },
  async mounted() {
    await this.handleFilterRequest();
  },
  methods: {
    ...mapActions("event", [
      "getAllJoinEventRequest",
      "acceptOrRejectJoinEventRequest",
    ]),
    ...mapMutations("event", ["setRequest", "setRequests"]),

    handleFilterRequest() {
      this.searchValue = this.txtSearchValue;
      this.handleChangePage(1);
    },
    async handleChangePage(page) {
      this.page = page;
      const payload = {
        page: this.page,
        size: this.size,
        status: this.statusChoose,
        search: this.searchValue,
      };
      await this.getAllJoinEventRequest(payload);
    },
    async handleRowClick(row) {
      console.log(row);
      // this.$router.push({ path: `/project/${row.id}` });
    },
    async handleChangeStatus(status, value) {
      //this.requestId = value.id;
      this.eventParticipantRequest = {
        id: value.id,
        eventId: value.event.id,
        projectId: value.project.id,
        status: status,
      };
      if (status === "ACCEPTED") {
        this.changeStatus = "Accept";
      } else {
        this.changeStatus = "Reject";
      }
      this.dialogVisible = true;
    },
    async handleConfirm() {
      await this.acceptOrRejectJoinEventRequest(this.eventParticipantRequest);
      this.dialogVisible = false;
      this.handleFilterRequest();
    },
  },
};
</script>

<style lang="scss" scoped>
.request-join-event {
  ::v-deep(.el-table__header),
  ::v-deep(.el-table__body),
  ::v-deep(.el-button),
  ::v-deep(.el-select) {
    width: 100% !important;
  }
  .group-button {
    display: flex;
    justify-content: flex-start;
    .el-button {
      margin-left: 20px;
      width: 140px !important;
    }
  }
  .search {
    .col-search {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .el-dialog {
    .el-input {
      margin-top: 10px;
    }
  }
  .label-lb16 {
    font-size: 16px;
  }
  .label-lb13 {
    font-size: 13px;
  }
  .dialog-footer {
    margin-top: 15px;
    display: flex;
  }
  .requestJoinEventTable {
    &__fullName {
      display: flex;
      align-items: center;
    }
    &__logo {
      height: 63px;
      display: flex;
      align-items: center;
    }
    &__member {
      align-items: center;
    }

    .el-tag--default {
      width: 81px;
    }
  }
}
</style>
