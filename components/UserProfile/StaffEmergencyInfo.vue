<template>
  <div>
    <form @submit.prevent="saveStaff">
      <base-alert v-if="success" type="success" dismissible>
        <span>
          {{ successMessage() }}
        </span>
      </base-alert>
      <div class="row">
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Emergency contact full name"
            placeholder="Your Emergency contact full name"
            v-model="staff.emergency_contact_full_name"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Relationship"
            placeholder="Relationship"
            v-model="staff.relationship"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Emergency contact full name"
            placeholder="Emergency contact full name"
            v-model="staff.emergency_contact_number"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Mother's full name"
            placeholder="Mother's full name"
            v-model="staff.mothers_full_name"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Mother's maiden name"
            placeholder="Mother's maiden name"
            v-model="staff.mothers_maiden_name"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Father's name"
            placeholder="Father's name"
            v-model="staff.fathers_full_name"
          >
          </base-input>
        </div>
      </div>
      <base-button
        v-if="!saving"
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
  </div>
</template>

<script>
import { BaseAlert } from "@/components";
export default {
  components: {
    BaseAlert,
  },
  props: {
    user: {
      type: Object,
      description: "User Info",
    },
    staff: {
      type: Object,
      description: "Emergency staff informations",
    },
  },
  data() {
    return {
      saving: false,
      success: false,
    };
  },
  methods: {
    successMessage() {
      return "Successfully updated your Emergency informations!";
    },
    async saveStaff() {
      const staffPayload = {
        id: this.staff.id,
        user: this.user.id,
        emergency_contact_full_name: this.staff.emergency_contact_full_name,
        relationship: this.staff.relationship,
        emergency_contact_number: this.staff.emergency_contact_number,
        mothers_full_name: this.staff.mothers_full_name,
        mothers_maiden_name: this.staff.mothers_maiden_name,
        fathers_full_name: this.staff.fathers_full_name,
      };
      this.saving = true;
      let url = `/api/v1/staff/${this.user.id}/`;
      if (this.staff) {
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
  },
};
</script>
