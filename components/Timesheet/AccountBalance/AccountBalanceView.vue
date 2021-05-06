<template>
  <div class="col-md-12 white-content">
    <form @submit.prevent="save">
      <h4 class="card-title">
        Account Balance of Transaction #<b>{{ balance.id }}</b>
      </h4>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input
            v-model="balance.total_payment_made"
            label="Total payment made"
            disabled
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input
            label="Total time consumed"
            v-model="balance.total_time_consumed"
            disabled
          >
          </base-input>
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-6">
          <base-input
            label="Account balance"
            v-model="balance.account_balance"
            disabled
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-6">
          <base-input
            label="Account charge"
            v-model="balance.account_charges"
            disabled
          >
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <label>Notes</label>
          <textarea class="form-control" v-model="balance.notes" disabled>
          </textarea>
        </div>
      </div>

      <div class="form-row mt-3 mb-3">
        <label>Payment portals</label>
        <div class="col-sm-12 col-md-12">
          <b-list-group>
            <div v-for="payment in paymentPortals" :key="payment.id">
              <b-list-group-item :href="payment.url" target="_blank"
              >{{ payment.name }}</b-list-group-item
            >
            </div>
            
          </b-list-group>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { DatePicker } from "element-ui";
import { mapGetters } from "vuex";

export default {
  components: {
    [DatePicker.name]: DatePicker,
  },
  props: {
    balance: {
      type: Object,
      decription: "Payment history data",
    },
  },
  data() {
    return {};
  },
  methods: {
    async fetchPaymentPortals() {
      this.isBusy = true;
      await this.$store
        .dispatch("accountBalance/fetchPaymentPortals", this.pagination)
        .then(() => {
          this.isBusy = false;
        });
    },
  },
  computed: {
    ...mapGetters({
      paymentPortals: "accountBalance/paymentPortals"
    })
  },
  async mounted() {
    this.fetchPaymentPortals();
  }
};
</script>
