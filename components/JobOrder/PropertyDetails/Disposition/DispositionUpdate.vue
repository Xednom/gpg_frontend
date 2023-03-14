<template>
  <div class="col-md-12">
    <base-alert v-if="success" type="success" dismissible>
      <span>
        {{ successMessage() }}
      </span>
    </base-alert>
    <form @submit.prevent="save">
      <card>
        <div class="row justify-content-center mt-5">
          <div class="col-sm-5">
            <base-input label="Selling Price" v-model="selling_price">
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Discounted cash price"
              v-model="discounted_cash_price"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Selling price minimum"
              name="Selling price minimum"
              v-model="selling_price_minimum"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Selling price maximum"
              name="Selling price maximum"
              v-model="selling_price_maximum"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Amount closed deal"
              name="Amount closed deal"
              v-model="amount_closed_deal"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input label="Deal status">
              <el-select
                class="select-primary"
                required
                size="large"
                placeholder="Deal status"
                v-model="deal_status"
                @input="setItem"
              >
                <el-option
                  v-for="option in dealStatusChoices.status"
                  class="select-primary"
                  :value="option.value"
                  :label="option.label"
                  :key="option.label"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-sm-12">
            <label>Notes</label>
            <textarea
              name="notes"
              class="form-control"
              type="text"
              v-model="notes"
            >
            </textarea>
          </div>
        </div>
      </card>
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
import { mapGetters, mapActions } from "vuex";

import _ from "lodash";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    itemId: {
      type: Number,
    },
    fetch: {
      type: Function,
    },
    items: {
      type: Function
    }
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      dealStatusChoices: {
        placeholder: "",
        status: [
          { value: "pending", label: "Pending" },
          { value: "sold", label: "Sold" },
          { value: "on_hold", label: "On hold" },
          { value: "on_going_negotiation", label: "On going negotiation" },
          { value: "drop_deal", label: "Drop deal" },
        ],
      },
      id: "",
      apn: "",
      client_code: "",
      selling_price: "",
      discounted_cash_price: "",
      selling_price_minimum: "",
      selling_price_maximum: "",
      financed_terms: "",
      amount_closed_deal: "",
      deal_status: "",
      assigned_sales_team: "",
      notes: "",
    };
  },
  methods: {
    ...mapActions("disposition", ["updateDisposition"]),
    async fetchDisposition(id) {
      this.$store
        .dispatch("disposition/fetchDisposition", this.itemId)
        .then(() => {
          console.warn("disposition info: ", this.disposition);
          console.warn("item id: ", this.itemId);
        });
    },
    async save() {
      const payload = {
        id: this.id,
        apn: this.apn,
        client_code: this.client_code,
        selling_price: this.selling_price,
        discounted_cash_price: this.discounted_cash_price,
        selling_price_minimum: this.selling_price_minimum,
        selling_price_maximum: this.selling_price_maximum,
        amount_closed_deal: this.amount_closed_deal,
        deal_status: this.deal_status,
        assigned_sales_team: this.assigned_sales_team,
        notes: this.notes,
      };
      console.warn("Payload: ", payload);
      await this.updateDisposition(payload).then(() => {
        this.success = true;
        if (this.success) {
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully updated this Disposition data.";
    },
  },
  computed: {
    setItem() {
      const vm = this;
      const items = [this.$store.getters["disposition/disposition"]];
      console.warn("Items: ", items);
      _.forEach(items, function (item) {
        vm.id = item.id;
        vm.apn = item.apn;
        vm.client_code = item.client_code;
        vm.selling_price = item.selling_price;
        vm.discounted_cash_price = item.discounted_cash_price;
        vm.selling_price_minimum = item.selling_price_minimum;
        vm.selling_price_maximum = item.selling_price_maximum;
        vm.financed_terms = item.financed_terms;
        vm.amount_closed_deal = item.amount_closed_deal;
        vm.deal_status = item.deal_status;
        vm.assigned_sales_team = item.assigned_sales_team;
        vm.notes = item.notes;
      });
    },
  },
  mounted() {
    // setTimeout(() => {
    //     this.items();
    //   }, 500);
  }
};
</script>
      