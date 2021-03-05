<template>
  <div class="row">
    <div class="col-md-8"><edit-profile-form> </edit-profile-form></div>
    <div class="col-md-4"><user-card :user="user"> </user-card></div>
    <div class="col-md-8" v-if="user.designation_category == 'staff'">
      <edit-staff-form></edit-staff-form>
    </div>
    <div class="col-md-8" v-else>
      <edit-client-form></edit-client-form>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import EditProfileForm from "../../components/UserProfile/EditProfileForm.vue";
import EditStaffForm from "../../components/UserProfile/EditStaffForm.vue";
import EditClientForm from "../../components/UserProfile/EditClientForm.vue";
import UserCard from "../../components/UserProfile/UserCard.vue";

export default {
  name: "user",
  components: {
    EditProfileForm,
    EditClientForm,
    EditStaffForm,
    UserCard,
  },
  data() {
    return {
      user: {},
    };
  },
  methods: {
    ...mapActions("user", ["fetchClientUser", "fetchUser"]),
    async fetchClient(id) {
      this.loading = true;
      try {
        await this.$store
          .dispatch("user/fetchClientUser", id)
          .then((res) => {
            console.log(id)
            this.client = res.data;
            console.log(client);
            this.loading = false;
          });
      } catch (err) {
        console.log(err.response.data);
        UIkit.notification("Error: Client data " + err.response.data.detail, {
          status: "danger",
        });
      }
    },
    async fetchStaff(id) {
      this.loading = true;
      let endpoint = `/api/v1/staff/${id}`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
        UIkit.notification("Error: Staff data " + err.response.data.detail, {
          status: "danger",
        });
      }
    },
    async fetchMe() {
      this.loading = true;
      try {
        await this.$store.dispatch("user/fetchUser").then((res) => {
          this.user = res.data;
          this.loading = false;
          if (
            this.user.designation_category == "new_client" ||
            this.user.designation_category == "current_client" ||
            this.user.designation_category == "affiliate_partner"
          ) {
            this.fetchClient(this.user.id);
          } else {
            this.fetchStaff(this.user.id);
          }
        });
      } catch (err) {
        console.log(err.response.data);
        this.loading = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      client: "user/clientUser"
    })
  },
  mounted() {
    this.fetchMe();
  },
};
</script>
<style></style>
