<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <form @submit.prevent="save">
          <first-step></first-step>
          <card>
            <h5 class="info-text">
              Property Price
            </h5>
            <div
              class="row justify-content-center mt-5"
              v-for="(item, index) in this.property_price_statuses"
              :key="index"
            >
              <div class="col-sm-5 col-md-3">
                <base-input
                  label="Asking price"
                  name="askingPrice"
                  required
                  v-model="item.asking_price"
                  v-validate="modelValidations.askingPrice"
                  :error="getError('askingPrice')"
                >
                </base-input>
              </div>
              <div class="col-sm-5 col-md-3">
                <base-input
                  label="Cash terms"
                  name="cashTerms"
                  required
                  v-model="item.cash_terms"
                  v-validate="modelValidations.cashTerms"
                  :error="getError('cashTerms')"
                >
                </base-input>
              </div>
              <div class="col-sm-5 col-md-3 status">
                <div class="row">
                  <label>Price status</label>
                </div>
                <el-select
                  class="select-primary"
                  size="large"
                  name="price_status"
                  v-model="item.price_status"
                >
                  <el-option
                    v-for="option in priceStatusChoices.status"
                    class="select-primary"
                    :value="option.value"
                    :label="option.label"
                    :key="option.label"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="col-sm-12 col-md-12 mt-3">
                <label>Finance Terms</label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  class="form-control"
                  v-model="item.finance_terms"
                ></textarea>
              </div>
              <div class="col-sm-12 col-md-12 mt-3">
                <label>Other Terms</label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  class="form-control"
                  v-model="item.other_terms"
                ></textarea>
              </div>
              <div class="col-sm-12 mt-3">
                <label>Notes</label>
                <textarea
                  name="notes"
                  class="form-control"
                  type="text"
                  v-model="item.notes"
                  v-validate="'required'"
                  :error="getError('notes')"
                  required
                >
                </textarea>
              </div>
            </div>
          </card>
          <third-step></third-step>
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
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import FirstStep from "@/components/JobOrder/PropertyDetails/PropertyDetailFirstStep.vue";
import SecondStep from "@/components/JobOrder/PropertyDetails/PropertyDetailSecondStep.vue";
import ThirdStep from "@/components/JobOrder/PropertyDetails/PropertyDetailThirdStep.vue";
import swal from "sweetalert2";
import { SimpleWizard, WizardTab } from "@/components";

import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
import { Select, Option } from "element-ui";

export default {
  mixins: [CreatePropertyDetailMixin],
  name: "wizard-form",
  data() {
    return {
      property_price_statuses: [],
      wizardModel: {},
      loading: false,
      saving: false,
      clientUser: {},
      staffUser: {},
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "deactivate", label: "Deactivate" },
          { value: "active", label: "Active" },
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
      },
      error: {
        client: "",
        staff: "",
        apn: "",
        state: "",
        county: "",
        size: "",
        asking_price: "",
        cash_terms: "",
        finance_terms: "",
        other_terms: "",
        notes: "",
        non_field_errors: "",
      },
    };
  },
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
    SimpleWizard,
    WizardTab,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  provide() {
    return {
      $validator: this.$validator,
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["savePropertyDetail", "reset"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
    addRow: function() {
      this.property_price_statuses.push({
        asking_price: "",
        cash_terms: "",
        finance_terms: "",
        other_terms: "",
        price_status: "",
        notes: "",
      });
    },
    deleteRow: function(e, item) {
      e.preventDefault();
      var index = this.property_price_statuses
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(item);
      this.property_price_statuses.splice(index, 1);
    },
    // receivePropertyPriceStatuses(value) {
    //   this.property_price_statuses = value;
    //   console.log(this.property_price_statuses);
    //   return this.property_price_statuses;
    // },
    onStepValidated(validated, model) {
      this.wizardModel = { ...this.wizardModel, ...model };
    },
    wizardComplete() {
      swal("Good job!", "You clicked the finish button!", "success");
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
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.apn
          ? "APN: " + error.apn
          : error.state
          ? "State: " + error.state
          : error.county
          ? "County" + error.county
          : error.size
          ? "Size: " + error.username
          : error.property_status
          ? "Property status: " + error.property_status
          : error.asking_price
          ? "Asking price: " + error.asking_price
          : error.finance_terms
          ? "Finance terms: " + error.finance_terms
          : error.cash_terms
          ? "Cash terms: " + error.cash_terms
          : error.other_terms
          ? "Other terms: " + error.other_terms
          : error.notes
          ? "Notes: " + error.notes
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
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        const clientPayload = {
          client: this.clientUser.id,
          property_status: this.property_status,
          company_name: this.company_name,
          phone: this.phone,
          email: this.email,
          website_url: this.website_url,
          file_storage: this.file_storage,
          apn: this.apn,
          county: this.county,
          state: this.state,
          size: this.size,
          notes_client_side: this.notes_client_side,
          notes_va_side: this.notes_va_side,
          notes_management_side: this.notes_management_side,
          property_price_statuses: this.property_price_statuses,
        };

        const staffPayload = {
          staff: this.staffUser.id,
          property_status: this.property_status,
          company_name: this.company_name,
          phone: this.phone,
          email: this.email,
          website_url: this.website_url,
          file_storage: this.file_storage,
          apn: this.apn,
          county: this.county,
          state: this.state,
          size: this.size,
          notes_client_side: this.notes_client_side,
          notes_va_side: this.notes_va_side,
          notes_management_side: this.notes_management_side,
          property_price_statuses: this.property_price_statuses,
        };

        console.log(clientPayload);

        if (this.$auth.user.designation_category == "staff") {
          try {
            this.saving = true;
            await this.savePropertyDetail(staffPayload)
              .then(() => {
                this.saving = false;
                this.$router.push("/job-order/property-detail");
                this.reset();
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
            await this.savePropertyDetail(clientPayload)
              .then(() => {
                this.saving = false;
                this.$router.push("/job-order/property-detail");
                this.reset();
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
        this.loading = false;
      }
    },
  },
  computed: {
    ...mapGetters("propertyDetail", [
      "price_status",
      "property_status",
      "category",
      "apn",
      "county",
      "state",
      "size",
      "company_name",
      "phone",
      "email",
      "website_url",
      "file_storage",
      "notes_client_side",
      "notes_va_side",
      "notes_management_side",
      // "property_price_statuses"
    ]),
  },
  mounted() {
    this.fetchMe();
    this.addRow();
    // this.receivePropertyPriceStatuses();
  },
};
</script>
