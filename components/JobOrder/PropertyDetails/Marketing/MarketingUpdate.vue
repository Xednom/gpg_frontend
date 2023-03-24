<template>
  <div class="col-md-12">
    <base-alert v-if="success" type="success" dismissible>
      <span>
        {{ successMessage() }}
      </span>
    </base-alert>
    <form @submit.prevent="save">
      <card>
        <div class="row justify-content-center mt-5">
          <div class="row justify-content-center mt-5">
            <div class="col-sm-12">
              <label>Description</label>
              <textarea
                name="Description"
                class="form-control"
                type="text"
                v-model="description"
              >
              </textarea>
            </div>
            <div class="col-sm-12">
              <label>Notes</label>
              <textarea
                name="notes"
                class="form-control"
                type="text"
                v-model="notes"
              >
              </textarea>
            </div>
            <div class="col-sm-12">
              <label>Description of request</label>
              <textarea
                name="description of request"
                class="form-control"
                type="text"
                v-model="description_of_request"
              >
              </textarea>
            </div>
            <div class="col-sm-12">
              <label>Completed Job order file</label>
              <textarea
                name="completed job order file"
                class="form-control"
                type="text"
                v-model="completed_job_order_file"
              >
              </textarea>
            </div>
            <div class="col-sm-5">
              <base-input label="Date completed">
                <el-date-picker
                  v-model="date_completed"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Choose date"
                >
                </el-date-picker>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Status of Job">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="leadType"
                  v-model="status_of_job"
                >
                  <el-option
                    v-for="option in statusChoices.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Images">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="images"
                  v-model="images"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Ad Content">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="ad_content"
                  v-model="ad_content"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Youtube videos">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="youtube_videos"
                  v-model="youtube_videos"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Tiktok videos">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="tiktok_videos"
                  v-model="tiktok_videos"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Email campaign">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="email_campaign"
                  v-model="email_campaign"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Other graphics">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="other_graphics"
                  v-model="other_graphics"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Other Marketing files">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="other_makerting_files"
                  v-model="other_makerting_files"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
            <div class="col-sm-5">
              <base-input label="Neighbor list">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="neighbor_list"
                  v-model="neighbor_list"
                >
                  <el-option
                    v-for="option in yesOrNoOrNot.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </base-input>
            </div>
          </div>
        </div>
      </card>
      <div slot="footer">
        <div class="pull-right mt-5">
          <base-button
            v-if="!saving"
            native-type="submit"
            slot="footer"
            type="submit"
            round
            block
            size="lg"
          >
            Save
          </base-button>
          <base-button
            v-else
            native-type="submit"
            slot="footer"
            type="primary"
            round
            block
            size="lg"
            disabled
          >
            Saving...
          </base-button>
        </div>
      </div>
    </form>
  </div>
</template>
      
      <script>
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { mapGetters, mapActions } from "vuex";

import _ from "lodash";
import MarketingMixin from "@/mixins/Marketing.js";

export default {
  mixins: [MarketingMixin],
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    itemId: {
      type: Number,
    },
    fetch: {
      type: Function,
    },
    item: {
      type: Object,
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      statusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "closed", label: "Closed" },
          { value: "on_hold", label: "On hold" },
          { value: "canceled", label: "Canceled" },
        ],
      },
      yesOrNoOrNot: {
        placeholder: "",
        status: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "not_applicable", label: "Not applicable" },
        ],
      },
      id: "",
      apn: "",
      client_code: "",
      description: "",
      notes: "",
      description_of_request: "",
      completed_job_order_file: "",
      date_completed: null,
      status_of_job: "",
      packets: "",
      comps_by_parcel: "",
      comps_by_area: "",
      due_diligence: "",
    };
  },
  methods: {
    ...mapActions("marketing", ["updateMarketing"]),
    async fetchMarketing(id) {
      this.$store.dispatch("marketing/fetchMarketing", id).then(() => {});
    },
    async save() {
      const payload = {
        id: this.id,
        apn: this.apn,
        client_code: this.client_code,
        description: this.description,
        description_of_request: this.description_of_request,
        completed_job_order_file: this.completed_job_order_file,
        date_completed: this.date_completed,
        status_of_job: this.status_of_job,
        images: this.images,
        ad_content: this.ad_content,
        youtube_videos: this.youtube_videos,
        tiktok_videos: this.tiktok_videos,
        email_campaign: this.email_campaign,
        other_graphics: this.other_graphics,
        other_makerting_files: this.other_makerting_files,
        neighbor_list: this.neighbor_list,
        notes: this.notes,
      };
      console.warn("Payload: ", payload);
      await this.updateMarketing(payload).then(() => {
        this.success = true;
        if (this.success) {
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully updated this Marketing data.";
    },
  },
  computed: {
    ...mapGetters(["marketing/marketing"]),
  },
};
</script>
      