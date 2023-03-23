import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("disposition/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
    setItem() {
      const vm = this;
      const items = [this.$store.getters["disposition/disposition"]];
      _.forEach(items, function(item) {
        vm.id = item.id;
        vm.apn = item.apn;
        vm.client_code = item.client_code;
        vm.selling_price = item.selling_price;
        vm.discounted_cash_price = item.discounted_cash_price;
        vm.selling_price_minimum = item.selling_price_minimum;
        vm.selling_price_maximum = item.selling_price_maximum;
        vm.financed_terms = item.financed_terms;
        vm.amount_closed_deal = item.amount_closed_deal;
        vm.deal_status = item.deal_status;
        vm.assigned_sales_team = item.assigned_sales_team;
        vm.notes = item.notes;
      });
    },
  },
  computed: {
    ...mapGetters({ disposition: "disposition/disposition" }),
    
    property_detail_buyer_lists: {
      get() {
        return this.$store.getters["disposition/property_detail_buyer_lists"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail_buyer_lists", value);
      },
    },
    property_detail: {
      get() {
        return this.$store.getters["disposition/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    apn: {
      get() {
        return this.$store.getters["disposition/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    client_code: {
      get() {
        return this.$store.getters["disposition/client_code"];
      },
      set(value) {
        this.setBasicStoreValue("client_code", value);
      },
    },
    possible_offer: {
      get() {
        return this.$store.getters["disposition/possible_offer"];
      },
      set(value) {
        this.setBasicStoreValue("possible_offer", value);
      },
    },
    approved_amount_from_client: {
      get() {
        return this.$store.getters["disposition/approved_amount_from_client"];
      },
      set(value) {
        this.setBasicStoreValue("approved_amount_from_client", value);
      },
    },
    minimum_amount: {
      get() {
        return this.$store.getters["disposition/minimum_amount"];
      },
      set(value) {
        this.setBasicStoreValue("minimum_amount", value);
      },
    },
    maximum_amount: {
      get() {
        return this.$store.getters["disposition/maximum_amount"];
      },
      set(value) {
        this.setBasicStoreValue("maximum_amount", value);
      },
    },
    amount_closed_deal: {
      get() {
        return this.$store.getters["disposition/amount_closed_deal"];
      },
      set(value) {
        this.setBasicStoreValue("amount_closed_deal", value);
      },
    },
    deal_status: {
      get() {
        return this.$store.getters["disposition/deal_status"];
      },
      set(value) {
        this.setBasicStoreValue("deal_status", value);
      },
    },
    assigned_sales_team: {
      get() {
        return this.$store.getters["disposition/assigned_sales_team"];
      },
      set(value) {
        this.setBasicStoreValue("assigned_sales_team", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["disposition/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      },
    },
  },
};
