<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//card-primary.png" alt="" />
          <h1 class="card-title">Password reset successfully</h1>
        </template>

        <nuxt-link to="/login">Back to login page</nuxt-link>
      </card>
    </div>
  </div>
</template>
<script>
export default {
  name: "reset-password-component",
  data() {
    return {
    };
  },
  methods: {
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
