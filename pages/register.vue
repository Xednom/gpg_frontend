<template>
  <div class="container register-page">
    <div class="col-md-8 ml-auto mr-auto">
      <form @submit.prevent="registerUser">
        <card class="card-register card-white">
          <div class="container mb-5">
            <span class="text-center">
              <h4 class="text-muted">Please choose what kind of user you are.</h4>
            </span>
          </div>
          <div class="form-row">
            <div class="col-sm-12 col-md-6">
              <nuxt-link to="/client-registration/"
                ><base-button
                  type="primary"
                  class="mb-3 client"
                  size="md"
                  block
                >
                  Client
                </base-button></nuxt-link
              >
            </div>
            <div class="col-sm-12 col-md-6">
              <nuxt-link to="/staff-registration/"
                ><base-button
                  type="success"
                  class="mb-3 client"
                  size="md"
                  block
                >
                  Staff
                </base-button></nuxt-link
              >
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
                  this.$router.push("/");
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
.client {
  border-radius: 0px;
}
</style>
