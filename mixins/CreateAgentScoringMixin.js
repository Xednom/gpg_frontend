import { set } from "lodash";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("agentScoring/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    staff: {
      get() {
        return this.$store.getters["agentScoring/staff"];
      },
      set(value) {
        this.setBasicStoreValue("staff", value);
      },
    },
    job_order_general: {
      get() {
        return this.$store.getters["agentScoring/job_order_general"];
      },
      set(value) {
        this.setBasicStoreValue("job_order_general", value);
      },
    },
    accuracy: {
      get() {
        return this.$store.getters["agentScoring/accuracy"];
      },
      set(value) {
        this.setBasicStoreValue("accuracy", value);
      },
    },
    speed: {
      get() {
        return this.$store.getters["agentScoring/speed"];
      },
      set(value) {
        this.setBasicStoreValue("speed", value);
      },
    },
    speed: {
      get() {
        return this.$store.getters["agentScoring/speed"];
      },
      set(value) {
        this.setBasicStoreValue("speed", value);
      },
    },
    quality_of_work: {
      get() {
        return this.$store.getters["agentScoring/quality_of_work"];
      },
      set(value) {
        this.setBasicStoreValue("quality_of_work", value);
      },
    },
    delivered_on_time: {
      get() {
        return this.$store.getters["agentScoring/delivered_on_time"];
      },
      set(value) {
        this.setBasicStoreValue("delivered_on_time", value);
      },
    },
    delivery_note: {
      get() {
        return this.$store.getters["agentScoring/delivery_note"];
      },
      set(value) {
        this.setBasicStoreValue("delivery_note", value);
      },
    },
    job_completed: {
      get() {
        return this.$store.getters["agentScoring/job_completed"];
      },
      set(value) {
        this.setBasicStoreValue("job_completed", value);
      },
    },
    job_completed_note: {
      get() {
        return this.$store.getters["agentScoring/job_completed_note"];
      },
      set(value) {
        this.setBasicStoreValue("job_completed_note", value);
      },
    },
    satisfied: {
      get() {
        return this.$store.getters["agentScoring/satisfied"];
      },
      set(value) {
        this.setBasicStoreValue("satisfied", value);
      },
    },
  },
};
