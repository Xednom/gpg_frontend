<template>
  <div>
    <card>
      <h5 slot="header" class="title">Edit Client information</h5>
      <form @submit.prevent="saveClient">
        <base-alert v-if="success2" type="success" dismissible>
          <span>
            {{ successMessage2() }}
          </span>
        </base-alert>
        <base-alert v-if="error" type="danger" dismissible>
          <span>
            {{ errorMessage(error) }}
          </span>
        </base-alert>
        <div class="row">
          <div class="col-md-2">
            <base-input
              type="text"
              label="Client code"
              placeholder="Client Code"
              v-model="clientUser.client_code"
              disabled
            >
            </base-input>
          </div>
          <div class="col-md-2">
            <base-input
              type="text"
              label="Affiliate partner code"
              placeholder="Affiliate partner code"
              v-model="clientUser.affiliate_partner_code"
            >
            </base-input>
          </div>
          <div class="col-md-5">
            <base-input
              type="text"
              label="Affiliate partner name"
              placeholder="Affiliate partner name"
              v-model="clientUser.affiliate_partner_name"
            >
            </base-input>
          </div>
          <div class="col-md-3">
            <base-input
              type="text"
              label="PIN"
              placeholder="PIN"
              v-model="clientUser.pin"
            >
            </base-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <base-input
              type="text"
              label="Customer ID"
              placeholder="Customer ID"
              v-model="clientUser.customer_id"
              disabled
            >
            </base-input>
          </div>
        </div>

        <div class="row"></div>

        <div class="row">
          <div class="col-sm-12 col-md-12">
            <textarea
              class="form-control"
              placeholder="Lead information"
              v-model="clientUser.lead_information"
            >
            </textarea>
          </div>
        </div>

        <base-button
          v-if="!saving2"
          native-type="submit"
          type="primary"
          class="btn-fill"
        >
          Save
        </base-button>
        <base-button
          v-else
          native-type="submit"
          type="primary"
          class="btn-fill"
          disabled
        >
          Saving...
        </base-button>
      </form>
      <card>
        <h5 slot="header" class="title">Client files</h5>
        <base-alert v-if="error" type="danger" dismissible>
          <span>
            {{ errorMessage(error) }}
          </span>
        </base-alert>
        <base-alert v-if="success" type="success" dismissible>
          <span>
            {{ successMessage() }}
          </span>
        </base-alert>
        <div id="app" class="container">
          <div class="col-xs-12">
            <div
              class="row"
              v-for="(item, index) in clientUser.client_files"
              :key="index"
            >
              <div class="row">
                <div class="col-sm-12 col-md-3">
                  <base-input
                    type="text"
                    label="File name"
                    placeholder="File name"
                    v-model="item.file_name"
                  >
                  </base-input>
                </div>
                <div class="col-xs-12 col-md-4">
                  <base-input
                    type="text"
                    label="URL"
                    placeholder="URL"
                    v-model="item.url"
                  >
                  </base-input>
                </div>
                <div class="col-sm-12 col-md-4">
                  <base-input
                    type="text"
                    label="Description"
                    placeholder="Description"
                    v-model="item.description"
                  >
                  </base-input>
                </div>
                <div class="col-xs-1">
                  <button
                    class="btn btn-link"
                    @click="deleteRow($event, item.id)"
                  >
                    <i class="tim-icons icon-simple-remove"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12">
                <button
                  v-if="!saving"
                  @click="saveUser"
                  type="submit"
                  class="btn btn-info"
                >
                  Submit
                </button>
                <button v-else class="btn btn-info" disabled>
                  Saving...
                </button>
                <button type="submit" class="btn btn-success" @click="addRow">
                  Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </card>
    </card>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { Select, Option } from "element-ui";
import { BaseAlert } from "@/components";
import Card from "../Cards/Card.vue";

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
        UIkit.notification("Error:" + err.response.data, {
          status: "danger",
        });
      }
    },
    successMessage() {
      return "Successfully added a new files";
    },
    successMessage2() {
      return "Successfully updated your account info";
    },
    async save() {
      this.saving2 = true;
      const payload = {
        username: this.user.username,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        phone: this.user.phone,
      };
      await this.updateClientUser(payload)
        .then(() => {
          this.saving2 = false;
          this.success2 = true;
          this.successMessage2();
        })
        .catch((err) => {
          this.success2 = false;
          this.error = err.response.data;
          this.errorMessage(error);
          console.log(err.response.data);
        });
    },
    async saveUser() {
      const clientPayload = {
        id: this.clientUser.id,
        client: this.user.id,
        client_code: this.clientUser.client_code,
        affiliate_partner_code: this.clientUser.affiliate_partner_code,
        affiliate_partner_name: this.clientUser.affiliate_partner_name,
        pin: this.clientUser.pin,
        lead_information: this.clientUser.lead_information,
        customer_id: this.clientUser.customer_id,
        client_files: this.clientUser.client_files,
      };
      this.saving = true;
      let url = `/api/v1/client/${this.user.id}/`;
      if (this.clientUser) {
        return await this.$axios
          .put(url, clientPayload)
          .then((res) => {
            this.saving = false;
            this.success = true;
            this.successMessage();
            return res.data;
          })
          .catch((err) => {
            this.saving = false;
            console.log(err);
          });
      }
    },
    async saveClient() {
      const clientPayload = {
        id: this.clientUser.id,
        client: this.user.id,
        client_code: this.clientUser.client_code,
        affiliate_partner_code: this.clientUser.affiliate_partner_code,
        affiliate_partner_name: this.clientUser.affiliate_partner_name,
        pin: this.clientUser.pin,
        lead_information: this.clientUser.lead_information,
        customer_id: this.clientUser.customer_id,
      };
      this.saving2 = true;
      let url = `/api/v1/client/${this.user.id}/`;
      if (this.clientUser) {
        return await this.$axios
          .put(url, clientPayload)
          .then((res) => {
            this.saving2 = false;
            this.success2 = true;
            this.successMessage2();
            return res.data;
          })
          .catch((err) => {
            this.saving2 = false;
            console.log(err);
          });
      }
    },
    addInternalFiles(e) {
      e.preventDefault();
      this.clientUser.client_files.push({
        file_name: "",
        url: "",
        description: "",
      });
    },
    removeInternalFiles(e, id) {
      e.preventDefault();
      var index = this.clientUser.client_files
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(id);
      this.clientUser.client_files.splice(index, 1);
    },
    addRow: function() {
      this.clientUser.client_files.push({
        file_name: "",
        url: "",
        description: "",
      });
    },
    deleteRow: function(e, item) {
      e.preventDefault();
      var index = this.clientUser.client_files
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(item);
      this.clientUser.client_files.splice(index, 1);
    },
    errorMessage(error) {
      if (error.password) {
        return "Password: " + this.error.password;
      } else if (error.username) {
        return "Username: " + this.error.username;
      } else if (error.detail) {
        return "Detail: " + this.error.detail;
      } else if (error.non_field_errors) {
        return this.error.non_field_errors;
      }
    },
  },
  mounted() {
    this.fetchMe();
  },
};
</script>
