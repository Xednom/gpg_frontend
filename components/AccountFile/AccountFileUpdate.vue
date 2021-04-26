<template>
  <div>
    <div class="">
      <div class="col-md-6">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <b-card>
              <h4 class="card-title"><b-skeleton width="25%"></b-skeleton></h4>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row mt-3">
                <div class="col-sm-12 col-md-12">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
            </b-card>
          </template>
          <form @submit.prevent="save">
            <h4 class="card-title">
              Account file information
            </h4>
            <div class="form-row">
              <div class="col-sm-12 col-md-6">
                <base-input label="File name" v-model="account.file_name">
                </base-input>
              </div>
              <div class="col-sm-12 col-md-6">
                <base-input label="URL" v-model="account.url"> </base-input>
              </div>
            </div>
            <div class="form-row mt-3">
              <div class="col-sm-12 col-md-12">
                <label>File description</label>
                <textarea
                  class="form-control"
                  placeholder="Description"
                  v-model="account.file_description"
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
import { mapActions } from "vuex";
import { DatePicker, Select, Option } from "element-ui";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      saving: false,
      loading: false,
      error: "",
      user: {},
      clientUser: {},
      staffUser: {},
      account: {},
      current_account: {},
    };
  },
  methods: {
    ...mapActions("accountFile", ["updateAccountFiles", "fetchAccountFile"]),
    async fetchAccount(payload) {
      this.loading = true;
      let endpoint = `/api/v1/account-files/${payload}/`;
      return await this.$axios
        .get(endpoint)
        .then((res) => {
          this.loading = false;
          console.log(res.data)
          this.account = res.data;
        })
        .catch((e) => {
          this.loading = false;
          console.error(e)
          throw e;
        });
    },
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
      this.$bvToast.toast("Successfully updated this file info.", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    async save() {
      const clientPayload = {
        id: this.account.id,
        client: this.account.client,
        file_name: this.account.file_name,
        url: this.account.url,
        file_description: this.account.file_description
      };
      try {
        this.saving = true;
        await this.updateAccountFiles(clientPayload)
          .then(() => {
            this.saving = false;
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
    refresh() {
      this.fetchAccountFile(this.$route.params.id);
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
    this.fetchAccount(this.$route.params.id);
  },
};
</script>
