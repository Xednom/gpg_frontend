<template>
  <div class="container forgot-password-page login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//card-primary.png" alt="" />
          <h1 class="card-title">Thanks for Registering!</h1>
        </template>
        <div>
          <p>
            You can now use our site!
          </p>
        </div>

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
    </div>
  </div>
</template>
<script>
import { BaseAlert } from "@/components";
export default {
  name: "registration-complete-page",
  components: {
    BaseAlert,
  },
  data() {
    return {
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
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
