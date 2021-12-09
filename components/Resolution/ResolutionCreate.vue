<template>
  <div class="content">
    <div class="container">
      <div class="row">
        <card card-body-classes="table-full-width">
          <div class="col-md-12">
            <form @submit.prevent="save">
              <h4 class="card-title">Create Resolution</h4>
              <div class="form-row">
                <div class="col-sm-12 col-md-6 mt-3">
                  <base-input label="Date submitted">
                    <el-date-picker
                      v-model="date_submitted"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="Choose date"
                    >
                    </el-date-picker>
                  </base-input>
                </div>
                <div class="col-sm-12 col-md-6 mt-3">
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
              </div>
              <div class="form-row">
                <div class="col-sm-12 col-md-12 mt-3">
                  <label>Description</label>
                  <textarea class="form-control" v-model="description" required>
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
            client: this.clientUser.id,
            date_submitted: this.date_submitted,
            category: this.category,
            description: this.description,
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
            date_submitted: this.date_submitted,
            category: this.category,
            description: this.description,
            client: this.query,
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
  },
  mounted() {
    this.fetchClient(this.$auth.user.id);
    this.fetchCategory();
  },
};
</script>
