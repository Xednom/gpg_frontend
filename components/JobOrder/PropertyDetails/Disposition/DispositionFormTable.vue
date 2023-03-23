<template>
  <div class="col-md-12">
    <card @change="onChanged">
      <h5 slot="header" class="title">Disposition list</h5>
      <div class="col-xs-12">
        <b-btn class="btn btn-success" @click="addDispositionRow">
          Add Disposition
        </b-btn>
      </div>
      <card
        v-for="(item, index) in items"
        :key="index"
        title="Acquisition list"
      >
        <div class="col-md-12">
          <b-btn
            class="btn btn-danger btn-sm float-right"
            @click="deleteDispositionRow($event, index)"
          >
            <i class="tim-icons icon-simple-remove"> {{ item.id }}</i>
          </b-btn>
        </div>
        <div class="row justify-content-center mt-5">
          <div class="col-sm-5">
            <base-input label="Selling price" v-model="item.selling_price">
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Discounted cash price"
              v-model="item.discounted_cash_price"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Selling price minimum"
              v-model="item.selling_price_minimum"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <base-input
              label="Seller price maximum"
              name="Seller price maximum"
              v-model="item.selling_price_maximum"
            >
            </base-input>
          </div>
          <div class="col-sm-5">
            <label>Financed terms</label>
            <textarea
              name="notes"
              class="form-control"
              type="text"
              v-model="item.financed_terms"
            >
            </textarea>
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
    </card>
  </div>
</template>
    
    <script>
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { mapActions, mapGetters } from "vuex";
import DispositionMixin from "@/mixins/Disposition.js";

export default {
  mixins: [DispositionMixin],
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
    items: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      dispositions: [],
      clientUser: {},
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
    ...mapActions("user", ["fetchClientUser", "fetchUser"]),
    async save() {
      let isValidForm = await this.$validator.validateAll();
      console.log("Valid form: ", isValidForm);
      if (isValidForm) {
        await this.saveDispositions(this.Dispositions)
          .then(() => {
            this.success = true;
            if (this.success) {
              this.Dispositions = [];
              this.fetch();
            }
            setTimeout(() => (this.success = false), 2000);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    onChanged() {
      this.$emit("change", this.items);
      console.log("on changed: ", this.items)
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
    // async getUser() {
    //   this.fetchUser();

    //   this.fetchClientUser(this.user.id);

    //   console.info("Client info: ", this.client);
    // },
    addDispositionRow() {
      this.items.push({
        selling_price: "",
        discounted_cash_price: "",
        selling_price_minimum: "",
        selling_price_maximum: "",
        financed_terms: "",
        amount_closed_deal: "",
        deal_status: "",
        assigned_sales_team: null,
        notes: "",
      });
    },
    deleteCounterOffer(e, index) {
      const vm = this;
      vm.counter_offer_amount.splice(index, 1);
    },
    deleteDispositionRow(e, index) {
      this.items.splice(index, 1);
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

      return this.client;
    },
  },
  mounted() {
    // this.getUser();
  },
};
</script>
        