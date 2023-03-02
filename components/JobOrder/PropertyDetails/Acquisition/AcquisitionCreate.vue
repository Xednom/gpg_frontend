<template>
  <div class="col-md-12">
    <div class="col-xs-12">
      <b-btn class="btn btn-success" @click="addAcquisitionRow">
        Add Acquisition
      </b-btn>
    </div>
    <form @submit.prevent="save">
      <card
        v-for="(item, index) in acquisitions"
        :key="index"
        title="Acquisition"
      >
        <div class="col-md-12">
          <b-btn
            class="btn btn-danger btn-sm float-right"
            @click="deleteBuyerRow($event, index)"
          >
            <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
          </b-btn>
        </div>
        <div class="row justify-content-center mt-5">
          <div class="col-sm-5">
            <base-input label="Possible offer" v-model="item.possible_offer">
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Approved amount from client"
              v-model="item.approved_amount_from_client"
            >
              <el-select
                class="select-primary"
                reqiured
                size="large"
                placeholder="Approved amount from Client"
                v-model="item.approved_amount_from_client"
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
              label="Seller Lead name"
              name="Seller Lead name"
              v-model="item.seller_lead_name"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Minimum amount"
              name="Minimum amount"
              v-model="item.minimum_amount"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Maximum amount"
              name="Maximum amount"
              v-model="item.maximum_amount"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Amount closed deal"
              name="Amount closed deal"
              v-model="item.amount_closed_deal"
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
                v-model="item.deal_status"
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
              v-model="item.notes"
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
            :disabled="acquisitions.length == 0"
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
import { mapActions, mapGetters } from "vuex";
import AcquisitionMixin from "@/mixins/Acquisition.js";

export default {
  mixins: [AcquisitionMixin],
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
    apn: {
      type: String,
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      acquisitions: [],
      clientUser: {},
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "deactivate", label: "Deactivate" },
        ],
      },
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
    };
  },
  methods: {
    ...mapActions("acquisition", ["saveAcquisitions"]),
    ...mapActions("user", ["fetchClientUser", "fetchUser"]),
    async save() {
      await this.saveAcquisitions(this.acquisitions).then(() => {
        this.success = true;
        if (this.success) {
          this.acquisitions = [];
          this.fetch();
        }
        setTimeout(() => (this.success = false), 2000);
      });
    },
    successMessage() {
      return "Successfully added a Property Price data.";
    },
    // async getUser() {
    //   this.fetchUser();

    //   this.fetchClientUser(this.user.id);

    //   console.info("Client info: ", this.client);
    // },
    addAcquisitionRow: function () {

      this.acquisitions.push({
        property_detail: this.propertyDetail.id,
        apn: this.propertyDetail.apn,
        client_code: this.client.client_code,
        possible_offer: "",
        approved_amount_from_client: "",
        minimum_amount: "",
        maximum_amount: "",
        amount_closed_deal: "",
        deal_status: null,
        assigned_sales_team: null,
        notes: "",
      });

      console.warn("Get user: ", this.getUser);
      console.info("Get code: ", this.clientCode)
    },
    deleteCounterOffer(e, index) {
      const vm = this;
      vm.counter_offer_amount.splice(index, 1);
    },
    deleteBuyerRow(e, index) {
      this.acquisitions.splice(index, 1);
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
  computed: {
    ...mapGetters({
      client: "user/clientUser",
      user: "user/user",
    }),
    clientCode() {
      this.fetchUser();
      this.fetchClientUser(this.user.id);
      return this.client;
    },
    getUser() {
      this.fetchUser();

      this.fetchClientUser(this.user.id);

      console.info("Client info: ", this.client);

      return this.client
    },
  },
  mounted() {
    // this.getUser();
  },
};
</script>
    