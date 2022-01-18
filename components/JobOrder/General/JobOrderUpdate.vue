<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <b-card>
              <h4 class="card-title"><b-skeleton width="85%"></b-skeleton></h4>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="col-sm-12 col-md-12">
                <b-skeleton width="85%"></b-skeleton>
              </div>
            </b-card>
          </template>
          <form @submit.prevent="save">
            <h4 class="card-title">
              Job order informations: Ticket #<b>{{
                jobOrder.ticket_number
              }}</b>
              <b-badge
                href="#"
                variant="primary"
                @click.native="modals.classic = true"
                >Please rate our agents who did this task!</b-badge
              >
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
                    :disabled="
                      jobOrder.status == 'complete' ||
                        jobOrder.status == 'closed'
                    "
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
                  :disabled="
                    jobOrder.status == 'complete' || jobOrder.status == 'closed'
                  "
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
                  :disabled="
                    staffDisable ||
                      jobOrder.status == 'complete' ||
                      jobOrder.status == 'closed'
                  "
                >
                </textarea>
              </div>
            </div>
            <div class="form-row mt-3">
              <div class="col-sm-12 col-md-12">
                <label>URL of the completed JO</label>
                <textarea
                  class="form-control"
                  v-model="jobOrder.url_of_the_completed_jo"
                  :disabled="isDisabled"
                >
                </textarea>
              </div>
            </div>
            <div class="form-row mt-3">
              <div class="col-sm-12 col-md-12">
                <label>Management notes</label>
                <textarea
                  class="form-control"
                  v-model="jobOrder.management_notes"
                  disabled
                >
                </textarea>
              </div>
            </div>
            <div class="pull-right">
              <base-button
                v-if="!saving"
                :disabled="
                  jobOrder.status == 'complete' || jobOrder.status == 'closed'
                "
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
            <div
              class="col-sm-5 mt-3"
              v-if="
                $auth.user.designation_category == 'new_client' ||
                  $auth.user.designation_category == 'current_client' ||
                  $auth.user.designation_category == 'affiliate_partner'
              "
            >
              Any attachments please send it
              <a href="https://form.jotform.com/210818766251458" target="_blank"
                >here</a
              >
            </div>
          </form>
          &nbsp;
          <div
            class="col-sm-12 col-md-12"
            v-if="jobOrder.status == 'complete' || 'closed'"
          >
            <job-rate
              :job="jobOrder"
              :type="type"
              :clientId="clientUser.id"
              :ticket="ticket"
              @refresh="refreshAfterRating"
            ></job-rate>
          </div>
        </b-skeleton-wrapper>
      </div>
      <div class="col-md-6">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <b-card>
              <h4 class="card-title"><b-skeleton width="85%"></b-skeleton></h4>
              <div class="row">
                <b-skeleton width="85%"></b-skeleton>
              </div>
            </b-card>
          </template>
          <h4 class="card-title">
            Comment section of #<strong>{{ jobOrder.ticket_number }}</strong>
          </h4>
          <div class="row">
            <job-order-comment
              :job="jobOrder"
              :fetch="refresh"
            ></job-order-comment>
          </div>
        </b-skeleton-wrapper>
      </div>
    </div>
    <modal
      :show.sync="modals.classic"
      headerClasses="justify-content-center"
      class="white-content"
      centered
      close-button
    >
      <h4 slot="header" class="col-sm-12 col-md-12 card-title">
        <center>Job order staff scoring</center> 
      </h4>
      <scoring-add
        :job="jobOrder"
        :fetch="fetchJobOrder"
        :client="clientUser.id"
        :type="type"
        @close="closeModal"
        @refresh="refreshAfterRating"
      ></scoring-add>
    </modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { DatePicker, Select, Option } from "element-ui";
import { Modal } from "@/components";
import JobOrderComment from "~/components/JobOrder/General/JobOrderComment";

import ScoringAdd from "@/components/AgentScoring/ScoringAdd.vue";

import JobRate from "@/components/JobRating/JobRating.vue";

export default {
  components: {
    Modal,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    JobOrderComment,
    JobRate,
    ScoringAdd,
  },
  data() {
    return {
      saving: false,
      loading: false,
      error: "",
      type: "general",
      clientUser: {},
      staffUser: {},
      jobOrder: {},
      modals: {
        classic: false,
      },
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
          { value: "under_quality_review", label: "Under Quality Review" },
          { value: "daily_tasks", label: "Daily Tasks" },
          { value: "weekly_tasks", label: "Weekly Tasks" },
          { value: "monthly_tasks", label: "Monthly Tasks" },
          { value: "redo", label: "Redo" },
          { value: "pending", label: "Pending" },
          { value: "request_for_posting", label: "Request for Posting" },
          { value: "mark_as_sold_request", label: "Mark as Sold Request" },
          { value: "initial_dd_processing", label: "Initial DD Processing" },
          { value: "initial_dd_complete", label: "Initial DD Complete" },
          { value: "dd_call_out_processing", label: "DD Call Out Processing" },
          { value: "dd_call_out_complete", label: "DD Call Out Complete" },
          { value: "duplicate_request", label: "Duplicate Request" },
          { value: "multiple_task", label: "Multiple Task" },
          {
            value: "va_assigned_multiple_task",
            label: "VA assigned Multiple Task",
          },
          {
            value: "va_processing_multiple_task",
            label: "VA processing Multiple Task",
          },
          {
            value: "va_complete_multiple_task",
            label: "VA Complete Multiple Task",
          },
          {
            value: "for_quality_review_multiple_task",
            label: "For Quality Review Multiple Task",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions("jobOrder", ["updateJobOrder"]),
    closeModal() {
      this.modals.classic = false;
    },
    async fetchJobOrder(payload) {
      this.loading = true;
      let endpoint = `/api/v1/job-order/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.loading = false;
          this.jobOrder = res.data;
        })
        .catch((e) => {
          this.loading = false;
          throw e;
        });
    },
    async fetchJobOrderRating(payload) {
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
    async fetchJobOrderComment(payload) {
      let endpoint = `/api/v1/job-order/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.jobOrder = res.data;
        })
        .catch((e) => {
          console.error(e);
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
        console.error(err.response.data);
        this.loading = false;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast(
        "Successfully updated this Job Order General request.",
        {
          title: `Successful`,
          variant: variant,
          solid: true,
        }
      );
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
        url_of_the_completed_jo: this.jobOrder.url_of_the_completed_jo,
        total_time_consumed: this.jobOrder.total_time_consumed,
      };
      const staffPayload = {
        ticket_number: this.jobOrder.ticket_number,
        client: this.jobOrder.client_code,
        staff_email: this.$auth.user.email,
        request_date: this.jobOrder.request_date,
        date_completed: this.jobOrder.date_completed,
        status: this.jobOrder.status,
        due_date: this.jobOrder.due_date,
        job_title: this.jobOrder.job_title,
        job_description: this.jobOrder.job_description,
        url_of_the_completed_jo: this.jobOrder.url_of_the_completed_jo,
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
              this.successMessage("success");
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
      this.fetchJobOrderComment(this.$route.params.ticket_number);
    },
    refreshAfterRating(ticket) {
      ticket = this.jobOrder.ticket_number;
      this.fetchJobOrderRating(ticket);
    },
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
    this.fetchMe();
    // this.fetchClient(this.$auth.user.id);
    this.fetchJobOrder(this.$route.params.ticket_number);
  },
};
</script>
