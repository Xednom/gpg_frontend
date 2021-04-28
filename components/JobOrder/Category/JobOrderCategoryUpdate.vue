<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-md-6">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <card>
              <h5 class="info-text">
                <b-skeleton width="25%"></b-skeleton>
              </h5>
              <div class="row justify-content-center mt-5">
                <div class="col-sm-4 col-md-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-4 col-md-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-10 col-md-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5 col-md-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5 col-md-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5 col-md-5">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-5 col-md-10">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-10">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
            </card>
            <card>
              <div class="info-text">
                <b-skeleton width="25%"></b-skeleton>
              </div>

              <div class="row justify-content-center mt-5">
                <div class="col-sm-10">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-10">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
            </card>
          </template>

          <form @submit.prevent="save">
            <div class="col-sm-12 col-md-12">
              <card>
                <h5 class="info-text">
                  Job Order by Category Information
                </h5>
                <div class="row justify-content-center mt-5">
                  <div class="col-sm-4 col-md-5">
                    <div class="row">
                      <label>Category</label>
                    </div>
                    <el-select
                      class="select-primary"
                      size="large"
                      name="status"
                      placeholder="Status"
                      v-model="jobOrderCategory.category"
                      disabled
                    >
                      <el-option
                        v-for="option in apnCategories"
                        class="select-primary"
                        :value="option.category"
                        :label="option.category"
                        :key="option.id"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="col-sm-4 col-md-5">
                    <div class="row">
                      <label>Status</label>
                    </div>
                    <el-select
                      class="select-primary"
                      size="large"
                      name="status"
                      placeholder="Status"
                      v-model="jobOrderCategory.status"
                    >
                      <el-option
                        v-for="option in StatusChoices.status"
                        class="select-primary"
                        :value="option.value"
                        :label="option.label"
                        :key="option.label"
                        :disabled="option.isDisabled"
                      >
                      </el-option>
                    </el-select>
                    <div class="col-sm-5 col-md-12">
                      <small class="text-muted"
                        >If you don't set the status. The default value will be
                        <strong>N/A</strong></small
                      >
                    </div>
                  </div>
                  <div class="col-sm-10 col-md-5">
                    <label>APN: </label> <br />
                    <nuxt-link
                      :to="
                        '/job-order/property-detail/' +
                          jobOrderCategory.property_detail
                      "
                      target="_blank"
                      >{{ jobOrderCategory.property_detail }}</nuxt-link
                    >
                  </div>
                  <div class="col-sm-5 col-md-5">
                    <base-input label="Due date">
                      <el-date-picker
                        v-model="jobOrderCategory.due_date"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="Choose date"
                        :disabled="staffDisable"
                      >
                      </el-date-picker>
                    </base-input>
                  </div>

                  <div class="col-sm-5 col-md-5">
                    <base-input label="Date completed">
                      <el-date-picker
                        v-model="jobOrderCategory.date_completed"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="Choose date"
                        :disabled="isDisabled"
                      >
                      </el-date-picker>
                    </base-input>
                  </div>
                  <div class="col-sm-5 col-md-5">
                    <base-input
                      label="Total time consumed"
                      v-model="jobOrderCategory.total_time_consumed"
                      :disabled="isDisabled"
                    >
                    </base-input>
                  </div>
                  <div class="col-sm-5 col-md-10 mt-3 mb-3">
                    <label>URL of the completed JO: </label>
                    <a :href="jobOrderCategory.url_of_the_completed_jo" target="_blank">link here</a>
                  </div>

                  <div class="col-sm-10">
                    <label>Job description</label>
                    <textarea
                      class="form-control"
                      placeholder="Job description"
                      v-model="jobOrderCategory.job_description"
                      required
                    >
                    </textarea>
                  </div>
                </div>
              </card>

              <card>
                <h5 class="info-text">
                  Notes
                </h5>
                <div class="row justify-content-center mt-5">
                  <div class="col-sm-10">
                    <label>Notes from VA</label>
                    <textarea
                      class="form-control"
                      type="text"
                      v-model="jobOrderCategory.notes_va"
                      :disabled="isDisabled"
                    >
                    </textarea>
                  </div>
                  <div class="col-sm-10 mt-3">
                    <label>Notes from Management</label>
                    <textarea
                      class="form-control"
                      type="text"
                      v-model="jobOrderCategory.notes_management"
                      disabled
                    >
                    </textarea>
                  </div>
                </div>
              </card>

              <div class="col-sm-5 mt-3">
                Any attachments please send it
                <a
                  href="https://form.jotform.com/210818766251458"
                  target="_blank"
                  >here</a
                >
              </div>
            </div>
            <div class="pull-right">
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
          </form>
        </b-skeleton-wrapper>
      </div>
      <div class="col-md-6">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <b-card>
              <h4 class="card-title"><b-skeleton width="25%"></b-skeleton></h4>
              <div class="row">
                <b-skeleton width="85%"></b-skeleton>
              </div>
            </b-card>
          </template>

          <h4 class="card-title">
            Comment section of #<strong>{{
              jobOrderCategory.ticket_number
            }}</strong>
          </h4>
          <div class="row">
            <job-order-cat-comment
              :job="jobOrderCategory"
              :fetch="refresh"
            ></job-order-cat-comment>
          </div>
        </b-skeleton-wrapper>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { DatePicker, Select, Option } from "element-ui";

