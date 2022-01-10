<template>
  <div class="content">
    <div class="container">
      <div class="row">
        <card card-body-classes="table-full-width">
          <div class="col-md-12">
            <form @submit.prevent="save">
              <h4 class="card-title">View/Update your Resolution</h4>
              <div class="form-row">
                <div class="col-sm-12 col-md-4 mt-3">
                  <base-input label="Date submitted">
                    <el-date-picker
                      v-model="resolution.date_submitted"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="Choose date"
                      disabled
                    >
                    </el-date-picker>
                  </base-input>
                </div>
                <div class="col-sm-12 col-md-4 mt-3">
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
                      v-bind:value="category"
                      v-model="resolution.category"
                      disabled
                    >
                      <el-option
                        v-for="option in categories"
                        class="select-primary"
                        :value="option.name"
                        :label="option.name"
                        :key="option.id"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 mt-3">
                  <base-input label="Status">
                    <base-input
                      v-model="resolution.status"
                      disabled
                    ></base-input>
                  </base-input>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-12 col-md-12 mt-3">
                  <label>Description</label>
                  <textarea
                    class="form-control"
                    v-model="resolution.description"
                    disabled
                  >
                  </textarea>
                </div>
                <div class="col-sm-12 col-md-12 mt-3">
                  <label>Resolution provided by Management</label>
                  <textarea
                    class="form-control"
                    v-model="resolution.resolution_provided_by_management"
                    disabled
                  >
                  </textarea>
                </div>
                <div class="col-sm-12 col-md-12 mt-3">
                  <label>Additional notes</label>
                  <textarea
                    class="form-control"
                    v-model="resolution.additional_notes"
                    :disabled="resolution.status == 'closed'"
                  >
                  </textarea>
                </div>
              </div>

              <div slot="footer">
                <div class="pull-left">
                  <nuxt-link to="/resolution">Return back to list</nuxt-link>
                </div>
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
        </card>
      </div>
    </div>
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
      resolution: {},
      balance: "",
      query: "",
      selectedClientCode: "",
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
    async fetchClient(id) {
      try {
        await this.$store.dispatch("user/fetchClientUser", id);
      } catch (e) {
        this.errorMessage("danger", e.response.data);
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
            id: this.resolution.id,
            additional_notes: this.resolution.additional_notes,
          };
          try {
            if (this.balance < 0) {
              this.loading = false;
              this.deficitMessage("danger");
            } else {
              let response = await this.saveResolution(payload);
              console.log(response);
              this.loading = false;
              this.successMessage("success");
              this.reset();
              this.$validator.reset();
            }
          } catch (err) {
            console.error(err);
            this.loading = false;
            this.success = false;
            this.error = err;
            this.errorMessage("danger", err.response.data);
          }
        } else {
          const payload = {
            id: this.resolution.id,
            additional_notes: this.resolution.additional_notes,
          };
          await this.saveResolution(payload);
          this.loading = false;
          this.reset();
          this.$validator.reset();
          this.fetch();
        }
      }
    },
    async fetchCategory() {
      try {
        await this.$store.dispatch("resolution/fetchCategory");
      } catch (e) {
        this.errorMessage("danger", e.response.data);
      }
    },
    async fetchAccountBalance() {
      await this.$store.dispatch("accountBalance/fetchAccountBalances");
      this.accountBalances.forEach((item) => {
        this.balance = item.account_balance_amount;
      });
    },
    async fetchResolution(id) {
      try {
        let endpoint = `/api/v1/resolution/${id}/`;
        let response = await this.$axios.get(endpoint);
        if (response.status == 200) {
          this.resolution = response.data;
        }
        console.log(response.status == 200);
      } catch (e) {
        this.errorMessage("danger", e.response.data);
      }
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
    ...mapGetters({
      clientUser: "user/clientUser",
      categories: "resolution/categories",
      resolution: "resolution/resolution",
    }),
    date_submitted: {
      get() {
        return this.$store.getters["resolution/date_submitted"];
      },
      set(value) {
        this.setBasicStoreValue("date_submitted", value);
      },
    },
    category: {
      get() {
        return this.$store.getters["resolution/category"];
      },
      set(value) {
        this.setBasicStoreValue("category", value);
      },
    },
    description: {
      get() {
        return this.$store.getters["resolution/description"];
      },
      set(value) {
        this.setBasicStoreValue("description", value);
      },
    },
    assigned_to: {
      get() {
        return this.$store.getters["resolution/assigned_to"];
      },
      set(value) {
        this.setBasicStoreValue("assigned_to", value);
      },
    },
    client: {
      get() {
        return this.$store.getters["resolution/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      },
    },
    resolution_provided_by_management: {
      get() {
        return this.$store.getters[
          "resolution/resolution_provided_by_management"
        ];
      },
      set(value) {
        this.setBasicStoreValue("resolution_provided_by_management", value);
      },
    },
    status: {
      get() {
        return this.$store.getters["resolution/status"];
      },
      set(value) {
        this.setBasicStoreValue("status", value);
      },
    },
    additional_notes: {
      get() {
        return this.$store.getters["resolution/additional_notes"];
      },
      set(value) {
        this.setBasicStoreValue("additional_notes", value);
      },
    },
  },
  mounted() {
    this.fetchClient(this.$auth.user.id);
    this.fetchCategory();
    this.fetchResolution(this.$route.params.id);
  },
};
</script>
