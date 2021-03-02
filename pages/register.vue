<template>
  <div class="container register-page">
    <div class="row">
      <div class="col-md-12">
        <form @submit.prevent="register">
          <card class="card-register card-white">
            <template slot="header">
              <img
                class="card-img"
                src="img/card-primary.png"
                alt="Card image"
              />
              <h4 class="card-title">Register</h4>
            </template>
            <div class="form-row">
              <div class="col-6">
                <base-input
                  v-validate="'required'"
                  :error="getError('First name')"
                  v-model="model.first_name"
                  name="First Name"
                  placeholder="First Name"
                  addon-left-icon="tim-icons icon-single-02"
                >
                </base-input>
              </div>
              <div class="col-6">
                <base-input
                  v-validate="'required'"
                  :error="getError('Last Name')"
                  v-model="model.last_name"
                  name="Last Name"
                  placeholder="Last Name"
                  addon-left-icon="tim-icons icon-single-02"
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-6">
                <base-input
                  v-validate="'required|username'"
                  :error="getError('username')"
                  v-model="model.username"
                  name="username"
                  placeholder="Username"
                  autocomplete="username"
                  addon-left-icon="tim-icons icon-user-run"
                >
                </base-input>
              </div>
              <div class="col-6">
                <base-input
                  v-validate="'required|min:5'"
                  :error="getError('password')"
                  v-model="model.password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autocomplete="current-password"
                  addon-left-icon="tim-icons icon-lock-circle"
                >
                </base-input>
              </div>
            </div>

            <base-button
              native-type="submit"
              slot="footer"
              type="primary"
              round
              block
              size="lg"
            >
              Register
            </base-button>

            <div slot="footer">
              <div class="pull-left">
                <h6>
                  <nuxt-link class="link footer-link" :to="'/login'">
                    Back to Login page
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
import { BaseCheckbox } from "@/components";

export default {
  auth: false,
  name: "register-page",
  layout: "auth",
  components: {
    BaseCheckbox,
  },
  data() {
    return {
      model: {
        username: "",
        fullName: "",
        password: "",
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async register() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        // TIP use this.model to send it to api and perform register call
      }
    },
  },
};
</script>
<style scoped>
.card-img {
  width: 50%;
}
</style>
