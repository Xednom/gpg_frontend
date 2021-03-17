export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("jobOrderCategory/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  