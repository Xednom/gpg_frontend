<template>
  <card>
    <h5 slot="header" class="title">Edit Profile</h5>
    <form @submit.prevent="save">
      <div class="row">
        <div class="col-md-6">
          <base-input
            type="text"
            label="Username"
            :disabled="true"
            placeholder="Username"
            v-model="user.username"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="email"
            label="Primary mail address"
            placeholder="email"
            v-model="user.email"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <base-input
            type="text"
            label="First Name"
            placeholder="First name"
            v-model="user.first_name"
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="text"
            label="Last Name"
            placeholder="Last name"
            v-model="user.last_name"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <base-input
            v-validate="'required'"
            type="text"
            label="Phone"
            placeholder="Phone"
            v-model="user.phone"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <label>Designation</label>
          <el-select
            class="select-primary"
            size="medium"
            placeholder="Select your designation..."
            v-model="user.designation_category"
            disabled
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
        <div class="col-md-4">
          <label>Category</label>
          <el-select
            class="select-primary"
            size="medium"
            placeholder="Select your company..."
            v-model="user.company_category"
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
      </div>

      <base-button native-type="submit" type="primary" class="btn-fill">
        Save
      </base-button>
    </form>
  </card>
</template>
<script>
import { BaseAlert } from "@/components";
import { mapActions } from "vuex";
import { Select, Option } from "element-ui";
import UserCard from "@/components/UserProfile/UserCard.vue";

export default {
  components: {
    UserCard,
    BaseAlert,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      saving: false,
      loading: false,
      success: false,
      user: {},
      clientUser: {},
      staffUser: {},
      user: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
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
          { value: "land_master", label: "Land master" },
          { value: "call_me_ph", label: "CallMe.com.ph" },
          { value: "psalms_global", label: "Psalmsglobal.com" },
          { value: "affiliate_partner", label: "Affiliate Partner" },
        ],
      },
    };
  },
  methods: {
    updateProfile() {
      alert("Your data: " + JSON.stringify(this.user));
    },
    ...mapActions("user", ["updateClientUser", "saveMe"]),
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/v1/client/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.clientUser = res.data;
          this.loading = false;
        });
      } catch (err) {
        console.log(err.response.data);
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
      }
    },
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
          this.user = res.data;
          this.loading = false;
          console.log(this.user);
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
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated your information!", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    async save() {
      this.saving = true;
      const payload = {
        username: this.user.username,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        phone: this.user.phone,
        email: this.user.email
      };
      return await this.saveMe(payload)
        .then(() => {
          this.saving = false;
          this.success = true;
          this.successMessage("success");
        })
        .catch((err) => {
          console.log(err);
          this.errorClientMessage("danger", err.response.data);
        });
    },
    errorClientMessage(variant = null, error) {
      this.$bvToast.toast(
        error.email
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
  mounted() {
    this.fetchMe();
  },
};
</script>
<style></style>
