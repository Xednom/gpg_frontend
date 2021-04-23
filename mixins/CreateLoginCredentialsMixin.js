export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("account/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  