<template>
  <div>
    <card>
      <h5 class="info-text">
        Property Price
      </h5>
      <div
        class="row justify-content-center mt-5"
        v-for="(item, index) in this.propertyPriceStatuses"
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
        <div class="col-sm-5 col-md-3">
          <base-input
            label="Finance terms"
            name="financeTerms"
            required
            v-model="item.finance_terms"
            v-validate="modelValidations.financeTerms"
            :error="getError('financeTerms')"
          >
          </base-input>
        </div>
        <div class="col-sm-5 col-md-3">
          <base-input
            label="Other terms"
            name="otherTerms"
            required
            v-model="item.other_terms"
            v-validate="modelValidations.otherTerms"
            :error="getError('otherTerms')"
          >
          </base-input>
        </div>
        <div class="col-sm-12 status">
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
      saving: false,
      property_price_statuses: [
        {
          asking_price: "",
          cash_terms: "",
          finance_terms: "",
          other_terms: "",
          notes: "",
          price_status: ""
        }
      ],
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
    addRow: function() {
      this.propertyPriceStatuses.push({
        asking_price: "",
        cash_terms: "",
        finance_terms: "",
        other_terms: "",
        price_status: "",
        notes: "",
      });
      console.log(this.propertyPriceStatuses)
    },
    deleteRow: function(e, item) {
      e.preventDefault();
      var index = this.propertyPriceStatuses
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(item);
      this.propertyPriceStatuses.splice(index, 1);
    },
  },
  computed: {
    propertyPriceStatuses: {
      get() {
        return this.$store.getters["propertyDetail/property_price_statuses"];
      },
      set(value) {
        this.setBasicStoreValue("property_price_statuses", value);
      },
    },
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
  mounted() {
    this.addRow();
    console.log(this.propertyPriceStatuses);
  },
};
</script>
<style scoped>
.status {
  margin-top: 20px;
  margin-bottom: 20px;
}

.property-add {
  float: right;
}
</style>
