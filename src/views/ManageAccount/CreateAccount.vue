<template>
  <app-header />
  <div class="el-div-main create-account">
    <el-dialog v-model="dialogNotiVisible" title="Confirm" width="30%">
      <span style="font-size: 16px">
        {{ "Are you sure create this account?" }}
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
    <el-col :span="16" class="create-account-inner">
      <div class="label">
        <div class="title" style="margin-bottom: 30px">
          <h1>Create Account</h1>
        </div>
      </div>

      <el-row>
        <div class="info">
          <el-col :span="4">
            <div class="label">Role (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-select v-model="role" placeholder="Select">
                  <el-option
                    v-for="item in optionRole"
                    :key="item"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <p v-if="errors.role" class="fForm__error">
                  {{ errors.role }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Email (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-input v-model="txtEmail" />
                <p v-if="errors.email" class="fForm__error">
                  {{ errors.email }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">First name</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-input v-model="txtFirstName" />
                <p v-if="errors.name" class="fForm__error">
                  {{ errors.name }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Last name</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-input v-model="txtLastName" />
                <p v-if="errors.name" class="fForm__error">
                  {{ errors.name }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info" v-if="role === 'ROLE_STUDENT'">
          <el-col :span="4">
            <div class="label">Student Code</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-input v-model="txtStudentCode" />
                <p v-if="errors.studentCode" class="fForm__error">
                  {{ errors.studentCode }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info group-button">
          <el-button type="info" class="btn-cancel" @click="handleCancel"
            >Cancel</el-button
          >

          <el-button class="btn-create" @click="handleNext" type="success"
            >Create Account</el-button
          >
        </div>
      </el-row>
    </el-col>
  </div>
  <app-footer />
</template>

<script setup>
import { ElMessage } from "element-plus";
</script>

<script>
import { mapActions, mapState } from "vuex";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  name: "Create-account",
  components: { AppHeader, AppFooter },
  data() {
    return {
      role: "",
      optionRole: [
        { label: "Staff", value: "ROLE_STAFF" },
        { label: "Manager", value: "ROLE_MANAGER" },
      ],
      date: [new Date(), new Date()],
      imageUrl: "",
      bannerUrl: "",
      txtFirstName: "",
      txtLastName: "",
      txtEmail: "",
      txtPhoneNumber: "",
      txtStudentCode: "",
      txtPassword: "password",
      txtAddress: "",
      timeLine: [
        {
          content: "",
          time: "",
        },
      ],
      isReviewPage: false,
      accountList: [
        "Tabel",
        "Chair",
        "Loudspeaker",
        "Micro",
        "Headphone",
        "Banner",
      ],
      accountListChoose: [],
      errors: {},
      isError: false,
      dialogNotiVisible: false,
    };
  },
  computed: {
    ...mapState("user", ["account"]),
  },
  async mounted() {},
  methods: {
    ...mapActions("user", ["createAccount", "uploadImage"]),

    validate() {
      this.txtFirstName === "" && this.txtLastName === ""
        ? (this.errors.name = " Name is required")
        : delete this.errors.name;
      this.txtEmail === ""
        ? (this.errors.email = "Email is required")
        : delete this.errors.email;
      this.role === ""
        ? (this.errors.role = "Role is required")
        : delete this.errors.role;

      if (this.role === "ROLE_STUDENT") {
        this.txtStudentCode === ""
          ? (this.errors.studentCode = "Student code is required")
          : delete this.errors.studentCode;
      }
    },
    handleNext() {
      this.validate();
      setTimeout(() => {
        if (Object.keys(this.errors).length === 0) {
          this.dialogNotiVisible = true;
        }
      }, 100);
    },

    handleCancel() {
      this.$router.push({ path: "/all-accounts" });
    },

    async handleConfirm() {
      const payload = {
        email: this.txtEmail,
        firstName: this.txtFirstName,
        lastName: this.txtLastName,
        role: this.role,
      };
      try {
        await this.createAccount(payload).then((res) => {
          if (res === true) {
            ElMessage({
              message: "Congrats, Create the event successfully!",
              type: "success",
            });
            setTimeout(() => {
              this.$router.push({ path: `/all-accounts` });
            }, 500);
          } else {
            ElMessage.error("Oops, Create event fail");
          }
        });
      } catch (e) {
        ElMessage.error("Oops, Create event fail");
      }
    },

    handleBack() {
      this.isReviewPage = false;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    },
    addTimeLine() {
      this.timeLine.push({
        content: "",
        time: "",
      });
    },
    removeTimeLine(index) {
      this.timeLine.splice(index, 1);
    },
  },
};
</script>
<style lang="scss">
.create-account {
  .info {
    .box-edit {
      .box-end-time {
        flex-wrap: nowrap;
        margin-left: 272px;
        .el-input {
          .el-input__inner {
            width: 220px;
          }
        }
      }
      .avatar-uploader:hover {
        border-color: #f67043;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 178px;
        height: 178px;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }
  .timeline {
    margin-bottom: 10px !important;
    .el-button {
      width: 42px;
    }
  }
}
</style>
<style lang="scss" scoped>
.create-account {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .edit-banner {
    width: 100%;
    height: 205px;
    border: 1px dashed #000000;

    .banner-uploader {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: auto;
    }
    .banner-uploader:hover {
      border-color: #f67043;
    }

    .banner-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .banner {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .info {
    margin-top: 30px;
    width: 100%;
    display: flex;
    .label {
      margin-right: 10px;
      margin-top: 10px;
      font-size: 16px;
      .title {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
      }
    }
    .box-edit {
      display: flex;
      .box-end-time {
        flex-wrap: nowrap;
        .el-input {
          .el-input__inner {
            width: 220px;
          }
        }
      }
      .el-checkbox {
        margin-top: 5px;
        margin-right: 40px;
      }
      .time-line {
        display: flex;
      }
      .input {
        width: 100%;
      }
    }
    .el-tag {
      margin: 5px 5px 0px 0px;
    }
  }
  .group-button {
    display: flex;
    justify-content: center;
    margin-top: 100px;
    margin-bottom: 60px;
    .el-button + .el-button {
      margin-left: 70px;
    }
    .el-button {
      border-radius: 5px;
      width: 155px;
    }
  }
}
</style>
