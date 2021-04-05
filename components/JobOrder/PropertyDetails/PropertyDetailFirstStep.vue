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
          >
          </base-input>

          <div class="row">
            <label>County</label>
          </div>
          <el-select
            class="select-primary"
            size="large"
            placeholder="Select a County"
            v-model="county"
          >
            <template v-if="!this.state">Please select a State first</template>
            <template v-else>
            <el-option
              v-for="option in counties"
              class="select-primary"
              :value="option.name"
              :label="option.label"
              :key="option.label"
            >
            </el-option>
            </template>
          </el-select>
        </div>
        <div class="col-sm-5">
          <div class="row">
            <label>State</label>
          </div>
          <el-select
            class="select-primary"
            size="large"
            placeholder="Select a State"
            v-model="state"
            @change="fetchCounties"
          >
            <el-option
              v-for="option in states"
              class="select-primary"
              :value="option.name"
              :label="option.label"
              :key="option.label"
            >
            </el-option>
          </el-select>

          <base-input
            label="Size(Acreage)"
            name="size"
            required
            placeholder="Size(Acreage)"
            v-model="size"
            v-validate="modelValidations.size"
            :error="getError('size')"
          >
          </base-input>
        </div>
        <div class="col-sm-10">
          <div class="row">
            <label>Property Status</label>
          </div>
          <el-select
            class="select-primary"
            size="large"
            name="propertyStatus"
            placeholder="Property Status"
            v-model="propertyStatus"
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
      counties: [],
      states: [],
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
          decimal: true,
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
    async fetchCounties() {
      this.loading = true;
      let endpoint = `/api/v1/county/?search=${this.state}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.counties = res.data.results;
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
      }
    },
    async fetchStates() {
      this.loading = true;
      let endpoint = `/api/v1/state/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.states = res.data.results;
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
        console.error(err);
      }
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
  mounted() {
    this.fetchStates();
  },
};
</script>
<style></style>
