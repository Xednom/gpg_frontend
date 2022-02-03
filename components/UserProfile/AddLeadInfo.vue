<template>
  <div class="container">
    <card>
      <h5 slot="header" class="title">Please provide the necessary info</h5>
      <form @submit.prevent="save">

        <div class="row">
          <div class="col-sm-12 col-md-12">
            <textarea
              class="form-control"
              placeholder="Where did you hear about our company"
              v-model="clientUser.lead_information"
            >
            </textarea>
            <small class="text-muted"
              >We're wondering how did you hear about us? &#129300;</small
            >
          </div>
        </div>

        <base-button
          v-if="!saving2"
          native-type="submit"
          type="primary"
          class="btn-fill"
        >
          Submit
        </base-button>
        <base-button
          v-else
          native-type="submit"
          type="primary"
          class="btn-fill"
          disabled
        >
          Submitting...
        </base-button>
      </form>
    </card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { Select, Option } from "element-ui";
import { BaseAlert } from "@/components";

export default {
  components: {
    BaseAlert,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      saving: false,
      saving2: false,
      loading: false,
      success: false,
      success2: false,
      user: {},
      clientUser: {},
      staffUser: {},
      error: "",
      user: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        designation_category: "",
        company_category: "",
      },
    };
  },
  methods: {
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
    async fetchMe() {
      this.loading = true;
      try {
        let endpoint = `/auth/users/me/`;
        await this.$axios.get(endpoint).then((res) => {
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
    successMessage() {
      return "Successfully added a new files";
    },
    successMessage2(variant = null) {
      this.$bvToast.toast("Successfully updated Client information!", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    async save() {
      const payload = {
        id: this.clientUser.id,
        lead_information: this.clientUser.lead_information,
      };
      this.saving2 = true;
      let url = `/api/v1/client/${this.clientUser.user}/`;
      if (this.clientUser) {
        return await this.$axios
          .put(url, payload)
          .then((res) => {
            this.saving2 = false;
            this.success2 = true;
            this.$router.push("/");
            return res.data;
          })
          .catch((err) => {
            this.saving2 = false;
            console.log(err);
            this.errorMessage("danger", err.response.data)
          });
      }
    },
    errorMessage(variant = null, error) {
      this.$bvToast.toast(
        error.lead_information
          ? "Lead information: " + error.lead_information
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
