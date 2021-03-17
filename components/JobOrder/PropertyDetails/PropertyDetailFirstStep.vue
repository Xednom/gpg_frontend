<template>
  <div>
    <card>
      <h5 class="info-text">
        Property Details
      </h5>
      <div class="row justify-content-center mt-5">
        <div class="col-sm-5">
          <base-input
            label="APN"
            name="apn"
            required
            placeholder="APN"
            v-model="apn"
            v-validate="modelValidations.apn"
            :error="getError('apn')"
            addon-left-icon="tim-icons icon-single-02"
          >
          </base-input>

          <base-input
            label="County"
            name="county"
            required
            placeholder="County"
            v-model="county"
            v-validate="modelValidations.county"
            :error="getError('county')"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>
        </div>
        <div class="col-sm-5">
          <base-input
            label="State"
            name="state"
            required
            placeholder="State"
            v-model="state"
            v-validate="modelValidations.state"
            :error="getError('state')"
            addon-left-icon="tim-icons icon-caps-small"
          >
          </base-input>

          <base-input
            label="Size(Acreage)"
            name="size"
            required
            placeholder="Size(Acreage)"
            v-model="size"
            v-validate="modelValidations.size"
            :error="getError('size')"
            addon-left-icon="tim-icons icon-mobile"
          >
          </base-input>
        </div>
        <div class="col-sm-10">
          <div class="row">
            <label>Property Status</label>
          </div>
          <el-select
            class="select-primary"
            reqiured
            size="large"
            name="propertyStatus"
            placeholder="Property Status"
            v-model="propertyStatus"
            v-validate="modelValidations.propertyStatus"
            :error="getError('propertyStatus')"
          >
            <el-option
              v-for="option in propertyStatusChoices.status"
              class="select-primary"
              :value="option.value"
              :label="option.label"
              :key="option.label"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
import { Select, Option } from "element-ui";
import Card from "~/components/Cards/Card.vue";
export default {
  mixins: [CreatePropertyDetailMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  inject: ["$validator"],
  data() {
    return {
      property: {
        apn: "",
        county: "",
        state: "",
        size: "",
        propertyStatus: "",
      },
      modelValidations: {
        apn: {
          required: true,
        },
        county: {
          required: true,
        },
        state: {
          required: true,
        },
        size: {
          required: true,
          numeric: true,
        },
        propertyStatus: {
          required: true,
        },
      },
      propertyStatusChoices: {
        placeholder: "",
        status: [
          { value: "sold", label: "Sold" },
          { value: "available", label: "Available" },
          { value: "in_escrow", label: "In Escrow" },
          { value: "in_contract", label: "In Contract" },
          { value: "ready_to_purchase", label: "Ready to Purchase" },
          { value: "canceled_transaction", label: "Canceled Transaction" },
        ],
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
    apn: {
      get() {
        return this.$store.getters["propertyDetail/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    county: {
      get() {
        return this.$store.getters["propertyDetail/county"];
      },
      set(value) {
        this.setBasicStoreValue("county", value);
      },
    },
    state: {
      get() {
        return this.$store.getters["propertyDetail/state"];
      },
      set(value) {
        this.setBasicStoreValue("state", value);
      },
    },
    size: {
      get() {
        return this.$store.getters["propertyDetail/size"];
      },
      set(value) {
        this.setBasicStoreValue("size", value);
      },
    },
    propertyStatus: {
      get() {
        return this.$store.getters["propertyDetail/property_status"];
      },
      set(value) {
        this.setBasicStoreValue("property_status", value);
      },
    },
  },
};
</script>
<style></style>
