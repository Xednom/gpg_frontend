<template>
  <div class="col-md-12 white-content">
    <form @submit.prevent="save">
      <h4 class="card-title">
        Account Balance of Transaction #<b>{{ balance.id }}</b>
      </h4>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input v-model="balance.date" label="Date" disabled>
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input label="Amount Due" v-model="balance.amount_due_w_currency" disabled>
          </base-input>
        </div>
      </div>
      <div class="form-row">
          <div class="col-sm-12 col-md-6">
              <base-input label="Payment Made" v-model="balance.payment_made_w_currency" disabled>
          </base-input>
          </div>
          <div class="col-sm-12 col-md-6">
              <base-input label="Account balance" v-model="balance.account_balance_w_currency" disabled>
          </base-input>
          </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Notes</label>
          <textarea
            class="form-control"
            v-model="balance.notes"
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
    balance: {
      type: Object,
      decription: "Staff Account Balance data",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
