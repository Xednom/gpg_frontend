<template>
  <div class="col-md-12">
    <base-alert v-if="success" type="success" dismissible>
      <span>
        {{ successMessage() }}
      </span>
    </base-alert>
    <form @submit.prevent="save">
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input v-model="asking_price" label="Asking price">
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="Cash terms" v-model="cash_terms">
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <div class="row">
            <label>Property price Status </label>
          </div>
          <el-select
            class="select-primary"
            reqiured
            size="large"
            name="propertyStatus"
            placeholder="Property Status"
            v-model="price_status"
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

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Finance terms</label>
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="finance_terms"
          >
          </textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Other terms</label>
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="other_terms"
          >
          </textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Notes</label>
          <textarea
            class="form-control"
            placeholder="Job description"
            v-model="notes"
          >
          </textarea>
        </div>
      </div>
      <div slot="footer">
        <div class="pull-right mt-5">
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
      </div>
    </form>
  </div>
</template>

<script>
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { mapActions } from "vuex";
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";

export default {
  mixins: [CreatePropertyDetailMixin],
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    price: {
      type: Object,
      decription: "Property price data id",
    },
    user: {
        type: Object,
        description: "User data"
    },
    fetch: {
      type: Function,
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "deactivate", label: "Deactivate" },
        ],
      },
    };
  },
  methods: {
    ...mapActions("propertyDetail", ["createPropertyPrice", "reset"]),
    async save() {
      const payload = {
        property_detail: this.price.id,
        user: this.user.id,
        asking_price: this.asking_price,
        cash_terms: this.cash_terms,
        finance_terms: this.finance_terms,
        other_terms: this.other_terms,
        price_status: this.price_status,
        notes: this.notes,
      };
      await this.createPropertyPrice(payload).then(() => {
        this.success = true;
        if (this.success) {
          this.fetch();
          this.reset();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully added a Property Price data.";
    },
  },
  computed: {
    asking_price: {
      get() {
        return this.$store.getters["propertyDetail/asking_price"];
      },
      set(value) {
        this.setBasicStoreValue("asking_price", value);
      },
    },
    cash_terms: {
      get() {
        return this.$store.getters["propertyDetail/cash_terms"];
      },
      set(value) {
        this.setBasicStoreValue("cash_terms", value);
      },
    },
    finance_terms: {
      get() {
        return this.$store.getters["propertyDetail/finance_terms"];
      },
      set(value) {
        this.setBasicStoreValue("finance_terms", value);
      },
    },
    other_terms: {
      get() {
        return this.$store.getters["propertyDetail/other_terms"];
      },
      set(value) {
        this.setBasicStoreValue("other_terms", value);
      },
    },
    price_status: {
      get() {
        return this.$store.getters["propertyDetail/price_status"];
      },
      set(value) {
        this.setBasicStoreValue("price_status", value);
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
  },
};
</script>
