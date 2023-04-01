import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("acquisition/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
    acquisitionFields() {
      const vm = this;
      vm.id = vm.item.id;
      vm.apn = vm.item.apn;
      vm.client_code = vm.item.client_code;
      vm.possible_offer = vm.item.possible_offer;
      vm.approved_amount_from_client = vm.item.approved_amount_from_client;
      vm.minimum_amount = vm.item.minimum_amount;
      vm.maximum_amount = vm.item.maximum_amount;
      vm.amount_closed_deal = vm.item.amount_closed_deal;
      vm.deal_status = vm.item.deal_status;
      vm.assigned_sales_team = vm.item.assigned_sales_team;
      vm.notes = vm.item.notes;
    },
  },
  computed: {
    ...mapGetters({ acquisition: "acquisition/acquisition" }),
    setItem() {
      const vm = this;
      const items = [this.$store.getters["acquisition/acquisition"]];
      _.forEach(items, function(item) {
        vm.id = item.id;
        vm.apn = item.apn;
        vm.client_code = item.client_code;
        vm.possible_offer = item.possible_offer;
        vm.approved_amount_from_client = item.approved_amount_from_client;
        vm.minimum_amount = item.minimum_amount;
        vm.maximum_amount = item.maximum_amount;
        vm.amount_closed_deal = item.amount_closed_deal;
        vm.deal_status = item.deal_status;
        vm.assigned_sales_team = item.assigned_sales_team;
        vm.notes = item.notes;
      });
    },
    property_detail_buyer_lists: {
      get() {
        return this.$store.getters["acquisition/property_detail_buyer_lists"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail_buyer_lists", value);
      },
    },
    property_detail: {
      get() {
        return this.$store.getters["acquisition/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    apn: {
      get() {
        return this.$store.getters["acquisition/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    client_code: {
      get() {
        return this.$store.getters["acquisition/client_code"];
      },
      set(value) {
        this.setBasicStoreValue("client_code", value);
      },
    },
    possible_offer: {
      get() {
        return this.$store.getters["acquisition/possible_offer"];
      },
      set(value) {
        this.setBasicStoreValue("possible_offer", value);
      },
    },
    approved_amount_from_client: {
      get() {
        return this.$store.getters["acquisition/approved_amount_from_client"];
      },
      set(value) {
        this.setBasicStoreValue("approved_amount_from_client", value);
      },
    },
    minimum_amount: {
      get() {
        return this.$store.getters["acquisition/minimum_amount"];
      },
      set(value) {
        this.setBasicStoreValue("minimum_amount", value);
      },
    },
    maximum_amount: {
      get() {
        return this.$store.getters["acquisition/maximum_amount"];
      },
      set(value) {
        this.setBasicStoreValue("maximum_amount", value);
      },
    },
    amount_closed_deal: {
      get() {
        return this.$store.getters["acquisition/amount_closed_deal"];
      },
      set(value) {
        this.setBasicStoreValue("amount_closed_deal", value);
      },
    },
    deal_status: {
      get() {
        return this.$store.getters["acquisition/deal_status"];
      },
      set(value) {
        this.setBasicStoreValue("deal_status", value);
      },
    },
    assigned_sales_team: {
      get() {
        return this.$store.getters["acquisition/assigned_sales_team"];
      },
      set(value) {
        this.setBasicStoreValue("assigned_sales_team", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["acquisition/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      },
    },
  },
  mounted() {
    setTimeout(() => {
      this.acquisitionFields();
    }, 500);
  },
};
