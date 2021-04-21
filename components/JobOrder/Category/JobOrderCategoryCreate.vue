<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Create job order</h4>
      <base-alert v-if="success" type="success" dismissible>
        <span>
          {{ successMessage() }}
        </span>
      </base-alert>
      <base-alert v-if="error" type="danger" dismissible>
        <span>
          {{ errorMessage(error) }}
        </span>
      </base-alert>
      <div class="form-row">
        <div
          class="col-sm-12 col-md-12"
          v-if="this.$auth.user.designation_category == 'staff'"
        >
          <label>Client Code</label>
          <vue-typeahead-bootstrap
            class="mb-4"
            v-model="query"
            :ieCloseFix="false"
            :data="clientCodes"
            :serializer="(item) => item.client_code"
            @hit="selectedClientCode = $event"
            :disabledValues="
              selectedClientCode ? [selectedClientCode.client_code] : []
            "
            placeholder="Search client code"
            @input="getClientCode"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <div class="col-sm-12">
            <div class="row">
              <label>Category</label>
            </div>
            <el-select
              class="select-primary"
              size="large"
              name="status"
              placeholder="Status"
              v-model="category"
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
        </div>
        <div class="col-sm-12 col-md-12 mt-3">
          <div class="col-sm-12">
            <div class="row">
              <label>Per APN</label>
            </div>
            <el-select
              class="select-primary"
              size="large"
              name="status"
              placeholder="Status"
              v-model="perApn"
            >
              <el-option
                v-for="option in propertyDetails"
                class="select-primary"
                :value="option.apn"
                :label="option.apn"
                :key="option.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 mt-3">
          <div class="col-sm-12">
            <div class="row">
              <label>Deadline</label>
            </div>
            <el-select
              class="select-primary"
              size="large"
              name="deadline"
              placeholder="Deadline"
              v-model="deadline"
            >
              <el-option
                v-for="option in deadlines"
                class="select-primary"
                :value="option.deadline"
                :label="option.deadline"
                :key="option.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 mt-3">
          <div class="col-sm-10">
            <div class="row">
              <label>Status</label>
            </div>
            <el-select
              class="select-primary"
              size="large"
              name="status"
              placeholder="Status"
              v-model="status"
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
            <small class="text-muted"
              >If you don't set the status. The default value will be
              <strong>N/A</strong></small
            >
          </div>
        </div>
        <div class="col-sm-12 col-md-12 mt3">
          <base-input
            label="Total time consumed"
            v-model="totalTimeConsumed"
            v-if="$auth.user.designation_category == 'staff'"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-12 mt-3">
          <base-input label="Due date">
            <el-date-picker
              v-model="dueDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
        <div
          class="col-sm-12 col-md-12 mt-3"
          v-if="$auth.user.designation_category == 'staff'"
        >
          <base-input label="Date completed">
            <el-date-picker
              v-model="dateCompleted"
              v-validate="'required'"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
      </div>

      <div
        class="form-row mt-3"
        v-if="$auth.user.designation_category == 'staff'"
      >
        <label>URL of the completed JO</label>
        <textarea class="form-control" v-model="urlOfTheCompletedJo" required>
        </textarea>
      </div>

      <div class="form-row mt-3">
        <div class="col-sm-12 col-md-12">
          <label>Job description</label>
          <textarea class="form-control" v-model="jobDescription" required>
          </textarea>
        </div>
      </div>

      <div
        class="form-row mt-3"
        v-if="$auth.user.designation_category == 'staff'"
      >
        <div class="col-sm-12 col-md-12">
          <label>Notes - VA side</label>
          <textarea class="form-control" v-model="notesVa"> </textarea>
        </div>
      </div>

      <div slot="footer">
        <div class="pull-right">
          <base-button
            v-if="!loading"
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
import { mapActions, mapGetters } from "vuex";
import CreateJobMixin from "@/mixins/CreateJobOrderCategoryMixin.js";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { debounce } from "lodash";

