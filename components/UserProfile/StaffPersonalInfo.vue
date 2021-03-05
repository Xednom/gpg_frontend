<template>
  <div>
    <form @submit.prevent="saveStaff">
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
          <base-input label="Date of Birth">
            <el-date-picker
              v-model="staffUser.date_of_birth"
              type="date"
              placeholder="Date Picker"
            >
            </el-date-picker>
          </base-input>
        </div>
        <div class="col-md-2">
          <base-input
            type="text"
            label="Blood type"
            placeholder="Your blood type"
            v-model="staffUser.blood_type"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Position"
            placeholder="Position"
            v-model="staffUser.position"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Phone/Mobile Number"
            placeholder="Phone/Mobile number"
            v-model="staffUser.phone_number"
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4">
          <base-input
            v-validate="'email'"
            label="Company email"
            name="email"
            :error="getError('email')"
            v-model="staffUser.company_email"
            type="email"
            autocomplete="email"
            placeholder="Email"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input label="Start date hired">
            <el-date-picker
              v-model="staffUser.start_date_hired"
              type="date"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input label="Date hired in contract">
            <el-date-picker
              v-model="staffUser.date_hired_in_contract"
              type="date"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 col-md-3">
          <base-input
            type="text"
            label="Base pay"
            placeholder="Your base pay"
            v-model="staffUser.base_pay"
            addon-left-icon="tim-icons icon-money-coins"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-3">
          <base-input
            type="text"
            label="Hourly rate"
            placeholder="Your hourly rate"
            v-model="staffUser.hourly_rate"
            addon-left-icon="tim-icons icon-money-coins"
          >
          </base-input>
        </div>

        <div class="col-sm-12 col-md-3">
          <label>Status</label>
          <el-select
            class="select-primary"
            size="medium"
            placeholder="Select your status..."
            v-model="staffUser.status"
            disabled
          >
            <el-option
              v-for="option in status.categories"
              class="select-primary"
              :value="option.value"
              :label="option.label"
              :key="option.label"
            >
            </el-option>
          </el-select>
        </div>

        <div class="col-sm-12 col-md-3">
          <label>Category</label>
          <el-select
            class="select-primary"
            size="medium"
            placeholder="Select your status..."
            v-model="staffUser.category"
            disabled
          >
            <el-option
              v-for="option in category.categories"
              class="select-primary"
              :value="option.value"
              :label="option.label"
              :key="option.label"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Company ID"
            placeholder="Your Company ID"
            v-model="staffUser.company_id"
            disabled
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Staff ID"
            placeholder="Your Staff ID"
            v-model="staffUser.staff_id"
            disabled
          >
          </base-input>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-12 col-md-12">
          <textarea
            class="form-control res-address"
            placeholder="Residential Address"
            v-model="staffUser.residential_address"
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
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      description: "User data",
    },
    staff: {
      type: Object,
      description: "Staff personal information",
    },
  },
  methods: {
    async saveStaff() {
      const clientPayload = {
        id: this.staffUser.id,
        user: this.user.id,
        date_of_birth: this.staffUser.date_of_birth,
        company_id: this.staffUser.company_id,
        staff_id: this.staffUser.staff_id,
        pin: this.staffUser.pin,
        lead_information: this.staffUser.lead_information,
        customer_id: this.staffUser.customer_id,
      };
      this.saving2 = true;
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        let url = `/api/v1/staff/${this.user.id}/`;
        if (this.staffUser) {
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
      }
    },
  },
};
</script>
