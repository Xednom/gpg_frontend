<template>
  <div>
    <card>
      <h5 class="info-text">
        Listing Ad Details
      </h5>
      <div class="row justify-content-center mt-5">
        <div class="col-sm-5">
          <base-input label="Company name" v-model="company_name"> </base-input>
        </div>
        <div class="col-sm-5">
          <base-input label="Phone" name="phone" v-model="phone"> </base-input>
        </div>
        <div class="col-sm-5">
          <base-input label="Email" name="email" v-model="email"> </base-input>
        </div>
        <div class="col-sm-5">
          <base-input label="Website URL" v-model="website_url"> </base-input>
        </div>
        <div class="col-sm-5 mt-3">
          <a href="https://form.jotform.com/210818766251458" target="_blank"
            >Logo(Please attached file)</a
          >
        </div>
        <div class="col-sm-5">
          <base-input
            label="Logo(If you're using file storage such as Gdrive, Dropbox, etc..)"
            v-model="file_storage"
          >
          </base-input>
        </div>
        <div class="col-sm-10 mt-3">
          <label>Notes</label>
          <textarea
            name="notes_client_side"
            class="form-control"
            v-model="notes_client_side"
          >
          </textarea>

          <textarea
            v-if="this.$auth.user.designation_category == 'staff'"
            name="notes_va_side"
            class="form-control"
            placeholder="Notes from VA"
            v-model="notes_va_side"
          >
          </textarea>
        </div>
      </div>
    </card>
  </div>
</template>
<script>
import CreatePropertyDetailMixin from "@/mixins/CreatePropertyDetailMixin.js";
import { Select, Option } from "element-ui";

export default {
  mixins: [CreatePropertyDetailMixin],
  inject: ["$validator"],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {};
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit("on-validated", res, this.model);
        return res;
      });
    },
  },
  computed: {
    company_name: {
      get() {
        return this.$store.getters["propertyDetail/company_name"];
      },
      set(value) {
        this.setBasicStoreValue("company_name", value);
      },
    },
    phone: {
      get() {
        return this.$store.getters["propertyDetail/phone"];
      },
      set(value) {
        this.setBasicStoreValue("phone", value);
      },
    },
    email: {
      get() {
        return this.$store.getters["propertyDetail/email"];
      },
      set(value) {
        this.setBasicStoreValue("email", value);
      },
    },
    website_url: {
      get() {
        return this.$store.getters["propertyDetail/website_url"];
      },
      set(value) {
        this.setBasicStoreValue("website_url", value);
      },
    },
    file_storage: {
      get() {
        return this.$store.getters["propertyDetail/file_storage"];
      },
      set(value) {
        this.setBasicStoreValue("file_storage", value);
      },
    },
    notes_client_side: {
      get() {
        return this.$store.getters["propertyDetail/notes_client_side"];
      },
      set(value) {
        this.setBasicStoreValue("notes_client_side", value);
      },
    },
    notes_va_side: {
      get() {
        return this.$store.getters["propertyDetail/notes_va_side"];
      },
      set(value) {
        this.setBasicStoreValue("notes_va_side", value);
      },
    },
    notes_management_side: {
      get() {
        return this.$store.getters["propertyDetail/notes_management_side"];
      },
      set(value) {
        this.setBasicStoreValue("notes_management_side", value);
      },
    },
  },
};
</script>
