<template>
  <div class="container register-page">
    <div class="col-md-6 ml-auto mr-auto">
      <form @submit.prevent="registerUser">
        <card class="card-register card-white">
          <div class="container mb-5">
            <span class="text-center">
              <h4 class="text-muted">Sign up with your Client credentials.</h4>
            </span>
          </div>
          <div class="col-sm-12">
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
          <div class="col-sm-12">
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
          <div class="col-sm-12">
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
          <div class="col-sm-12">
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

          <div class="col-sm-12">
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
          <div class="col-sm-12">
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

          <div class="col-sm-12">
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

          <div class="col-lg-12">
            <el-select
              class="select-primary col-lg-12"
              size="medium"
              placeholder="Select your company..."
              v-model="register.company_category"
              disabled
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

          <div class="col-sm-12 col-md-12">
            <base-checkbox class="text-left" v-model="termsPrivacy">
              I agree to the
              <nuxt-link class="link footer-link" :to="'/terms-and-condition'">
                terms and condition
              </nuxt-link>
              and
              <nuxt-link class="link footer-link" :to="'/privacy-policy'"
                >privacy policy</nuxt-link
              >.
            </base-checkbox>
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

import TermsAndCondtion from "@/components/TermsAndCondition/TermsAndCondition.vue";

export default {
  auth: false,
  name: "register-page",
  layout: "auth",
  components: {
    BaseCheckbox,
    BaseAlert,
    [Option.name]: Option,
    [Select.name]: Select,
    TermsAndCondtion,
  },
  data() {
    return {
      modals: {
        terms: false,
        privacy: false,
      },
      termsPrivacy: false,
      error: "",
      loading: false,
      confirm_password: "",
      error: {
        password: "",
        username: "",
        detail: "",
        email: "",
        non_field_errors: "",
      },
      register: {
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        designation_category: "new_client",
        company_category: "land_master",
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
      if (!this.termsPrivacy) {
        this.message("warning");
      } else {
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
                  data: this.register,
                })
                .then((res) => {
                  this.$router.push("/client-registration/leads");
                });
            })
            .catch((e) => {
              this.loading = false;
              this.error = e.response.data;
              this.errorMessage("danger", this.error);
            });
        }
      }
    },

    message(variant = null) {
      this.$bvToast.toast(
        "Please check the terms and conditions and privacy policy",
        {
          title: `Warning`,
          variant: variant,
          solid: true,
        }
      );
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.password
          ? "Password: " + error.password
          : error.username
          ? "Username: " + error.username
          : error.detail
          ? "Detail: " + error.detail
          : error.email
          ? "Email: " + error.email
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
};
</script>
<style scoped>
.card-img {
  width: 50%;
}
</style>
