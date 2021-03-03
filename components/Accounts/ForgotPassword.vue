<template>
  <div class="container forgot-password-page login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//card-primary.png" alt="" />
          <h1 class="card-title">Forgot password</h1>
        </template>
        <base-alert v-if="error" type="danger" dismissible>
          <span>
            {{ errorMessage(error) }}
          </span>
        </base-alert>
        <base-alert v-if="success" type="success" dismissible>
          <span>
            Password reset link sent!
          </span>
        </base-alert>
        <form @submit.prevent="forgotPassword">
          <div>
            <base-input
              v-validate="'required|email'"
              name="email"
              :error="getError('email')"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="Email"
              addon-left-icon="tim-icons icon-email-85"
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
              Sending...
            </base-button>
            <base-button
              v-if="!loading"
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              block
            >
              Send
            </base-button>
            <div class="pull-left">
              <h6>
                <nuxt-link class="link footer-link" to="/login">
                  Back to login page
                </nuxt-link>
              </h6>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>
<script>
import { BaseAlert } from "@/components";
export default {
  name: "forgot-password-page",
  components: {
    BaseAlert
  },
  data() {
    return {
      loading: false,
      success: false,
      email: "",
      error: ""
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async forgotPassword() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        await this.$axios
          .post(`/auth/users/reset_password/`, {
            email: this.email,
          })
          .then((res) => {
            this.success = true;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            this.success = false;
            this.errorMessage(err.response.data);
            console.log(err.response.data);
          });
      }
    },
    errorMessage(error) {
      if (error.password) {
        return "Password: " + this.error.password;
      } else if (error.username) {
        return "Username: " + this.error.username;
      } else if (error.detail) {
        return "Detail: " + this.error.detail;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
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
.forgot-password-page .card-title {
  font-size: 46px !important;
}
</style>
