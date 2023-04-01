<template>
  <div class="col-md-12">
    <div class="col-xs-12">
      <b-btn
        class="btn btn-success"
        :disabled="loading"
        @click="addAcquisitionRow"
      >
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
            <base-input
              label="Possible offer"
              name="Possible offer"
              v-model="item.possible_offer"
              v-validate="'required'"
              :error="getError('Possible offer')"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Approved amount from client"
              name="Approved amount from client"
              v-model="item.approved_amount_from_client"
              v-validate="modelValidations.approved_amount_from_client"
              :error="getError('Approved amount from client')"
            >
              <el-select
                class="select-primary"
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
              v-validate="modelValidations.seller_lead_name"
              :error="getError('Seller Lead name')"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Minimum amount"
              name="minimum_amount"
              v-model="item.minimum_amount"
              v-validate="modelValidations.minimum_amount"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Maximum amount"
              name="maximum_amount"
              v-model="item.maximum_amount"
              v-validate="modelValidations.maximum_amount"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Amount closed deal"
              name="amount_closed_deal"
              v-model="item.amount_closed_deal"
              v-validate="modelValidations.amount_closed_deal"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Deal status"
              name="Deal Status"
              v-model="item.deal_status"
              v-validate="'required'"
              :error="getError('Deal Status')"
            >
              <el-select
                class="select-primary"
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

export default {
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
      acquisitions: [],
      clientUser: {},
      user: {},
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
      modelValidations: {
        possible_offer: {
          required: true,
        },
        approved_amount_from_client: {
          required: true,
        },
        seller_lead_name: {
          required: true,
        },
        minimum_amount: {
          required: true,
        },
        maximum_amount: {
          required: true,
        },
        amount_closed_deal: {
          required: true,
        },
        deal_status: {
          required: true,
        },
        assigned_sales_team: {
          required: true,
        },
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    ...mapActions("acquisition", ["saveAcquisitions"]),
    ...mapActions("user", ["fetchClientUser", "fetchUser"]),
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        await this.saveAcquisitions(this.acquisitions)
          .then(() => {
            this.success = true;
            if (this.success) {
              this.acquisitions = [];
              this.fetch();
            }
            setTimeout(() => (this.success = false), 2000);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast("Error", {
        title: `Error`,
        variant: variant,
        solid: true,
      });
    },
    successMessage() {
      return "Successfully added an Acquisition data.";
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
        client_code: this.clientUser.client_code,
        possible_offer: "",
        approved_amount_from_client: "",
        minimum_amount: "",
        maximum_amount: "",
        amount_closed_deal: "",
        deal_status: null,
        assigned_sales_team: null,
        notes: "",
      });
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
        this.loading = true;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.loading = false;
            this.fetchClient(this.user.id);
          } else {
            this.loading = false;
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        this.loading = false;
        console.error(err.response.data);
      }
    },
  },
  computed: {
    ...mapGetters({
      client: "user/clientUser",
    }),
  },
  mounted() {
    setTimeout(() => {
      this.fetchMe();
    }, 200);
    // this.getUser();
  },
};
</script>
    