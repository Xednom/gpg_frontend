<template>
  <div>
    <div class="row">
      <div class="col-md-12">
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
            </b-card>
          </template>
          <form @submit.prevent="save">
            <tabs type="primary" lazy>
              <tab-pane label="Call Out informations">
                <div class="form-row">
                  <div class="col-sm-12 col-md-4">
                    <base-input
                      label="Ticket number"
                      v-model="callOut.ticket_number"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-sm-12 col-md-4">
                    <base-input
                      label="Client code"
                      v-model="callOut.client_code"
                      disabled
                    >
                    </base-input>
                  </div>

                  <div class="col-sm-12 col-md-4">
                    <base-input
                      label="Due diligence link"
                      v-model="callOut.dd_link"
                      disabled
                    >
                    </base-input>
                  </div>
                </div>

                <div class="form-row">
                  <div class="col-sm-12 col-md-4">
                    <base-input label="APN" v-model="callOut.apn" disabled>
                    </base-input>
                  </div>
                  <div class="col-sm-12 col-md-4">
                    <base-input
                      label="County"
                      v-model="callOut.county"
                      disabled
                    >
                    </base-input>
                  </div>
                  <div class="col-sm-12 col-md-4">
                    <base-input label="State" v-model="callOut.state" disabled>
                    </base-input>
                  </div>
                </div>

                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label>Memo/Call notes</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.memo_call_notes"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label
                      >Due diligence Specialist additional information</label
                    >
                    <textarea
                      class="form-control"
                      v-model="callOut.dd_specialists_additional_info"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                  </div>
                </div>

                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-3">
                    <div class="col-sm-10">
                      <div class="row">
                        <label>Initial Due diligence status</label>
                      </div>
                      <el-select
                        class="select-primary"
                        size="large"
                        name="status"
                        placeholder="Status"
                        v-model="callOut.initial_due_diligence_status"
                        :disabled="isDisabled"
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

                  <div class="col-sm-12 col-md-3">
                    <base-input label="Initial Due diligence date complete">
                      <el-date-picker
                        v-model="callOut.initial_dd_date_complete"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="Choose date"
                        :disabled="isDisabled"
                      >
                      </el-date-picker>
                    </base-input>
                  </div>

                  <div class="col-sm-12 col-md-3">
                    <div class="col-sm-10">
                      <div class="row">
                        <label>Call out status</label>
                      </div>
                      <el-select
                        class="select-primary"
                        size="large"
                        name="status"
                        placeholder="Status"
                        v-model="callOut.call_out_status"
                        :disabled="isDisabled"
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

                  <div class="col-sm-12 col-md-3">
                    <base-input label="Call Out Due diligence date complete">
                      <el-date-picker
                        v-model="callOut.call_out_dd_date_complete"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="Choose date"
                        :disabled="isDisabled"
                      >
                      </el-date-picker>
                    </base-input>
                  </div>
                </div>
              </tab-pane>

              <tab-pane label="Purpose and Category">
                <div class="form-row">
                  <div class="col-sm-12 col-md-6">
                    <label>Assessor website</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.assessor_website"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Assessed Value & Market Value of the property</small
                    >
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label>Assessor contact</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.assessor_contact"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Assessed Value & Market Value of the property</small
                    >
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label>Treasurer website</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.treasurer_website"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted">For Tax Data Collection</small>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label>Treasurer contact</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.treasurer_contact"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted">For Tax Data Collection</small>
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label>Recorder/Clerk website</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.recorder_clerk_website"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Covenance, Restriction & Deeds</small
                    >
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label>Recorder/Clerk contact</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.recorder_clerk_contact"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Covenance, Restriction & Deeds</small
                    >
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label>Zoning or Planning department website</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.zoning_or_planning_department_website"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted">For Zoning Data Collection</small>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label>Zoning or Planning department contact</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.zoning_or_planning_department_contact"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted">For Zoning Data Collection</small>
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label
                      >County environmental health department website</label
                    >
                    <textarea
                      class="form-control"
                      v-model="
                        callOut.county_environmental_health_department_website
                      "
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Utilities - Septic, Sewer and Water Data
                      Collection</small
                    >
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label
                      >County environmental health department contact</label
                    >
                    <textarea
                      class="form-control"
                      v-model="
                        callOut.county_environmental_health_department_contact
                      "
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Utilities - Septic, Sewer and Water Data
                      Collection</small
                    >
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label>GIS website</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.gis_website"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted">For property map viewing</small>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label>CAD Website</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.cad_website"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted">For property map viewing</small>
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label>Electricity company name and phone number</label>
                    <textarea
                      class="form-control"
                      v-model="
                        callOut.electricity_company_name_and_phone_number
                      "
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Utilities - Electricity Data Collection</small
                    >
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label>Water Company name and phone number</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.water_company_name_and_phone_number"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Utilities - Septic, Sewer and Water Data
                      Collection</small
                    >
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-6">
                    <label>Sewer Company name and phone number</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.sewer_company_name_and_phone_number"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Utilities - Septic, Sewer and Water Data
                      Collection</small
                    >
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <label>Gas Company name and phone number</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.gas_company_name_and_phone_number"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Utilities - Septic, Sewer and Water Data
                      Collection</small
                    >
                  </div>
                </div>
                <div class="form-row mt-3">
                  <div class="col-sm-12 col-md-12">
                    <label>Waste Company name and phone number</label>
                    <textarea
                      class="form-control"
                      v-model="callOut.waste_company_name_and_phone_number"
                      rows="8"
                      :disabled="isDisabled"
                    >
                    </textarea>
                    <small class="text-muted"
                      >For Utilities - Septic, Sewer and Water Data
                      Collection</small
                    >
                  </div>
                </div>
              </tab-pane>
            </tabs>
            <div slot="footer" v-if="this.$auth.user.designation_category == 'staff'">
              <div class="pull-right mt-5">
                <base-button
                  v-if="!saving"
                  native-type="submit"
                  slot="footer"
                  type="submit"
                  round
                  block
                  size="lg"
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
import { TabPane, Tabs, Collapse, CollapseItem } from "@/components";

