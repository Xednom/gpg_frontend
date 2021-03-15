export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("propertyDetail/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  