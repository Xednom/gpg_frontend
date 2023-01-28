<template>
  <div>
    <card>
      <h5 class="info-text">Property Details</h5>
      <div class="row justify-content-center mt-5">
        <div class="form-row"></div>
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
            filterable
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
            filterable
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
            class="mt-2"
            name="size"
            required
            placeholder="Size(Acreage)"
            v-model="size"
            v-validate="modelValidations.size"
            :error="getError('size')"
          >
          </base-input>
        </div>
        <div class="col-sm-5">
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
        <div class="col-sm-5">
          <div v-if="this.$auth.user.designation_category == 'staff'">
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
          <base-input
            label="Property Owner"
            class="mt-2"
            name="Property owner"
            placeholder="Property Owner"
            v-model="propertyOwner"
          >
          </base-input>
        </div>
        <div class="col-md-10">
          <div class="row">
            <label>Property complete address</label>
          </div>
          <textarea
            class="form-control"
            placeholder="Description"
            v-model="propertyCompleteAddress"
          >
          </textarea>
        </div>
        <div class="col-sm-5"></div>
      </div>
    </card>
  </div>
</template>
<script>
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
import { Select, Option } from "element-ui";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { debounce } from "lodash";
import Card from "~/components/Cards/Card.vue";
export default {
  mixins: [CreatePropertyDetailMixin],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
  },
  inject: ["$validator"],
  data() {
    return {
      selectedClientCode: "",
      clientCodes: [],
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
          { value: "interested_to_purchase", label: "Interested to purchase" },
          { value: "need_of_research", label: "In need of research" },
          { value: "not_applicable", label: "Not applicable" },
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
    getClientCode: debounce(function () {
      this.$axios
        .get(`/api/v1/client-code/?search=${this.query}`)
        .then((res) => {
          this.clientCodes = res.data.results;
        })
        .catch((err) => {
          console.log(err);
        });
    }, 700),
    async fetchCounties() {
      let endpoint = `/api/v1/county/?search=${this.state}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.counties = res.data;
        });
      } catch (err) {}
    },
    async fetchStates() {
      let endpoint = `/api/v1/state/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.states = res.data;
        });
      } catch (err) {
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
    query: {
      get() {
        return this.$store.getters["propertyDetail/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
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
    propertyOwner: {
      get() {
        return this.$store.getters["propertyDetail/property_owner"];
      },
      set(value) {
        this.setBasicStoreValue("property_owner", value);
      },
    },
    propertyCompleteAddress: {
      get() {
        return this.$store.getters["propertyDetail/property_complete_address"];
      },
      set(value) {
        this.setBasicStoreValue("property_complete_address", value);
      },
    },
  },
  mounted() {
    this.fetchStates();
  },
};
</script>
<style scoped></style>
