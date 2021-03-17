<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <form @submit.prevent="save">
          <first-step></first-step>
          <second-step></second-step>
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

export default {
  name: "wizard-form",
  data() {
    return {
      wizardModel: {},
      loading: false,
      saving: false,
      clientUser: {},
      staffUser: {},
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
  },
  provide() {
    return {
      $validator: this.$validator,
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["savePropertyDetail", "reset"]),
    validateStep(ref) {
      return this.$refs[ref].validate();
    },
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
        UIkit.notification("Error:" + err.response.data, {
          status: "danger",
        });
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
          price_status: this.price_status,
          property_status: this.property_status,
          category: this.category,
          apn: this.apn,
          county: this.county,
          state: this.state,
          size: this.size,
          asking_price: this.asking_price,
          cash_terms: this.cash_terms,
          finance_terms: this.finance_terms,
          other_terms: this.other_terms,
          notes: this.notes,
          ad_details: this.ad_details,
          notes_client_side: this.notes_client_side,
          notes_va_side: this.notes_va_side,
          notes_management_side: this.notes_management_side,
        };

        const staffPayload = {
          staff: this.staffUser.id,
          price_status: this.price_status,
          property_status: this.property_status,
          category: this.category,
          apn: this.apn,
          county: this.county,
          state: this.state,
          size: this.size,
          asking_price: this.asking_price,
          cash_terms: this.cash_terms,
          finance_terms: this.finance_terms,
          other_terms: this.other_terms,
          notes: this.notes,
          ad_details: this.ad_details,
          notes_client_side: this.notes_client_side,
          notes_va_side: this.notes_va_side,
          notes_management_side: this.notes_management_side,
        };

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
      "asking_price",
      "cash_terms",
      "finance_terms",
      "other_terms",
      "notes",
      "ad_details",
      "notes_client_side",
      "notes_va_side",
      "notes_management_side",
    ]),
  },
  mounted() {
    this.fetchMe();
  },
};
</script>
