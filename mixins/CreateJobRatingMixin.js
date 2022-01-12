export default {
    methods: {
      setBasicStoreValue(fieldName, value) {
        this.$store.commit("jobRating/setBasicField", {
          field: fieldName,
          value: value
        });
      }
    }
  };
  