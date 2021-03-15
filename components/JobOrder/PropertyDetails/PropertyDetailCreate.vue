<template>
  <div>
    <div class="row d-flex justify-content-center">
      <div class="col-md-10">
        <simple-wizard>
          <template slot="header">
            <h3 class="card-title">Property Details</h3>
            <h3 class="description">
              This information will will give us more information about your Property.
            </h3>
          </template>

          <wizard-tab :before-change="() => validateStep('step1')">
            <template slot="label">
              <i class="tim-icons icon-single-02"></i>
              <p>Property Details</p>
            </template>
            <first-step
              ref="step1"
              @on-validated="onStepValidated"
            ></first-step>
          </wizard-tab>

          <wizard-tab :before-change="() => validateStep('step2')">
            <template slot="label">
              <i class="tim-icons icon-settings-gear-63"></i>
              <p>Property Price</p>
            </template>
            <second-step
              ref="step2"
              @on-validated="onStepValidated"
            ></second-step>
          </wizard-tab>

          <wizard-tab :before-change="() => validateStep('step3')">
            <template slot="label">
              <i class="tim-icons icon-delivery-fast"></i>
              <p>Listing Ad Details</p>
            </template>
            <third-step ref="step3"></third-step>


            <base-button @click="save">test</base-button>
          </wizard-tab>
        </simple-wizard>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapActions} from "vuex";

import FirstStep from '@/components/JobOrder/PropertyDetails/PropertyDetailFirstStep.vue';
import SecondStep from '@/components/JobOrder/PropertyDetails/PropertyDetailSecondStep.vue';
import ThirdStep from '@/components/JobOrder/PropertyDetails/PropertyDetailThirdStep.vue';
import swal from 'sweetalert2';
import { SimpleWizard, WizardTab } from '@/components';

export default {
  name: 'wizard-form',
  data() {
    return {
      wizardModel: {},
      loading: false
    };
  },
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
    SimpleWizard,
    WizardTab
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
      swal('Good job!', 'You clicked the finish button!', 'success');
    },
    async save() {
      this.loading = true;
      const clientPayload = {
        client: this.$auth.user.id,
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
        notes_management_side: this.notes_management_side
      }

      const staffPayload = {
        staff: this.$auth.user.id,
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
        notes_management_side: this.notes_management_side
      }

      if (this.$auth.user.designation_category == "staff") {
        await this.savePropertyDetail(staffPayload);
      } else {
        await this.savePropertyDetail(clientPayload);
      }
      this.loading = false;
      this.reset();
    }
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
      "notes_management_side"
    ])
  }
};
</script>
