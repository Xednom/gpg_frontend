export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("paymentHistory/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  