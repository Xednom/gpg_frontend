<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Create job order general</h4>
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
        <div class="col-sm-12 col-md-12">
          <base-input
            v-model="request_date"
            label="Request date"
            v-validate="'required'"
            name="Request date"
            :error="getError('Request date')"
          >
            <el-date-picker
              v-model="request_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
        <div class="col-sm-12 col-md-12">
          <base-input label="Due date">
            <el-date-picker
              v-model="due_date"
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
          <base-input
            label="Job title"
            v-validate="'required'"
            :error="getError('Job title')"
            name="Job title"
            v-model="job_title"
          >
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
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
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="col-sm-12 col-md-12">
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="job_description"
            required
          >
          </textarea>
        </div>
      </div>

      <div class="form-row mt-3">
        <div
          class="col-sm-12 col-md-12"
          v-if="$auth.user.designation_category == 'staff'"
        >
          <textarea
            class="form-control"
            placeholder="URL of the completed JO"
            v-model="url_of_the_completed_jo"
          >
          </textarea>
        </div>
      </div>

      <div slot="footer">
        <div class="pull-right mt-3">
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
import { mapActions } from "vuex";
import CreateJobMixin from "@/mixins/CreateJobOrderMixin.js";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { debounce } from "lodash";

export default {
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
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
      clientUser: {},
      clientCodes: [],
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
          { value: "pending", label: "Pending"},
          { value: "request_for_posting", label: "Request for Posting" },
          { value: "mark_as_sold_request", label: "Mark as Sold Request" },
          { value: "initial_dd_processing", label: "Initial DD Processing" },
          { value: "initial_dd_complete", label: "Initial DD Complete" },
          { value: "dd_call_out_processing", label: "DD Call Out Processing" },
          { value: "dd_call_out_complete", label: "DD Call Out Complete" },
          { value: "duplicate_request", label: "Duplicate Request" },
        ],
      },
      error: "",
    };
  },
  methods: {
    ...mapActions("jobOrder", ["reset", "saveJobOrder"]),
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
    async fetchClient(id) {
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchCallerInteraction(id) {
      let endpoint = `/api/v1/post-paid/customer-interaction-post-paid/`;
      try {
        await this.$axios.get(endpoint);
      } catch (err) {
        console.error(err.response.data);
      }
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
            client: this.clientUser.client_code,
            request_date: this.request_date,
            due_date: this.due_date,
            job_title: this.job_title,
            status: this.status,
            job_description: this.job_description,
          };
          try {
            await this.saveJobOrder(payload).then(() => {
              this.loading = false;
              this.success = true;
              this.successMessage();
              this.reset();
              this.query = null;
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
            va_assigned: [this.staff.id],
            client: this.query,
            request_date: this.request_date,
            due_date: this.due_date,
            job_title: this.job_title,
            status: this.status,
            job_description: this.job_description,
            url_of_the_completed_jo: this.url_of_the_completed_jo
          };
          await this.saveJobOrder(payload);
          this.loading = false;
          this.query = "";
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
    request_date: {
      get() {
        return this.$store.getters["jobOrder/request_date"];
      },
      set(value) {
        this.setBasicStoreValue("request_date", value);
      },
    },
    due_date: {
      get() {
        return this.$store.getters["jobOrder/due_date"];
      },
      set(value) {
        this.setBasicStoreValue("due_date", value);
      },
    },
    job_title: {
      get() {
        return this.$store.getters["jobOrder/job_title"];
      },
      set(value) {
        this.setBasicStoreValue("job_title", value);
      },
    },
    status: {
      get() {
        return this.$store.getters["jobOrder/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      },
    },
    url_of_the_completed_jo: {
      get() {
        return this.$store.getters["jobOrder/url_of_the_completed_jo"];
      },
      set(value) {
        this.setBasicStoreValue("url_of_the_completed_jo", value);
      },
    },
    job_description: {
      get() {
        return this.$store.getters["jobOrder/job_description"];
      },
      set(value) {
        this.setBasicStoreValue("job_description", value);
      },
    },
  },
  mounted() {
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner"
    ) {
      this.fetchClient(this.$auth.user.id);
    }
  },
};
</script>
