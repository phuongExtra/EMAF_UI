<template>
  <app-header />
  <div class="manage-account el-div-main">
    <el-row class="mt-48 manage-account-inner">
      <el-col :span="20">
        <el-row>
          <el-col :span="24" class="search">
            <div>
              <el-button @click="$router.push({ path: '/create-account' })">
                Create Account
              </el-button>
            </div>

            <div class="col-search">
              <el-select v-model="selectRole" placeholder="Select role">
                <el-option
                  v-for="item in roles"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <el-select v-model="selectStatus" placeholder="Select status">
                <el-option
                  v-for="item in status"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <el-input
                placeholder="Please input"
                v-model="inputName"
                class="input-with-select"
                style="margin-left: 30px"
              >
                <template #append>
                  <div class="btn-search">
                    <button @click="handleFilterUser">
                      <el-icon :size="20"> <Search /></el-icon>
                    </button>
                  </div>
                </template>
              </el-input>
            </div>
          </el-col>
        </el-row>

        <el-table
          class="account-table"
          :data="listAccounts"
          style="width: 100%"
        >
          <el-table-column label="" width="70">
            <template #default="scope">
              <el-image
                :src="
                  scope.row.avatar
                    ? scope.row.avatar
                    : require('@/assets/default_user.png')
                "
                class="avatar-tb"
              />
            </template>
          </el-table-column>
          <el-table-column label="Email" width="270">
            <template #default="scope">
              {{ scope.row.email }}
            </template>
          </el-table-column>
          <el-table-column label="Firstname" width="200">
            <template #default="scope">
              <span>{{ getText(scope.row.firstName) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Lastname" width="200">
            <template #default="scope">
              <span>{{ getText(scope.row.lastName) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="StudentCode" width="150">
            <template #default="scope">
              <span>{{ getText(scope.row.studentCode) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Role" width="110">
            <template #default="scope">
              {{ scope.row.role }}
            </template>
          </el-table-column>

          <el-table-column label="Status" width="110">
            <template #default="scope">
              {{ scope.row.status }}
            </template>
          </el-table-column>
          <el-table-column width="140">
            <template #default="scope">
              <el-button @click="handleUpdate(scope.row)">Update</el-button>
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
import { mapActions, mapState, mapMutations } from "vuex";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
import Const from "@/const/data";
export default {
  name: "ManageUser",
  data() {
    return {
      size: 10,
      page: 1,
      selectRole: null,
      selectStatus: null,
      roles: ["Staff", "Student"],
      status: ["Active", "Blocked"],
      inputName: "",
      auth: {},
      Const,
    };
  },
  components: { AppHeader, AppFooter },
  computed: {
    ...mapState("user", ["accounts"]),

    listAccounts() {
      return this.accounts.data;
    },
    totalElements() {
      return this.accounts.totalElements;
    },
  },
  mounted() {
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
    this.handleFilterUser();
  },
  methods: {
    ...mapActions("user", ["filterAccount"]),
    ...mapMutations("user", ["setListAccount"]),

    handleUpdate(row) {
      this.$router.push({ path: `/account-update/${row.id}` });
    },
    handleFilterUser() {
      this.handleChangePage(1);
    },
    getText(value) {
      return value && value !== "" ? value : "—";
    },
    handleChangePage(page) {
      this.page = page;
      const payload = {
        search: this.searchValue,
        role: this.selectRole,
        status: this.selectStatus,
        page: this.page,
        size: this.size,
      };
      this.filterAccount(payload);
    },
    handleSearchEvent() {
      console.log("search account");
    },
  },
};
</script>

<style lang="scss" scoped>
.manage-account {
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
.manage-account {
  .manage-account-inner {
    .search {
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
      }

      .el-input-group {
        width: 450px;
      }
      .el-input-group__append {
        width: 40px;
        padding: 0 1px;
      }
    }
    .account-table {
      .el-button {
        span {
          font-size: 15px !important;
          font-weight: 300 !important;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.manage-account {
  ::v-deep(.el-table__header),
  ::v-deep(.el-table__body) {
    width: 100% !important;
  }
  .manage-account-inner {
    display: flex;
    justify-content: center;
    .search {
      display: flex;
      margin-bottom: 30px;
      justify-content: space-between;

      .btn-search {
        button {
          border: none;
          background-color: #fff;
          height: 39px;
          margin-top: 1px;
          width: 40px;
          border-radius: var(--el-input-border-radius);
          .el-icon {
            color: #c0c4cc;
          }
        }
        button:active {
          background-color: #409eff;

          .el-icon {
            color: #fff;
          }
        }
      }
    }
    .account-table {
      word-wrap: break-word;

      .avatar-tb {
        border-radius: 50%;
        height: 50px;
        width: 50px;
      }
      .el-button {
        width: 100px !important;
        height: 25px;
        font-family: "Open Sans", sans-serif;
        font-size: 12px !important;
        span {
          font-size: 15px !important;
          font-weight: 200 !important;
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

