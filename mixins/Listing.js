import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("listing/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
    listingFields() {
      this.id = this.item.id;
      this.apn = this.item.apn;
      this.client_code = this.item.client_code;
      this.description = this.item.description;
      this.notes = this.item.notes;
      this.description_of_request = this.item.description_of_request;
      this.completed_job_order_file = this.item.completed_job_order_file;
      this.date_completed = this.item.date_completed;
      this.status_of_job = this.item.status_of_job;
      this.tagging = this.item.tagging;
      this.listing_sites = this.item.listing_sites;
      this.listing_status = this.item.listing_status;
      this.assigned_to = this.item.assigned_to;
    },
  },
  computed: {
    property_detail: {
      get() {
        return this.$store.getters["listing/property_detail"];
      },
      set(value) {
        this.setBasicStoreValue("property_detail", value);
      },
    },
    apn: {
      get() {
        return this.$store.getters["listing/apn"];
      },
      set(value) {
        this.setBasicStoreValue("apn", value);
      },
    },
    client_code: {
      get() {
        return this.$store.getters["listing/client_code"];
      },
      set(value) {
        this.setBasicStoreValue("client_code", value);
      },
    },
    description: {
      get() {
        return this.$store.getters["listing/description"];
      },
      set(value) {
        this.setBasicStoreValue("description", value);
      },
    },
    description_of_request: {
      get() {
        return this.$store.getters["listing/description_of_request"];
      },
      set(value) {
        this.setBasicStoreValue("description_of_request", value);
      },
    },
    completed_job_order_file: {
      get() {
        return this.$store.getters["listing/completed_job_order_file"];
      },
      set(value) {
        this.setBasicStoreValue("completed_job_order_file", value);
      },
    },
    date_completed: {
      get() {
        return this.$store.getters["listing/date_completed"];
      },
      set(value) {
        this.setBasicStoreValue("date_completed", value);
      },
    },
    status_of_job: {
      get() {
        return this.$store.getters["listing/status_of_job"];
      },
      set(value) {
        this.setBasicStoreValue("status_of_job", value);
      },
    },
    tagging: {
      get() {
        return this.$store.getters["listing/tagging"];
      },
      set(value) {
        this.setBasicStoreValue("tagging", value);
      },
    },
    listing_sites: {
      get() {
        return this.$store.getters["listing/listing_sites"];
      },
      set(value) {
        this.setBasicStoreValue("listing_sites", value);
      },
    },
    listing_status: {
      get() {
        return this.$store.getters["listing/listing_status"];
      },
      set(value) {
        this.setBasicStoreValue("listing_status", value);
      },
    },
    assigned_to: {
      get() {
        return this.$store.getters["listing/assigned_to"];
      },
      set(value) {
        this.setBasicStoreValue("assigned_to", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["listing/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
      },
    },
  },
  mounted() {
    setTimeout(() => {
      this.listingFields();
    }, 500);
  },
};
