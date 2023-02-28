<template>
  <el-header>
    <el-row style="display: flex">
      <el-col
        :span="4"
        class="d-flex"
        style="width: 17%; justify-content: center"
      >
        <el-button class="btn-logo" @click="handleClickLogo">
          <img
            id="noti"
            src="@/assets/logo.png"
            height="74"
            style="border-bottom: 1px solid #ccc"
          />
        </el-button>
      </el-col>
      <el-col
        :span="20"
        class="d-flex items-center flex-space-between"
        style="width: 83%"
      >
        <div
          class="d-flex items-center content-flex-start"
          style="margin-top: -5px"
        >
          <el-button
            v-if="userLogin && userLogin.role === Const.USER_ROLE.ROLE_STUDENT"
            @click="this.$router.push({ path: `/home` })"
            >Home</el-button
          >

          <el-button
            v-if="userLogin && userLogin.role === Const.USER_ROLE.ROLE_STAFF"
            @click="this.$router.push({ path: `/statistical` })"
            >Statistical</el-button
          >
          <el-button
            v-if="userLogin && userLogin.role !== Const.USER_ROLE.ROLE_ADMIN"
            @click="handleChooseEventsMenu"
            >Events</el-button
          >
          <el-button
            v-if="userLogin?.role === Const.USER_ROLE.ROLE_ADMIN"
            @click="this.$router.push({ path: `/all-accounts` })"
            >Accounts</el-button
          >

          <el-button
            v-if="userLogin?.role === Const.USER_ROLE.ROLE_STAFF"
            @click="this.$router.push({ path: `/all-equipments` })"
            >Equipments</el-button
          >
        </div>
        <div class="d-flex items-center content-flex-end">
          <el-dropdown :hide-on-click="false">
            <div class="d-flex items-center content-center el-dropdown-link">
              <el-button @click="handleOpen()">
                <el-icon :color="color" :size="30"><Bell /></el-icon>&ensp;
              </el-button>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="notification-dropdown">
                <el-dropdown-item
                  v-for="item in listNotification"
                  :key="item"
                  @click="gotoEventDetail(item)"
                >
                  {{ item.content }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="listNotification && listNotification.length === 0"
                >
                  You have no notification!
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="listNotification && listNotification.length > 0"
                  divided
                  @click="this.$router.push({ path: `/notifications` })"
                >
                  All Notifications
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown :hide-on-click="false">
            <div class="d-flex items-center content-center el-dropdown-link">
              <el-avatar
                :src="
                  userLogin?.avatar
                    ? userLogin.avatar
                    : require('@/assets/default_user.png')
                "
              ></el-avatar
              >&ensp;
              <b>{{ userLogin?.fullName }}</b>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handlegetProfile(`/profile`)"
                  >Profile</el-dropdown-item
                >
                <el-dropdown-item
                  @click="this.$router.push({ path: `/my-events` })"
                  >My Event</el-dropdown-item
                >
                <el-dropdown-item
                  @click="
                    this.$router.push({ path: `/invitation-and-request` })
                  "
                  >Invitation & request</el-dropdown-item
                >
                <el-dropdown-item divided @click="handleSignOut"
                  >Sign Out</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </el-header>
</template>

<script setup>
import { Bell } from "@element-plus/icons-vue";
</script>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import Utils from "@/utils/utils";
import Const from "../../const/data";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { ElNotification } from "element-plus";

export default {
  name: "AppHeader",
  data() {
    return {
      Utils,
      Const,
      eventId: null,
      listNotification: [],
      visible: false,
      color: "black",
    };
  },
  components: {},
  computed: {
    ...mapState("user", ["user"]),
    ...mapState("event", ["notis"]),
    isAuthenticated() {
      return Utils.isAuthenticated();
    },
    userLogin() {
      const authStr = localStorage.getItem("auth");
      const auth = JSON.parse(authStr);
      return auth && auth.auth;
    },
  },
  async mounted() {
    this.listNotification = await this.getAllNoti();
    this.connect();
  },

  methods: {
    ...mapMutations("user", ["setUser"]),
    ...mapActions("event", ["getAllNoti"]),

    gotoEventDetail(item) {
      this.$router.push({ path: `/event/${item.targetUrl}` });
    },

    handleSignOut() {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");

      window.location.href = "/login";
    },
    handlegetProfile(path) {
      //  this.color = "red";
      this.$router.push({ path: path });
    },
    async handleOpen() {
      this.color = "black";
      this.listNotification = await this.getAllNoti();

      this.visible = true;
    },

    connect() {
      this.socket = new SockJS("http://localhost:8082/ws-emaf");
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        {},
        () => {
          this.connected = true;
          this.stompClient.subscribe(
            `/topic/notification/${this.userLogin.userId}`,
            (tick) => {
              const body = JSON.parse(tick.body);

              this.listNotification.unshift(body);

              this.color = "red";

              ElNotification({
                title: body.type,
                message: body.content,
                type: "success",
              });
            }
          );
        },
        (error) => {
          this.connected = false;
          console.log(error, "error");
        }
      );
    },

    handleChooseEventsMenu() {
      if (this.userLogin?.role === Const.USER_ROLE.ROLE_STUDENT) {
        this.$router.push({ path: `/list-events` });
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } else {
        this.$router.push({ path: `/all-events` });
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },
    handleClickLogo() {
      if (this.userLogin?.role === Const.USER_ROLE.ROLE_STUDENT) {
        this.$router.push({ path: `/home` });
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } else {
        this.$router.push({ path: `/all-events` });
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },
  },
};
</script>
<style lang="scss">
.el-dropdown {
  .el-button {
    height: 100% !important;
    width: 100% !important;
  }
}

.notification-dropdown {
  width: 400px;
  .el-dropdown-menu__item {
    border-bottom: #eeebeb 1px solid;
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    white-space: pre-wrap;
  }

  button {
    height: 100% !important;
    width: 100% !important;
    padding: 0 !important;

    word-break: break-word;
    white-space: pre-wrap;
    font-size: 16px;
    background: inherit;
    border: none;
  }
  button:hover {
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
.el-header {
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  height: 75px;
  .btn-logo {
    height: 75px;
    border: 0;
    background-color: #fff;
  }
}
.el-button {
  height: 78px;
  width: 120px;
  border: none;
  --el-button-hover-bg-color: #fff2d8;
  --el-button-hover-text-color: rgb(246, 112, 67);
}

.el-button--default {
  --el-button-text-color: var(--el-text-color-regular);
  --el-button-hover-text-color: #f67043;
  --el-button-disabled-text-color: var(--el-text-color-placeholder);
}
.header-menu {
  display: flex;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-left: 32px;

  li {
    padding: 0;
  }
}

.link-item a {
  padding: 16px 24px;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.4s ease;

  &:hover {
    color: #f7780c !important;
  }

  &:visited,
  &:active {
    color: #000;
  }
}
</style>