export default {
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap
  },
  mixins: [CreateJobMixin],
  props: {
    staff: {
      type: Object,
      decription: "Staff data",
    },
    client: {
      type: Object,
      description: "Client data",
    },
    fetch: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      query: "",
      selectedClientCode: "",
      clientCodes: [],
      error: "",
      job: {
        request_date: "",
        due_date: "",
        job_title: "",
        job_description: "",
        client_notes: "",
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
        ],
      },
    };
  },
  methods: {
    ...mapActions("jobOrderCategory", ["reset", "saveJobOrderCategory"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    getClientCode: debounce(function() {
      this.$axios
        .get(`/api/v1/client-code/?search=${this.query}`)
        .then((res) => {
          this.clientCodes = res.data.results;
        })
        .catch((err) => {
          console.log(err);
        });
    }, 700),
    async fetchCategory() {
      await this.$store.dispatch("jobOrderCategory/fetchCategory");
    },
    async fetchPropertyDetailApn() {
      await this.$store.dispatch("propertyDetail/fetchPropertyDetails");
    },
    async fetchDeadline() {
      await this.$store.dispatch("jobOrderCategory/fetchDeadline");
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        if (
          this.$auth.user.designation_category == "new_client" ||
          this.$auth.user.designation_category == "current_client" ||
          this.$auth.user.designation_category == "affiliate_partner"
        ) {
          const payload = {
            client: this.client.client_code,
            client_email: this.$auth.user.email,
            category: this.category,
            property_detail: this.perApn,
            deadline: this.deadline,
            status: this.status,
            due_date: this.dueDate,
            category: this.category,
            job_description: this.jobDescription,
          };
          try {
            await this.saveJobOrderCategory(payload).then(() => {
              this.loading = false;
              this.success = true;
              this.successMessage();
              this.reset();
              this.$validator.reset();

              this.fetch();
            });
          } catch (err) {
            console.error(err);
            this.success = false;
            this.error = err;
            this.errorMessage(this.error);
          }
        } else {
          const payload = {
            category: this.category,
            property_detail: this.perApn,
            status: this.status,
            client: this.query,
            staff: [this.staff.id],
            staff_email: this.$auth.user.email,
            deadline: this.deadline,
            due_date: this.dueDate,
            date_completed: this.dateCompleted,
            total_time_consumed: this.totalTimeConsumed,
            url_of_the_completed_jo: this.urlOfTheCompletedJo,
            job_description: this.jobDescription,
            notes_va: this.notesVa,
          };
          await this.saveJobOrderCategory(payload);
          this.loading = false;
          this.reset();
          this.$validator.reset();
          this.fetch();
        }
      }
    },
    successMessage() {
      return "Successfully added a new Job Order. Management is on it's way to process this.";
    },
    errorMessage(error) {
      if (error.request_date) {
        return "Request date: " + this.error.request_date;
      } else if (error.due_date) {
        return "due_date: " + this.error.due_date;
      } else if (error.property_detail) {
        return "Property detail: " + this.error.property_detail;
      } else if (error.job_title) {
        return "Job title: " + this.error.job_title;
      } else if (error.job_description) {
        return "Job description: " + this.error.job_decription;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    },
  },
  computed: {
    ...mapGetters({
      apnCategories: "jobOrderCategory/apnCategories",
      deadlines: "jobOrderCategory/deadlines",
      propertyDetails: "propertyDetail/propertyDetails",
    }),
    category: {
      get() {
        return this.$store.getters["jobOrderCategory/category"];
      },
      set(value) {
        this.setBasicStoreValue("category", value);
      },
    },
    perApn: {
      get() {
        return this.$store.getters["jobOrderCategory/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    deadline: {
      get() {
        return this.$store.getters["jobOrderCategory/deadline"];
      },
      set(value) {
        this.setBasicStoreValue("deadline", value);
      },
    },
    status: {
      get() {
        return this.$store.getters["jobOrderCategory/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      },
    },
    dueDate: {
      get() {
        return this.$store.getters["jobOrderCategory/due_date"];
      },
      set(value) {
        this.setBasicStoreValue("due_date", value);
      },
    },
    dateCompleted: {
      get() {
        return this.$store.getters["jobOrderCategory/date_completed"];
      },
      set(value) {
        this.setBasicStoreValue("date_completed", value);
      },
    },
    jobDescription: {
      get() {
        return this.$store.getters["jobOrderCategory/job_description"];
      },
      set(value) {
        this.setBasicStoreValue("job_description", value);
      },
    },
    urlOfTheCompletedJo: {
      get() {
        return this.$store.getters["jobOrderCategory/url_of_the_completed_jo"];
      },
      set(value) {
        this.setBasicStoreValue("url_of_the_completed_jo", value);
      },
    },
    notesVa: {
      get() {
        return this.$store.getters["jobOrderCategory/notes_va"];
      },
      set(value) {
        this.setBasicStoreValue("notes_va", value);
      },
    },
    notesManagement: {
      get() {
        return this.$store.getters["jobOrderCategory/notes_management"];
      },
      set(value) {
        this.setBasicStoreValue("notes_management", value);
      },
    },
    totalTimeConsumed: {
      get() {
        return this.$store.getters["jobOrderCategory/total_time_consumed"];
      },
      set(value) {
        this.setBasicStoreValue("total_time_consumed", value);
      },
    },
  },
  mounted() {
    this.fetchCategory();
    this.fetchPropertyDetailApn();
    this.fetchDeadline();
  },
};
</script>
