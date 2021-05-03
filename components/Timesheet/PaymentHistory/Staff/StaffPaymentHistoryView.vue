<template>
  <div class="col-md-12 white-content">
    <form @submit.prevent="save">
      <h4 class="card-title">
        Payment history of: Transaction #<b>{{ payment.transaction_number }}</b>
      </h4>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input v-model="payment.date" label="Date" disabled>
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="Payment channel" v-model="payment.payment_channel" disabled>
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input label="Amount" v-model="payment.amount_w_currency" disabled></base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Notes</label>
          <textarea
            class="form-control"
            v-model="payment.notes"
            disabled
          >
          </textarea>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { DatePicker } from "element-ui";

export default {
  components: {
    [DatePicker.name]: DatePicker,
  },
  props: {
    payment: {
      type: Object,
      decription: "Staff payment history data",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
