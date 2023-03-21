import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("assessment/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    ...mapGetters({ assessment: "assessment/assessment" }),
    setItem() {
      const vm = this;
      const items = [this.$store.getters["assessment/assessment"]];
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
    property_detail: {
      get() {
        return this.$store.getters["assessment/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    property_detail: {
      get() {
        return this.$store.getters["assessment/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    apn: {
      get() {
        return this.$store.getters["assessment/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    client_code: {
      get() {
        return this.$store.getters["assessment/client_code"];
      },
      set(value) {
        this.setBasicStoreValue("client_code", value);
      },
    },
    description: {
      get() {
        return this.$store.getters["assessment/description"];
      },
      set(value) {
        this.setBasicStoreValue("description", value);
      },
    },
    description_of_request: {
      get() {
        return this.$store.getters["assessment/description_of_request"];
      },
      set(value) {
        this.setBasicStoreValue("description_of_request", value);
      },
    },
    completed_job_order_file: {
      get() {
        return this.$store.getters["assessment/completed_job_order_file"];
      },
      set(value) {
        this.setBasicStoreValue("completed_job_order_file", value);
      },
    },
    date_completed: {
      get() {
        return this.$store.getters["assessment/date_completed"];
      },
      set(value) {
        this.setBasicStoreValue("date_completed", value);
      },
    },
    status_of_job: {
      get() {
        return this.$store.getters["assessment/status_of_job"];
      },
      set(value) {
        this.setBasicStoreValue("status_of_job", value);
      },
    },
    packets: {
      get() {
        return this.$store.getters["assessment/packets"];
      },
      set(value) {
        this.setBasicStoreValue("packets", value);
      },
    },
    comps_by_parcel: {
      get() {
        return this.$store.getters["assessment/comps_by_parcel"];
      },
      set(value) {
        this.setBasicStoreValue("comps_by_parcel", value);
      },
    },
    comps_by_area: {
      get() {
        return this.$store.getters["assessment/comps_by_area"];
      },
      set(value) {
        this.setBasicStoreValue("comps_by_area", value);
      },
    },
    due_diligence: {
      get() {
        return this.$store.getters["assessment/due_diligence"];
      },
      set(value) {
        this.setBasicStoreValue("due_diligence", value);
      },
    },
    assigned_to: {
      get() {
        return this.$store.getters["assessment/assigned_to"];
      },
      set(value) {
        this.setBasicStoreValue("assigned_to", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["assessment/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      },
    },
  },
};
