<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//card-primary.png" alt="" />
          <h1 class="card-title">Reset password</h1>
        </template>
        <base-alert v-if="error" type="danger" dismissible>
          <span>
            {{ errorMessage(error) }}
          </span>
        </base-alert>
        <form @submit.prevent="resetPassword">
          <div>
            <base-input
              v-validate="'required|min:8'"
              name="password"
              :error="getError('password')"
              v-model="new_password"
              type="password"
              autocomplete="password"
              placeholder="New Password"
              addon-left-icon="tim-icons icon-lock-circle"
            >
            </base-input>
          </div>

          <div slot="footer">
            <base-button
              v-if="loading"
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              block
              disabled
            >
              Activating...
            </base-button>
            <base-button
              v-if="!loading"
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              block
            >
              Activate
            </base-button>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>
<script>
import { BaseAlert } from "@/components";
export default {
  name: "reset-password-page",
  components: {
    BaseAlert,
  },
  data() {
    return {
      loading: false,
      new_password: "",
      error: "",
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    errorMessage(error) {
      if (error.token) {
        return "" + error.token;
      } else if (error.new_password) {
        return "" + error.new_password;
      }
    },
    async resetPassword() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        let confirmation = {
          uid: this.$route.params.uid,
          token: this.$route.params.token,
          new_password: this.new_password,
        };
        this.loading = true;
        this.$axios
          .post(`/auth/users/reset_password_confirm/`, confirmation)
          .then(() => {
            this.loading = false;
            this.$router.push("/users/reset_password_confirm/success");
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.response.data;
            this.errorMessage(err.response.data);
            console.log(err.response.data);
          });
      }
    },
  },
};
</script>
<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
.card-title {
  font-size: 46px !important;
  color: black !important;
}
</style>
