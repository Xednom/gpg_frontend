<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Create Resolution</h4>
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
              filterable
              size="large"
              name="Category"
              placeholder="Category"
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
              filterable
              size="large"
              name="Per APN"
              placeholder="Per APN"
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
              filterable
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
              filterable
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
import CreateResolutionMixin from "@/mixins/CreateResolutionMixin.js";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { debounce } from "lodash";

export default {
  name: "resolution_create",
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
  },
  mixins: [CreateResolutionMixin],
  props: {
    fetch: {
      type: Function,
      description: "Fetch the resolution function ",
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      balance: "",
      query: "",
      selectedClientCode: "",
      clientCodes: [],
      limit: 1000,
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
          { value: "pending", label: "Pending" },
          { value: "in_progress", label: "In progress" },
          { value: "on_hold", label: "On hold" },
          { value: "closed", label: "Closed" },
          { value: "resolution_provided", label: "Resolution provided" },
        ],
      },
    };
  },
  methods: {
    ...mapActions("resolution", ["reset", "saveResolution"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async fetchCategory() {
      await this.$store.dispatch("resolution/fetchCategory");
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
            if (this.balance < 0) {
              this.loading = false;
              this.deficitMessage("danger");
            } else {
              let response = await this.saveResolution(payload);
              if (response.ok) {
                this.loading = false;
                this.success = true;
                this.successMessage();
                this.reset();
                this.$validator.reset();

                this.fetch();
              }
            }
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
          await this.saveResolution(payload);
          this.loading = false;
          this.reset();
          this.$validator.reset();
          this.fetch();
        }
      }
    },
    async fetchAccountBalance() {
      await this.$store.dispatch("accountBalance/fetchAccountBalances");
      this.accountBalances.forEach((item) => {
        this.balance = item.account_balance_amount;
      });
    },
    deficitMessage(variant = null) {
      this.$bvToast.toast(
        "Your account is in deficit status. For you to continue using the service, please refill your account by going to TIMESHEET under Account Balance you can see the link to make a payment. Thank you.",
        {
          title: `Please be advised`,
          variant: variant,
          solid: true,
        }
      );
    },
    successMessage(variant = null) {
      this.$bvToast.toast(
        "Successfully submitted your resolution, thank you!",
        {
          title: `Successful`,
          variant: variant,
          solid: true,
        }
      );
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.date_submitted
          ? "Date submitted: " + error.date_submitted
          : error.category
          ? "Category: " + error.category
          : error.description
          ? "Description: " + error.description
          : error.assigned_to
          ? "Assigned to: " + error.assigned_to
          : error.client
          ? "Client: " + error.client
          : error.resolution_provided_by_management
          ? "Resolution provided by management: " +
            error.resolution_provided_by_management
          : error.status
          ? "Status: " + error.status
          : error.additional_notes
          ? "Additional notes: " + error.additional_notes
          : error.detail
          ? "Detail: " + error.detail
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
  },
  computed: {
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
    this.fetchAccountBalance();
  },
};
</script>
