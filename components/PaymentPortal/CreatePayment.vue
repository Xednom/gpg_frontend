<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <base-input
          label="Amount"
          v-validate="'required'"
          name="Amount"
          value="number"
          v-model="amount"
        >
        </base-input>
        <div ref="paypal"></div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
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
      priceStatusChoices: {
        placeholder: "",
        status: [
          { value: "active", label: "Active" },
          { value: "deactivate", label: "Deactivate" },
        ],
      },
    };
  },
  head() {
    return {
      script: [
        {
          src: `https://www.paypal.com/sdk/js?client-id=${
            config.PAYPAL_CLIENT_ID
          }&currency=USD`,
        },
      ],
    };
  },
  methods: {
    // setPaypal() {
    //   paypal
    //     .Buttons({
    //       createOrder: function(data, actions) {
    //         // This function sets up the details of the transaction, including the amount and line item details.
    //         return actions.order.create({
    //           purchase_units: [
    //             {
    //               description: this.description,
    //               amount: {
    //                 value: this.amount,
    //               },
    //             },
    //           ],
    //         });
    //       },
    //       onApprove: function(data, actions) {
    //         // This function captures the funds from the transaction.
    //         return actions.order.capture().then(function(details) {
    //           // This function shows a transaction success message to your buyer.
    //           alert(
    //             "Transaction completed by " + details.payer.name.given_name
    //           );
    //         });
    //       },
    //     })
    //     .render(this.$refs.paypal);
    // },
    setLoaded() {
      console.log(this.amount);
      window.paypal
        .Buttons({
          createOrder: function(data, actions) {
            // This function sets up the details of the transaction, including the amount and line item details.
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "0.01",
                  },
                },
              ],
            });
          },
          // onApprove: function(data, actions) {
          //   // This function captures the funds from the transaction.
          //   return actions.order.capture().then(function(details) {
          //     // This function shows a transaction success message to your buyer.
          //     alert(
          //       "Transaction completed by " + details.payer.name.given_name
          //     );
          //   });
          // },
        })
        .render(this.$refs.paypal);
    },
  },
  mounted() {
    this.setLoaded();
    // paypal
    //   .Buttons({
    //     style: {
    //       shape: "rect",
    //       color: "gold",
    //       layout: "vertical",
    //       label: "paypal",
    //     },
    //     createOrder: function(data, actions) {
    //       return actions.order.create({
    //         purchase_units: [
    //           {
    //             description: "test",
    //             amount: { currency_code: "USD", value: this.amount },
    //           },
    //         ],
    //       });
    //     },
    //     onApprove: function(data, actions) {
    //       return actions.order.capture().then(function(orderData) {
    //         // Full available details
    //         console.log(
    //           "Capture result",
    //           orderData,
    //           JSON.stringify(orderData, null, 2)
    //         );
    //         // Show a success message within this page, e.g.
    //         const element = document.getElementById("paypal-button-container");
    //         element.innerHTML = "";
    //         element.innerHTML = "<h3>Thank you for your payment!</h3>";
    //         // Or go to another URL:  actions.redirect('thank_you.html');
    //       });
    //     },
    //     onError: function(err) {
    //       console.log(err);
    //     },
    //   })
    //   .render(this.$refs.paypal);
  },
};
</script>
