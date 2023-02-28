<template>
  <div class="d-flex-center fw-wrap comment">
    <!-- input comment by user -->
    <el-row class="w-90 mt-10">
      <el-col :span="2"
        ><el-avatar
          :src="
            auth?.avatar ? auth.avatar : require('@/assets/default_user.png')
          "
        ></el-avatar
      ></el-col>
      <el-col :span="22">
        <el-input
          v-model="inputComment"
          placeholder="Please input comment..."
          class="w-70"
          @keyup.enter="handleSend()"
        />
        <el-button class="button-send" type="success" @click="handleSend()"
          >Send</el-button
        >
      </el-col>
    </el-row>

    <el-empty
      v-if="listComment && listComment.length === 0"
      class="w-90"
      description="There is no comment here"
    />

    <el-row class="w-90 mb-30 comment-area" v-else>
      <!-- item comment -->
      <div
        class="w-100 d-flex mt-20"
        v-for="item in this.listComment"
        :key="item"
      >
        <el-col :span="2">
          <el-avatar
            :src="
              item?.user?.avatar
                ? item.user.avatar
                : require('@/assets/default_user.png')
            "
          >
          </el-avatar>
        </el-col>
        <el-col :span="22" class="d-flex">
          <div class="w-100">
            <div class="d-flex">
              <div class="comment-item">
                <p style="font-size: 13px">
                  <b>{{
                    item?.user?.lastName + " " + item?.user?.firstName
                  }}</b>
                </p>

                <p style="font-size: 15px">{{ item.content }}</p>
              </div>
              <div v-if="item.user.id === this.auth.userId">
                <el-popconfirm
                  title="Are you sure to delete this comment?"
                  @confirm="confirmDeleteEvent(item)"
                >
                  <template #reference>
                    <el-button class="btn-delete">
                      <el-icon><CircleClose /></el-icon
                    ></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
            <div>
              <div class="mb-5">
                <span
                  class="reply"
                  style="font-weight: 700"
                  @click="handleInputReply(item.id)"
                  >Reply</span
                >
                <span style="font-weight: 200; margin-left: 15px">{{
                  moment(item.createdAt, "YYYYMMDDHHmmss").format(
                    "DD/MM/YYYY HH:mm"
                  )
                }}</span>
              </div>

              <!-- reply comment -->
              <div
                v-for="commentChild in item?.childrenComments"
                :key="commentChild"
                class="d-flex mb-5"
              >
                <el-col :span="2">
                  <el-avatar
                    :src="
                      commentChild?.user?.avatar
                        ? commentChild.user.avatar
                        : require('@/assets/default_user.png')
                    "
                  >
                  </el-avatar>
                </el-col>
                <el-col :span="22" class="d-flex">
                  <div class="w-100">
                    <div>
                      <div class="d-flex">
                        <div class="comment-item">
                          <p style="font-size: 13px">
                            <b>{{
                              commentChild?.user?.lastName +
                              " " +
                              commentChild?.user?.firstName
                            }}</b>
                          </p>

                          <p style="font-size: 15px">
                            {{ commentChild.content }}
                          </p>
                        </div>
                        <div v-if="commentChild.user.id === this.auth.userId">
                          <el-popconfirm
                            title="Are you sure to delete this comment?"
                            @confirm="confirmDeleteEvent(commentChild)"
                          >
                            <template #reference>
                              <el-button class="btn-delete">
                                <el-icon><CircleClose /></el-icon
                              ></el-button>
                            </template>
                          </el-popconfirm>
                        </div>
                      </div>
                      <span style="font-weight: 200; margin-left: 15px">{{
                        moment(item.createdAt, "YYYYMMDDHHmmss").format(
                          "DD/MM/YYYY HH:mm"
                        )
                      }}</span>
                    </div>
                  </div>
                </el-col>
              </div>
            </div>
            <!-- user reply -->
            <div class="mt-10 w-98 d-flex mb-10" v-if="checkReply(item.id)">
              <el-col :span="2">
                <el-avatar
                  :src="
                    auth?.avatar
                      ? auth.avatar
                      : require('@/assets/default_user.png')
                  "
                >
                </el-avatar>
              </el-col>
              <el-col :span="22">
                <el-input
                  v-model="inputReply"
                  placeholder="Please input comment..."
                  class="w-70"
                  @keyup.enter="handleReply(item.id)"
                />
                <el-button
                  class="button-send"
                  type="success"
                  @click="handleReply(item.id)"
                  >Send</el-button
                >
              </el-col>
            </div>
          </div>
          <div></div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script setup>
import { CircleClose } from "@element-plus/icons-vue";
</script>
<script>
import { mapActions, mapState, mapMutations } from "vuex";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

