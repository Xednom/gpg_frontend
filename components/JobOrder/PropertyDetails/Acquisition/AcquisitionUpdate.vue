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
            <base-input label="Possible offer" v-model="possible_offer">
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Approved amount from client"
              v-model="approved_amount_from_client"
            >
              <el-select
                class="select-primary"
                reqiured
                size="large"
                placeholder="Approved amount from Client"
                v-model="approved_amount_from_client"
                @change="setItem"
              >
                <el-option
                  v-for="option in possibleOfferChoices.status"
                  class="select-primary"
                  :value="option.value"
                  :label="option.label"
                  :key="option.label"
                >
                </el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Minimum amount"
              name="Minimum amount"
              v-model="minimum_amount"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Maximum amount"
              name="Maximum amount"
              v-model="maximum_amount"
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
                reqiured
                size="large"
                placeholder="Deal status"
                v-model="deal_status"
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
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      leadTypeChoices: {
        placeholder: "",
        status: [
          { value: null, label: "--Select lead type--" },
          { value: "buyers", label: "Buyers" },
          { value: "sellers", label: "Sellers" },
        ],
      },
      leadStatusChoices: {
        placeholder: "",
        status: [
          { value: "interested", label: "Interested" },
          { value: "not_interested", label: "Not Interested" },
          { value: "dead_lead", label: "Dead lead" },
          { value: "do_not_call_list", label: "Do Not Call List" },
        ],
      },
      possibleOfferChoices: {
        placeholder: "",
        status: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
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
      possible_offer: "",
      approved_amount_from_client: "",
      minimum_amount: "",
      maximum_amount: "",
      amount_closed_deal: "",
      deal_status: "",
      assigned_sales_team: "",
      notes: "",
    };
  },
  methods: {
    ...mapActions("acquisition", ["updateAcquisition"]),
    async fetchAcquisition(id) {
      this.$store
        .dispatch("acquisition/fetchAcquisition", this.itemId)
        .then(() => {
          console.warn("Acquisition info: ", this.acquisition);
          console.warn("item id: ", this.itemId);
        });
    },
    async save() {
      const payload = {
        id: this.id,
        apn: this.apn,
        client_code: this.client_code,
        possible_offer: this.possible_offer,
        approved_amount_from_client: this.approved_amount_from_client,
        minimum_amount: this.minimum_amount,
        maximum_amount: this.maximum_amount,
        amount_closed_deal: this.amount_closed_deal,
        deal_status: this.deal_status,
        assigned_sales_team: this.assigned_sales_team,
        notes: this.notes,
      };
      console.warn("Payload: ", payload)
      await this.updateAcquisition(payload).then(() => {
        this.success = true;
        if (this.success) {
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully updated this Acquisition data.";
    },
  },
  computed: {
    setItem() {
      const vm = this;
      const items = [this.$store.getters["acquisition/acquisition"]];
      _.forEach(items, function (item) {
        vm.id = item.id;
        vm.apn = item.apn;
        vm.client_code = item.client_code;
        vm.possible_offer = item.possible_offer;
        vm.approved_amount_from_client = item.approved_amount_from_client;
        vm.minimum_amount = item.minimum_amount;
        vm.maximum_amount = item.maximum_amount;
        vm.amount_closed_deal = item.amount_closed_deal;
        vm.deal_status = item.deal_status;
        vm.assigned_sales_team = item.assigned_sales_team;
        vm.notes = item.notes;
      });
    },
  },
  mounted() {
    console.warn("Item id: ", this.itemId);
  },
};
</script>
    