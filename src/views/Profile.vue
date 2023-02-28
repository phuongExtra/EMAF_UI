<template>
  <app-header />
  <div class="el-div-main">
    <div class="profile-page">
      <el-row :gutter="24" style="dislay: flex; justify-content: center">
        <el-col :span="20">
          <el-card>
            <template #header>
              <div
                class="card-header d-flex content-space-between items-center"
              >
                <h4 v-if="!changeAccountDetail">Profile</h4>
                <h4 v-else>Update Profile</h4>
                <el-button
                  v-if="!changeAccountDetail"
                  class="btn btn-edit"
                  type="text"
                  circle
                  @click="handleChangeAccountDetail()"
                  ><el-icon :size="30"><Edit /></el-icon
                ></el-button>
                <el-button
                  v-if="changeAccountDetail"
                  class="btn btn-save"
                  @click="saveAccountDetail()"
                  ><el-icon :size="18"><Select /></el-icon> Save</el-button
                >
              </div>
            </template>
            <div class="d-flex flex-column items-center">
              <div class="profile-avatar">
                <img
                  :src="previewSource"
                  class="image"
                  width="300"
                  height="300"
                />
              </div>

              <el-button
                v-if="changeAccountDetail"
                type="primary"
                class="mt-12"
                @click="$refs.fileInput.click()"
                >Upload new avatar</el-button
              >
            </div>

            <el-row
              style="display: flex; justify-content: center; margin: 20px 0px"
            >
              <el-row class="information">
                <div class="info mt-16">
                  <label class="text-label">Email:</label>
                  <div>
                    <p>{{ user.email }}</p>
                  </div>
                </div>

                <div class="info mt-16">
                  <label class="text-label">Student code:</label>

                  <div>
                    <p>{{ user.studentCode }}</p>
                  </div>
                </div>

                <div class="info mt-16">
                  <label class="text-label">First name:</label>
                  <div v-if="changeAccountDetail">
                    <el-input v-model="txtFirstname" type="text" />
                  </div>
                  <div v-else>
                    <p>{{ user.firstName }}</p>
                  </div>
                </div>

                <div class="info mt-16">
                  <label class="text-label">Last name:</label>
                  <div v-if="changeAccountDetail">
                    <el-input v-model="txtLastName" type="text" />
                  </div>
                  <div v-else>
                    <p>{{ user.lastName }}</p>
                  </div>
                </div>

                <div class="info mt-16">
                  <label class="text-label">Phone Number:</label>
                  <div v-if="changeAccountDetail">
                    <el-input v-model="txtPhoneNumber" type="text" />
                  </div>
                  <div v-else>
                    <p>{{ user.phoneNumber }}</p>
                  </div>
                </div>

                <div class="info mt-16" v-if="checkStudent">
                  <label class="text-label">Major:</label>
                  <div v-if="changeAccountDetail">
                    <el-select
                      v-model="majorChoose"
                      placeholder="Type"
                      clearable
                    >
                      <el-option
                        v-for="item in optionMajor"
                        :key="item"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div v-else>
                    <p>{{ user?.major?.name }}</p>
                  </div>
                </div>
              </el-row>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <input
        id="profileAvatar"
        ref="fileInput"
        class="d-none"
        type="file"
        accept="image/png,image/jpg,image/jpeg"
        @change="handleChangeAvatar"
      />
    </div>
  </div>
  <app-footer />
</template>

<script setup>
import { Edit, Select } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
</script>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
import moment from "moment";

export default {
  name: "UserProfile",
  data() {
    return {
      moment,
      previewSource:
        "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png",
      changeAccountDetail: false,
      txtFirstname: "",
      txtLastName: "",
      txtEmail: "",
      txtPhoneNumber: "",
      txtMajor: "",
      user: {},
      fileAvatar: null,
      majorChoose: null,
    };
  },
  components: { AppHeader, AppFooter },
  computed: {
    ...mapState("user", ["user", "avatar"]),
    ...mapState("major", ["majors"]),
    optionMajor() {
      return this.majors;
    },
    checkStudent() {
      return this.user.role === "ROLE_STUDENT";
    },
  },
  async created() {
    // const authStr = localStorage.getItem("auth");
    // const auth = JSON.parse(authStr);
    this.user = await this.getMyProfile();
    if (this.user?.avatar) {
      this.previewSource = this.user.avatar;
    }
    await this.getAllMajor();
  },
  methods: {
    ...mapActions("user", ["updateUser", "getMyProfile", "updateAvatar"]),
    ...mapActions("major", ["getAllMajor"]),
    ...mapMutations("user", ["setUser", "setAvatar"]),

    handleChangeAccountDetail() {
      this.txtFirstname = this.user?.firstName;
      this.txtLastName = this.user?.lastName;
      this.txtEmail = this.user?.email;
      this.txtPhoneNumber = this.user?.phoneNumber;
      this.majorChoose = this.user?.major?.id;
      this.changeAccountDetail = true;
    },
    async saveAccountDetail() {
      try {
        await this.updateUser({
          firstName: this.txtFirstname,
          lastName: this.txtLastName,
          majorId: this.majorChoose ? this.majorChoose : "",
          phoneNumber: this.txtPhoneNumber ? this.txtPhoneNumber : "",
        });
        ElMessage({
          message: "Congrats, update successfully!",
          type: "success",
        });

        if (this.fileAvatar) {
          const formData = new FormData();
          formData.append("avatar", this.fileAvatar);
          try {
            await this.updateAvatar(formData);
          } catch (error) {
            console.log(error);
          }
        }
        setTimeout(() => {
          location.reload();
        }, 500);
      } catch (e) {
        ElMessage.error("Oops,update fail");
        console.log(e);
      }
    },

    handleChangeAvatar(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 50000000) {
        this.$message.error(`Oops!!! This file size more than 50MB `);
        return;
      }
      this.fileAvatar = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewSource = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-div-main {
  .profile-page {
    .information {
      width: 60%;
    }
    .info {
      display: flex;
      width: 100%;
      font-size: 14px;
      margin-left: 60px;
      .el-input {
        width: 400px;
      }
      .el-select {
        width: 400px;
      }
    }
    .text-label {
      margin-right: 20px;
      width: 200px !important;
      align-items: center;
      display: flex;
    }
    p {
      font-size: 16px;
    }
  }
  .profile-avatar {
    width: 300px;
    height: 300px;
    border-radius: 300px;
    overflow: hidden;
  }
  .text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  .el-card__header {
    padding: 8px 20px;
    .card-header {
      position: relative;
      .btn-save {
        border: none;
        position: absolute;
        right: 0px !important;
        .el-icon {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