import moment from "moment";
export default {
  name: "comment-event",
  data() {
    return {
      auth: {},
      inputComment: "",
      inputReply: "",

      inputReplyVisible: null,
      eventId: "",
      stompClient: null,
      connected: false,
      listReplyComment: [],
    };
  },
  props: {
    eventDetail: Object,
  },
  computed: {
    ...mapState("comment", ["comment", "comments"]),
    listComment() {
      return this.comments ? this.comments : [];
    },
  },
  async mounted() {
    this.eventId = this.$route.params.eventId;
    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
    await this.getAllComments(this.eventId);
    this.connect();
  },
  // onUnmouted() {
  //   console.log(this.stompClient, "end");
  //   this.stompClient.disconnect(
  //     {},
  //     () => {
  //       console.log("disconnect success");
  //     },
  //     () => {
  //       console.log("disconnect fails");
  //     }
  //   );
  // },
  methods: {
    ...mapActions("comment", [
      "getAllComments",
      "updateComment",
      "deleteComment",
      "createComment",
    ]),
    ...mapMutations("comment", ["setComments"]),

    moment: function () {
      return moment();
    },

    checkReply(id) {
      return this.listReplyComment.includes(id);
    },

    handleInputReply(id) {
      if (this.listReplyComment.includes(id)) {
        this.listReplyComment.splice(0, 1);
      } else {
        this.listReplyComment.push(id);
      }
    },

    convertDatetime(str) {
      var date = new Date(
        str.replace(
          /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
          "$4:$5:$6 $2/$3/$1"
        )
      );
      return date;
    },

    async handleSend() {
      if (this.inputComment !== "") {
        const payload = {
          userId: this.auth.userId,
          content: this.inputComment,
          eventId: this.eventDetail.id,
          parentId: 0,
        };

        await this.createComment(payload).then((res) => {
          if (res.status === 200) {
            //this.getAllComments(this.eventId);
          }
        });

        // if (this.connected === true) {

        // }
        this.inputComment = "";
      }
    },

    async handleReply(id) {
      if (this.inputReply !== "") {
        const payload = {
          userId: this.auth.userId,
          content: this.inputReply,
          eventId: this.eventDetail.id,
          parentId: id,
        };

        await this.createComment(payload).then((res) => {
          if (res.status === 200) {
            // this.getAllComments(this.eventId);
          }
        });

        this.listReplyComment.splice(0, 1);
        this.inputReply = "";
      }
    },

    async handleDelete(item) {
      const payload = {
        userId: this.auth.userId,
        commentId: item.id,
        eventId: this.eventDetail.id,
      };
      // const id = item.id;
      try {
        await this.deleteComment(payload).then((res) => {
          if (res === true) {
            // const filter = this.comments.filter((item) => {
            //   console.log(item.id != id);
            //   return item.id != id;
            // });
            // this.setComments(filter);
          }
        });
      } catch (e) {
        console.log(e);
      }
    },

    confirmDeleteEvent(item) {
      this.handleDelete(item);
    },

    connect() {
      this.socket = new SockJS("http://localhost:8082/ws-emaf");
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        {},
        () => {
          this.connected = true;
          this.stompClient.subscribe(`/topic/event/${this.eventId}`, (tick) => {
            const body = JSON.parse(tick.body);

            if (body?.delete === false) {
              if (body?.parentId === 0) {
                this.comments.unshift(body);
              } else if (body?.parentId !== 0) {
                for (let item of this.comments) {
                  if (item.id === body.parentId) {
                    if (item.childrenComments === null) {
                      item.childrenComments = [];
                    }
                    item.childrenComments.push(body);
                  }
                }
              }
            } else {
              if (body?.parentId === 0) {
                const filter = this.comments.filter((item) => {
                  return item.id !== body.id;
                });
                this.setComments(filter);
              } else if (body?.parentId !== 0) {
                for (let item of this.comments) {
                  if (item.id === body.parentId) {
                    item.childrenComments = item.childrenComments.filter(
                      (i) => {
                        return i.id !== body.id;
                      }
                    );
                    //this.setComments(filter);
                  }
                }
              }
            }
          });
        },
        (error) => {
          this.connected = false;
          console.log(error, "error");
        }
      );
    },
  },
};
</script>
<style lang="scss">
.comment {
  .btn-delete {
    border: none;
    --el-button-hover-border-color: #fff !important;
    --el-button-hover-bg-color: #fff !important;
  }
  .el-button {
    width: 6vw;
  }
}
</style>
<style lang="scss" scoped>
.comment {
  flex-wrap: wrap;
  .comment-area {
    min-height: 200px;
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 10px;
  }

  .button-send {
    margin-left: 10px;
    width: 6vw;
  }
  .comment-item {
    background: #e4e6eb;
    display: table;
    padding: 5px 10px;
    border-radius: 6px;
    p {
      word-wrap: break-word;
      white-space: normal;
    }
  }
  .reply {
    box-shadow: 0 3px #fff;
    margin-left: 10px;
  }
  .reply:hover {
    color: blue;
    box-shadow: 0 1px blue;
    cursor: pointer;
  }
}
</style>

