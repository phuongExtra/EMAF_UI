<template>
  <app-header />
  <div class="el-div-main update-equipment">
    <el-col :span="16" class="update-equipment-inner">
      <div class="label">
        <div class="title" style="margin-bottom: 30px">
          <h1>Update Equipment</h1>
        </div>
        <div class="image-equip">
          <img v-if="previewSource" :src="previewSource" class="image" />
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
              <el-input-number v-model="txtQuantity" :min="1" :max="5000"></el-input-number>
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
            <div class="label">Status</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <el-select v-model="statusChoose">
                <el-option v-for="item in optionStatus" :key="item" :label="item" :value="item"></el-option>
              </el-select>
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
                <img v-if="previewSource" :src="previewSource" class="image" width="300" height="300" />
                <br />

                <el-button type="primary" class="mt-12" @click="$refs.fileInput.click()">Upload image </el-button>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info group-button">
          <el-button type="info" @click="$router.push({ path: '/all-equipments' })">Cancel</el-button>

          <el-button type="success" @click="handleUpdate">Update </el-button>
        </div>
      </el-row>
    </el-col>
    <input
      id="profileImage"
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
  name: "Update-account",
  data() {
    return {
      txtQuantity: 0,
      txtName: "",
      txtNote: "",
      errors: {},
      isError: false,
      previewSource: null,
      fileImage: null,
      equipmentId: null,
      optionStatus: ["AVAILABLE", "UNAVAILABLE"],
      statusChoose: null,
    };
  },
  computed: {
    ...mapState("equipment", ["equipment"]),
  },
  async mounted() {
    this.equipmentId = this.$route.params.equipmentId;
    await this.getEquipmentDetail(this.equipmentId).then((res) => {
      this.txtName = this.equipment.equipmentName;
      this.txtNote = this.equipment.note;
      this.txtQuantity = this.equipment.quantity;
      this.previewSource = this.equipment.image;
      this.statusChoose = this.equipment.status;
    });
  },
  methods: {
    ...mapActions("equipment", ["updateEquipment", "getEquipmentDetail", "uploadImage"]),
    validate() {
      this.txtName === "" ? (this.errors.name = "Name is required") : delete this.errors.name;
    },

    async handleUpdate() {
      this.validate();
      if (Object.keys(this.errors).length === 0) {
        const payload = {
          equipmentId: this.equipmentId,
          equipmentName: this.txtName,
          quantity: this.txtQuantity,
          note: this.txtNote,
          status: this.statusChoose,
        };
        try {
          await this.updateEquipment(payload).then((res) => {
            if (res) {
              if (this.fileImage) {
                const formData = new FormData();
                formData.append("image", this.fileImage);
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
              ElMessage({
                message: "Congrats, Update the equipment successfully!",
                type: "success",
              });
            }

            setTimeout(() => {
              this.$router.push(`/all-equipments/`);
            }, 800);
          });
        } catch (e) {
          console.log("update equipment error", e);
          ElMessage.error("Oops, Update the equipment fail");
        }
      }
    },

    handleUploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 50000000) {
        this.$message.error(`Oops!!! This file size more than 50MB `);
        return;
      }
      this.fileImage = file;

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
.update-equipment {
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
    }
  }
  .update-equipment-inner {
    .label {
      .image-equip {
        display: flex;
        justify-content: center;
        height: 300px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.update-equipment {
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

