<template>
  <div class="col-md-12">
    <form @submit.prevent="save">
      <h4 class="card-title">Create Account credentials</h4>
      <base-alert v-if="success" type="success" dismissible>
        <span>
          {{ successMessage() }}
        </span>
      </base-alert>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Category"
            v-validate="'required'"
            :error="getError('Category')"
            name="Category"
            v-model="file_name"
          >
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            label="url"
            v-validate="'required'"
            :error="getError('Url')"
            name="Url"
            v-model="url"
          >
          </base-input>
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="col-sm-12 col-md-12">
          <textarea class="form-control" placeholder="Notes" v-model="file_description">
          </textarea>
        </div>
      </div>

      <div slot="footer">
        <div class="pull-right mt-3">
          <base-button
            v-if="!loading"
            native-type="submit"
            slot="footer"
            type="submit"
            round
            block
            size="lg"
          >
            Save
          </base-button>
          <base-button
            v-else
            native-type="submit"
            slot="footer"
            type="primary"
            round
            block
            size="lg"
            disabled
          >
            Saving...
          </base-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CreateLoginMixin from "@/mixins/CreateLoginCredentialsMixin";
import { DatePicker, Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
import { debounce } from "lodash";

export default {
  components: {
    BaseAlert,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    VueTypeaheadBootstrap,
  },
  mixins: [CreateLoginMixin],
  props: {
    fetch: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      saving: false,
      success: false,
      query: "",
      selectedClientCode: "",
      clientUser: {},
      clientCodes: [],
      error: {
        client: "",
        category: "",
        url: "",
        username: "",
        password: "",
        notes: "",
        staff: "",
      },
    };
  },
  methods: {
    ...mapActions("accountFile", ["reset", "saveAccount"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async fetchClient(id) {
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
        });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        if (
          this.$auth.user.designation_category == "new_client" ||
          this.$auth.user.designation_category == "current_client" ||
          this.$auth.user.designation_category == "affiliate_partner"
        ) {
          const payload = {
            client: this.clientUser.id,
            file_name: this.file_name,
            url: this.url,
            file_description: this.file_description,
          };
          try {
            await this.saveAccount(payload)
              .then(() => {
                this.loading = false;
                this.success = true;
                this.successMessage();
                this.reset();
                this.$validator.reset();

                this.fetch();
              })
              .catch((err) => {
                this.error = err.response;
                this.errorMessage("danger", this.error);
              });
          } catch (err) {
            console.error(err.response);
            this.success = false;
          }
        }
      }
    },
    successMessage() {
      return "Successfully added a file information.";
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.client
          ? "Client: " + error.client
          : error.url
          ? "URL: " + error.url
          : error.file_name
          ? "File name: " + error.file_name
          : error.file_description
          ? "File Description: " + error.file_description
          : error.non_field_errors
          ? error.non_field_errors
          : error,
        {
          title: `Error`,
          variant: variant,
          solid: true,
        }
      );
    },
  },
  computed: {
    client: {
      get() {
        return this.$store.getters["account/client"];
      },
      set(value) {
        this.setBasicStoreValue("client", value);
      },
    },
    file_name: {
      get() {
        return this.$store.getters["account/category"];
      },
      set(value) {
        this.setBasicStoreValue("category", value);
      },
    },
    url: {
      get() {
        return this.$store.getters["account/url"];
      },
      set(value) {
        this.setBasicStoreValue("url", value);
      },
    },
    file_description: {
      get() {
        return this.$store.getters["account/username"];
      },
      set(value) {
        this.setBasicStoreValue("username", value);
      },
    },
  },
  mounted() {
    if (
      this.$auth.user.designation_category == "new_client" ||
      this.$auth.user.designation_category == "current_client" ||
      this.$auth.user.designation_category == "affiliate_partner"
    ) {
      this.fetchClient(this.$auth.user.id);
    }
  },
};
</script>
