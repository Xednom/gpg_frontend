export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("sellerList/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    property_detail_seller_lists: {
      get() {
        return this.$store.getters["sellerList/property_detail_seller_lists"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail_seller_lists", value);
      },
    },
    sellerLists: {
      get() {
        return this.$store.getters["sellerList/sellerLists"];
      },
      set(value) {
        this.setBasicStoreValue("sellerLists", value);
      },
    },
    property_detail: {
      get() {
        return this.$store.getters["sellerList/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    apn: {
      get() {
        return this.$store.getters["sellerList/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    client_code: {
      get() {
        return this.$store.getters["sellerList/client_code"];
      },
      set(value) {
        this.setBasicStoreValue("client_code", value);
      },
    },
    date_lead_added: {
      get() {
        return this.$store.getters["sellerList/date_lead_added"];
      },
      set(value) {
        this.setBasicStoreValue("date_lead_added", value);
      },
    },
    lead_type: {
      get() {
        return this.$store.getters["sellerList/lead_type"];
      },
      set(value) {
        this.setBasicStoreValue("lead_type", value);
      },
    },
    seller_lead_name: {
      get() {
        return this.$store.getters["sellerList/seller_lead_name"];
      },
      set(value) {
        this.setBasicStoreValue("seller_lead_name", value);
      },
    },
    phone_number: {
      get() {
        return this.$store.getters["sellerList/phone_number"];
      },
      set(value) {
        this.setBasicStoreValue("phone_number", value);
      },
    },
    email: {
      get() {
        return this.$store.getters["sellerList/email"];
      },
      set(value) {
        this.setBasicStoreValue("email", value);
      },
    },
    lead_status: {
      get() {
        return this.$store.getters["sellerList/lead_status"];
      },
      set(value) {
        this.setBasicStoreValue("lead_status", value);
      },
    },
    seller_asking_price: {
      get() {
        return this.$store.getters["sellerList/seller_asking_price"];
      },
      set(value) {
        this.setBasicStoreValue("seller_asking_price", value);
      },
    },
    counter_offer_amount: {
      get() {
        return this.$store.getters["sellerList/counter_offer_amount"];
      },
      set(value) {
        this.setBasicStoreValue("counter_offer_amount", value);
      },
    },
    lead_assigned_to: {
      get() {
        return this.$store.getters["sellerList/lead_assigned_to"];
      },
      set(value) {
        this.setBasicStoreValue("lead_assigned_to", value);
      },
    },
    total_minutes_consumed: {
      get() {
        return this.$store.getters["sellerList/total_minutes_consumed"];
      },
      set(value) {
        this.setBasicStoreValue("total_minutes_consumed", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["sellerList/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      },
    },
  },
};
