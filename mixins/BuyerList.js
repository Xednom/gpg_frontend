export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("buyerList/setBasicField", {
          field: fieldName,
          value: value,
        });
      },
    },
    computed: {
      property_detail_buyer_lists: {
        get() {
          return this.$store.getters["buyerList/property_detail_buyer_lists"];
        },
        set(value) {
          this.setBasicStoreValue("property_detail_buyer_lists", value);
        },
      },
      buyerLists: {
        get() {
          return this.$store.getters["buyerList/buyerLists"];
        },
        set(value) {
          this.setBasicStoreValue("buyerLists", value);
        },
      },
      property_detail: {
        get() {
          return this.$store.getters["buyerList/property_detail"];
        },
        set(value) {
          this.setBasicStoreValue("property_detail", value);
        },
      },
      apn: {
        get() {
          return this.$store.getters["buyerList/apn"];
        },
        set(value) {
          this.setBasicStoreValue("apn", value);
        },
      },
      client_code: {
        get() {
          return this.$store.getters["buyerList/client_code"];
        },
        set(value) {
          this.setBasicStoreValue("client_code", value);
        },
      },
      date_lead_added: {
        get() {
          return this.$store.getters["buyerList/date_lead_added"];
        },
        set(value) {
          this.setBasicStoreValue("date_lead_added", value);
        },
      },
      lead_type: {
        get() {
          return this.$store.getters["buyerList/lead_type"];
        },
        set(value) {
          this.setBasicStoreValue("lead_type", value);
        },
      },
      buyer_lead_name: {
        get() {
          return this.$store.getters["buyerList/buyer_lead_name"];
        },
        set(value) {
          this.setBasicStoreValue("buyer_lead_name", value);
        },
      },
      phone_number: {
        get() {
          return this.$store.getters["buyerList/phone_number"];
        },
        set(value) {
          this.setBasicStoreValue("phone_number", value);
        },
      },
      email: {
        get() {
          return this.$store.getters["buyerList/email"];
        },
        set(value) {
          this.setBasicStoreValue("email", value);
        },
      },
      lead_status: {
        get() {
          return this.$store.getters["buyerList/lead_status"];
        },
        set(value) {
          this.setBasicStoreValue("lead_status", value);
        },
      },
      buyer_offer: {
        get() {
          return this.$store.getters["buyerList/buyer_offer"];
        },
        set(value) {
          this.setBasicStoreValue("buyer_offer", value);
        },
      },
      counter_offer_amount: {
        get() {
          return this.$store.getters["buyerList/counter_offer_amount"];
        },
        set(value) {
          this.setBasicStoreValue("counter_offer_amount", value);
        },
      },
      lead_assigned_to: {
        get() {
          return this.$store.getters["buyerList/lead_assigned_to"];
        },
        set(value) {
          this.setBasicStoreValue("lead_assigned_to", value);
        },
      },
      total_minutes_consumed: {
        get() {
          return this.$store.getters["buyerList/total_minutes_consumed"];
        },
        set(value) {
          this.setBasicStoreValue("total_minutes_consumed", value);
        },
      },
      notes: {
        get() {
          return this.$store.getters["buyerList/notes"];
        },
        set(value) {
          this.setBasicStoreValue("notes", value);
        },
      },
    },
  };
  