export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("accountCharge/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  