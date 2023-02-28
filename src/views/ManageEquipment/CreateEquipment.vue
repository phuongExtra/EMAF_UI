<template>
  <app-header />
  <div class="el-div-main create-equipment">
    <el-col :span="16" class="create-equipment-inner">
      <div class="label">
        <div class="title" style="margin-bottom: 30px">
          <h1>Create Equipment</h1>
        </div>
      </div>

      <el-row>
        <div class="info">
          <el-col :span="4">
            <div class="label">Name (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-input v-model="txtName" :disabled="isReviewPage" />
                <p v-if="errors.name" class="fForm__error">
                  {{ errors.name }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Quantity</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <el-input-number
                v-model="txtQuantity"
                :min="1"
                :max="5000"
              ></el-input-number>
              <p v-if="errors.quantity" class="fForm__error">
                {{ errors.quantity }}
              </p>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Note</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <el-input v-model="txtNote" />
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Image</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="upload-image">
                <img
                  v-if="previewSource"
                  :src="previewSource"
                  class="image"
                  width="300"
                  height="300"
                />
                <br v-if="previewSource" />

                <el-button
                  type="primary"
                  class="mt-12"
                  @click="$refs.fileInput.click()"
                  >Upload image
                </el-button>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info group-button">
          <el-button
            type="info"
            @click="$router.push({ path: '/all-equipments' })"
            >Cancel</el-button
          >

          <el-button type="success" @click="handleCreate">Create </el-button>
        </div>
      </el-row>
    </el-col>
    <input
      id="profileAvatar"
      ref="fileInput"
      class="d-none"
      type="file"
      accept="image/png,image/jpg,image/jpeg"
      @change="handleUploadImage"
    />
  </div>
  <app-footer />
</template>

<script></script>
<script>
import { mapActions, mapState } from "vuex";
import { ElMessage } from "element-plus";
import Dashboard from "../Dashboard.vue";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
export default {
  components: { Dashboard, AppHeader, AppFooter },
  name: "Create-account",
  data() {
    return {
      txtQuantity: 0,
      txtName: "",
      txtNote: "",
      errors: {},
      isError: false,
      previewSource: null,
      fileAvatar: null,
      equipmentId: null,
    };
  },
  computed: {
    ...mapState("equipment", ["equipment"]),
  },
  async mounted() {},
  methods: {
    ...mapActions("equipment", [
      "createEquipment",
      "uploadImage",
      "getEquipmentDetail",
    ]),

    validate() {
      this.txtName === ""
        ? (this.errors.name = "Name is required")
        : delete this.errors.name;
    },

    async handleCreate() {
      this.validate();
      if (Object.keys(this.errors).length === 0) {
        const payload = {
          equipmentName: this.txtName,
          quantity: this.txtQuantity,
          note: this.txtNote,
        };
        try {
          await this.createEquipment(payload).then((res) => {
            if (res) {
              this.equipmentId = res;
              ElMessage({
                message: "Congrats, Create the equipment successfully!",
                type: "success",
              });
              if (this.fileAvatar) {
                const formData = new FormData();
                formData.append("image", this.fileAvatar);
                const payload = {
                  equipmentId: this.equipmentId,
                  image: formData,
                };

                try {
                  this.uploadImage(payload);
                } catch (e) {
                  console.log(e);
                }
              }
              setTimeout(() => {
                this.$router.push(`/all-equipments/`);
              }, 500);
            }
          });
        } catch (e) {
          ElMessage.error("Oops, Create the equipment fail");
        }
      }
    },

    handleUploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 5000000) {
        this.$message.error(`Oops!!! This file size more than 5MB `);
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
<style lang="scss">
.create-equipment {
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
      .pload-image {
        display: block;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.create-equipment {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

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
      margin-left: 50px;
    }
    .el-button {
      border-radius: 5px;
      width: 150px;
    }
  }
}
</style>

