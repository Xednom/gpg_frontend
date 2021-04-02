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
          <base-input v-model="price.asking_price" label="Asking price">
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="Cash terms" v-model="price.cash_terms">
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
            v-model="price.price_status"
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
            v-model="price.finance_terms"
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
            v-model="price.other_terms"
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
            v-model="price.notes"
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

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    price: {
      type: Object,
      decription: "Property price data",
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
    ...mapActions("propertyDetail", ["updatePropertyPrice"]),
    async save() {
      const payload = {
        id: this.price.id,
        asking_price: this.price.asking_price,
        cash_terms: this.price.cash_terms,
        finance_terms: this.price.finance_terms,
        other_terms: this.price.other_terms,
        price_status: this.price.price_status,
        notes: this.price.notes,
      };
      await this.updatePropertyPrice(payload).then(() => {
        this.success = true;
        if (this.success) {
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully updated this Property Price data.";
    },
  },
};
</script>
