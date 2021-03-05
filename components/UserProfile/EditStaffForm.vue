<template>
  <div>
    <card>
      <!-- TODO: create a collapse component for each info -->
      <collapse :multiple-active="false" :active-index="0">
        <collapse-item title="Staff personal information">
          <personal-info :user="user" :staff="staffUser"></personal-info>
        </collapse-item>

        <collapse-item title="Government information">
          <staff-gov :user="user" :staff="staffUser"></staff-gov>
        </collapse-item>

        <collapse-item title="Emergency information">
          <emergency-info :user="user" :staff="staffUser"></emergency-info>
        </collapse-item>
        <collapse-item title="Payroll information">
          <payroll-info :user="user" :staff="staffUser"></payroll-info>
        </collapse-item>
      </collapse>
      <card>
        <h5 slot="header" class="title">Your staff file(s)</h5>
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
              v-for="(item, index) in staffUser.staff_files"
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
import { Select, Option, DatePicker } from "element-ui";
import { BaseAlert, Collapse, CollapseItem } from "@/components";
import StaffGov from "@/components/UserProfile/StaffGovInfo.vue";
import EmergencyInfo from "@/components/UserProfile/StaffEmergencyInfo.vue";
import PayrollInfo from "@/components/UserProfile/StaffPayroll.vue";
import PersonalInfo from "@/components/UserProfile/StaffPersonalInfo.vue";
import Card from "../Cards/Card.vue";

export default {
  components: {
    StaffGov,
    EmergencyInfo,
    PayrollInfo,
    PersonalInfo,
    BaseAlert,
    Collapse,
    CollapseItem,
    [DatePicker.name]: DatePicker,
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
    updateProfile() {
      alert("Your data: " + JSON.stringify(this.user));
    },
    ...mapActions("user", ["updatestaffUser", "saveMe"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/v1/staff/${id}/`;
      try {
        await this.$axios.get(endpoint).then((res) => {
          this.staffUser = res.data;
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
      await this.updatestaffUser(payload)
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
      const staffPayload = {
        id: this.staffUser.id,
        staff: this.user.id,
        staff_files: this.staffUser.staff_files,
      };
      this.saving = true;
      let url = `/api/v1/staff/${this.user.id}/`;
      if (this.staffUser) {
        return await this.$axios
          .put(url, staffPayload)
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
    async saveStaff() {
      const staffPayload = {
        id: this.staff.id,
        user: this.user.id,
        staff_files: this.staffUser.staff_files
      };
      this.saving = true;
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        let url = `/api/v1/staff/${this.user.id}/`;
        if (this.staffUser) {
          return await this.$axios
            .put(url, staffPayload)
            .then((res) => {
              this.saving = false;
              this.success = true;
              this.successMessage2();
              return res.data;
            })
            .catch((err) => {
              this.saving = false;
              console.log(err);
            });
        }
      }
    },
    addInternalFiles(e) {
      e.preventDefault();
      this.staffUser.staff_files.push({
        file_name: "",
        url: "",
        description: "",
      });
    },
    removeInternalFiles(e, id) {
      e.preventDefault();
      var index = this.staffUser.staff_files
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(id);
      this.staffUser.staff_files.splice(index, 1);
    },
    addRow: function() {
      this.staffUser.staff_files.push({
        file_name: "",
        url: "",
        description: "",
      });
    },
    deleteRow: function(e, item) {
      e.preventDefault();
      var index = this.staffUser.staff_files
        .map(function(item) {
          console.log(item.id);
          return item.id;
        })
        .indexOf(item);
      this.staffUser.staff_files.splice(index, 1);
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

<style scoped>
.res-address {
  margin-bottom: 20px !important;
}
</style>
