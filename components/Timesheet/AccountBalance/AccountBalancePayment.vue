<template>
  <div class="col-md-12 white-content">
    <div class="form-row mt-3 mb-3">
      <label>Payment portals</label>
      <div class="col-sm-12 col-md-12">
        <b-list-group>
          <div v-for="payment in paymentPortals" :key="payment.id">
            <b-list-group-item :href="payment.url" target="_blank">{{
              payment.name
            }}</b-list-group-item>
          </div>
        </b-list-group>
      </div>
    </div>
  </div>
</template>

<script>
import { DatePicker } from "element-ui";
import { mapGetters } from "vuex";

export default {
  components: {
    [DatePicker.name]: DatePicker,
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
      paymentPortals: "accountBalance/paymentPortals",
    }),
  },
  async mounted() {
    this.fetchPaymentPortals();
  },
};
</script>
