<template>
    <div class="col-md-12">
      <base-alert v-if="success" type="success" dismissible>
        <span>
          {{ successMessage() }}
        </span>
      </base-alert>
      <form @submit.prevent="save">
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <label>Date lead added</label>
            <el-date-picker
              v-model="date_lead_added"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="Choose date"
              @input="setItem"
            >
            </el-date-picker>
          </div>
        </div>
  
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <div class="row"><label>Lead type</label></div>
            <el-select
              class="select-primary"
              required
              size="large"
              name="leadType"
              placeholder="Lead type"
              v-model="lead_type"
              @input="setItem"
            >
              <el-option
                v-for="option in leadTypeChoices.status"
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
            <label>Buyer lead name</label>
            <base-input
              name="Buyer Lead name"
              placeholder="Buyer lead name"
              v-model="buyer_lead_name"
            >
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <label>Phone number</label>
            <base-input
              name="Phone number"
              placeholder="Phone number"
              v-model="phone_number"
            >
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <label>Email</label>
            <base-input name="Email" placeholder="Email" v-model="email">
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <div class="row"><label>Lead Status</label></div>
            <el-select
              class="select-primary"
              required
              size="large"
              name="leadStatus"
              placeholder="Lead status"
              v-model="lead_status"
              @input="setItem"
            >
              <el-option
                v-for="option in leadStatusChoices.status"
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
            <base-input
              label="Buyer offer"
              name="Buyer offer"
              placeholder="Buyer offer"
              v-model="buyer_offer"
            >
            </base-input>
          </div>
        </div>
        <div class="form-row">
          <div class="col-sm-12 col-md-12">
            <base-input
              label="Total minutes consumed"
              name="Total minutes consumed"
              placeholder="Total minutes consumed"
              v-model="total_minutes_consumed"
            >
            </base-input>
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
        id: "",
        apn: "",
        client_code: "",
        date_lead_added: "",
        lead_type: "",
        buyer_lead_name: "",
        phone_number: "",
        email: "",
        lead_status: "",
        buyer_offer: "",
        counter_offer_amount: [],
        lead_assigned_to: null,
        total_minutes_consumed: "",
        notes: "",
      };
    },
    methods: {
      ...mapActions("buyerList", ["updateBuyerList"]),
      async fetchBuyerList(id) {
        this.$store
          .dispatch("buyerList/fetchBuyerList", this.itemId)
          .then(() => {
            console.warn("Buyer info: ", this.buyerList);
            console.warn("item id: ", this.itemId);
          });
      },
      async save() {
        const payload = {
          id: this.id,
          apn: this.apn,
          client_code: this.client_code,
          date_lead_added: this.date_lead_added,
          lead_type: this.lead_type,
          buyer_lead_name: this.buyer_lead_name,
          phone_number: this.phone_number,
          email: this.email,
          lead_status: this.lead_status,
          buyer_offer: this.buyer_offer,
          counter_offer_amount: this.counter_offer_amount,
          lead_assigned_to: this.lead_assigned_to,
          total_minutes_consumed: this.total_minutes_consumed,
          notes: this.notes,
        };
        await this.updateBuyerList(payload).then(() => {
          this.success = true;
          if (this.success) {
            this.fetch();
          }
          setTimeout(() => (this.success = false), 2000);
        });
      },
      successMessage() {
        return "Successfully updated this Seller list data.";
      },
    },
    computed: {
      setItem() {
        const vm = this;
        const items = [this.$store.getters["buyerList/buyerList"]];
        _.forEach(items, function (item) {
          vm.id = item.id;
          vm.apn = item.apn;
          vm.client_code = item.client_code;
          vm.date_lead_added = item.date_lead_added;
          vm.lead_type = item.lead_type;
          vm.buyer_lead_name = item.buyer_lead_name;
          vm.phone_number = item.phone_number;
          vm.email = item.email;
          vm.lead_status = item.lead_status;
          vm.buyer_offer = item.buyer_offer;
          vm.counter_offer_amount = item.counter_offer_amount;
          vm.lead_assigned_to = item.lead_assigned_to;
          vm.total_minutes_consumed = item.total_minutes_consumed;
          vm.notes = item.notes;
        });
      },
    },
    mounted() {
        console.warn("Item id: ", this.itemId)
    }
  };
  </script>
    