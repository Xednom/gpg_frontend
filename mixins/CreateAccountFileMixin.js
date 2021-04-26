export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("accountFile/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  