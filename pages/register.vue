<template>
  <div class="container register-page">
    <div class="col-md-8 ml-auto mr-auto">
      <form @submit.prevent="registerUser">
        <card class="card-register card-white">
          <template slot="header">
            <img class="card-img" src="img/card-primary.png" alt="Card image" />
            <h4 class="card-title">Register</h4>
          </template>
          <base-alert v-if="error" type="danger" dismissible>
            <span>
              {{ errorMessage(error) }}
            </span>
          </base-alert>
          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <base-input
                v-validate="'required'"
                :error="getError('First Name')"
                v-model="register.first_name"
                name="First Name"
                placeholder="First Name"
                addon-left-icon="tim-icons icon-single-02"
              >
              </base-input>
            </div>
            <div class="col-sm-12 col-md-6">
              <base-input
                v-validate="'required'"
                :error="getError('Last Name')"
                v-model="register.last_name"
                name="Last Name"
                placeholder="Last Name"
                addon-left-icon="tim-icons icon-single-02"
              >
              </base-input>
            </div>
          </div>
          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <base-input
                v-validate="'required|email'"
                :error="getError('email')"
                v-model="register.email"
                name="email"
                placeholder="Email"
                addon-left-icon="tim-icons icon-email-85"
              >
              </base-input>
            </div>
            <div class="col-sm-12 col-md-6">
              <base-input
                v-validate="'required'"
                :error="getError('phone')"
                v-model="register.phone"
                name="phone"
                placeholder="Phone"
                addon-left-icon="tim-icons icon-mobile"
              >
              </base-input>
            </div>
          </div>

          <div class="form-row">
            <div class="col-sm-12 col-md-12">
              <base-input
                v-validate="'required'"
                :error="getError('username')"
                v-model="register.username"
                name="username"
                placeholder="Username"
                autocomplete="username"
                addon-left-icon="tim-icons icon-user-run"
              >
              </base-input>
            </div>
          </div>
          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <base-input
                v-validate="'required|min:8'"
                :error="getError('password')"
                v-model="register.password"
                name="password"
                type="password"
                placeholder="Password"
                autocomplete="current-password"
                addon-left-icon="tim-icons icon-lock-circle"
              >
              </base-input>
            </div>

            <div class="col-sm-12 col-md-6">
              <base-input
                v-validate="'required|min:8'"
                :error="getError('confirm password')"
                v-model="register.re_password"
                name="confirm password"
                type="password"
                placeholder="Confirm Password"
                autocomplete="current-password"
                addon-left-icon="tim-icons icon-lock-circle"
              >
              </base-input>
            </div>
          </div>

          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <el-select
                class="select-primary"
                size="medium"
                placeholder="Select your designation..."
                v-model="register.designation_category"
              >
                <el-option
                  v-for="option in designations.categories"
                  class="select-primary"
                  :value="option.value"
                  :label="option.label"
                  :key="option.label"
                >
                </el-option>
              </el-select>
            </div>

            <div class="col-sm-12 col-md-6">
              <el-select
                class="select-primary"
                size="medium"
                placeholder="Select your company..."
                v-model="register.company_category"
              >
                <el-option
                  v-for="option in companies.categories"
                  class="select-primary"
                  :value="option.value"
                  :label="option.label"
                  :key="option.label"
                >
                </el-option>
              </el-select>
            </div>
          </div>

          <div slot="footer">
            <div class="pull-right">
              <base-button
                v-if="!loading"
                native-type="submit"
                slot="footer"
                type="primary"
                round
                block
                size="lg"
              >
                Register
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
                Registering...
              </base-button>
            </div>
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
</template>
<script>
import { BaseCheckbox, BaseAlert } from "@/components";
import { Select, Option } from "element-ui";

export default {
  auth: false,
  name: "register-page",
  layout: "auth",
  components: {
    BaseCheckbox,
    BaseAlert,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      error: "",
      loading: false,
      confirm_password: "",
      register: {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        designation_category: "",
        company_category: "",
      },
      designations: {
        categories: [
          { value: "staff", label: "Staff" },
          { value: "new_client", label: "New client" },
          { value: "current_client", label: "Current client" },
          { value: "affiliate_partner", label: "Affiliate Partner" },
        ],
      },
      companies: {
        categories: [
          { value: "gpg_corporation", label: "GPG Corporation" },
          { value: "land_master", label: "Landmaster.us" },
          { value: "call_me_ph", label: "CallMe.com.ph" },
          { value: "psalms_global", label: "Psalmsglobal.com" },
          { value: "english_academy", label: "English Academy" },
          { value: "affiliate_partner", label: "Affiliate Partner" },
        ],
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async registerUser() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        this.loading = true;
        await this.$axios
          .post(`auth/users/`, this.register)
          .then(async (res) => {
            this.loading = false;
            // instead of showing a success page, we should automatically login the user.
            await this.$auth
              .loginWith("local", {
                data: this.register
              })
              .then((res) => {
                this.$router.push("/");
              });
          })
          .catch((e) => {
            this.loading = false;
            this.error = e.response.data;
            this.errorMessage(e.response.data);
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
      } else if (error.email) {
        return "Email: " + this.error.email;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
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
