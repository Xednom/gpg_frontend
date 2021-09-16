<template>
  <div>
    <div class="">
      <div class="col-md-12">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <b-card>
              <h4 class="card-title"><b-skeleton width="85%"></b-skeleton></h4>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
            </b-card>
          </template>
          <form @submit.prevent="save">
            <h4 class="card-title">
              Account credentials
            </h4>
            <div class="form-row">
              <div class="col-sm-12 col-md-6">
                <base-input label="Category" v-model="account.category">
                </base-input>
              </div>
              <div class="col-sm-12 col-md-6">
                <base-input label="URL" v-model="account.url"> </base-input>
              </div>
            </div>

            <div class="form-row mt-3">
              <div class="col-sm-12 col-md-6">
                <base-input label="Username" v-model="account.username">
                </base-input>
              </div>
              <div class="col-sm-12 col-md-6">
                <base-input label="Password" v-model="account.password">
                </base-input>
              </div>
            </div>
            <div class="form-row mt-3">
              <div class="col-sm-12 col-md-12">
                <label>Notes</label>
                <textarea
                  class="form-control"
                  placeholder="Notes"
                  v-model="account.notes"
                >
                </textarea>
              </div>
            </div>
            <div slot="footer">
              <div class="pull-right mt-5">
                <base-button
                  v-if="!saving"
                  native-type="submit"
                  slot="footer"
                  type="submit"
                  round
                  block
                  size="lg"
                  :disabled="$auth.user.designation_category=='staff'"
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
        </b-skeleton-wrapper>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { DatePicker, Select, Option } from "element-ui";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  props: {
    account: {
      type: Object,
      decription: "Login Credential data",
    },
    refresh: {
      type: Function,
      description: "fetch the list page"
    }
  },
  data() {
    return {
      saving: false,
      loading: false,
      error: "",
      user: {},
      clientUser: {},
      staffUser: {},
      current_account: {},
    };
  },
  methods: {
    ...mapActions("account", ["updateAccount"]),
    // async fetchAccount(id) {
    //   await this.$store.dispatch("account/fetchAccount", id);
    //   console.log(this.account);
    // },
    // async fetchAccount(payload) {
    //   this.loading = true;
    //   let endpoint = `/api/v1/login-credentials/${payload}/`;
    //   return await this.$axios
    //     .get(endpoint)
    //     .then((res) => {
    //       this.loading = false;
    //       console.log(res.data)
    //       this.account = res.data;
    //     })
    //     .catch((e) => {
    //       this.loading = false;
    //       throw e;
    //     });
    // },
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/v1/client/${id}/`;
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          await this.$axios.get(endpoint).then((res) => {
            this.clientUser = res.data;
            this.loading = false;
          });
        } catch (err) {
          console.error(err.response.data);
        }
      }
    },
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          this.loading = false;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.$auth.user.id);
          }
        });
      } catch (err) {
        console.error(err.response.data);
        this.loading = false;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated this credentials.", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    async save() {
      const clientPayload = {
        id: this.account.id,
        client: this.account.client,
        category: this.account.category,
        url: this.account.url,
        username: this.account.username,
        password: this.account.password,
        notes: this.account.notes
      };
      try {
        this.saving = true;
        await this.updateAccount(clientPayload)
          .then(() => {
            this.saving = false;
            this.refresh();
            this.successMessage("success");
          })
          .catch((e) => {
            this.saving = false;
            this.error = e.response.data;
            this.errorMessage("danger", this.error);
          });
      } catch (e) {
        this.saving = false;
        this.error = e.response.data;
        this.errorMessage("danger", this.error);
      }
      this.saving = false;
    },
  },
  computed: {
    isDisabled() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return true;
      } else {
        return false;
      }
    },
    staffDisable() {
      if (this.$auth.user.designation_category == "staff") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.fetchClient(this.$auth.user.id);
    // this.fetchAccount(this.account.id);
  },
};
</script>
