<template>
  <app-header />
  <div class="el-div-main update-event">
    <el-dialog v-model="dialogNotiVisible" title="Status" width="30%">
      <span style="font-size: 16px"> {{ updateStatus }} </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" plain @click="handleConfirm">OK</el-button>
        </span>
      </template>
    </el-dialog>
    <el-col :span="17" class="update-event-inner">
      <div class="title">
        <h1 v-if="auth.role === Const.USER_ROLE.ROLE_STUDENT">
          Update Event Request
        </h1>
        <h1 v-else>Update Event</h1>
      </div>

      <div class="info">
        <div class="label" style="margin-bottom: -20px">Banner</div>
      </div>
      <el-row>
        <div class="info" style="justify-content: center">
          <div class="edit-banner">
            <el-button class="btn-banner" @click="$refs.fileInput.click()">
              <img v-if="bannerUrl" :src="bannerUrl" class="banner" />
              <i v-else class="el-icon-plus banner-uploader-icon">
                <el-icon><Plus /> </el-icon></i
            ></el-button>
            <input
              ref="fileInput"
              id="bannerImage"
              class="d-none"
              type="file"
              accept="image/*"
              @change="handleChangeBanner"
            />
          </div>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Name (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-input v-model="txtName" />
                <p v-if="errors.name" class="fForm__error">
                  {{ errors.name }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Short Description (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <ckeditor
                  v-model="txtShortDescription"
                  :editor="editor"
                  :config="editorConfig"
                  @input="handleChangeDescription"
                ></ckeditor>
              </div>
              <p v-if="errors.shortDescription" class="fForm__error">
                {{ errors.shortDescription }}
              </p>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Description (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <ckeditor
                  v-model="txtDescription"
                  :editor="editor"
                  :config="editorConfig"
                  @input="handleChangeDescription"
                ></ckeditor>
              </div>
              <p v-if="errors.description" class="fForm__error">
                {{ errors.description }}
              </p>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Type(*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit" style="justify-content: space-between">
              <div class="d-flex-start">
                <el-select
                  v-model="typeChoose"
                  placeholder="Type"
                  style="height: 42px; width: 300px"
                >
                  <el-option
                    v-for="item in optionType"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <p v-if="errors.type" class="fForm__error">
                  {{ errors.type }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Location (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit" style="justify-content: space-between">
              <div class="input d-flex-start">
                <el-select
                  v-model="txtLocation"
                  filterable
                  placeholder="Choose location..."
                  style="width: 300px"
                >
                  <el-option
                    v-for="item in locations"
                    :key="item"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <p v-if="errors.location" class="fForm__error">
                  {{ errors.location }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Time (*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-date-picker
                  v-model="date"
                  type="datetimerange"
                  range-separator="To"
                  start-placeholder="Start Time"
                  end-placeholder="End Time"
                  @change="handleChangeTime()"
                  style="height: 42px"
                  :disabled-date="pickerOptions"
                >
                </el-date-picker>
                <p v-if="errors.time" class="fForm__error">
                  {{ errors.time }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Registration Time(*)</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-date-picker
                  v-model="registerDate"
                  type="datetimerange"
                  range-separator="To"
                  start-placeholder="Start Time"
                  end-placeholder="End Time"
                  @change="handleChangeTime()"
                  style="height: 42px"
                  :disabled-date="pickerOptionsRegister"
                >
                </el-date-picker>
                <p v-if="errors.time" class="fForm__error">
                  {{ errors.time }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div
          class="info"
          v-if="
            txtLocation === 'FPT' && auth.role !== Const.USER_ROLE.ROLE_STUDENT
          "
        >
          <el-col :span="4">
            <div class="label">Room</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-select
                  v-model="roomchoose"
                  filterable
                  placeholder="Choose room..."
                  multiple
                >
                  <el-option
                    v-for="item in rooms"
                    :key="item"
                    :label="
                      item.roomName + ` (capacity:  ` + item.capacity + `)`
                    "
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Timeline</div>
          </el-col>
          <el-col :span="20">
            <el-row
              :gutter="20"
              v-for="(item, index) in timeLine"
              :key="`timeline_${index}`"
              class="timeline"
            >
              <el-col :span="12">
                <el-input
                  v-model="item.content"
                  placeholder="Please input content"
                />
              </el-col>
              <el-col :span="12">
                <el-input v-model="item.note" placeholder="Please input note" />
              </el-col>
              <el-col :span="24" style="padding-left: 0px; display: flex">
                <el-col :span="20" style="display: flex">
                  <el-input
                    v-model="item.activity"
                    placeholder="Please input activity "
                    style="width: 400px; margin-right: 20px"
                  />

                  <el-time-picker
                    v-model="item.time"
                    is-range
                    format="HH:mm"
                    value-format="HH:mm"
                    range-separator="To"
                    start-placeholder="Start time"
                    end-placeholder="End time"
                  />
                </el-col>
                <el-col :span="4">
                  <el-button
                    v-if="index === 0"
                    type="success"
                    round
                    @click="addTimeLine()"
                  >
                    +
                  </el-button>
                  <el-button type="danger" round @click="removeTimeLine(index)">
                    -
                  </el-button>
                </el-col>
              </el-col>
            </el-row>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Speaker</div>
          </el-col>
          <el-col :span="20">
            <div class="d-flex-wrap">
              <el-tag
                v-for="speaker in speakerList"
                :key="speaker"
                class="mx-1"
                type="warning"
                closable
                :disable-transitions="false"
                @close="handleClose(speaker)"
              >
                {{ speaker }}
              </el-tag>
              <input
                v-if="inputVisible"
                ref="inputTag"
                v-model="inputValue"
                class="ml-1 w-20 input-tag"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <button
                v-if="!inputVisible"
                style="border-radius: 5px"
                class="button-new-tag ml-1"
                size="small"
                @click="showInput"
              >
                + New Speaker
              </button>
            </div>
            <p v-if="errors.speaker" class="fForm__error">
              {{ errors.speaker }}
            </p>
          </el-col>
        </div>

        <div class="info" style="align-items: center">
          <el-col :span="4">
            <div class="label">Master of ceremonies(MC)</div>
          </el-col>
          <el-col :span="20">
            <div class="d-flex-wrap">
              <el-tag
                v-for="mc in mcList"
                :key="mc"
                class="mx-1"
                type="warning"
                closable
                :disable-transitions="false"
                @close="handleCloseMC(mc)"
              >
                {{ mc }}
              </el-tag>
              <input
                v-if="inputMCVisible"
                ref="inputTag"
                v-model="inputValueMC"
                class="ml-1 w-20 input-tag"
                size="small"
                @keyup.enter="handleInputMCConfirm"
                @blur="handleInputMCConfirm"
              />
              <button
                v-if="!inputMCVisible"
                style="border-radius: 5px"
                class="button-new-tag ml-1"
                size="small"
                @click="showInputMC"
              >
                + New MC
              </button>
            </div>
            <p v-if="errors.mc" class="fForm__error">
              {{ errors.mc }}
            </p>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="4">
            <div class="label">Equipment</div>
          </el-col>
          <el-col :span="20">
            <el-date-picker
              v-model="timeEquipment"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Borrow Time"
              end-placeholder="Return Time"
              @change="handleChangeTimeEquipment()"
              style="height: 42px; margin-bottom: 5px"
              :disabled-date="pickerOptions"
            >
            </el-date-picker>
            <p
              v-if="timeEquipment.length === 0"
              style="color: rgb(246, 112, 67)"
            >
              Please choose borrow/return time for equipment!
            </p>
            <br />
            <div
              class="box-edit"
              v-for="item in this.equipmentList"
              :key="item"
              style="margin: 5px 0px"
            >
              <div class="checkbox-equipment">
                <el-checkbox
                  v-model="item.checked"
                  :label="item.equipmentName"
                  @change="handleCheckEquipment(item)"
                ></el-checkbox>
              </div>
              <p v-if="item && item.quantityAvailable" class="equipment-count">
                {{ item.quantityAvailable - item.quantityChoose + " left" }}
              </p>
              <el-input-number
                v-if="item.checked"
                :disabled="!item.checked"
                v-model="item.quantityChoose"
                :min="minEquipment"
                :max="item.quantityAvailable"
              />
            </div>
          </el-col>
        </div>

        <div class="info mb-30">
          <el-col :span="4">
            <div class="label">Note</div>
          </el-col>
          <el-col :span="20">
            <div class="box-edit">
              <div class="input">
                <el-input v-model="txtNote" />
              </div>
              <p v-if="errors.note" class="fForm__error">
                {{ errors.note }}
              </p>
            </div>
          </el-col>
        </div>

        <el-divider />

        <div class="info">
          <h4>Config this Event</h4>
        </div>

        <div class="info">
          <el-col :span="24" class="d-flex">
            <div class="d-flex-start" style="width: 50%">
              <div class="label-cf" style="margin-left: 30px; width: 200px">
                Min Number Participant
              </div>

              <div>
                <el-input-number
                  v-model="txtMinNumberParticipant"
                  :min="1"
                  :max="5000"
                ></el-input-number>
                <p v-if="errors.numberParticipant" class="fForm__error">
                  {{ errors.numberParticipant }}
                </p>
              </div>
            </div>
            <div class="d-flex-end" style="width: 50%">
              <div class="label-cf" style="margin-left: 30px; width: 200px">
                Max number Participant
              </div>

              <div>
                <el-input-number
                  v-model="txtMaxNumberParticipant"
                  :min="1"
                  :max="5000"
                ></el-input-number>
                <p v-if="errors.numberParticipant" class="fForm__error">
                  {{ errors.numberParticipant }}
                </p>
              </div>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="24" class="d-flex">
            <div class="d-flex-start" style="width: 65%">
              <el-col>
                <div class="d-flex">
                  <div class="label-cf" style="margin-left: 30px; width: 200px">
                    Type Check-in Check-out
                  </div>

                  <el-radio-group v-model="checkinRequired" size="large">
                    <el-radio-button label="CHECKIN" />
                    <el-radio-button label="BOTH" />
                    <el-radio-button label="NONE" />
                  </el-radio-group>
                </div>
                <p
                  v-if="errors.location"
                  class="fForm__error"
                  style="text-align: end"
                >
                  {{ errors.checkoutRequired }}
                </p>
              </el-col>
            </div>
            <div class="d-flex-end" style="width: 35%">
              <el-col>
                <div class="d-flex">
                  <div class="label-cf" style="margin-left: 30px; width: 200px">
                    Approve join in
                  </div>
                  <el-switch
                    v-model="approvalRequired"
                    inline-prompt
                    active-text="no auto"
                    inactive-text="auto"
                    style="
                      --el-switch-on-color: red;
                      --el-switch-off-color: blue;
                    "
                  />
                </div>
              </el-col>
            </div>
          </el-col>
        </div>

        <div class="info">
          <el-col :span="24" class="d-flex">
            <div class="d-flex-start" style="width: 65%">
              <el-col>
                <div class="d-flex">
                  <div class="label-cf" style="margin-left: 30px; width: 200px">
                    Participation Threshold
                  </div>

                  <el-input-number
                    v-model="participantDeviation"
                    :min="minParticipantDeviation"
                    :max="maxParticipantDeviationd"
                    :step="5"
                  />
                </div>
              </el-col>
            </div>
          </el-col>
        </div>

        <div class="info group-button">
          <el-button
            type="info"
            class="btn-cancel"
            @click="
              auth.role === 'ROLE_STUDENT'
                ? $router.push({ path: '/list-events' })
                : $router.push({ path: '/all-events' })
            "
            >Cancel</el-button
          >
          <el-button class="btn-update" @click="handleUpdateEvent"
            >Update</el-button
          >
        </div>
      </el-row>
    </el-col>
  </div>
  <app-footer />
</template>

<script setup>
import { Plus } from "@element-plus/icons-vue";
import Const from "@/const/data";
import { ElMessage } from "element-plus";
// import moment from "moment";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
</script>
<script>
import Utils from "@/utils/utils";
import AppHeader from "@/components/app/AppHeader.vue";
import AppFooter from "@/components/app/AppFooter.vue";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "UpdateEvent",
  data() {
    return {
      Const,
      editor: ClassicEditor,
      editorConfig: {
        placeholder: "Event's description",
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",

          "bulletedList",
          "numberedList",
          "|",
          "outdent",
          "indent",
          "|",
          "uploadImage",
          "blockQuote",
          "insertTable",
          "undo",
          "redo",
        ],
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
        },
      },
      speakerList: [],
      mcList: [],
      optionType: Const.EVENT_ONTIONS_TYPE,
      date: [],
      registerDate: [],
      imageUrl: "",
      bannerUrl: null,
      txtName: "",
      txtShortDescription: "",
      txtMinNumberParticipant: 0,
      txtMaxNumberParticipant: 10,
      txtDescription: "",
      txtLocation: "",
      roomchoose: [],
      timeLine: [
        {
          content: "",
          note: "",
          activity: "",
          startTime: "",
          endTime: "",
        },
      ],
      isReviewPage: false,
      equipmentList: [],
      errors: {},
      inputVisibleTag: false,
      tags: [],
      inputValueMC: "",
      inputValue: "",
      typeChoose: "",
      minEquipment: 0,
      rooms: [],
      startTime: "",
      endTime: "",
      startRegisterTime: null,
      endRegisterTime: null,
      borrowTime: "",
      returnTime: "",
      fileBanner: "",
      dialogNotiVisible: false,
      updateStatus: "",
      auth: {},
      inputVisible: false,
      inputMCVisible: false,
      locations: [
        { id: "FPT", name: "?????i h???c FPT" },
        { id: "QK7", name: "Tr?????ng qu??n s??? qu??n khu 7" },
      ],
      timeEquipment: [],
      checkinRequired: "NONE",
      txtNote: "",
      eventId: null,
      approvalRequired: false,
      txtParticipantDeviation: 0,
      participantDeviation: 0,
    };
  },
  computed: {
    ...mapState("room", ["rooms"]),
    ...mapState("equipment", ["equipments"]),
    ...mapState("event", ["event"]),

    eventDetail() {
      return this.event;
    },
  },
  components: { AppHeader, AppFooter },

  async mounted() {
    this.eventId = this.$route.params.eventId;

    const authStr = localStorage.getItem("auth");
    if (authStr) {
      this.auth = JSON.parse(authStr).auth;
    }
    await this.getEventDetail(this.eventId);
    this.loadData();
  },
  methods: {
    ...mapActions("room", ["getAllRoom", "getAllRoomAvailable"]),
    ...mapMutations("room", ["setRooms"]),

    ...mapActions("equipment", ["getAllEquipment", "getAllEquipmentAvailable"]),
    ...mapMutations("equipment", ["setEquipments"]),

    ...mapActions("event", ["updateEvent", "updateBanner", "getEventDetail"]),
    ...mapMutations("event", ["setEvent"]),

    pickerOptions(time) {
      return time.getTime() < Date.now();
    },

    pickerOptionsRegister(time) {
      return (
        Date.now() > time.getTime() || time.getTime() > new Date(this.date[0])
      );
    },

    async loadData() {
      this.bannerUrl = this.eventDetail.banner;
      this.txtName = this.eventDetail.eventName;
      this.txtShortDescription = this.eventDetail.shortDescription;
      this.txtDescription = this.eventDetail.description;
      this.typeChoose = this.eventDetail.type;
      this.txtNumberParticipant = this.eventDetail.numberOfParticipants;
      this.txtLocation = this.eventDetail.location;
      this.checkoutRequired = this.eventDetail.checkoutRequired;
      this.date = [this.eventDetail.startTime, this.eventDetail.endTime];
      this.txtMinNumberParticipant = this.eventDetail.minNumOfParticipant;
      this.txtMaxNumberParticipant = this.eventDetail.maxNumOfParticipant;
      this.participantDeviation = this.eventDetail.participantDeviation;
      this.approvalRequired = this.eventDetail.approvalRequired;
      this.checkinRequired = this.eventDetail.checkinRequired;

      this.registerDate = [
        this.eventDetail.registrationStartTime,
        this.eventDetail.registerEndTime,
      ];
      this.startTime = this.eventDetail.startTime;
      this.endTime = this.eventDetail.endTime;
      if (this.event) {
        this.rooms = await this.getAllRoomAvailable({
          startTime: this.startTime,
          endTime: this.endTime,
        });
      }

      this.eventDetail?.eventRoomSchedules?.forEach((item) => {
        this.roomchoose.push(item.room.id);
      });
      this.timeLine =
        this.eventDetail.eventTimelines &&
        this.eventDetail.eventTimelines.length > 0
          ? this.eventDetail.eventTimelines
          : [
              {
                content: "",
                note: "",
                activity: "",
                startTime: "",
                endTime: "",
              },
            ];

      if (this.timeLine.length > 0) {
        this.timeLine.forEach((item) => {
          item.time = [item.startTime, item.endTime];
        });
      }

      if (this.eventDetail?.speakers) {
        this.speakerList = this.eventDetail.speakers.split(/,/);
      }

      if (this.eventDetail.masterOfCeremonies) {
        this.mcList = this.eventDetail.masterOfCeremonies.split(/,/);
      }

      this.timeEquipment = [
        this.eventDetail?.eventEquipments[0]?.borrowTime,
        this.eventDetail?.eventEquipments[0]?.returnTime,
      ];

      this.txtNote = this.eventDetail.note;
    },
    validate() {
      this.txtName.trim() === ""
        ? (this.errors.name = "Name is required")
        : delete this.errors.name;
      this.txtName.trim().length > 255
        ? (this.errors.name = "Length of name less than 255")
        : delete this.errors.name;

      this.txtShortDescription.trim() === ""
        ? (this.errors.shortDescription = "Short Description is required")
        : delete this.errors.shortDescription;

      this.txtDescription.trim() === ""
        ? (this.errors.description = "Description is required")
        : delete this.errors.description;

      this.txtLocation === ""
        ? (this.errors.location = "Location is required")
        : delete this.errors.location;

      if (this.txtLocation === "QK7") {
        this.roomchoose = null;
      }

      this.typeChoose === ""
        ? (this.errors.type = "Type is required")
        : delete this.errors.type;

      !this.date || this.date.length === 0
        ? (this.errors.time = "Time is required")
        : delete this.errors.time;

      this.timeLine = this.timeLine.filter((item) => {
        return item.content !== "";
      });

      this.mcList && this.mcList.join(",").length > 255
        ? (this.errors.mc = "Length of mc list less than 255")
        : delete this.errors.mc;

      this.speakerList && this.speakerList.join(",").length > 255
        ? (this.errors.speaker = "Length of MC list less than 255")
        : delete this.errors.speaker;

      this.txtNote && this.txtNote.trim().length > 255
        ? (this.errors.note = "Length of note less than 255")
        : delete this.errors.note;
    },

    handleInputConfirm() {
      if (this.inputValue) {
        if (!this.speakerList.includes(this.inputValue)) {
          this.speakerList.push(this.inputValue);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    handleInputMCConfirm() {
      if (this.inputValueMC) {
        if (!this.mcList.includes(this.inputValueMC)) {
          this.mcList.push(this.inputValueMC);
        }
      }
      this.inputMCVisible = false;
      this.inputValueMC = "";
    },
    showInput() {
      this.inputVisible = true;
    },
    showInputMC() {
      this.inputMCVisible = true;
    },
    handleClose(tag) {
      this.speakerList.splice(this.speakerList.indexOf(tag.index), 1);
    },
    handleCloseMC(tag) {
      this.mcList.splice(this.mcList.indexOf(tag.index), 1);
    },

    handleConfirm() {
      this.dialogNotiVisible = false;

      if (this.updateStatus === "Successfully") {
        this.$router.push({ path: `/event/${this.eventId}` });
      } else {
        this.$router.push({ path: `/update-event` });
        location.reload();
      }
    },

    handleCheckEquipment(item) {
      if (item.checked) {
        this.minEquipment = 1;
        item.quantityChoose = 1;
      } else {
        this.minEquipment = 0;
        item.quantityChoose = 0;
      }
    },

    async handleChangeTime() {
      if (this.date && this.date.length > 0) {
        this.startTime = Utils.convertDatetime(this.date[0]);
        this.endTime = Utils.convertDatetime(this.date[1]);
      }

      if (this.registerDate && this.registerDate.length > 0) {
        this.startRegisterTime = Utils.convertDatetime(this.registerDate[0]);
        this.endRegisterTime = Utils.convertDatetime(this.registerDate[1]);
      }

      const payload = {
        startTime: this.startTime,
        endTime: this.endTime,
      };
      this.rooms = await this.getAllRoomAvailable(payload);
    },

    async handleChangeTimeEquipment() {
      this.borrowTime = Utils.convertDatetime(this.timeEquipment[0]);
      this.returnTime = Utils.convertDatetime(this.timeEquipment[1]);
      const payload = {
        borrowTime: this.borrowTime,
        returnTime: this.returnTime,
      };
      this.equipmentList = await this.getAllEquipmentAvailable(payload);
      this.equipmentList.forEach((item) => {
        item.checked = false;
        item.quantityChoose = 0;
      });
    },

    covertDataForUpdateEvent() {
      this.equipmentList = this.equipmentList.filter((item) => {
        return item.checked === true;
      });
      this.equipmentList = this.equipmentList.map((item) => {
        return {
          quantity: item.quantityChoose,
          equipmentId: item.id,
          borrowTime: this.borrowTime,
          returnTime: this.returnTime,
        };
      });

      if (this.timeLine) {
        this.timeLine.forEach((item) => {
          item.startTime = item.time[0];
          item.endTime = item.time[1];
          delete item.time;
        });
      }
    },

    async handleUpdateEvent() {
      this.validate();

      if (this.registerDate && this.registerDate.length === 0) {
        this.startRegisterTime = this.startTime;
        this.endRegisterTime = this.endTime;
      }

      if (Object.keys(this.errors).length === 0) {
        const eventUsers = [];
        this.covertDataForUpdateEvent();

        const payload = {
          feedbackLink: this.eventDetail.feedbackLink,
          eventId: this.eventId,
          eventName: this.txtName,
          shortDescription: this.txtShortDescription,
          description: this.txtDescription,
          type: this.typeChoose,
          startTime: this.startTime,
          endTime: this.endTime,
          minNumOfParticipant: this.txtMinNumberParticipant,
          maxNumOfParticipant: this.txtMaxNumberParticipant,
          eventUsers: eventUsers,
          location: this.txtLocation,
          roomIds: this.roomchoose ? this.roomchoose : null,
          eventEquipments: this.equipmentList,
          eventTimelines: this.timeLine,
          checkoutRequired: this.checkoutRequired,
          note: this.txtNote,
          speakers: this.speakerList.join(","),
          masterOfCeremonies: this.mcList.join(","),
          registerStartTime: this.startRegisterTime,
          registerEndTime: this.endRegisterTime,
          approvalRequired: this.approvalRequired,
          checkinRequired: this.checkinRequired,
          participantDeviation: this.participantDeviation,
        };
        try {
          await this.updateEvent(payload)
            .then((res) => {
              this.eventId = res;

              if (this.fileBanner) {
                const formData = new FormData();
                formData.append("banner", this.fileBanner);

                const uploadBanner = {
                  eventId: this.eventId,
                  banner: formData,
                };
                this.updateBanner(uploadBanner)
                  .then((res) => {
                    console.log(res);
                    ElMessage({
                      message: "Congrats, Update the event successfully!",
                      type: "success",
                    });
                    setTimeout(() => {
                      this.$router.push({ path: `/event/${this.eventId}` });
                    }, 500);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                this.updateStatus = "Successfully";
                ElMessage({
                  message: "Congrats, Update the event successfully!",
                  type: "success",
                });
                setTimeout(() => {
                  this.$router.push({ path: `/event/${this.eventId}` });
                }, 500);
              }
            })
            .catch((e) => {
              this.updateStatus = "Fail";
              ElMessage.error("Oops, Update event fail");
              console.log(e, "fail");
            });
        } catch (e) {
          console.log(e);
        }
      }
    },

    handleChangeBanner(event) {
      this.bannerUrl = null;
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 50000000) {
        this.$message.error(`Oops!!! This file size more than 5MB `);
        return;
      }
      this.fileBanner = file;

      const reader = new FileReader();

      reader.onload = (e) => {
        this.bannerUrl = e.target.result;
      };

      reader.readAsDataURL(file);
    },

    addTimeLine() {
      this.timeLine.push({
        content: "",
        time: "",
        activity: "",
        note: "",
      });
    },
    addEquipment() {},
    removeTimeLine(index) {
      this.timeLine.splice(index, 1);
      if (this.timeLine.length === 0) {
        this.timeLine.push({
          content: "",
          time: "",
          activity: "",
          note: "",
        });
      }
    },
  },
};
</script>
<style lang="scss">
.update-event {
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
      .el-switch {
        margin-top: 3px;
      }
    }
    .input {
      width: 100%;
      .el-select {
        min-height: 42px;
        .select-trigger {
          min-height: 42px !important;
        }
        .el-input__wrapper {
          min-height: 42px;
        }
      }
    }
    .button-new-tag {
      height: 30px;
    }
    .input-tag {
      height: 30px;
    }
    .el-tag {
      height: 30px;
    }
  }
  .timeline {
    margin-bottom: 30px !important;
    .el-button {
      width: 42px;
    }
    .el-input {
      margin-bottom: 10px;
      height: 42px;
    }
    .el-date-editor {
      height: 42px;
      top: 1px;
    }
  }
  .edit-banner {
    height: 100%;
    .btn-banner {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-color: #fff;
      padding: 0px;
      span {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.update-event {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .edit-banner {
    width: 50%;
    height: 100%;

    border: 1px dashed #000000;

    .banner-uploader {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: auto;
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: center;
      .el-upload {
        width: 100% !important;
        height: 100%;
      }
    }

    .banner-uploader-icon {
      font-size: 28px;
      color: #8c939d;

      line-height: 200px;
      text-align: center;
    }
    .banner {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
    }

    .label-cf {
      margin-left: 0px !important;
      margin-right: 30px;
      margin-top: 10px;
      font-size: 16px;
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
      .checkbox-equipment {
        width: 500px;
      }
      .equipment-count {
        margin-right: 30px;
        font-size: 16px;
        padding-top: 10px;
        width: 70px;
      }
      .time-line {
        display: flex;
      }
    }
    .el-tag {
      margin: 0px 5px 5px 0px;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;

      .el-input__inner {
        height: 24px;
      }
    }
  }
  .group-button {
    display: flex;
    justify-content: center;
    margin-top: 100px;
    .el-button + .el-button {
      margin-left: 60px;
    }
    .el-button {
      border-radius: 5px;
      width: 120px;
    }
  }
}
</style>
