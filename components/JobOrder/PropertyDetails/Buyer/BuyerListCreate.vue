<template>
  <div class="col-md-12">
    <base-alert v-if="success" type="success" dismissible>
      <span>
        {{ successMessage() }}
      </span>
    </base-alert>
    <form @submit.prevent="save">
      <div class="form-row"></div>

      <div class="form-row"></div>
      <card>
        <h5 slot="header" class="title">Buyer List</h5>
        <div class="col-xs-12">
          <b-btn class="btn btn-success" @click="addBuyerRow">
            Add Buyer data
          </b-btn>
        </div>
        <card v-for="(item, index) in buyerList" :key="index">
          <div class="col-md-12">
            <b-btn
              class="btn btn-danger btn-sm float-right"
              @click="deleteBuyerRow($event, index)"
            >
              <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
            </b-btn>
          </div>
          <div class="row justify-content-center mt-5">
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input label="Date lead added">
                  <el-date-picker
                    v-model="item.date_lead_added"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Choose date"
                  >
                  </el-date-picker>
                </base-input>
              </div>
            </div>

            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input label="Lead type">
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="leadType"
                    placeholder="Lead type"
                    v-model="item.lead_type"
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
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input
                  label="Buyer Lead name"
                  name="Buyer Lead name"
                  placeholder="Buyer lead name"
                  v-model="item.Buyer_lead_name"
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input
                  label="Phone number"
                  name="Phone number"
                  placeholder="Phone number"
                  v-model="item.phone_number"
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input
                  label="Email"
                  name="Email"
                  placeholder="Email"
                  v-model="item.email"
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input label="Lead status">
                  <el-select
                    class="select-primary"
                    reqiured
                    size="large"
                    name="leadStatus"
                    placeholder="Lead status"
                    v-model="item.lead_status"
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
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input
                  label="Buyer offer"
                  name="Buyer offer"
                  placeholder="Buyer offer"
                  v-model="item.buyer_offer"
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
                  v-model="item.total_minutes_consumed"
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input
                  label="Notes"
                  name="Notes"
                  placeholder="Notes"
                  v-model="item.notes"
                >
                </base-input>
              </div>
            </div>
            <!-- <div class="col-md-12">
                  <div class="col-xs-12">
                    <b-btn class="btn btn-success" @click="addCounterOffer">
                      Add counter offer
                    </b-btn>
                  </div>
                  <card
                    v-for="(counter, index) in item.counter_offer_amount"
                    :key="index"
                    title="Counter Offer"
                  >
                    <b-btn
                      class="btn btn-danger btn-sm float-right"
                      @click="deleteCounterOffer($event, index)"
                    >
                      <i class="tim-icons icon-simple-remove"></i>
                    </b-btn>
                    <div class="col-sm-5">
                      <base-input
                        label="Amount"
                        name="Amount"
                        placeholder="Amount"
                        v-model="counter.amount"
                      >
                      </base-input>
                    </div>
                  </card>
                </div> -->
          </div>
        </card>
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
            :disabled="buyerList.length == 0"
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
import BuyerListMixin from "@/mixins/BuyerList.js";

export default {
  mixins: [BuyerListMixin],
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  props: {
    propertyDetail: {
      type: Object,
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
      clientUser: {},
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "deactivate", label: "Deactivate" },
        ],
      },
      buyerList: [],
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
    };
  },
  methods: {
    ...mapActions("buyerList", ["saveBuyerLists"]),
    async save() {
      console.warn("Seller List: ", this.buyerList);
      await this.saveBuyerLists(this.buyerList).then(() => {
        this.success = true;
        if (this.success) {
          this.buyerList = [];
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully added a Property Price data.";
    },
    addBuyerRow: function () {
      this.buyerList.push({
        property_detail: this.propertyDetail.id,
        apn: this.propertyDetail.apn,
        client_code: this.clientUser.client_code,
        date_lead_added: "",
        lead_type: null,
        buyer_lead_name: "",
        phone_number: "",
        email: "",
        lead_status: null,
        buyer_offer: "",
        total_minutes_consumed: "",
        notes: "",
        counter_offer_amount: [],
      });
    },
    addCounterOffer() {
      const vm = this;
      // _.forEach(vm.buyerLists, function (item) {
      //   vm.counter_offer_amount.push({
      //     amount: "",
      //   });
      // });
      vm.counter_offer_amount.push({
        amount: "",
      });
      console.warn(vm.counter_offer_amount);
    },
    deleteCounterOffer(e, index) {
      const vm = this;
      vm.counter_offer_amount.splice(index, 1);
    },
    deleteBuyerRow(e, index) {
      this.buyerList.splice(index, 1);
    },
    async fetchClient(id) {
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async fetchMe() {
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.user.id);
          } else {
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
  },
  mounted() {
    this.fetchMe();
  },
};
</script>
    