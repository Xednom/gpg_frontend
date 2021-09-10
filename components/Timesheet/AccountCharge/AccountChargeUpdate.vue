<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <b-card>
              <h4 class="card-title"><b-skeleton width="50%"></b-skeleton></h4>
              <div class="form-row">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-12 col-md-12">
                  <b-skeleton width="85%"></b-skeleton>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-12 col-md-6">
                  <b-skeleton width="45%"></b-skeleton>
                </div>
              </div>
            </b-card>
          </template>
          <form @submit.prevent="save">
            <h4 class="card-title">
              Account Charge informations: Ticket #<b>{{
                charge.ticket_number
              }}</b>
            </h4>
            <div class="form-row">
              <div class="col-sm-12 col-md-6">
                <base-input label="Request date">
                  <el-date-picker
                    v-model="charge.shift_date"
                    v-validate="'required'"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Choose date"
                    :disabled="isDisabled"
                  >
                  </el-date-picker>
                </base-input>
              </div>
              <div
                class="col-sm-12 col-md-6"
                v-if="this.$auth.user.designation_category == 'staff'"
              >
                <base-input
                  label="Client code"
                  v-model="charge.client_code"
                  disabled
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-3">
                <base-input
                  label="Total time"
                  name="Total time"
                  v-model="charge.total_time"
                  v-validate="modelValidations.total_time"
                  :error="getError('Total time')"
                  :disabled="isDisabled"
                >
                </base-input>
              </div>
              <div class="col-sm-12 col-md-3">
                <base-input
                  label="Total items"
                  name="Total items"
                  v-model="charge.total_items"
                  v-validate="modelValidations.total_items"
                  :error="getError('Total items')"
                  :disabled="isDisabled"
                >
                </base-input>
              </div>
              <div class="col-sm-12 col-md-6">
                <base-input
                  label="Ticket number"
                  v-model="charge.ticket_number"
                  :disabled="isDisabled"
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <base-input
                  label="Job Request"
                  v-model="charge.job_request"
                  :disabled="isDisabled"
                >
                </base-input>
              </div>
            </div>
            <div
              class="form-row"
              v-if="$auth.user.designation_category == 'staff'"
            >
              <div class="col-sm-12 col-md-3">
                <base-input
                  label="Staff hourly rate"
                  v-model="charge.staffs_hourly_rate"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-sm-12 col-md-3">
                <base-input
                  label="Staff Fee"
                  v-model="charge.staffs_fee"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-sm-12 col-md-3">
                <base-input
                  label="Staff Other Fees"
                  v-model="charge.staffs_other_fee"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-sm-12 col-md-3">
                <base-input
                  label="Staff Total due"
                  v-model="charge.staffs_total_due"
                  disabled
                >
                </base-input>
              </div>
            </div>
            <div
              class="form-row"
              v-if="
                $auth.user.designation_category == 'new_client' ||
                  $auth.user.designation_category == 'current_client' ||
                  $auth.user.designation_category == 'affiliate_partner'
              "
            >
              <div class="col-sm-12 col-md-4">
                <base-input
                  label="Other fee"
                  v-model="charge.clients_other_fee"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-sm-12 col-md-4">
                <base-input
                  label="Total Charge"
                  v-model="charge.clients_total_charge"
                  disabled
                >
                </base-input>
              </div>
              <div class="col-sm-12 col-md-4">
                <base-input
                  label="Total due"
                  v-model="charge.clients_total_due"
                  disabled
                >
                </base-input>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <label>Job Request Description</label>
                <textarea
                  class="form-control"
                  v-model="charge.job_request_description"
                  :disabled="isDisabled"
                >
                </textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-12">
                <label>Notes</label>
                <textarea class="form-control" v-model="charge.notes" disabled>
                </textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-12 col-md-6">
                <div class="col-sm-10">
                  <div class="row">
                    <label>Status</label>
                  </div>
                  <el-select
                    class="select-primary"
                    size="large"
                    name="status"
                    placeholder="Status"
                    v-model="charge.status"
                    disabled
                  >
                    <el-option
                      v-for="option in StatusChoices.status"
                      class="select-primary"
                      :value="option.value"
                      :label="option.label"
                      :key="option.label"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div slot="footer">
              <div class="pull-right mt-5">
                <base-button
                  v-if="!saving"
                  native-type="submit"
                  slot="footer"
                  type="submit"
                  round
                  block
                  size="lg"
                  :disabled="isDisabled"
                >
                  Save
                </base-button>
                <base-button
                  v-else
                  native-type="submit"
                  slot="footer"
                  type="primary"
                  round
                  block
                  size="lg"
                  disabled
                >
                  Saving...
                </base-button>
              </div>
            </div>
          </form>
        </b-skeleton-wrapper>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { DatePicker, Select, Option } from "element-ui";
import JobOrderComment from "~/components/JobOrder/General/JobOrderComment";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    JobOrderComment,
  },
  props: {
    charge: {
      type: Object,
      description: "Account Charge information",
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      error: "",
      clientCodes: [],
      clientUser: {},
      staffUser: {},
      StatusChoices: {
        placeholder: "",
        status: [
          { value: "submitted", label: "Submitted" },
          { value: "approved", label: "Approved" },
          { value: "dispute", label: "Dispute" },
          { value: "waived", label: "Waived" },
        ],
      },
      modelValidations: {
        total_time: {
          decimal: true,
        },
        total_items: {
          decimal: true,
        },
      },
    };
  },
  methods: {
    ...mapActions("accountCharge", ["updateCharge"]),
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    async fetchClient(id) {
      this.loading = true;
      let endpoint = `/api/v1/client/${id}/`;
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        try {
          await this.$axios.get(endpoint).then((res) => {
            this.clientUser = res.data;
            this.loading = false;
          });
        } catch (err) {
          console.error(err.response.data);
        }
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
        console.error(err.response.data);
        this.loading = false;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated this Account Charge.", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        const staffPayload = {
          id: this.charge.id,
          ticket_number: this.charge.ticket_number,
          client: this.charge.client,
          shift_date: this.charge.shift_date,
          job_request: this.charge.job_request,
          job_request_description: this.charge.job_request_description,
          total_items: this.charge.total_items,
          total_time: this.charge.total_time,
          hourly_rate: this.staffUser.hourly_rate,
          status: this.charge.status,
          notes: this.charge.notes,
        };

        if (this.$auth.user.designation_category == "staff") {
          try {
            this.saving = true;
            await this.updateCharge(staffPayload)
              .then(() => {
                this.saving = false;
                this.successMessage("success");
              })
              .catch((e) => {
                this.saving = false;
                this.error = e.response.data;
                this.errorMessage("danger", this.error);
              });
          } catch (e) {
            this.saving = false;
            this.error = e.response.data;
            this.errorMessage("danger", this.error);
          }
        }
        this.saving = false;
      }
    },
    successMessage(variant = null) {
      this.$bvToast.toast("Successfully updated this Account Charge.", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
  },
  computed: {
    isDisabled() {
      if (
        this.$auth.user.designation_category == "new_client" ||
        this.$auth.user.designation_category == "current_client" ||
        this.$auth.user.designation_category == "affiliate_partner"
      ) {
        return true;
      } else {
        if (this.charge.status == "approved") {
          return true;
        }
      }
    },
    staffDisable() {
      if (this.$auth.user.designation_category == "staff") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.fetchMe();
    // this.fetchClient(this.$auth.user.id);
  },
};
</script>
