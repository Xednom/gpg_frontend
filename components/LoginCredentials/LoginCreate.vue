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
        <div
          class="col-sm-12 col-md-12"
          v-if="this.$auth.user.designation_category == 'staff'"
        >
          <label>Client Code</label>
          <vue-typeahead-bootstrap
            class="mb-4"
            v-model="client"
            :ieCloseFix="false"
            :data="clientCodes"
            :serializer="(item) => item.client_code"
            :value="keyword"
            @hit="getClientCode"
            @input="onSearchInput"
            placeholder="Search by Client Code"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Category"
            v-validate="'required'"
            :error="getError('Category')"
            name="Category"
            v-model="category"
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

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Username"
            v-validate="'required'"
            :error="getError('username')"
            name="username"
            v-model="username"
          >
          </base-input>
        </div>
      </div>

      <div class="form-row">
        <div class="col-sm-12 col-md-12">
          <base-input
            label="Password"
            v-validate="'required'"
            :error="getError('password')"
            name="password"
            v-model="password"
          >
          </base-input>
        </div>
      </div>

      <div class="form-row mt-3">
        <div class="col-sm-12 col-md-12">
          <textarea class="form-control" placeholder="Notes" v-model="notes">
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
      keyword: "",
      query: "",
      selectedClientCode: "",
      clientUser: {},
      staffUser: {},
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
    ...mapActions("account", ["reset", "saveAccount"]),
    onSearchInput(text) {
      this.keyword = text;
    },
    getClientCode: debounce(function() {
      this.$axios
        .get(`/api/v1/client-code/?search=${this.client}`)
        .then((res) => {
          this.clientCodes = res.data.results;
        })
        .catch((err) => {
          console.log(err);
        });
    }, 700),
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
    async fetchStaff(id) {
      let endpoint = `/api/v1/staff/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
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
            category: this.category,
            url: this.url,
            username: this.username,
            password: this.password,
            notes: this.notes,
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
        } else if (this.$auth.user.designation_category == "staff") {
          const payload = {
            client: this.client,
            staff: [this.staffUser.id],
            category: this.category,
            url: this.url,
            username: this.username,
            password: this.password,
            notes: this.notes,
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
      return "Successfully added the credentials. Management is on it's way to process this.";
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.category
          ? "Category: " + error.category
          : error.url
          ? "URL: " + error.url
          : error.username
          ? "Username: " + error.username
          : error.password
          ? "Password: " + error.password
          : error.notes
          ? "Notes: " + error.notes
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
    category: {
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
    username: {
      get() {
        return this.$store.getters["account/username"];
      },
      set(value) {
        this.setBasicStoreValue("username", value);
      },
    },
    password: {
      get() {
        return this.$store.getters["account/password"];
      },
      set(value) {
        this.setBasicStoreValue("password", value);
      },
    },
    notes: {
      get() {
        return this.$store.getters["account/notes"];
      },
      set(value) {
        this.setBasicStoreValue("notes", value);
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
    } else if (this.$auth.user.designation_category == 'staff') {
      this.fetchStaff(this.$auth.user.id);
    }
  },
  watch: {
    keyword: debounce(function(oldKeyword, newKeyword) {
      if (newKeyword !== "" && newKeyword !== oldKeyword) {
        this.getClientCode();
      } else if (!newKeyword) {
        this.clientCodes = [];
      }
    }, 500),
  },
};
</script>
