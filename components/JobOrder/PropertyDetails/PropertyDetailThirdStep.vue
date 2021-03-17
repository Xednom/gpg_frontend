<template>
  <div>
    <card>
      <h5 class="info-text">
        Listing Ad Details
      </h5>
      <div class="row justify-content-center mt-5">
        <div class="col-sm-10 category-choices">
          <div class="row">
            <label>Category</label>
          </div>
          <el-select
            class="select-primary"
            size="large"
            v-model="category"
          >
            <el-option
              v-for="option in categoryChoices.status"
              class="select-primary"
              :value="option.value"
              :label="option.label"
              :key="option.label"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col-sm-10 mt-3">
          <label>Ad details</label>
          <textarea
            name="ad_details"
            class="form-control"
            v-model="ad_details"
          >
          </textarea>
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

          <textarea
            v-if="this.$auth.user.designation_category == 'staff'"
            name="notes_management_side"
            class="form-control"
            placeholder="Notes - Management side"
            v-model="notes_management_side"
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
    return {
      modelValidations: {
        // category: {
        //   required: true,
        // },
        adDetails: {
          required: true,
        },
      },
      categoryChoices: {
        placeholder: "",
        status: [
          { value: "company_name", label: "Company name" },
          { value: "phone", label: "Phone" },
          { value: "email_ad", label: "Email Ad" },
          { value: "website_url", label: "Website url" },
        ],
      },
    };
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
    category: {
      get() {
        return this.$store.getters["propertyDetail/category"];
      },
      set(value) {
        this.setBasicStoreValue("category", value);
      },
    },
    ad_details: {
      get() {
        return this.$store.getters["propertyDetail/ad_details"];
      },
      set(value) {
        this.setBasicStoreValue("ad_details", value);
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
<style scoped>
.category-choices {
  margin-bottom: 10px;
}
</style>
