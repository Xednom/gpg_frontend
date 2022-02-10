export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("resolution/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  