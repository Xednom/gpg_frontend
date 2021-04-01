<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <form @submit.prevent="save">
          <h4 class="card-title">
            Job order informations: Ticket #<b>{{ jobOrder.ticket_number }}</b>
          </h4>
          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <base-input label="Request date">
                <el-date-picker
                  v-model="jobOrder.request_date"
                  v-validate="'required'"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Choose date"
                  :disabled="isDisabled"
                >
                </el-date-picker>
              </base-input>
            </div>
            <div class="col-sm-12 col-md-6">
              <base-input label="Due date">
                <el-date-picker
                  v-model="jobOrder.due_date"
                  v-validate="'required'"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Choose date"
                  :disabled="isDisabled"
                >
                </el-date-picker>
              </base-input>
            </div>
          </div>
          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <base-input label="Date completed">
                <el-date-picker
                  v-model="jobOrder.date_completed"
                  v-validate="'required'"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Choose date"
                  :disabled="isDisabled"
                >
                </el-date-picker>
              </base-input>
            </div>
            <div class="col-sm-12 col-md-6">
              <base-input
                label="Total time consumed"
                v-model="jobOrder.total_time_consumed"
                :disabled="isDisabled"
              >
              </base-input>
            </div>
          </div>
          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <div class="col-sm-10">
                <div class="row">
                  <label>Status</label>
                </div>
                <el-select
                  class="select-primary"
                  size="large"
                  name="status"
                  placeholder="Status"
                  v-model="jobOrder.status"
                >
                  <el-option
                    v-for="option in StatusChoices.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>

            <div class="col-sm-12 col-md-6">
              <base-input
                label="Job title"
                v-model="jobOrder.job_title"
                :disabled="staffDisable"
              >
              </base-input>
            </div>
          </div>

          <div class="form-row mt-3">
            <div class="col-sm-12 col-md-12">
              <label>Job Description</label>
              <textarea
                class="form-control"
                placeholder="Job description"
                v-model="jobOrder.job_description"
                :disabled="staffDisable"
              >
              </textarea>
            </div>
          </div>
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
      <div class="col-md-6">
        <h4 class="card-title">Comment section of #<strong>{{ jobOrder.ticket_number }}</strong></h4>
        <div class="row">
          <job-order-comment :job="jobOrder" :fetch="refresh"></job-order-comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { DatePicker, Select, Option } from "element-ui";
import JobOrderComment from "~/components/JobOrder/General/JobOrderComment";
import Card from "~/components/Cards/Card.vue";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    JobOrderComment
  },
  data() {
    return {
      saving: false,
      loading: false,
      error: "",
      clientUser: {},
      staffUser: {},
      jobOrder: {},
      StatusChoices: {
        placeholder: "",
        status: [
          { value: "na", label: "N/A" },
          { value: "job_order_request", label: "Job order request" },
          { value: "va_processing", label: "VA Processing" },
          { value: "management_processing", label: "Management Processing" },
          { value: "verified_job_order", label: "Verified Job Order" },
          { value: "on_hold", label: "On Hold" },
          { value: "canceled", label: "Canceled" },
          { value: "follow_up", label: "Follow up" },
          { value: "dispute", label: "Dispute" },
          { value: "complete", label: "Complete" },
          { value: "under_quality_review", label: "Under Quality Review" },
        ],
      },
    };
  },
  methods: {
    ...mapActions("jobOrder", ["updateJobOrder"]),
    async fetchJobOrder(payload) {
      let endpoint = `/api/v1/job-order/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.jobOrder = res.data;
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/v1/client/${id}/`;
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          await this.$axios.get(endpoint).then((res) => {
            this.clientUser = res.data;
            this.loading = false;
          });
        } catch (err) {
          console.error(err.response.data);
        }
      }
    },
    async fetchStaff(id) {
      this.loading = true;
      let endpoint = `/api/v1/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
      }
    },
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          this.loading = false;
          console.log(this.user);
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.user.id);
          } else {
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        console.log(err.response.data);
        this.loading = false;
      }
    },
    async save() {
      const clientPayload = {
        ticket_number: this.jobOrder.ticket_number,
        client: this.clientUser.client_code,
        client_email: this.$auth.user.email,
        request_date: this.jobOrder.request_date,
        status: this.jobOrder.status,
        due_date: this.jobOrder.due_date,
        job_title: this.jobOrder.job_title,
        job_description: this.jobOrder.job_description,
        total_time_consumed: this.jobOrder.total_time_consumed,
      };
      const staffPayload = {
        ticket_number: this.jobOrder.ticket_number,
        client: this.jobOrder.client_code,
        va_assigned: this.staffUser.id,
        staff_email: this.$auth.user.email,
        request_date: this.jobOrder.request_date,
        date_completed: this.jobOrder.date_completed,
        status: this.jobOrder.status,
        due_date: this.jobOrder.due_date,
        job_title: this.jobOrder.job_title,
        job_description: this.jobOrder.job_description,
        total_time_consumed: this.jobOrder.total_time_consumed,
      };

      if (this.$auth.user.designation_category == "staff") {
        try {
          this.saving = true;
          await this.updateJobOrder(staffPayload)
            .then(() => {
              this.saving = false;
            })
            .catch((e) => {
              this.saving = false;
              this.error = e.response.data;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          this.saving = false;
          this.error = e.response.data;
          this.errorMessage("danger", this.error);
        }
      } else {
        try {
          this.saving = true;
          await this.updateJobOrder(clientPayload)
            .then(() => {
              this.saving = false;
              this.$router.push("/job-order/general");
            })
            .catch((e) => {
              this.saving = false;
              this.error = e.response.data;
              this.errorMessage("danger", this.error);
            });
        } catch (e) {
          this.saving = false;
          this.error = e.response.data;
          this.errorMessage("danger", this.error);
        }
      }
      this.saving = false;
    },
    refresh() {
      this.fetchJobOrder(this.$route.params.ticket_number);
    }
  },
  computed: {
    isDisabled() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return true;
      } else {
        return false;
      }
    },
    staffDisable() {
      if (this.$auth.user.designation_category == "staff") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.fetchClient(this.$auth.user.id);
    this.fetchJobOrder(this.$route.params.ticket_number);
  },
};
</script>
