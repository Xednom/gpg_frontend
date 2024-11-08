<template>
  <div>
    <div class="container mt--8 login-page">
      <div class="col-lg-4 col-md-6 ml-auto mr-auto">
        <form @submit.prevent="login">
          <card class="card-login card-white">
            <template slot="header"> </template>
            <base-alert v-if="error" type="danger" dismissible>
              <span>
                {{ errorMessage(error) }}
              </span>
            </base-alert>
            <div class="container mb-5">
              <span class="text-muted text-center">
                <h4>Sign in with credentials</h4>
              </span>
            </div>

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
                class="mb-3 login-btn"
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
                class="mb-3 login-btn"
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
<style lang="scss" scoped>
.header {
  position: relative !important;
}
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
.company-logo {
  padding: 40px 40px 60px 40px;
  margin-top: 50px;
}
.card-title {
  color: #222a42 !important;
  font-size: 25px !important;
  text-transform: none !important;
  padding-left: 10px;
  text-align: center;
}
.card-login {
  border-radius: 0px;
}
.login-btn {
  border-radius: 0px;
}
.bg-gradient-success {
  height: 100% !important;
  background-image: linear-gradient(87deg, #ffffff, #1001e0) !important;
}
.separator {
  position: absolute !important;
}
.storm-warning {
  color: #856404 !important;
}
@media only screen and (max-width: 767.98px) {
  .login-page .card-login .card-header img {
    width: 100%;
  }
}
</style>
