<template>
  <div class="container mt--8">
    <card card-body-classes="table-full-width">
      <div class="col-lg-4 col-md-6 ml-auto mr-auto">
        <center class="mb-5">
          <h1>
            Payment portal
          </h1>
        </center>
        <div class="row">
          <div class="col-md-12">
            <base-input
              label="Amount"
              v-validate="'required'"
              :error="getError('Amount')"
              :required="true"
              name="Amount"
              v-model="amount"
              @keypress="isNumber"
            >
            </base-input>
          </div>
        </div>
        <div class="row mb-5">
          <div class="col-md-12">
            <textarea
              class="form-control"
              placeholder="Description"
              v-model="description"
              required
            >
            </textarea>
          </div>
        </div>
        <div ref="paypal"></div>
      </div>
    </card>
  </div>
</template>

<script>
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import { mapActions } from "vuex";
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";

export default {
  mixins: [CreatePropertyDetailMixin],
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    BaseAlert,
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      amount: 0.0,
      description: "",
      descriptionError: "",
      priceError: "",
      invoiceId: "",
      invoiceidError: "",
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "deactivate", label: "Deactivate" },
        ],
      },
      clientUser: {},
    };
  },
  methods: {
    ...mapActions("paymentHistory", ["reset", "savePayment"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
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
    successMessage(variant = null) {
      this.$bvToast.toast("Thank you for your payment!", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    warningMessage(variant = null) {
      this.$bvToast.toast(
        "Please don't leave the following field empty: Amount and Description",
        {
          title: `Warning`,
          variant: variant,
          solid: true,
        }
      );
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast("Something went wrong, you can try later again.", {
        title: `Something went wrong`,
        variant: variant,
        solid: true,
      });
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    paypalButton() {
      const amount = this.amount.toString();
      var purchase_units = [];
      purchase_units[0] = {};
      purchase_units[0].amount = {};
      const that = this;
      paypal
        .Buttons({
          style: {
            color: "gold",
            shape: "rect",
            label: "pay",
            layout: "vertical",
          },
          onClick: () => {
            if (this.amount == "" && this.description == "") {
              this.warningMessage("warning");
              return false;
            }
            purchase_units[0].description = this.description;
            purchase_units[0].amount.value = this.amount;
          },
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: purchase_units,
            });
          },
          onApprove(data, actions) {
            return actions.order.capture().then(function(orderData) {
              console.log(orderData);
              var date = new Date().toLocaleDateString("en-CA");
              const payload = {
                payment_id: data.orderID,
                client: that.clientUser.client_code,
                client_name:
                  orderData.payer.name.given_name +
                  " " +
                  orderData.payer.name.surname,
                date: date,
                amount: orderData.purchase_units[0].amount.value,
                transaction_number: data.orderID,
                payment_channel: "Paypal",
                notes:
                  "this is paid from the LM system payment portal(this is system generated).",
              };
              try {
                that.savePayment(payload).then(() => {
                  that.successMessage("success");
                });
              } catch (err) {
                this.errorMessage();
                console.error(err);
              }
            });
          },
        })
        .render(this.$refs.paypal);
    },
    testFunc() {
      var date = new Date().toLocaleDateString("en-CA");
      console.log(date);
    },
  },
  created() {},
  mounted() {
    this.fetchClient(this.$auth.user.id);
    this.paypalButton();
  },
};
</script>