import JobOrderCatComment from "~/components/JobOrder/Category/JobOrderCategoryComment";

import CreateJobOrderCategoryMixin from "@/mixins/CreateJobOrderCategoryMixin.js";
import Card from "~/components/Cards/Card.vue";

export default {
  name: "wizard-form",
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    JobOrderCatComment,
  },
  mixins: ["CreateJobOrderCategoryMixin"],
  data() {
    return {
      wizardModel: {},
      loading: false,
      saving: false,
      success: false,
      clientUser: {},
      staffUser: {},
      jobOrderCategory: {},
      apnCategories: [],
      error: {
        client: "",
        staff: "",
        ticket_number: "",
        category: "",
        status: "",
        due_date: "",
        date_completed: "",
        total_time_consumed: "",
        url_of_the_completed_jo: "",
        job_description: "",
        notes_va: "",
        notes_management: "",
        non_field_errors: "",
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
          { value: "complete", label: "Complete" },
          { value: "under_quality_review", label: "Under Quality Review" },
          { value: "daily_tasks", label: "Daily Tasks" },
          { value: "weekly_tasks", label: "Weekly Tasks" },
          { value: "monthly_tasks", label: "Monthly Tasks" },
          { value: "redo", label: "Redo" },
          { value: "pending", label: "Pending"},
          { value: "request_for_posting", label: "Request for Posting" },
          { value: "mark_as_sold_request", label: "Mark as Sold Request" }
        ],
      },
      propertyStatusChoices: {
        placeholder: "",
        status: [
          { value: "sold", label: "Sold" },
          { value: "available", label: "Available" },
          { value: "in_escrow", label: "In Escrow" },
          { value: "in_contract", label: "In Contract" },
          { value: "ready_to_purchase", label: "Ready to Purchase" },
          { value: "canceled_transaction", label: "Canceled Transaction" },
        ],
      },
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "change", label: "Change" },
          { value: "active", label: "Active" },
        ],
      },
      categoryChoices: {
        placeholder: "",
        status: [
          { value: "company_name", label: "Company name" },
          { value: "phone", label: "Phone" },
          { value: "email_ad", label: "Email Ad" },
          { value: "website_url", label: "Website url" },
        ],
      },
      modelValidations: {
        askingPrice: {
          required: true,
        },
        cashTerms: {
          required: true,
        },
        financeTerms: {
          required: true,
        },
        otherTerms: {
          required: true,
        },
        notes: {
          required: true,
        },
        priceStatus: {
          required: true,
        },
        askingPrice: {
          required: true,
        },
        cashTerms: {
          required: true,
        },
        financeTerms: {
          required: true,
        },
        otherTerms: {
          required: true,
        },
        notes: {
          required: true,
        },
        priceStatus: {
          required: true,
        },
      },
    };
  },
  provide() {
    return {
      $validator: this.$validator,
    };
  },
  methods: {
    ...mapActions("jobOrderCategory", ["updateJobOrderCategory", "reset"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },
    async fetchJobOrderCategory(payload) {
      this.loading = true;
      let endpoint = `/api/v1/job-order-by-category/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.loading = false;
          this.jobOrderCategory = res.data;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
          throw e;
        });
    },
    async fetchJobOrderCategoryComment(payload) {
      let endpoint = `/api/v1/job-order-by-category/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.jobOrderCategory = res.data;
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
    async fetchCategory() {
      let endpoint = `/api/v1/apn-category-type/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.apnCategories = res.data.results;
        })
        .catch((e) => {
          throw e;
        });
    },
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchStaff(id) {
      let endpoint = `/api/v1/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
        });
      } catch (err) {
        console.error(err);
      }
    },
    async fetchMe() {
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
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
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated this Per APN Job Order!", {
        title: `Successful`,
        variant: variant,
        solid: true
      });
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        this.error.ticket_number
          ? "Ticket number: " + this.error.ticket_number
          : this.error.client
          ? "client: " + this.error.client
          : this.error.staff
          ? "Staff" + this.error.staff
          : this.error.category
          ? "Category: " + this.error.category
          : this.error.status
          ? "Status: " + this.error.status
          : this.error.due_date
          ? "Due date: " + this.error.due_date
          : this.error.date_completed
          ? "Date completed: " + this.error.date_completed
          : this.error.total_time_consumed
          ? "Total time consumed: " + this.error.total_time_consumed
          : this.error.url_of_the_completed_jo
          ? "URL of the completed Job order: " +
            this.error.url_of_the_completed_jo
          : this.error.job_description
          ? "Job description: " + this.error.job_description
          : this.error.notes_va
          ? "Notes from VA: " + this.error.notes_va
          : this.error.notes_management
          ? "Notes from management: " + this.error.notes_management
          : this.error.non_field_errors
          ? this.error.non_field_errors
          : this.error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        const clientPayload = {
          ticket_number: this.jobOrderCategory.ticket_number,
          property_detail: this.jobOrderCategory.property_detail,
          client: this.clientUser.client_code,
          client_email: this.$auth.user.email,
          deadline: this.jobOrderCategory.deadline,
          category: this.jobOrderCategory.category,
          status: this.jobOrderCategory.status,
          due_date: this.jobOrderCategory.due_date,
          job_description: this.jobOrderCategory.job_description,
        };

        const staffPayload = {
          ticket_number: this.jobOrderCategory.ticket_number,
          property_detail: this.jobOrderCategory.property_detail,
          client: this.jobOrderCategory.client_code,
          staff_email: this.$auth.user.email,
          deadline: this.jobOrderCategory.deadline,
          category: this.jobOrderCategory.category,
          property_detail: this.jobOrderCategory.property_detail,
          status: this.jobOrderCategory.status,
          due_date: this.jobOrderCategory.due_date,
          date_completed: this.jobOrderCategory.date_completed,
          total_time_consumed: this.jobOrderCategory.total_time_consumed,
          url_of_the_completed_jo: this.jobOrderCategory
            .url_of_the_completed_jo,
          job_description: this.jobOrderCategory.job_description,
          notes_va: this.jobOrderCategory.notes_va,
          notes_management: this.jobOrderCategory.notes_management,
        };

        if (this.$auth.user.designation_category == "staff") {
          try {
            this.saving = true;
            await this.updateJobOrderCategory(staffPayload)
              .then(() => {
                this.saving = false;
                this.success = true;
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
          setTimeout(() => (this.success = false), 2000);
        } else {
          try {
            this.saving = true;
            await this.updateJobOrderCategory(clientPayload)
              .then(() => {
                this.saving = false;
                this.success = true;
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
          setTimeout(() => (this.success = false), 2000);
        }
        this.reset();
      }
    },
    refresh() {
      this.fetchJobOrderCategoryComment(this.$route.params.ticket_number);
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
    this.fetchCategory();
    this.fetchJobOrderCategory(this.$route.params.ticket_number);
  },
};
</script>
