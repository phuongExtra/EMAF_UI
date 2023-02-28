<template>
  <div class="d-flex" style="min-height: 200px; align-content: center; justify-content: center; align-items: center">
    <div style="display: flex; justify-content: center; flex-wrap: wrap; height: 100%">
      <div style="width: 100%; display: flex; justify-content: center">
        <div v-if="eventDetail?.documents && eventDetail.documents.length > 0">
          <div v-for="(item, index) in documents" :key="index" style="display: flex">
            <a
              :class="`d-flex content-flex-start items-center`"
              :href="item.targetUrl"
              :underline="false"
              target="_blank"
              :download="item.name"
            >
              <el-icon style="top: 1px; margin-right: 2px; font-size: 16px"><Document /></el-icon>
              <span>{{ item.name }}</span>
            </a>

            <el-button v-if="isOwnerEvent || isCombor" class="btn-delete" @click="handleDeleteDocument(item.id)"
              ><el-icon><CircleClose /></el-icon
            ></el-button>
          </div>
        </div>
      </div>

      <el-button
        v-if="eventDetail?.roleInEvent === Const.USER_ROLE.ROLE_ORGANIZER"
        class="btn-banner"
        @click="$refs.fileInput.click()"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        <input ref="fileInput" id="bannerImage" class="d-none" type="file" accept="image/*" @change="handleImportDoc" />
      </el-button>

      <el-empty v-else description="There is no document in this event" style="width: 100%" />
    </div>
  </div>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { UploadFilled, Document, CircleClose } from "@element-plus/icons-vue";
import Const from "../../const/data";
</script>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import moment from "moment";
export default {
  name: "document-event",
  data() {
    return {
      Const,
      fileList: [],
      file: null,
      auth: {},
    };
  },
  props: {
    eventDetail: Object,
  },
  computed: {
    ...mapState("event", ["event", "documents"]),
    isOwnerEvent() {
      return this.eventDetail.roleInEvent === Const.USER_ROLE.ROLE_ORGANIZER;
    },
    isCombor() {
      return this.eventDetail.roleInEvent === Const.USER_ROLE.ROLE_COLLABORATOR;
    },
  },
  async created() {},
  async mounted() {
    const authStr = localStorage.getItem("auth");
    this.auth = JSON.parse(authStr);
  },
  methods: {
    ...mapActions("event", ["updateDocument", "deleteDocument"]),
    ...mapMutations("event", ["setDocuments"]),

    moment: function () {
      return moment();
    },
    async handleUploadDocument() {
      let formData = new FormData();
      formData.append("eventId", this.eventDetail.id);
      formData.append("documents", this.file);
      const res = await this.updateDocument(formData);
      if (res) {
        this.documents.push(res[0]);
        ElMessage({
          message: "Congrats, Upload documment successfully!",
          type: "success",
        });
      }
    },
    handleImportDoc(event) {
      this.file = null;
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 500000000) {
        this.$message.error(`Oops!!! This file size more than 5MB `);
        return;
      }
      this.file = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.file = e.target.result;
      };
      reader.readAsDataURL(file);
      this.handleUploadDocument();
    },
    async handleDeleteDocument(id) {
      const res = await this.deleteDocument(id);
      if (res === true) {
        const filter = this.documents.filter((item) => {
          return item.id != id;
        });
        this.setDocumfents(filter);
        ElMessage({
          message: "Congrats, Delete documment successfully!",
          type: "success",
        });
      } else {
        ElMessage.error("Oops,  Delete documment fail");
      }
    },
  },
};
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
.upload {
  display: flex;
  justify-content: center;
}
.btn-banner {
  margin-top: 50px;
  width: 300px;
  background-color: #fff;
  // border-color: #fff;
  padding: 0px;
  span {
    width: 1205px !important;
    height: 205px !important;
    display: flex;
    justify-content: center;
  }
}
.link {
  width: 50%;
  svg {
    width: 20px;
    height: 20px;
  }
  .el-icon {
    width: 20px;
    height: 20px;
  }
}
.btn-delete {
  height: 20px;
  width: 20px;
  padding: 0;
  border: none;
  border-radius: 50%;
  margin-left: 15px;
}
</style>

