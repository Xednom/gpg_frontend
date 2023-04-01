<template>
  <div class="col-md-12">
    <div class="col-xs-12">
      <b-btn
        class="btn btn-success"
        :disabled="loading"
        @click="addAssessmentRow"
      >
        Add Assessment
      </b-btn>
    </div>
    <form @submit.prevent="save">
      <card
        v-for="(item, index) in assessments"
        :key="index"
        title="Assessment"
      >
        <div class="col-md-12">
          <b-btn
            class="btn btn-danger btn-sm float-right"
            @click="deleteAssessmentRow($event, index)"
          >
            <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
          </b-btn>
        </div>
        <div class="row justify-content-center mt-5">
          <div class="row justify-content-center mt-5">
            <div class="col-sm-12">
              <label>Description</label>
              <textarea
                name="Description"
                class="form-control"
                type="text"
                v-model="item.description"
              >
              </textarea>
            </div>
            <div class="col-sm-12">
              <label>Notes</label>
              <textarea
                name="notes"
                class="form-control"
                type="text"
                v-model="item.notes"
              >
              </textarea>
            </div>
            <div class="col-sm-12">
              <label>Description of request</label>
              <textarea
                name="notes"
                class="form-control"
                type="text"
                v-model="item.description_of_request"
              >
              </textarea>
            </div>
            <div class="col-sm-12">
              <label>Completd Job order file</label>
              <textarea
                name="notes"
                class="form-control"
                type="text"
                v-model="item.completed_job_order_file"
              >
              </textarea>
            </div>
            <div class="col-sm-5">
              <base-input label="Date completed">
                <el-date-picker
                  v-model="item.date_completed"
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
                  v-model="item.status_of_job"
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
              <base-input label="Packets">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="leadType"
                  v-model="item.packets"
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
              <base-input label="Comps by parcel">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="leadType"
                  v-model="item.comps_by_parcel"
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
              <base-input label="Comps by area">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="leadType"
                  v-model="item.comps_by_area"
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
              <base-input label="Due diligence">
                <el-select
                  class="select-primary"
                  reqiured
                  size="large"
                  name="leadType"
                  v-model="item.due_diligence"
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
            :disabled="assessments.length == 0"
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
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    propertyDetail: {
      type: Object,
    },
    fetch: {
      type: Function,
    },
    apn: {
      type: String,
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      assessments: [],
      clientUser: {},
      user: {},
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
      modelValidations: {
        possible_offer: {
          required: true,
        },
        approved_amount_from_client: {
          required: true,
        },
        seller_lead_name: {
          required: true,
        },
        minimum_amount: {
          required: true,
        },
        maximum_amount: {
          required: true,
        },
        amount_closed_deal: {
          required: true,
        },
        deal_status: {
          required: true,
        },
        assigned_sales_team: {
          required: true,
        },
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    ...mapActions("assessment", ["saveassessments"]),
    ...mapActions("user", ["fetchClientUser", "fetchUser"]),
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        await this.$store
          .dispatch("assessment/saveAssessments", this.assessments)
          .then(() => {
            this.success = true;
            if (this.success) {
              this.assessments = [];
              this.fetch();
            }
            setTimeout(() => (this.success = false), 2000);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast("Errpr", {
        title: `Error`,
        variant: variant,
        solid: true,
      });
    },
    successMessage() {
      return "Successfully added a Property Price data.";
    },
    // async getUser() {
    //   this.fetchUser();

    //   this.fetchClientUser(this.user.id);

    //   console.info("Client info: ", this.client);
    // },
    addAssessmentRow: function () {
      this.assessments.push({
        property_detail: this.propertyDetail.id,
        apn: this.propertyDetail.apn,
        client_code: this.clientUser.client_code,
        description: "",
        description_of_request: "",
        completed_job_order_file: "",
        date_completed: "",
        status_of_job: "",
        packets: "",
        comps_by_parcel: "",
        comps_by_area: "",
        due_diligence: "",
        assigned_to: null,
        notes: "",
      });
    },
    deleteCounterOffer(e, index) {
      const vm = this;
      vm.counter_offer_amount.splice(index, 1);
    },
    deleteAssessmentRow(e, index) {
      this.assessments.splice(index, 1);
    },
    async fetchClient(id) {
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
          console.warn("Client user: ", this.clientUser);
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchMe() {
      try {
        let endpoint = `/auth/users/me/`;
        this.loading = true;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.loading = false;
            this.fetchClient(this.user.id);
          } else {
            this.loading = false;
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        console.error(err.response.data);
        this.loading = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      client: "user/clientUser",
      user: "user/user",
    }),
    clientCode() {
      this.fetchUser();
      this.fetchClientUser(this.user.id);
      return this.client;
    },
    getUser() {
      this.fetchUser();

      this.fetchClientUser(this.user.id);

      return this.client;
    },
  },
  mounted() {
    this.fetchMe();
  },
};
</script>
      