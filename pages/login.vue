<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <form @submit.prevent="login">
        <card class="card-login card-white">
          <template slot="header">
            <img src="img//card-primary.png" alt="" />
            <h1 class="card-title">Log in</h1>
          </template>
          <base-alert v-if="error" type="danger" dismissible>
            <span>
              {{ errorMessage(error) }}
            </span>
          </base-alert>
          <div>
            <base-input
              v-validate="'required'"
              name="username"
              :error="getError('username')"
              v-model="loginData.login"
              placeholder="Username"
              autocomplete="username"
              addon-left-icon="tim-icons icon-single-02"
            >
            </base-input>

            <base-input
              name="password"
              :error="getError('password')"
              v-model="loginData.password"
              type="password"
              autocomplete="current-password"
              placeholder="Password"
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
              Signing in...
            </base-button>
            <base-button
              v-if="!loading"
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              block
            >
              Sign in
            </base-button>
            <div class="pull-left">
              <h6>
                <nuxt-link class="link footer-link" :to="'/register'">
                  Create Account
                </nuxt-link>
              </h6>
            </div>
            <div class="pull-right">
              <h6>
                <nuxt-link class="link footer-link" to="/forgot-password">
                  Forgot password?
                </nuxt-link>
              </h6>
            </div>
          </div>
        </card>
      </form>
    </div>
  </div>
</template>
<script>
import { BaseAlert } from "@/components";
export default {
  components: {
    BaseAlert,
  },
  name: "login-page",
  layout: "auth",
  data() {
    return {
      loading: false,
      error: "",
      loginData: {
        login: "",
        password: "",
        subscribe: true,
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async login() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        this.authError = {};
        var data = {
          username: this.loginData.login,
          password: this.loginData.password,
        };
        await this.$auth
          .loginWith("local", {
            data: data,
          })
          .then((res) => {
            console.log(res);
            this.loading = false;
            this.$router.push("/");
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.response.data;
            this.errorMessage(err.response.data);
            console.log(err);
          });
      }
    },
    async register() {
      this.loading = true;
      await this.$axios
        .post(`/auth/users/`, this.registerData)
        .then((res) => {
          this.loading = false;
          this.$router.push("/accounts/registration-complete-step-1");
        })
        .catch((e) => {
          this.loading = false;
          this.error = e.response.data;
          this.errorMessage(e.response.data);
        });
    },
    async resetPassword() {
      this.loading = true;
      console.log(this.recoverPassEmail.email);
      await this.$axios
        .post(`/auth/users/reset_password/`, {
          email: this.recoverPassEmail,
        })
        .then((res) => {
          this.success = true;
          this.loading = false;
          this.successMessage();
        })
        .catch((err) => {
          this.loading = false;
          this.success = false;
          this.errorMessage(err.response.data);
          console.log(err.response.data);
        });
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
    successMessage() {
      return "Reset password link sent!";
    },
  },
};
</script>
<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
