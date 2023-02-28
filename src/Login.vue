<template>
  <div class="loginPage d-flex items-center content-center">
    <el-card class="box-card loginPage__card" style="width: 800px">
      <div class="d-flex content-center mt-50 w-100">
        <img class="loginPage__card__logo" src="@/assets/logo.png" />
      </div>
      <h1 class="text-center w-100 d-flex" style="font-size: 30px">SIGN IN</h1>
      <div class="login-form">
        <!-- <label class="text-label">Username</label>
        <el-input
          v-model="username"
          placeholder="Enter your username"
          @keyup.enter="handleLogin"
        />
        <label class="text-label mt-16">Password</label>
        <el-input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          @keyup.enter="handleLogin"
        /> -->

        <div class="d-flex content-center">
          <!-- <el-button
            type="primary"
            class="login-btn w-40 mt-24"
            @click="handleLogin"
            >Sign in
          </el-button>
          <div>Or Sign in With</div> -->
          <el-button
            type="primary"
            class="gg-btn w-40 mt-15"
            @click="handleLoginWithGoogle"
            :icon="IconGG"
            ><img class="logo-gg" src="@/assets/loginwithgoogle.png" /> Google
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "vuongvtse130628@fpt.edu.vn",
      password: "",
    };
  },

  methods: {
    ...mapActions("auth", ["login"]),
    ...mapActions("user", ["getUserByUsername"]),

    async handleLoginWithGoogle() {
      window.open(
        "https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?scope=openid%20profile%20email&redirect_uri=http%3A%2F%2Flocalhost%3A8082%2Femaf%2Fapi%2Fv1%2Fauth%2Flogin-google&response_type=code&client_id=1038807257026-c7tbf65a5fa1m5orkvekfbl20u5iom66.apps.googleusercontent.com&approval_prompt=force&fbclid=IwAR2zhbV2-_dYvAAo8dvADk9_OPMYhJQ2S3V49R5NqPQfIwDjoJMwmpQt1iw&service=lso&o2v=1&flowName=GeneralOAuthFlow"
      );
    },
    async handleLogin() {
      try {
        const authRes = await this.login({
          email: this.username,
        });
        if (authRes.status === 200) {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              auth: authRes.data,
            })
          );

          // try {
          //   const userRes = await this.getUserByUsername({
          //     username: authRes.data.username,
          //   });
          //   localStorage.setItem(
          //     "auth",
          //     JSON.stringify({
          //       auth: authRes.data,
          //       user: userRes,
          //     })
          //   );
          //   console.log(userRes);
          //   if (userRes) {
          //     window.location.href = "/statistical";
          //   }

          //   // window.location.reload();
          // } catch (error) {
          //   ElMessage({
          //     showClose: true,
          //     message: "Something went wrong, please try again!",
          //     type: "error",
          //   });
          // }
          setTimeout(() => {
            if (authRes.data.role === "ROLE_STUDENT") {
              this.$router.push({ path: `/home` });
            } else if (authRes.data.role === "ROLE_ADMIN") {
              this.$router.push({ path: `/all-accounts` });
            } else {
              this.$router.push({ path: `/all-events` });
            }
          }, 1000);
        }
      } catch (error) {
        ElMessage({
          showClose: true,
          message: "Invalid username or password, please try again!",
          type: "error",
        });
      }
    },
  },
  created() {
    localStorage.removeItem("auth");
  },
  mounted() {},
};
</script>

<style lang="scss">
.loginPage {
  width: 100vw;
  height: 100vh;
  background-image: url("../src/assets/fpt-hcm.jpg");
  background-size: cover;

  .w-100 {
    width: 100%;
  }
  .el-card {
    border: none;
    height: 500px;

    background: linear-gradient(
      to bottom,
      rgb(152 151 157 / 10%) 0%,
      rgb(43 42 42 / 30%) 100%
    );

    .el-card__body {
      height: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  &__card {
    position: relative;
    overflow: initial;

    &__logo {
      margin-top: -10px;
      width: 40rem;
    }
    h1 {
      align-items: flex-end;
      color: #fff;
    }
  }
  .login-form {
    width: 80%;
  }
  .logo-gg {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    :hover {
      color: #fff;
    }
  }
  .gg-btn {
    background-color: #fff;
    color: #f67043;
    --el-button-hover-text-color: #fff;
    border: none;
  }
  .gg-btn:hover {
    color: #fff;
  }
}
</style>

