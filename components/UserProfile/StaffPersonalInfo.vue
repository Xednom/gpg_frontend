<template>
  <div>
    <form @submit.prevent="saveStaff">
      <base-alert v-if="success" type="success" dismissible>
        <span>
          {{ successMessage() }}
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
              v-model="staff.date_of_birth"
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
            v-model="staff.blood_type"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Position"
            placeholder="Position"
            v-model="staff.position"
          >
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input
            type="text"
            label="Phone/Mobile Number"
            placeholder="Phone/Mobile number"
            v-model="staff.phone_number"
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
            v-model="staff.company_email"
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
              v-model="staff.start_date_hired"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="Choose date"
            >
            </el-date-picker>
          </base-input>
        </div>
        <div class="col-md-4">
          <base-input label="Date hired in contract">
            <el-date-picker
              v-model="staff.date_hired_in_contract"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
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
            v-model="staff.base_pay"
            addon-left-icon="tim-icons icon-money-coins"
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-3">
          <base-input
            type="text"
            label="Hourly rate"
            placeholder="Your hourly rate"
            v-model="staff.hourly_rate"
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
            v-model="staff.status"
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
            v-model="staff.category"
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
            v-model="staff.company_id"
            disabled
          >
          </base-input>
        </div>
        <div class="col-sm-12 col-md-4">
          <base-input
            type="text"
            label="Staff ID"
            placeholder="Your Staff ID"
            v-model="staff.staff_id"
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
            v-model="staff.residential_address"
          >
          </textarea>
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
import { Select, Option, DatePicker } from "element-ui";
import { BaseAlert } from "@/components";
export default {
  components: {
    [Select.name]: Select,
    [DatePicker.name]: DatePicker,
    [Option.name]: Option,
    BaseAlert,
  },
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
  data() {
    return {
      success: false,
      saving: false,
      error: "",
      status: {
        categories: [
          { value: "regular", label: "Regular" },
          { value: "probitionary", label: "Probitionary" },
          { value: "inactive", label: "Inactive" },
        ],
      },
      category: {
        categories: [
          { value: "office_based", label: "Office based" },
          { value: "part_timers", label: "Part-timers" },
          { value: "home_based", label: "Home based" },
        ],
      },
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    successMessage() {
      return "Successfully updated your Personal informations!";
    },
    async saveStaff() {
      const staffPayload = {
        id: this.staff.id,
        date_of_birth: this.staff.date_of_birth,
        blood_type: this.staff.blood_type,
        position: this.staff.position,
        phone_number: this.staff.phone_number,
        company_email: this.staff.company_email,
        start_date_hired: this.staff.start_date_hired,
        date_hired_in_contract: this.staff.date_hired_in_contract,
        base_pay: this.staff.base_pay,
        hourly_rate: this.staff.hourly_rate,
        status: this.staff.status,
        category: this.staff.category,
        residential_address: this.staff.residential_address,
      };
      this.saving = true;
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
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
      }
    },
  },
};
</script>
