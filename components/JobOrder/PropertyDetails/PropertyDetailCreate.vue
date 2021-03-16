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
              native-type="submit"
              type="success"
              class="animation-on-hover"
              >Save</base-button
            >
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
      clientUser: {},
      staffUser: {},
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
          await this.savePropertyDetail(staffPayload).then(() => {
            this.$router.push("/job-order/property-detail");
          });
        } else {
          await this.savePropertyDetail(clientPayload).then(() => {
            this.$router.push("/job-order/property-detail");
          });
        }
        this.loading = false;
        this.reset();
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
