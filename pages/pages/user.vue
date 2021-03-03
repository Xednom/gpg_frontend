<template>
  <div class="row">
    <div class="col-md-8"><edit-profile-form> </edit-profile-form></div>
    <div class="col-md-4"><user-card :user="user"> </user-card></div>
    <div class="col-md-8"><edit-client-form></edit-client-form></div>
  </div>
</template>
<script>
import EditProfileForm from '../../components/UserProfile/EditProfileForm.vue';
import EditClientForm from '../../components/UserProfile/EditClientForm.vue';
import UserCard from '../../components/UserProfile/UserCard.vue';

export default {
  name: 'user',
  components: {
    EditProfileForm,
    EditClientForm,
    UserCard
  },
  data() {
    return {
      user: {}
    }
  },
  methods: {
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          this.loading = false;
          console.log(this.user);
        });
      } catch (err) {
        console.log(err.response.data);
        this.loading = false;
        UIkit.notification("Error:" + err.response.data, {
          status: "danger",
        });
      }
    },
  },
  mounted() {
    this.fetchMe();
  }
};
</script>
<style></style>
