<template>
  <app-header />
  <div class="manage-equipment el-div-main">
    <el-dialog v-model="dialogNotiVisible" title="" width="30%">
      <span style="font-size: 16px">
        <el-image
          style="width: 18px; height: 18px"
          :src="require('@/assets/warning.jpg')"
          :fit="fit"
        />
        {{ notiStatus }}
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="info"
            plain
            @click="dialogNotiVisible = !dialogNotiVisible"
            >Cancel</el-button
          >
          <el-button type="success" plain @click="handleConfirm">OK</el-button>
        </span>
      </template>
    </el-dialog>

    <el-row class="mt-48 manage-equipment-inner">
      <el-col :span="20">
        <el-row>
          <el-col :span="24" class="search">
            <div>
              <el-button
                class="btn-create"
                type="success"
                @click="$router.push({ path: '/create-equipment' })"
              >
                Create Equipment
              </el-button>
            </div>

            <div class="col-search">
              <el-input
                placeholder="Search for equipment name..."
                v-model="inputName"
                class="input-with-select"
              />

              <el-button class="btn-search" @click="handleFilter">
                <el-icon :size="20"> <Search /></el-icon>
                Search
              </el-button>
            </div>
          </el-col>
        </el-row>

        <el-table
          class="equipment-table"
          :data="listEquipments"
          style="width: 100%"
        >
          <el-table-column label="NO." width="50">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="Image" width="120">
            <template #default="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row?.image"
                :fit="fit"
              />
            </template>
          </el-table-column>
          <el-table-column label="Name" width="200">
            <template #default="scope">
              {{ scope.row?.equipmentName }}
            </template>
          </el-table-column>
          <el-table-column label="Note" width="200">
            <template #default="scope">
              <span>{{ scope.row?.note }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Quantity" width="100">
            <template #default="scope">
              {{ scope.row?.quantity }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="Available" width="100">
            <template #default="scope">
              {{ scope.row?.quantityAvailable }}
            </template>
          </el-table-column> -->
          <el-table-column label="Status" width="100">
            <template #default="scope">
              {{ scope.row?.status }}
            </template>
          </el-table-column>
          <el-table-column width="220" style="display: flex">
            <template #default="scope">
              <div class="group-button">
                <el-button @click="updateEquipment(scope.row.id)"
                  >Update</el-button
                >
                <el-button type="danger" @click="handleDelete(scope.row.id)"
                  >Delete</el-button
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
  </div>
  <app-footer />
</template>
<script setup>
import { Search } from "@element-plus/icons-vue";
</script>
<script>
import { mapActions, mapState } from "vuex";
import { ElMessage } from "element-plus";
import Const from "@/const/data";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "all-equipment",
  components: { AppHeader, AppFooter },
  data() {
    return {
      size: 10,
      page: 1,

      inputName: "",
      auth: {},
      Const,
      equipmentId: null,
      dialogNotiVisible: false,
      notiStatus: null,
    };
  },
  computed: {
    ...mapState("equipment", ["equipments"]),

    listEquipments() {
      return this.equipments.data;
    },
    totalElements() {
      return this.equipments.totalElements;
    },
  },
  created() {
    this.handleFilter();
  },
  async mounted() {
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
  },
  methods: {
    ...mapActions("equipment", [
      "getAllEquipment",
      "getAllEquipmentAvailable",
      "deleteEquipment",
    ]),
    // ...mapActions("user", [
    //   "filterUser",
    // ]),
    // ...mapMutations("user", ["setUser"]),
    // handleFilterUser() {
    //   this.handleChangePage(1);
    // },
    async handleChangePage(page) {
      this.page = page;
      const payload = {
        search: this.inputName,
        size: this.size,
        page: this.page,
      };
      await this.getAllEquipment(payload);
    },
    handleFilter() {
      this.handleChangePage(1);
    },

    handleConfirm() {
      this.deleteEquipmentConfirm(this.equipmentId);
    },
    updateEquipment(id) {
      this.$router.push(`/update-equipment/${id}`);
    },

    handleDelete(id) {
      this.equipmentId = id;
      this.notiStatus = "Are you sure delete the equipment?";
      this.dialogNotiVisible = true;
    },
    async deleteEquipmentConfirm(id) {
      this.dialogNotiVisible = false;

      try {
        await this.deleteEquipment(id).then((res) => {
          if (res) {
            ElMessage({
              message: "Congrats, Create the equipment successfully!",
              type: "success",
            });
            location.reload();
          }
        });
      } catch (e) {
        console.log("delete the equipment error", e);
        ElMessage.error("Oops, delete the equipment fail");
      }
      // this.handleFilter();
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-equipment {
  .el-table .cell {
    word-break: break-word !important;
  }
  .el-table {
    .el-table__header-wrapper {
      th {
        background-color: #e8e4e4;
        border-bottom: 1px solid #999999;
        border-right: #fff;
      }
    }
    .el-table__body-wrapper {
      td {
        margin: 1px;
        background-color: #f4f4f4;
        border-bottom: var(--el-input-border, var(--el-border-base));
        border-right: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.manage-equipment {
  ::v-deep(.el-table__header),
  ::v-deep(.el-table__body) {
    width: 100% !important;
  }
  .manage-equipment-inner {
    display: flex;
    justify-content: center;
    .search {
      display: flex;
      margin-bottom: 30px;
      justify-content: space-between;
      .btn-create {
        width: 100%;
      }
      .col-search {
        display: flex;
        .el-select {
          margin-right: 10px;
          .el-input {
            .el-input__inner {
              width: 150px;
            }
          }
        }
        .el-input {
          .el-input__inner {
            width: 350px;
          }
        }
        .btn-search {
          height: 44px;
          margin-left: 40px;
          .el-icon {
            margin-right: 5px;
          }
        }
      }
      .el-input-group__append {
        width: 40px;
        padding: 0 1px;
      }
    }
    .equipment-table {
      word-wrap: break-word;

      .group-button {
        display: flex;
        .el-button {
          height: 32px;
          font-family: "Open Sans", sans-serif;

          span {
            font-size: 14px;
          }
        }
      }
      .box-status {
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.manage-equipment {
  ::v-deep(.el-table__header),
  ::v-deep(.el-table__body) {
    width: 100% !important;
  }
  .manage-equipment-inner {
    display: flex;
    justify-content: center;
    .search {
      display: flex;
      margin-bottom: 30px;
      justify-content: space-between;
    }
  }
}
</style>

