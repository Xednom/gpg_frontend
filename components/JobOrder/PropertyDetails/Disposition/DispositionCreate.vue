<template>
  <div class="col-md-12">
    <div class="col-xs-12">
      <b-btn
        class="btn btn-success"
        :disabled="loading"
        @click="addDispositionRow"
      >
        Add Disposition
      </b-btn>
    </div>
    <form @submit.prevent="save">
      <card
        v-for="(item, index) in dispositions"
        :key="index"
        title="Disposition"
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
              label="Selling price"
              name="Selling price"
              v-model="item.selling_price"
              v-validate="'required'"
              :error="getError('Selling price')"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Discounted cash price"
              name="Discounted cash price"
              v-model="item.discounted_cash_price"
              v-validate="modelValidations.discounted_cash_price"
              :error="getError('Discounted cash price')"
            >
              <el-select
                class="select-primary"
                size="large"
                placeholder="Discounted cash price"
                v-model="item.discounted_cash_price"
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
              label="Selling price minimum"
              name="Selling price minimum"
              v-model="item.selling_price_minimum"
              v-validate="modelValidations.minimum_amount"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Selling price maximum"
              name="Selling price maximum"
              v-model="item.selling_price_maximum"
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
              v-validate="modelValidations.deal_status"
              :error="getError('Deal Status')"
            >
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
            <label>Financed terms</label>
            <textarea
              name="notes"
              class="form-control"
              type="text"
              v-model="item.financed_terms"
            >
            </textarea>
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
            :disabled="dispositions.length == 0"
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
    apn: {
      type: String,
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      dispositions: [],
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
    ...mapActions("disposition", ["saveDispositions"]),
    ...mapActions("user", ["fetchClientUser", "fetchUser"]),
    async save() {
      let isValidForm = await this.$validator.validateAll();
      console.log("Disposition:", this.dispositions);
      if (isValidForm) {
        await this.saveDispositions(this.dispositions)
          .then(() => {
            this.success = true;
            if (this.success) {
              this.dispositions = [];
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
      this.$bvToast.toast("Errpr", {
        title: `Error`,
        variant: variant,
        solid: true,
      });
    },
    successMessage() {
      return "Successfully added a Property Price data.";
    },
    addDispositionRow: function () {
      this.dispositions.push({
        property_detail: this.propertyDetail.id,
        apn: this.propertyDetail.apn,
        client_code: this.clientUser.client_code,
        selling_price: this.selling_price,
        discounted_cash_price: "",
        selling_price_minimum: "",
        selling_price_maximum: "",
        amount_closed_deal: "",
        deal_status: null,
        assigned_sales_team: null,
        financed_terms: "",
        notes: "",
      });
    },
    deleteCounterOffer(e, index) {
      const vm = this;
      vm.counter_offer_amount.splice(index, 1);
    },
    deleteBuyerRow(e, index) {
      this.dispositions.splice(index, 1);
    },
    async fetchClient(id) {
      let endpoint = `/api/v1/client/${id}/`;
      await this.$axios
        .get(endpoint)
        .then((res) => {
          this.clientUser = res.data;
          console.warn("Client: ", this.clientUser.client_code);
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    },
    async fetchMe() {
      let endpoint = `/auth/users/me/`;
      this.loading = true;
      await this.$axios
        .get(endpoint)
        .then((res) => {
          console.info("User:", res)
          this.user = res.data;
          this.loading = false;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            console.warn("User: ", this.user);
            console.warn("Client: ", this.clientUser);
            this.fetchClient(this.user.id);
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
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
  },
};
</script>
      