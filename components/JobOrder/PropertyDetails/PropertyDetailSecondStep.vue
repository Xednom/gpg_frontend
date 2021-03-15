<template>
  <div>
    <h5 class="info-text">
      Property Price
    </h5>
    <div class="row justify-content-center mt-5">
      <div class="col-sm-5">
        <base-input
          name="asking_price"
          required
          placeholder="Asking Price"
          v-model="askingPrice"
          v-validate="modelValidations.askingPrice"
          :error="getError('asking_price')"
          addon-left-icon="tim-icons icon-single-02"
        >
        </base-input>

        <base-input
          name="cash_terms"
          required
          placeholder="Cash Terms"
          v-model="cashTerms"
          v-validate="modelValidations.cashTerms"
          :error="getError('cash_terms')"
          addon-left-icon="tim-icons icon-email-85"
        >
        </base-input>
      </div>
      <div class="col-sm-5">
        <base-input
          name="finance_terms"
          required
          placeholder="Finance terms"
          v-model="financeTerms"
          v-validate="modelValidations.financeTerms"
          :error="getError('finance_terms')"
          addon-left-icon="tim-icons icon-caps-small"
        >
        </base-input>

        <base-input
          name="other_terms"
          required
          placeholder="Other Terms"
          v-model="otherTerms"
          v-validate="modelValidations.otherTerms"
          :error="getError('other_terms')"
          addon-left-icon="tim-icons icon-mobile"
        >
        </base-input>

        <el-select
          class="select-primary"
          reqiured
          size="large"
          name="price_status"
          placeholder="Property Status"
          v-model="priceStatus"
          v-validate="modelValidations.priceStatus"
          :error="getError('price_status')"
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
      <div class="col-sm-10">
        <base-input
          name="notes"
          placeholder="Notes"
          v-model="notes"
          v-validate="modelValidations.notes"
          :error="getError('notes')"
          addon-left-icon="tim-icons icon-square-pin"
        >
        </base-input>
      </div>
    </div>
  </div>
</template>
<script>
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
import {Select, Option} from "element-ui";
export default {
  mixins: [CreatePropertyDetailMixin],
  components: {
      [Select.name]: Select,
      [Option.name]: Option
  },
  data() {
    return {
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
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "change", label: "Change" },
          { value: "active", label: "Active" },
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
    askingPrice: {
      get() {
        return this.$store.getters["propertyDetail/asking_price"];
      },
      set(value) {
        this.setBasicStoreValue("asking_price", value);
      },
    },
    cashTerms: {
      get() {
        return this.$store.getters["propertyDetail/cash_terms"];
      },
      set(value) {
        this.setBasicStoreValue("cash_terms", value);
      },
    },
    financeTerms: {
      get() {
        return this.$store.getters["propertyDetail/finance_terms"];
      },
      set(value) {
        this.setBasicStoreValue("finance_terms", value);
      },
    },
    otherTerms: {
      get() {
        return this.$store.getters["propertyDetail/other_terms"];
      },
      set(value) {
        this.setBasicStoreValue("other_terms", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["propertyDetail/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      },
    },
    priceStatus: {
      get() {
        return this.$store.getters["propertyDetail/price_status"];
      },
      set(value) {
        this.setBasicStoreValue("price_status", value);
      },
    },
  },
};
</script>
<style></style>
