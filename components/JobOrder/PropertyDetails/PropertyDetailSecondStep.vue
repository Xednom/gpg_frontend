<template>
  <div>
    <card>
      <h5 class="info-text">
        Property Price
      </h5>
      <div class="row justify-content-center mt-5">
        <div class="col-sm-5">
          <label>Asking price</label>
          <textarea
            class="form-control"
            type="text"
            v-model="askingPrice"
            v-validate="'required'"
            :error="getError('asking_price')"
            required
          >
          </textarea>
        </div>
        <div class="col-sm-5">
          <label>Cash terms</label>
          <textarea
            class="form-control"
            type="text"
            v-model="cashTerms"
            v-validate="'required'"
            :error="getError('cash_terms')"
            required
          >
          </textarea>
        </div>
        <div class="col-sm-5 mt-3">
          <label>Finance Terms</label>
          <textarea
            name="finance_terms"
            class="form-control"
            type="text"
            v-model="financeTerms"
            v-validate="'required'"
            :error="getError('finance_terms')"
            required
          >
          </textarea>
        </div>
        <div class="col-sm-5 mt-3">
          <label>Other terms</label>
          <textarea
            name="other_terms"
            class="form-control"
            type="text"
            v-model="otherTerms"
            v-validate="'required'"
            :error="getError('other_terms')"
            required
          >
          </textarea>
        </div>
        <div class="col-sm-10 mt-3">
          <label>Notes</label>
          <textarea
            name="notes"
            class="form-control"
            type="text"
            v-model="notes"
            v-validate="'required'"
            :error="getError('notes')"
            required
          >
          </textarea>
        </div>
        <div class="col-sm-10 status">
          <div class="row">
            <label>Price status</label>
          </div>
          <el-select
            class="select-primary"
            size="large"
            name="price_status"
            v-model="priceStatus"
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
      </div>
    </card>
  </div>
</template>
<script>
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
import { Select, Option } from "element-ui";
export default {
  mixins: [CreatePropertyDetailMixin],
  inject: ["$validator"],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
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
<style scoped>
.status {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
