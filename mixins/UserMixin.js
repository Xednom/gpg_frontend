import { mapGetters } from "vuex";

export default {
  methods: {
    setBasicStoreValue(fieldName, value) {
      this.$store.commit("forum/setBasicField", {
        field: fieldName,
        value: value,
      });
    },
  },
  computed: {
    ...mapGetters({
      staffs: "user/staffs",
      clients: "user/clients"
    }),
  },
};
