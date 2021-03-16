<template>
  <div>
    <card>
      <h5 class="info-text">
        Listing Ad Details
      </h5>
      <div class="row justify-content-center mt-5">
        <div class="col-sm-5">
          <!-- <el-select
          class="select-primary"
          size="large"
          placeholder="Category"
          v-model="selects.simple"
        >
          <el-option
            v-for="option in selects.countries"
            class="select-primary"
            :value="option.value"
            :label="option.label"
            :key="option.label"
          >
          </el-option>
        </el-select> -->
        </div>
        <div class="col-sm-10">
          <base-input
            name="ad_details"
            required
            placeholder="Ad Details"
            v-model="ad_details"
            v-validate="modelValidations.adDetails"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>
        </div>
        <div class="col-sm-10">
          <base-input
            name="notes_client_side"
            placeholder="Notes"
            v-model="notes_client_side"
            addon-left-icon="tim-icons icon-caps-small"
          >
          </base-input>

          <base-input
            v-if="this.$auth.user.designation_category == 'staff'"
            name="notes_va_side"
            placeholder="Notes - VA side"
            v-model="notes_va_side"
            addon-left-icon="tim-icons icon-mobile"
          >
          </base-input>

          <base-input
            v-if="this.$auth.user.designation_category == 'staff'"
            name="notes_management_side"
            placeholder="Notes - Management side"
            v-model="notes_management_side"
            addon-left-icon="tim-icons icon-mobile"
          >
          </base-input>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
export default {
  mixins: [CreatePropertyDetailMixin],
  inject: ['$validator'],
  data() {
    return {
      modelValidations: {
        // category: {
        //   required: true,
        // },
        adDetails: {
          required: true,
        },
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
  },
  computed: {
    category: {
      get() {
        return this.$store.getters["propertyDetail/category"];
      },
      set(value) {
        this.setBasicStoreValue("category", value);
      },
    },
    ad_details: {
      get() {
        return this.$store.getters["propertyDetail/ad_details"];
      },
      set(value) {
        this.setBasicStoreValue("ad_details", value);
      },
    },
    notes_client_side: {
      get() {
        return this.$store.getters["propertyDetail/notes_client_side"];
      },
      set(value) {
        this.setBasicStoreValue("notes_client_side", value);
      },
    },
    notes_va_side: {
      get() {
        return this.$store.getters["propertyDetail/notes_va_side"];
      },
      set(value) {
        this.setBasicStoreValue("notes_va_side", value);
      },
    },
    notes_management_side: {
      get() {
        return this.$store.getters["propertyDetail/notes_management_side"];
      },
      set(value) {
        this.setBasicStoreValue("notes_management_side", value);
      },
    },
  },
};
</script>
<style></style>