export default {
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    TabPane,
    Tabs,
    Collapse,
    CollapseItem,
  },
  props: {
    callOut: {
      type: Object,
      description: "Account category information",
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
          { value: "complete", label: "Completed" },
          { value: "pending", label: "Pending" },
          { value: "on_hold", label: "On Hold" },
          { value: "cancelled", label: "Cancelled" },
          { value: "for_follow_up", label: "For follow up" },
          { value: "processing", label: "Processing" },
          { value: "not_applicable", label: "Not Applicable" },
          { value: "job_request", label: "Job order request" },
          { value: "tax_data_complete", label: "Tax Data- Complete" },
          { value: "zoning_data_complete", label: "Zoning Data - Complete" },
          { value: "utilities_data_complete", label: "Utilities Data - Complete" },
          { value: "tax_zoning_data_complete", label: "Tax/Zoning Data- Complete" },
          { value: "tax_utlities_data_complete", label: "Tax/Utilies Data - Complete " },
          { value: "zoning_utilities_data_complete", label: "Zoning/Utilities Data- Complete" },
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
    ...mapActions("dueDiligenceCallOut", ["updateCallOut"]),
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
      this.$bvToast.toast("Successfully updated this Account category.", {
        title: `Successful`,
        variant: variant,
        solid: true,
      });
    },
    async save() {
      let isValidForm = await this.$validator.validateAll();
      if (isValidForm) {
        const staffPayload = {
          id: this.callOut.id,
          ticket_number: this.callOut.ticket_number,
          client: this.callOut.client,
          dd_link: this.callOut.dd_link,
          assessor_website: this.callOut.assessor_website,
          assessor_contact: this.callOut.assessor_contact,
          treasurer_website: this.callOut.treasurer_website,
          treasurer_contact: this.callOut.treasurer_contact,
          recorder_clerk_website: this.callOut.recorder_clerk_website,
          recorder_clerk_contact: this.callOut.recorder_clerk_contact,
          zoning_or_planning_department_website: this.callOut
            .zoning_or_planning_department_website,
          zoning_or_planning_department_contact: this.callOut
            .zoning_or_planning_department_contact,
          county_environmental_health_department_website: this.callOut
            .county_environmental_health_department_website,
          county_environmental_health_department_contact: this.callOut
            .county_environmental_health_department_contact,
          gis_website: this.callOut.gis_website,
          cad_website: this.callOut.cad_website,
          electricity_company_name_and_phone_number: this.callOut
            .electricity_company_name_and_phone_number,
          water_company_name_and_phone_number: this.callOut
            .water_company_name_and_phone_number,
          sewer_company_name_and_phone_number: this.callOut
            .sewer_company_name_and_phone_number,
          gas_company_name_and_phone_number: this.callOut
            .gas_company_name_and_phone_number,
          waste_company_name_and_phone_number: this.callOut
            .waste_company_name_and_phone_number,
          apn: this.callOut.apn,
          county: this.callOut.county,
          state: this.callOut.state,
          memo_call_notes: this.callOut.memo_call_notes,
          dd_specialists_additional_info: this.callOut
            .dd_specialists_additional_info,
          staff_initial_dd: this.callOut.staff_initial_dd,
          initial_due_diligence_status: this.callOut
            .initial_due_diligence_status,
          initial_dd_date_complete: this.callOut.initial_dd_date_complete,
          staff_assigned_for_call_out: this.callOut.staff_assigned_for_call_out,
          call_out_status: this.callOut.call_out_status,
          call_out_dd_date_complete: this.callOut.call_out_dd_date_complete,
        };

        if (this.$auth.user.designation_category == "staff") {
          try {
            this.saving = true;
            await this.updateCallOut(staffPayload)
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
      this.$bvToast.toast("Successfully updated this Call Out.", {
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
        return false;
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

<style scoped>
.form-control {
  margin-bottom: 0px !important;
}
</style>
