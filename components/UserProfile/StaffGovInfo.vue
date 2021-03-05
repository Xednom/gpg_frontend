<template>
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
          label="TIN number"
          placeholder="Your TIN number"
          v-model="staff.tin_number"
        >
        </base-input>
      </div>
      <div class="col-sm-12 col-md-3">
        <base-input
          type="text"
          label="SSS number"
          placeholder="Your SSS number"
          v-model="staff.sss_number"
        >
        </base-input>
      </div>
      <div class="col-sm-12 col-md-3">
        <base-input
          type="text"
          label="PAG-IBIG number"
          placeholder="Your PAG-IBIG number"
          v-model="staff.pag_ibig_number"
        >
        </base-input>
      </div>
      <div class="col-sm-12 col-md-3">
        <base-input
          type="text"
          label="Phil Health number"
          placeholder="Your Phil Health number"
          v-model="staff.phil_health_number"
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
      description: "staff data",
    },
    staff: {
      type: Object,
      description: "Gov data from staff",
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
      return "Successfully updated your Government informations!";
    },
    async saveStaff() {
      const staffPayload = {
        id: this.staff.id,
        user: this.user.id,
        tin_number: this.staff.tin_number,
        sss_number: this.staff.sss_number,
        pag_ibig_number: this.staff.pag_ibig_number,
        phil_health_number: this.staff.phil_health_number,
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
