<template>
  <el-main v-loading="isLoading" class="redirectPage mt-72">
    <!-- Verify Email -->
    <div v-if="$route">
      <div v-if="verifyEmailStatus === Const.USER_VERIFICATION_STATUS.INACTIVE">
        <div class="d-flex content-center">
          <img src="@/assets/checked.jpeg" alt="checked" width="150" height="150" />
        </div>
        <h1 class="text-center">Register Successfully</h1>
        <h4 class="text-center mt-12">Thanks for your registration at F-START</h4>
        <div class="d-flex content-center mt-12">
          <el-button type="primary" @click="$router.push({ path: '/login' })">Let's go!</el-button>
        </div>
      </div>
      <div v-if="verifyEmailStatus === Const.USER_VERIFICATION_STATUS.EXPIRED && resendVerifyStatus === false">
        <h2 class="text-center">Your Verification Email Has Expired</h2>
        <p class="text-center mt-8">
          Already have an account?
          <span class="link-item mr-12"><router-link to="/login">Sign In</router-link></span>
        </p>

        <el-row>
          <el-col :span="24" class="d-flex content-center">
            <img src="@/assets/resend.png" alt="resend" width="150" height="150" />
          </el-col>
        </el-row>
        <h4 class="text-center mt-12">Enter your email address to receive the verification email again</h4>
        <el-row :gutter="20" class="fForm mt-8 d-flex content-center">
          <el-col :span="12" class="w-100 d-flex content-center">
            <el-input v-model="email" placeholder="Enter your email address" />
            <p v-if="errors.emailAddress" class="fForm__error">
              {{ errors.emailAddress }}
            </p>
            <p v-if="errors.emailFormat" class="fForm__error">
              {{ errors.emailFormat }}
            </p>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" class="w-100" @click="handleSendVerifyCode">Send</el-button>
          </el-col>
        </el-row>
      </div>

      <div v-if="resendVerifyStatus">
        <div class="d-flex content-center">
          <img src="@/assets/checked.jpeg" alt="checked" width="150" height="150" />
        </div>
        <h1 class="text-center">Verify Your Email</h1>
        <h4 class="text-center mt-12">Your verification email have been sent to your email</h4>
        <p class="text-center mt-8">
          To complete the registration proccess, please verify your email address <br />
          by click to the "Verify Email" button in your email <br />
          We sent to you.
        </p>
      </div>
    </div>
  </el-main>
</template>

<script>
import { mapActions } from "vuex";
import Const from "@/const/data";
import Utils from "@/utils/utils";

export default {
  name: "RegisterPage",
  data() {
    return {
      Const,
      email: "",
      errors: {},
      isLoading: false,
      verifyEmailStatus: false,
      resendVerifyStatus: false,
    };
  },
  computed: {
    type() {
      const query = this.$route.query;
      return query.type ? query.type : "";
    },
  },
  async mounted() {
    switch (this.type) {
      case Const.REDIRECT_TYPE.GOOGLE:
        this.handleVerifyGoogle();
        break;
      case Const.REDIRECT_TYPE.VERIFY_EMAIL:
        this.handleVerifyEmail();
        break;
      default:
        this.$router.push({ path: "/404" });
        break;
    }
  },
  methods: {
    ...mapActions("user", ["sendVerifyCode", "getUserByUsername"]),
    ...mapActions("auth", ["processLoginGoogle"]),

    async handleVerifyGoogle() {
      const { query } = this.$route;

      this.isLoading = true;
      try {
        const authRes = await this.processLoginGoogle({
          accessTokenGoogle: query.code,
        });

        if (authRes.status === 200) {
          Utils.setStorage("auth", JSON.stringify({ auth: authRes.data }));

          const userRes = authRes.data;

          Utils.setStorage("auth", JSON.stringify({ auth: authRes.data, user: userRes }));

          if (userRes.role === Const.USER_ROLE.ROLE_STUDENT) {
            window.location.href = "/list-events";
          } else {
            window.location.href = "/all-events";
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async handleSendVerifyCode() {
      this.isLoading = true;
      const regx = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/);
      if (!this.email.trim()) {
        this.errors.emailAddress = "Email must be entered";
      } else if (!regx.test(this.email.trim())) {
        delete this.errors.emailAddress;
        this.errors.emailFormat = "Email is incorrect format";
      } else {
        delete this.errors.emailAddress;
        delete this.errors.emailFormat;

        this.isLoading = true;
        try {
          this.resendVerifyStatus = await this.sendVerifyCode({
            email: this.email.trim(),
          });
          this.isLoading = false;
          if (this.resendVerifyStatus) {
            this.email = "";
          }
        } catch (error) {
          this.isLoading = false;
          // this.showMsg("Send verification failed!");
        }
      }
    },
  },
};
</script>

