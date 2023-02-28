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
        <h5 slot="header" class="title">Seller list</h5>
        <div class="col-xs-12">
          <b-btn class="btn btn-success" @click="addSellerRow">
            Add Seller data
          </b-btn>
        </div>
        <card v-for="(item, index) in sellerList" :key="index">
          <div class="col-md-12">
            <b-btn
              class="btn btn-danger btn-sm float-right"
              @click="deleteSellerRow($event, index)"
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
                  label="Seller Lead name"
                  name="Seller Lead name"
                  placeholder="Seller lead name"
                  v-model="item.seller_lead_name"
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
                  label="Seller Asking Price"
                  name="Seller Asking Price"
                  placeholder="Seller Asking Price"
                  v-model="item.seller_asking_price"
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
            :disabled="sellerList.length == 0"
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
import SellerListMixin from "@/mixins/SellerList.js";

export default {
  mixins: [SellerListMixin],
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
      sellerList: [],
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
    ...mapActions("sellerList", ["saveSellerLists"]),
    async save() {
      console.warn("Seller list: ", this.sellerList);
      await this.saveSellerLists(this.sellerList).then(() => {
        this.success = true;
        if (this.success) {
          this.sellerList = []
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully added a Property Price data.";
    },
    addSellerRow: function () {
      this.sellerList.push({
        property_detail: this.propertyDetail.id,
        apn: this.propertyDetail.apn,
        client_code: this.clientUser.client_code,
        date_lead_added: "",
        lead_type: null,
        seller_lead_name: "",
        phone_number: "",
        email: "",
        lead_status: null,
        seller_asking_price: "",
        counter_offer_amount: [],
      });
      console.log(this.sellerList);
    },
    addCounterOffer() {
      const vm = this;
      // _.forEach(vm.sellerLists, function (item) {
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
    deleteSellerRow(e, index) {
      this.sellerList.splice(index, 1);
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
  