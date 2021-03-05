<template>
  <div>
    <form @submit.prevent="saveStaff">
      <base-alert v-if="success" type="success" dismissible>
        <span>
          {{ successMessage() }}
        </span>
      </base-alert>
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <base-input
            type="text"
            label="Bank name"
            placeholder="Your bank name"
            v-model="staff.bank_name"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-3">
          <base-input
            type="text"
            label="Bank account name"
            placeholder="Bank account name"
            v-model="staff.bank_account_name"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-3">
          <base-input
            type="text"
            label="Bank type"
            placeholder="Bank type"
            v-model="staff.bank_type"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-3">
          <base-input
            type="text"
            label="Bank account number"
            placeholder="Bank account number"
            v-model="staff.bank_account_number"
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
      description: "User info",
    },
    staff: {
      type: Object,
      description: "Staff Payroll informations",
    },
  },
  data() {
    return {
      success: false,
      saving: false,
    };
  },
  methods: {
    successMessage() {
      return "Successfully updated your Payroll informations!";
    },
    async saveStaff() {
      const staffPayload = {
        id: this.staff.id,
        bank_name: this.staff.bank_name,
        bank_account_name: this.staff.bank_account_name,
        bank_type: this.staff.bank_type,
        bank_account_number: this.staff.bank_account_number,
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
